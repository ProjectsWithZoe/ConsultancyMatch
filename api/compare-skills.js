import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { consultantSkills, extractedJobSkills } = req.body;

    if (!consultantSkills || !extractedJobSkills) {
      return res.status(400).json({
        error: "Both consultantSkills and extractedJobSkills are required.",
      });
    }

    if (
      !Array.isArray(consultantSkills) ||
      !Array.isArray(extractedJobSkills)
    ) {
      return res.status(400).json({
        error: "Both consultantSkills and extractedJobSkills should be arrays.",
      });
    }

    const consultantSkillsText = consultantSkills.join(", ");
    const extractedJobSkillsText = extractedJobSkills.join(", ");

    const prompt = `
      You are an assistant comparing two sets of skills. 
      The first list contains the consultant's skills: 
      "${consultantSkillsText}"
      
      The second list contains the job description's skills:
      "${extractedJobSkillsText}"
      
      1. List the common skills between the two lists.
    2. Provide the match percentage, which is the ratio of common skills to job description skills, and express it as a percentage only.
    3. List the missing skills from the job description that the consultant does not have.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      });

      const gptResponse = response.choices[0].message.content;
      res.json({ result: gptResponse });
    } catch (error) {
      console.error("Error extracting job skills:", error);
      res.status(500).json({ error: "Failed to extract job skills." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
