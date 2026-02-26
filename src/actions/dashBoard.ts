"use server"
import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { GoogleGenAI } from '@google/genai'
import { IndustryInsightsResponse } from "./user";
import { getGeminiResponse } from "@/lib/gemini";

export const aiIndustryInsight = async (industry: string) => {
    const prompt = `
                Analyze the current state of the ${industry} industry and provide insights in only the following JSON format without any additional notes or explanations:
                    {
                                "salaryRanges": [
                                {"role":"string","min":number,"max":number,"median":number,
                                "location":"string"}
                                ],
                                "growthRate": number,
                                "demandLevel": "HIGH"|"MEDIUM"|"LOW",
                                "topSkills": ["skill1","skill2"],
                                "marketOutlook": "POSITIVE"|"NEUTRAL"|"NEGATIVE",
                                "keyTrends": ["trend1","trend2"],
                                "recommendedSkills": ["skill1","skill2"],
                    }
                    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
                    Include at least 5 common roles for salary ranges.
                    Growth rate should be a percentage.
                    Include at least 5 skills and trends.
                    CRITICAL: Keep all skills in "topSkills" and "recommendedSkills" extremely concise. Use maximum 1-2 words per skill (e.g., use "AWS" instead of "Cloud Platforms (AWS)", use "Docker" instead of "Containerization").
                `

    const res=await getGeminiResponse(prompt)
    return res

}

export async function updateDashBoard() {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated Request")

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
        include: {
            industryInsight: true//since below i attempt to access user.industryInsight,its important to ensure that the .industryInsight attribute is present in user, even if its undefined ,else user.industryInsight would cause error,because as its a foreign key relation, be default it wont be included
        }
    })
    if (!user) {
        throw new Error("User not found")
    }
    // console.log("User data: ",user)
    try {
        if (!user.industryInsight) {
            const insights: IndustryInsightsResponse = await aiIndustryInsight(user.industry as string)
            console.log("User insights: ", insights)
            const updatedInsights = await db.industryInsights.create({
                data: {
                    industry: user.industry as string,
                    ...insights,
                    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            })
            return updatedInsights
        }
        return user.industryInsight

    } catch (error) {
        console.log("Error dealing with gemini api: ", error as unknown)
         throw new Error(`Error dealing with gemini api: ${error}`)
    }
}