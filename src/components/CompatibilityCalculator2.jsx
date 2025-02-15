import { useState } from "react";

function CompatibilityCalculator2() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF file first!");

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);
    const response = await fetch("consultancy-match.vercel.app/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setLoading(false);
    setText(data.text || "No text found.");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Upload & Read PDF</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload"}
      </button>
      {text && <pre>{text}</pre>}
    </div>
  );
}

export default CompatibilityCalculator2;
