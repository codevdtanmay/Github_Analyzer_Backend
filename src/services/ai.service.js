import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const analyzewithAI = async (repoData)=>{
    try{
     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fileList = repoData.files.slice(0, 30).join(", ");

    const prompt = `
You are a senior software engineer reviewing a GitHub repository.

Repository Name: ${repoData.name}
Description: ${repoData.description}
Primary Language: ${repoData.language}
Stars: ${repoData.stars}

Files:
${fileList}

---
Only use the provided repository data.
Do NOT assume file contents or internal architecture.
If information is insufficient, say "Insufficient data".
Return ONLY JSON:

{
  "summary": "",
  "techStack": [],(Filter out:
	•	npm
	•	ESLint
	•	Prettier
	•	Babel)
  "score": 0,(Give a code quality score strictly between 1 and 10.
Do NOT exceed 10.)
  "strengths": [],
  "weaknesses": [],(If weakness contains words like:
	•	“appears”
	•	“likely”
	•	“could be”

👉 Either:
	•	remove it
OR
	•	replace with:""General best practices suggest adding tests and improving documentation if missing"")
  "suggestions": []
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean response
    text = text.replace(/```json|```/g, "").trim();

    return JSON.parse(text);

  } catch (error) {
    throw new Error("Gemini AI failed: " + error.message);
  }

}
