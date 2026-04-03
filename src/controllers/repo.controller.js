import { getRepoData } from "../services/github.service.js";
import { analyzewithAI } from "../services/ai.service.js";

export const analyzeRepo = async(req, res)=>{
    try {
        const {repoUrl} = req.body;

        if(!repoUrl){
            return res.status(400).json({ error: "Repo URL is required" });
        }

        const repoData = await getRepoData(repoUrl)

        const aiAnalysis = await analyzewithAI(repoData)


        res.json({
            success: true,
      repo: repoData,
      analysis: aiAnalysis,
        }

        )






    } catch (error) {
   res.status(500).json({
      error: error.message,
    });
        
    }
}