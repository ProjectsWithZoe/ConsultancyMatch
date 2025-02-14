import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import cors from "cors";
import fs from "fs";

const app = express();
const upload = multer({ dest: "tmp/" }); // Temporary storage

app.use(cors()); // Allow frontend to communicate

app.post("/upload", upload.single("pdf"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    fs.unlinkSync(req.file.path); // Delete after reading

    res.json({ text: pdfData.text });
  } catch (err) {
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});
