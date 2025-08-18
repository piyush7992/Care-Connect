// app/api/suggest-doctor/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { symptoms } = await req.json();

    const prompt = `
    A patient describes these symptoms: ${symptoms}.
    Suggest the *top 3 most suitable doctor specializations* ranked from most to least relevant.
    Give the response in this exact format:
    1. Specialization
    2. Specialization
    3. Specialization
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ suggestions: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error suggesting doctor:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}