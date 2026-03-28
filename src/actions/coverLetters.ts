"use server";
import { getGeminiResponse } from "@/lib/gemini";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CoverLetter } from "@prisma/client";

export async function getCoverLetters(): Promise<CoverLetter[]> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthenticated Request");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }

    try {
        const coverLetters = await db.coverLetter.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        return coverLetters ?? [];
    } catch (error) {
        console.log("Error fetching coverLetters: ", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function createCoverLetter(formData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthenticated Request");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }

    try {
        const prompt = `
    Write a professional cover letter for a ${formData.jobTitle} position at ${formData.companyName}

    About the candidate:
    - Industry: ${user.industry}
    - Years of experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}

    Job Description:
    ${formData.jobDescription}

    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter structure using standard line breaks for paragraphs.
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements 

    CRITICAL FORMATTING INSTRUCTIONS:
    Output the letter STRICTLY in plain text. Do NOT use any markdown syntax whatsoever (no     asterisks ** for bolding, no brackets [], no hash symbols #, etc.). The final output must be pure, unformatted text that relies only on spaces and carriage returns (new lines) so it can be pasted directly into a standard email body.`

        const content = await getGeminiResponse(prompt, false);
        console.log("gemini res: ", content);
        const coverLetter = await db.coverLetter.create({
            data: {
                userId: user.id,
                content,
                ...formData,
            },
        });
        return coverLetter;

    } catch (error) {
        console.log("Error fetching coverLetters: ", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
}

export async function getCoverLetter(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthenticated Request");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }

    try {
        const coverLetter = await db.coverLetter.findUnique({
            where: {
                id,
                userId: user.id,
            },
        });
        return coverLetter;
    } catch (error) {
        console.log("Error fetching coverLetter: ", error);
    }
}

export const deleteCoverLetter = async (id: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthenticated Request");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }

    try {
        await db.coverLetter.delete({
            where: {
                id,
                userId: user.id,
            },
        });
    } catch (error) {
        console.log("Error deleting cover letter: ", error);
    }
};
