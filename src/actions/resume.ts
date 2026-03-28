"use server"
import { resumeSchemaType } from "@/app/(main)/resume/_components/ResumeBuilder"
import { getGeminiResponse } from "@/lib/gemini"
import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"


export const saveResume = async (content: resumeSchemaType) => {
    const res = content
    console.log("recieved data at backend: ", res)
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
        const resume = await db.resume.upsert({
            where: {
                userId: user.id
            },
            update: {
                content
            },
            create: {
                userId: user.id,
                content
            }
        })
        revalidatePath("/resume")
        return resume
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            throw new Error("Error saving resume", error)
        }
    }
}

export const getResume = async () => {
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
        return await db.resume.findUnique({
            where: {
                userId: user.id
            }
        })
    } catch (error) {
        console.log("Error fetching resume data from database: ", error)
          if (error instanceof Error) {
            throw new Error("Error fetching resume data from database:", error)
        }
    }
}

export const improveWithAi = async ({ current, type, org }:{current:string,type:string,org:string}) => {
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
    const prompt = `As an expert resume writer, improve the following ${type} description for a ${user.industry} professional, working in company ${org}.
Make it more impactful, quantifiable, and aligned with industry standards.
Current content: "${current}"

Requirements:
1. Use action verbs
2. Include metrics and results where possible
3. Highlight relevant technical skills
4. Keep it concise but detailed
5. Focus on achievements over responsibilities
6. Use industry-specific keywords
7. Output STRICTLY in plain text. Do NOT use any Markdown formatting, asterisks (**), bolding, or italics.

Format the response as a single paragraph without any additional text or explanations.`
    try {
        const res = await getGeminiResponse(prompt, false)
        return res
    } catch (error) {
        console.log("Error improving the resume content via gemini: ", error)
        throw new Error("Error improving the content via gemini")
    }
}
export const improveSummaryWithAi = async ({ current }:{current:string}) => {
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
    const prompt = `
        You are an expert resume writer specializing in IT professionals.

Your task is to improve and rewrite the user's professional summary to make it:
- Clear, concise, and impactful
- Tailored to the user's industry and IT sub-industry
- Results-driven with measurable achievements where possible
- Professional and modern in tone
- Optimized for ATS (Applicant Tracking Systems)
- Free of grammar or spelling issues

Context:
- Industry: ${user.industry}

Guidelines:
- Keep it between 2-4 sentences
- Use strong action verbs
- Highlight relevant technical skills and domain expertise based on the industry context
- Emphasize business impact and achievements
- Do NOT add false information — only improve what is provided
- If the input is vague, enhance clarity while staying truthful

User Input:
"""
${current}
"""

Output only the improved professional summary as plain text.
Do not include explanations, labels, or formatting.
    `
    try {
        const res = await getGeminiResponse(prompt, false)
        return res
    } catch (error) {
        console.log("Error improving the resume summary section via gemini: ", error)
        throw new Error("Error improving the resume summary section via gemini")
    }
}