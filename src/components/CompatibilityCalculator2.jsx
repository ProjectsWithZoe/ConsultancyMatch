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
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setLoading(false);
    setText(data.text || "No text found.");
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h2>Compatibility Calculator</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload"}
      </button>
      {text && <pre>{text}</pre>}
    </div>
  );
}

export default CompatibilityCalculator2;
