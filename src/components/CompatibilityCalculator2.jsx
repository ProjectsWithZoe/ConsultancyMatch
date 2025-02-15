import { useState } from "react";
import pdfParse from "pdf-parse";

function CompatibilityCalculator() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleExtractText = async () => {
    if (!file) return alert("Select a PDF file first!");

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async function () {
        const arrayBuffer = reader.result;
        const data = await pdfParse(arrayBuffer);
        setText(data.text || "No text found.");
      };
    } catch (error) {
      console.error("Error extracting text:", error);
      alert("Failed to extract text.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Extract Text from PDF</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleExtractText} disabled={loading}>
        {loading ? "Processing..." : "Extract Text"}
      </button>
      {text && <pre>{text}</pre>}
    </div>
  );
}

export default CompatibilityCalculator;
