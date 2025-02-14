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

  const form = new formidable.IncomingForm();
  form.uploadDir = "/tmp"; // Temporary storage for Vercel
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing file" });
    }

    const pdfPath = files.pdf?.filepath;
    if (!pdfPath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const dataBuffer = fs.readFileSync(pdfPath);
      const pdfData = await pdfParse(dataBuffer);

      res.status(200).json({ text: pdfData.text });
    } catch (error) {
      res.status(500).json({ error: "Error extracting text" });
    }
  });
}
