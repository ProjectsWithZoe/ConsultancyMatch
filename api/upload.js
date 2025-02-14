import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  try {
    const [fields, files] = await form.parse(req);
    console.log("Files:", files);

    const pdfFile = files.pdf?.[0]?.filepath || files.pdf?.filepath;
    console.log("PDF File Path:", pdfFile);

    if (!pdfFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(pdfFile);
    console.log("Data Buffer Length:", dataBuffer.length);

    const pdfData = await pdfParse(dataBuffer);
    console.log("Extracted Text:", pdfData.text);

    res.status(200).json({ text: pdfData.text.trim() });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res
      .status(500)
      .json({ error: "Error extracting text", details: error.message });
  }
}
