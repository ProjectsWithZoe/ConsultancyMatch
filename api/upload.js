import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({
    uploadDir: "/tmp", // Temporary directory for uploaded files
    keepExtensions: true,
  });

  try {
    const [fields, files] = await form.parse(req);
    const pdfFile = files.pdf?.[0]?.filepath; // Correct way to access the file

    if (!pdfFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(pdfFile);
    const pdfData = await pdfParse(dataBuffer);

    if (!pdfData.text) {
      return res.status(400).json({ error: "No text extracted from the PDF" });
    }

    res.status(200).json({ text: pdfData.text });
  } catch (error) {
    console.error("Error extracting text:", error);
    res
      .status(500)
      .json({ error: "Error extracting text", details: error.message });
  }
}
