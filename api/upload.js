import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";

export const config = {
  api: {
    bodyParser: false, // Required for handling file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false }); // Ensure single file

  try {
    const [fields, files] = await form.parse(req);
    const pdfFile = files.pdf?.[0]?.filepath || files.pdf?.filepath; // Handle different formats

    if (!pdfFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(pdfFile);
    const pdfData = await pdfParse(dataBuffer);

    res
      .status(200)
      .json({ text: pdfData.text, cvSkills: extractSkills(pdfData.text) });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res
      .status(500)
      .json({ error: "Error extracting text", details: error.message });
  }
}

// Example function to extract skills from text (customize as needed)
function extractSkills(text) {
  return text
    .split(/\n/)
    .filter((line) => line.toLowerCase().includes("skills"));
}
