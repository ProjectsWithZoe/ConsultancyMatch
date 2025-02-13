import express from "express";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON body parsing

const upload = multer({ dest: "uploads/" });

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to extract text from PDF
const extractTextFromPdf = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// Function to extract text from DOCX
const extractTextFromDocx = async (filePath) => {
  const docxBuffer = fs.readFileSync(filePath);
  const { value } = await mammoth.extractRawText({ buffer: docxBuffer });
  return value;
};

// API 1: Extract skills from Job Description
app.post("/api/extract-job-skills", async (req, res) => {
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
      .split("\n") // Split by new line
      .map((skill) => skill.trim()) // Trim extra spaces from each line
      .filter((skill) => skill && skill !== "Key Professional Skills:") // Filter out empty strings and the title line
      .map((skill) => skill.replace(/\(Preferred\)/g, "")) // Remove "Preferred" text
      .map((skill) => skill.replace(/[.,]/g, "")) // Remove commas or periods
      .map((skill) => skill.replace(/\d+/g, "")) // Remove any numbers
      .map((skill) => {
        // Split compound skills like "Natural Language Processing (NLP) computer vision"
        return skill
          .split(/ and | or /) // Split by "and" or "or"
          .map((item) => item.trim())
          .filter((item) => item);
      })
      .flat() // Flatten the array in case any skill is split into multiple parts
      .map((skill) => {
        // Remove common phrases like "understanding of", "ability to", etc.
        return skill
          .replace(
            /\b(understanding of|ability to|proficiency in|experience in)\b/gi,
            ""
          )
          .trim(); // Remove extra spaces after replacement
      })
      .filter((skill) => skill); // Remove any empty skills that may remain after filtering

    res.json({ jobSkills: extractedSkills });
  } catch (error) {
    console.error("Error extracting job skills:", error);
    res.status(500).json({ error: "Failed to extract job skills." });
  }
});

// API 2: Extract skills from CV
app.post("/api/extract-cv-skills", upload.single("cv"), async (req, res) => {
  try {
    const cvFile = req.file;

    if (!cvFile) {
      return res.status(400).json({ error: "CV file is required." });
    }

    let cvText = "";
    if (cvFile.mimetype === "application/pdf") {
      cvText = await extractTextFromPdf(cvFile.path);
    } else if (
      cvFile.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cvText = await extractTextFromDocx(cvFile.path);
    } else {
      return res
        .status(400)
        .json({ error: "Invalid file type. Only PDF and DOCX are supported." });
    }

    const openaiResponseCv = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Extract key professional skills from the following CV text:\n\n${cvText}. The key skills should have a maximum of 3 words.`,
        },
      ],
    });

    const extractedCvSkills = openaiResponseCv.choices[0].message.content
      .trim()
      .split("\n")
      .map((skill) => skill.trim())
      .filter((skill) => skill);

    res.json({ cvSkills: extractedCvSkills });
  } catch (error) {
    console.error("Error extracting CV skills:", error);
    res.status(500).json({ error: "Failed to extract CV skills." });
  }
});

//API 3 : Skill comparison

app.post("/api/compare-skills", async (req, res) => {
  const { consultantSkills, extractedJobSkills } = req.body;

  if (!consultantSkills || !extractedJobSkills) {
    return res.status(400).json({
      error: "Both consultantSkills and extractedJobSkills are required.",
    });
  }

  if (!Array.isArray(consultantSkills) || !Array.isArray(extractedJobSkills)) {
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

Please format your response as:
1. Common Skills: [list of common skills]
2. Match Percentage: [number]% 
3. Missing Skills: [list of missing skills]
  `;

  try {
    // Send request to GPT-4
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Use GPT-4 model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    // Get the GPT-4 response
    const gptResponse = response.choices[0].message.content;
    //.trim().split("\n");
    //.map((skill) => skill.trim())
    //.filter((skill) => skill);

    // Send the response back to the client
    res.json({ result: gptResponse });
  } catch (error) {
    console.error("Error extracting job skills:", error);
    res.status(500).json({ error: "Failed to extract job skills." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
