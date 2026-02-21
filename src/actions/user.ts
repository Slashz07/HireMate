"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { aiIndustryInsight } from "./dashBoard";

interface formInfo {
    industry: string,
    subIndustry: string,
    bio?: string,
    experience: number,
    skills: string[]
}
export type SalaryRange = {
    role: string
    min: number
    max: number
    median: number
    location: string
}

export type IndustryInsightsResponse = {
    salaryRanges: SalaryRange[]
    growthRate: number
    demandLevel: "HIGH" | "MEDIUM" | "LOW"
    topSkills: string[]
    marketOutlook: "POSITIVE" | "NEUTRAL" | "NEGATIVE"
    keyTrends: string[]
    recommendedSkills: string[]
}

export const updateUser = async (data: formInfo) => {
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
        //since we are to make multiple api calls ,we create a transaction(provided by prisma) so that either all api calls are made succesfully or else nothing is executed at all to avoid half-done work 
        let industryInsights = await db.industryInsights.findUnique({
            where: {
                industry: data.industry as string
            }
        })
        let insights: IndustryInsightsResponse;
        if (!industryInsights) {
            insights = await aiIndustryInsight(data.industry as string)
        }
        const result = await db.$transaction(
            async (tx) => {
                if (!industryInsights) {
                    const updateInsights = await tx.industryInsights.create({
                        data: {
                            industry: data.industry as string,
                            ...insights,
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        }
                    })
                    industryInsights = updateInsights
                }

                const updatedUser = await tx.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        industry: data.industry,
                        bio: data.bio,
                        experience: data.experience,
                        skills: data.skills,
                    }
                })
                return { updatedUser, industryInsights }
            }, {
            timeout: 10000
        }
        )
        return { success: true as const, ...result }
    } catch (error) {
        console.log("Error: ", error)
        if (error instanceof Error) throw new Error("Error updating user data: " + error.message)

        throw new Error("Error occurred updating user: ", error as any)
    }

}

type OnBoardingStatus = {
    isOnBoarded: boolean
}

export async function getOnboardingStatus(): Promise<OnBoardingStatus> {
    try {
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

        const userData = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
            select: {
                industry: true
            }
        })
        return { isOnBoarded: userData?.industry ? true : false }

    } catch (error) {
        console.log("Error checking onBoarding status: ", error)
        throw new Error("Couldnt verify onBoarding status")
    }

}