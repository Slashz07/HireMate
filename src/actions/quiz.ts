"use server"
import { getGeminiResponse } from "@/lib/gemini";
import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateQuiz = async () => {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated Request")

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if (!user) {
        throw new Error("User not found")
    }
    try {
        const prompt = `
         Generate 12 technical interview questions for a ${user.industry} professional ${user.skills?.length ? `with expertise in ${user.skills.join(",")}` : ""}
 
         Each question should be multiple choice with 4 options.
 
         Return the response in this JSON format only,no additional text:
         {
             "questions":[
                     {
                         "question":"string",
                         "options":["string","string","string","string"],
                         "correctAnswer":"string",
                         "explanation":"string"
                     }
             ]
         }
         
     `;
        const quiz=await getGeminiResponse(prompt)

        return quiz.questions
    } catch (error) {
        console.log("Error generating quiz questions via gemini : ", error as unknown)
        throw new Error(`Error generating quiz questions via gemini: ${error}`)
    }
}

export const saveQuizData = async (questions, answers, score) => {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated Request")

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if (!user) {
        throw new Error("User not found")
    }

    const questionResults = questions.map((q, idx) => ({
        question: q.question,
        answer: q.correctAnswer,
        userAnswer: answers[idx],
        isCorrect: q.correctAnswer == answers[idx],
        explanation: q.explanation
    }))

   try {
     const wrongQuestions = questionResults.filter((q) => !q.isCorrect)
     let improvementTip=""
     if (wrongQuestions.length > 0) {
         const wrongQuestionsText = wrongQuestions.map((q) => (
             `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer:"${q.userAnswer}"`
         )).join("\n\n")//.join() converts an array into a single string. .join("\n\n") here inserts double line breaks between each array elem when joining them
 
         const improvementPrompt = `
         The user got the following ${user.industry} techincal interview questions wrong:
         ${wrongQuestionsText} 
         Based on these mistakes, provide a concise, specific improvement tip.
         Focus on the knowledge gaps revealed by these wrong answers.
         Keep the response under 2-3 sentences and make it encourging.
         Don't explicitly mention the mistakes, instead focus on what to learn/practice.
     `
         const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: improvementPrompt,
         });
 
         if (!response.text) throw new Error("Error accessing data in Gemini api");
 
         improvementTip= response.text.trim();
         
     }
     const assessment=await db.assessment.create({
         data:{
             userId:user.id,
             quizScore:score,
             questions:questionResults,
             category:"Techincal",
             improvementTip,
         }
     })
    return assessment

   } catch (error) {
    console.log("Error generating improvement tip and saving quiz data to database")
   }
}
