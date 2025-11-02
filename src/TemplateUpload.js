import React, { useState } from "react";

function TemplateUpload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("template", selectedFile);

    try {
      const response = await fetch("https://ai-report-8aglyebd0-ashhar-usmans-projects.vercel.app/upload-template", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      onUploadSuccess(selectedFile, responseData.fields);
    } catch (err) {
      setError(
        "An error occurred during upload. Please check the console for details."
      );
      console.error("Upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="h4 mb-4">Step 1: Upload Template</h2>
      <p className="text-muted">Select a .docx file to upload and begin the process.</p>
      <div className="input-group mb-3">
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
          accept=".docx"
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-grid">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleUpload}
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload and Detect Fields"}
        </button>
      </div>
    </div>
  );
}

export default TemplateUpload;
