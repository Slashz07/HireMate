"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

interface formInfo {
    industry: string,
    subIndustry: string,
    bio?: string,
    experience: number,
    skills: string[]
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
        const result = await db.$transaction(
            async (tx) => {
                let industryInsghts = await tx.industryInsights.findUnique({
                    where: {
                        industry: data.industry as string
                    }
                })
                if (!industryInsghts) {
                    industryInsghts = await tx.industryInsights.create({
                        data: {
                            industry: data.industry as string,
                            salaryRanges: [],
                            growthRate: 0,
                            demandLevel: "MEDIUM",
                            topSkills: [],
                            marketOutlook: "NEUTRAL",
                            keyTrends: [],
                            recommendedSkills: [],
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        }
                    })
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
                return { updatedUser, industryInsghts }
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