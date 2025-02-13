import multer from "multer";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import pdf from "pdf-parse";

dotenv.config();

// Configure multer to store uploaded files in the /tmp directory (for serverless environments)
const upload = multer({ dest: "/tmp/" });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to extract text from PDF
const extractTextFromPdf = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const { text } = await pdf(dataBuffer);
  return text;
};

// Function to extract text from DOCX
const extractTextFromDocx = async (filePath) => {
  const docxBuffer = fs.readFileSync(filePath);
  console.log(docxBuffer);
  const { value } = await mammoth.extractRawText({ buffer: docxBuffer });
  return value;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Handle file upload using multer middleware
    upload.single("cvFile")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload failed." });
      }

      const cvFile = req.file;

      if (!cvFile) {
        return res.status(400).json({ error: "CV file is required." });
      }

      let cvText = "";
      try {
        // Handle PDF or DOCX file
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

        // Process the extracted text with OpenAI
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

        // Clean up by deleting the uploaded file from /tmp
        try {
          fs.unlinkSync(cvFile.path); // Delete the temporary file
        } catch (error) {
          console.error("Error deleting file:", error);
        }

        // Respond with extracted skills
        res.json({ cvSkills: extractedCvSkills });
      } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Error processing the file." });
      }
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
