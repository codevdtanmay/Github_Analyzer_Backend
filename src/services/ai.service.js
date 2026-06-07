import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzewithAI = async (repoData) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
    });

    const fileList = repoData.files
      ?.slice(0, 30)
      .join(", ") || "No files available";

    const prompt = `
You are a senior software engineer reviewing a GitHub repository.

Repository Name: ${repoData.name}
Description: ${repoData.description || "No description"}
Primary Language: ${repoData.language || "Unknown"}
Stars: ${repoData.stars || 0}

Files:
${fileList}

Rules:
- Only use the provided repository data.
- Do NOT assume file contents.
- Do NOT invent technologies.
- If information is insufficient, explicitly say "Insufficient data".
- Score must be between 1 and 10.
- Exclude npm, ESLint, Prettier, Babel from techStack.
- Return ONLY valid JSON.

Expected JSON format:

{
  "summary": "",
  "projectType": "",
  "techStack": [],
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "resumeWorthiness": ""
}
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    let text = result.response.text().trim();

    // Remove markdown wrappers if Gemini adds them
    text = text.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error:", parseError);

      return {
        summary: "Failed to parse AI response",
        projectType: "Unknown",
        techStack: [],
        score: 0,
        strengths: [],
        weaknesses: [],
        suggestions: [],
        resumeWorthiness: "Unknown",
      };
    }
  } catch (error) {
    console.error("Gemini Error:", error);

    throw new Error(`Gemini AI failed: ${error.message}`);
  }
};