import React, { useState } from 'react';
import FileUploader from './FileUploader';
import SummaryGen from './SummaryGen';
import "../styles/Summary.css";
import axios from 'axios';

function Summary() {
  const [fileData, setFileData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [wordCount, setWordCount] = useState(300);  // Default word count

  // Function to handle file upload and summary fetching
  const handleFileUpload = (file) => {
    setFileData(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('word_count', wordCount); // Sending word count to backend

    // Sending file to the backend API to extract text and generate a summary
    axios.post('http://localhost:5001/api/summarizer/summarize', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(response => {
        setSummaryData(response.data);
      })
      .catch(error => {
        console.error("There was an error with the file upload!", error);
      });
  };

  // Handle the word count slider change
  const handleWordCountChange = (event) => {
    setWordCount(event.target.value);
  };

  return (
    <div className="Summary">
      <header className="Summary-header">
        <h1>Advanced Document Summarizer</h1>
      </header>
      
      <div className="content">
        <div className='summInput'>
        <FileUploader onFileUpload={handleFileUpload} />

        <div className="slider-container-word">
          <label>Word Count: {wordCount}</label>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={wordCount}
            onChange={handleWordCountChange}
          />
        </div>
        </div>
        {summaryData && (
          <SummaryGen fileData={fileData} summaryData={summaryData} />
        )}
      </div>
    </div>
  );
}

export default Summary;
