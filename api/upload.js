import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import cors from "cors";
import fs from "fs";

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });
//const pdfData = await pdfParse(req.file.buffer);

app.use(cors()); // Allow frontend to communicate

app.post("/api/upload", upload.single("pdf"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    //const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(req.file.buffer);
    fs.unlinkSync(req.file.path); // Delete after reading

    res.json({ text: pdfData.text });
  } catch (err) {
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
