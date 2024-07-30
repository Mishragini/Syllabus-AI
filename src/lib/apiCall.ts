import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI('AIzaSyAeE0JFjFCyAG1JUnOkqsfBAT1zfp9CXpk');

export async function callToAiApi(prompt: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    return result.response.text();
}
