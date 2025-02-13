import multer from "multer";
import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

dotenv.config();

const upload = multer({ dest: "uploads/" });
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

export default async function handler(req, res) {
  if (req.method === "POST") {
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
      return res.status(400).json({
        error: "Invalid file type. Only PDF and DOCX are supported.",
      });
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
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
