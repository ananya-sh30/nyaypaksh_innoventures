import React, { useState } from "react";
import "../styles/Summary.css";

function FileUploader({ onFileUpload }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      onFileUpload(file);
    } else {
      alert("Please upload a file.");
    }
  };

  return (
    <div className="uploader">
    <div className="file-uploader-modern">
        
      <div className="upload-container">
        <input
          id="file-upload"
          type="file"
          accept=".pdf, .docx, .txt"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="upload-box">
          <span className="upload-icon"><i class='bx bx-file'></i></span>
          <span className="upload-text">
            {file ? file.name : "Drag and drop or choose a file"}
          </span>
        </label>
      </div>
      </div>
      <button className="upload-button" onClick={handleUpload}>
        Upload File
      </button>
    </div>
  );
}

export default FileUploader;
