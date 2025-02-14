import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Assuming Supabase for authentication & DB
import toast from "react-hot-toast";
import { fileFromPath } from "openai";

const CompatibilityCalculator = () => {
  const [consultantSkills, setConsultantSkills] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  //const [cvFile, setCvFile] = useState(null);
  const [extractedJobSkills, setExtractedJobSkills] = useState([]);
  const [result, setResult] = useState(null);
  const [gettingCV, setGettingCV] = useState(false);
  const [gettingJobSkills, setGettingJobSkills] = useState(false);
  const [gettingComparison, setGettingComparison] = useState(false);
  const [commonSkills, setCommonSkills] = useState([]);
  const [missingSkills, setMissingSKills] = useState([]);
  const [matchPercentage, setMatchPercentage] = useState("");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  //Handle Job Description Input and Skills Extraction
  const handleJobDescriptionChange = async (e) => {
    const description = e.target.value;
    setJobDescription(description);
  };
  /*const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("File", file);
    if (file) {
      uploadPDF(file);
    } else {
      console.error("Invalid file type. Please upload a PDF or DOCX file.");
    }
    setCvFile(file);
  };*/
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF file first!");

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setLoading(false);
    setText(data.text || "No text found.");
  };

  /*const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCvFile(file);
  };*/

  // 1 .get job skills from job description

  async function extractJobSkills(description) {
    //const jobDescription = document.getElementById("jobDescription").value;

    if (!jobDescription) {
      alert("Please enter a job description.");
      return;
    }

    setGettingJobSkills(true);

    try {
      const response = await fetch("/api/extract-job-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: description }),
      });

      const data = await response.json();

      setExtractedJobSkills(data.jobSkills);
      console.log(data.jobSkills);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setGettingJobSkills(false);
    }
  }

  /*async function uploadPDF(cvFile) {
    const formData = new FormData();
    formData.append("pdf", cvFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data", data);

      if (data.text) {
        console.log("Extracted Text:", data.text);
        setConsultantSkills(data.text);
      } else {
        console.error("No text extracted from PDF.");
      }

      if (data.cvSkills) {
        console.log("Extracted CV Skills:", data.cvSkills);
        setConsultantSkills(data.cvSkills);
      } else {
        console.warn("cvSkills is undefined.");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  }*/

  // 2 .get consultant skills from CV
  /*async function extractCvSkills(cvFile) {
    if (!cvFile) {
      alert("Please upload a CV.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cvFile);
    console.log("Formdata", formData);
    setGettingCV(true);

    try {
      const response = await fetch("/api/extract-cv-skills", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Data", data);
      console.log("Extracted CV Skills:", data.cvSkills);
      setConsultantSkills(data.cvSkills);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setGettingCV(false);
    }
  }*/

  // 3 .compare job skills and consultant skills

  async function compareSkills(consultantSkills, extractedJobSkills) {
    if (
      consultantSkills.length == 0 ||
      !consultantSkills ||
      extractedJobSkills.length == 0 ||
      !extractedJobSkills
    ) {
      alert("Please add a CV and job description");
    }

    setGettingComparison(true);
    try {
      const response = await fetch("/api/compare-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure this header is set
        },
        body: JSON.stringify({
          consultantSkills: consultantSkills,
          extractedJobSkills: extractedJobSkills,
        }),
      });
      console.log({
        consultantSkills: consultantSkills,
        extractedJobSkills: extractedJobSkills,
      });

      const data = await response.json();

      const result = data.result;
      console.log(data.result);
      setResult(result);

      // Extract common skills list
      const commonSkillsMatch = result.match(/Common Skills:\s*\[(.*?)\]/);
      const commonSkills = commonSkillsMatch
        ? commonSkillsMatch[1]
            .split(",")
            .map((skill) => skill.trim().replace(/^['"]+|['"]+$/g, ""))
        : [];

      // Extract missing skills list
      const missingSkillsMatch = result.match(/Missing Skills:\s*\[(.*?)\]/);
      const missingSkills = missingSkillsMatch
        ? missingSkillsMatch[1]
            .split(",")
            .map((skill) => skill.trim().replace(/^['"]+|['"]+$/g, ""))
        : [];

      // Try different regex patterns for match percentage
      const matchPercentageMatch =
        result.match(/Match Percentage:.*?=\s*([\d.]+)%/) ||
        result.match(/Match Percentage:.*?approximately\s*([\d.]+)%/) || // Format: "7 out of 23, which is approximately 30.43%"
        result.match(/Match Percentage:\s*\(.*?\)=\s*([\d.]+)%/) || // Format: "(X/Y)*100 = Z%"
        result.match(/Match Percentage:\s*([\d.]+)%/); // Format: "Z%"

      // Extract match percentage
      const matchPercentage = matchPercentageMatch
        ? parseFloat(matchPercentageMatch[1])
        : 0;

      console.log("Extracted Match Percentage:", matchPercentage); // Debugging

      console.log(commonSkills);
      console.log(missingSkills);
      console.log(matchPercentage);
      setCommonSkills(commonSkills);
      setMissingSKills(missingSkills);
      setMatchPercentage(matchPercentage);
      // Return structured data
      return {
        commonSkills,
        missingSkills,
        matchPercentage,
      };
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setGettingComparison(false);
      setConsultantSkills("");
      setJobDescription("");
      setCvFile("");
      setExtractedJobSkills([]);
    }
  }

  return (
    <div className="bg-gray-50 py-16 px-6 lg:px-20">
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-lg">
        <h2 className="lg:text-3xl md:text-2xl font-semibold text-center text-indigo-700 mb-4">
          Compatibility Calculator
        </h2>
        <h1 className="lg:text-2xl md:text-l font-semibold text-center text-indigo-700 mb-4">
          1. Enter the job description that you want to analyze for skills.
        </h1>

        {/* Job Description Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Job Description
          </label>
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Paste your job description here..."
            value={jobDescription}
            onChange={handleJobDescriptionChange}
          />
        </div>

        <div className="flex justify-center mb-8">
          <button
            className={`${
              extractedJobSkills.length > 0 ? "bg-green-600" : "bg-indigo-600"
            } text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed`}
            onClick={() => extractJobSkills(jobDescription)}
            disabled={gettingJobSkills}
          >
            {extractedJobSkills.length > 0
              ? "Job Skills Extracted"
              : gettingJobSkills
              ? "Analyzing job description..."
              : "Extract Job Skills"}
          </button>
        </div>

        <h1 className="lg:text-2xl md:text-l font-semibold text-indigo-700 mb-4">
          2. Upload your CV to get your skills.
        </h1>

        <div style={{ padding: "20px" }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Processing..." : "Upload"}
          </button>
          {text && <pre>{text}</pre>}
        </div>

        {/* CV Upload 
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Upload CV (PDF/DOCX)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="border p-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>*/}

        <div className="flex justify-center mb-8">
          <button
            className={`${
              consultantSkills.length > 0 ? "bg-green-600" : "bg-indigo-600"
            } text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed`}
            //onClick={() => extractCvSkills(cvFile)}
            onClick={() => uploadPDF(cvFile)}
            disabled={gettingCV}
          >
            {consultantSkills.length > 0
              ? "CV Skills Extracted"
              : gettingCV
              ? "Analyzing CV..."
              : "Extract CV Skills"}
          </button>
        </div>

        <h1 className="lg:text-2xl md:text-l font-semibold text-indigo-700 mb-4">
          3. Analyze how closely your skills match the job description.
        </h1>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => compareSkills(consultantSkills, extractedJobSkills)}
            className="flex flex-col bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={
              gettingComparison || !extractedJobSkills || !consultantSkills
            }
          >
            {gettingComparison
              ? "Analyzing Compatibility ..."
              : "Check Job Compatibility"}
          </button>
        </div>

        {/* Display Results */}
        {result && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
              Compatibility Results
            </h3>

            {/* Match Percentage */}
            <div className="mt-4">
              <h4 className="font-semibold text-black-600 text-xl">
                Match Percentage
              </h4>
            </div>
            <div className="flex justify-start">
              <span className="flex flex-col bg-gray-200 textblack px-8 py-3 rounded-lg text-3xl font-semibold">
                {matchPercentage}%
              </span>
            </div>
            {/* Main Common Skills */}
            <div className="mb-4">
              <h4 className="font-semibold text-green-600 text-xl">
                Skills Matched:
              </h4>
              <ul className="list-none pl-6 space-y-2 flex flex-col border border-green-300 bg-green-100 rounded-lg shadow-sm focus:outline-none text-black px-8 py-3 text-s font-semibold">
                {commonSkills.map((skill, idx) => (
                  <li key={idx} className="text-gray-700">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Skills Missing */}
            <div className="mb-4">
              <h4 className="font-semibold text-red-600 text-xl">
                Skills Missing:
              </h4>
              <ul className="list-none pl-6 space-y-2 flex flex-col border border-red-300 bg-red-100 rounded-lg shadow-sm focus:outline-none text-black px-8 py-3 text-s font-semibold">
                {missingSkills.map((skill, idx) => (
                  <li key={idx} className="text-gray-700">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompatibilityCalculator;
