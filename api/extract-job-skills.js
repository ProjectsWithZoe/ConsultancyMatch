import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { jobDescription } = req.body;

      if (!jobDescription) {
        return res.status(400).json({ error: "Job description is required." });
      }

      const aiResponseJobSpec = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: `Extract key professional skills from the following job description:\n\n${jobDescription}. The key words are a maximum of 3 words`,
          },
        ],
      });

      const extractedSkills = aiResponseJobSpec.choices[0].message.content
        .trim()
        .split("\n")
        .map((skill) => skill.trim())
        .filter((skill) => skill && skill !== "Key Professional Skills:")
        .map((skill) => skill.replace(/\(Preferred\)/g, ""))
        .map((skill) => skill.replace(/[.,]/g, ""))
        .map((skill) => skill.replace(/\d+/g, ""))
        .map((skill) => {
          return skill
            .split(/ and | or /)
            .map((item) => item.trim())
            .filter((item) => item);
        })
        .flat()
        .map((skill) =>
          skill
            .replace(
              /\b(understanding of|ability to|proficiency in|experience in)\b/gi,
              ""
            )
            .trim()
        )
        .filter((skill) => skill);

      res.json({ jobSkills: extractedSkills });
    } catch (error) {
      console.error("Error extracting job skills:", error);
      res.status(500).json({ error: "Failed to extract job skills." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
