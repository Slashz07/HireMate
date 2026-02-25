import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import { db } from "../prisma";
import { inngest } from "./client";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// npx inngest-cli@latest dev--->command for starting inngest server

export const generateIndustryInsights = inngest.createFunction(
    { id: "industry insights", name: "generate industry insights" },
    { cron: "0 0 * * 0" },
    async ({ step }) => {
        const industries = await step.run("Fetch Industries", async () => {
            return await db.industryInsights.findMany({
                select: { industry: true },
            })
        })

        for (const item of industries) {
            const industry = item.industry
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
            const res = await step.ai.infer("gemini", {
                model: step.ai.models.gemini({
                    model: "gemini-2.5-flash",
                }),
                body: {
                    contents: [{
                        role: "user",
                        parts: [{ text: prompt }]
                    }]
                }

            })

            const candidate = res.candidates?.[0];
            const part = candidate?.content?.parts?.[0];
            const text = (part && "text" in part) ? part.text : "";

            // const res = await step.ai.wrap("gemini", async (p): Promise<GenerateContentResponse> => {
            //     const response = await ai.models.generateContent({
            //         model: "gemini-2.5-flash",
            //         contents: p,
            //     });
            //     return response
            // }, prompt)

            // const candidate = res.candidates?.[0];
            // const text = candidate?.content?.parts?.[0]?.text ?? "";


            const match = text.trim().match(/\{[\s\S]*\}/);

            const insights = match ? JSON.parse(match[0]) : "";

            await step.run(`Updating ${industry}'s insights`, async () => {
                await db.industryInsights.update({
                    where: { industry },
                    data: {
                        ...insights,
                        lastUpdate: new Date(),
                        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    }
                })
            })
        }
    }

)
// inngest.createFunction(metadata, trigger, handler)
// "fetch Industries" is name of the step for unique identification cuz user is allowed to create multiple steps at once 