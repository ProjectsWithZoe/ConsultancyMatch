import multer from "multer";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
dotenv.config();

//const upload = multer({ dest: "/tmp/" });
//const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to extract text from PDF
/*const extractTextFromPdf = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    console.log("Data.text", data.text);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
};*/
const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log("Extracted text:", data.text);
};

// Function to extract text from DOCX
const extractTextFromDocx = async (filePath) => {
  const docxBuffer = fs.readFileSync(filePath);
  const { value } = await mammoth.extractRawText({ buffer: docxBuffer });
  return value;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Use multer to handle file upload
    upload.single("cv")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload failed." });
      }

      const cvFile = req.file;
      console.log("Cv file", cvFile);

      if (!cvFile) {
        return res.status(400).json({ error: "CV file is required." });
      }

      let cvText = "";
      try {
        // Handle PDF or DOCX file
        if (cvFile.mimetype === "application/pdf") {
          cvText = await extractTextFromPdf(cvFile.path);
          console.log("CVtest", cvText);
        } else if (
          cvFile.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          cvText = await extractTextFromDocx(cvFile.path);
          console.log("CVtext", cvText);
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
