import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


export const getGeminiResponse = async (prompt: string, expectJson: boolean = true) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    if (!response.text) throw new Error("Error accessing data in Gemini api");

    const raw = response.text.trim();

    // Extract JSON block if demanded during call
    if (expectJson) {
        const match = raw.match(/\{[\s\S]*\}/);//match here extracts everything enclosed in {} in the raw and returns it in an array of object
        if (!match) throw new Error("No JSON found in gemini api response");

        return JSON.parse(match[0])
    }else{
        return raw
    }

}