import React, { useState, useEffect } from "react";
import Chatbot from "./Chatbot"; // Import the Chatbot component
import "../styles/Summary.css";

function SummaryGen({ fileData, summaryData }) {
  const { originalText, summaryText, keyInsights, totalWords } = summaryData;
  const [file, setFile] = useState(null);
  const [showKeyInsights, setShowKeyInsights] = useState(true); // Show key insights by default
  const [showOriginalDocModal, setShowOriginalDocModal] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Simulate a delay in generating key insights
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false once data is ready
    }, 2000); // Simulate a 2-second delay (adjust based on your processing time)

    return () => clearTimeout(timer); // Cleanup timer if component unmounts
  }, []); // Empty dependency array to run the effect only once after mount

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setShowKeyInsights(true); // After file is uploaded, show key insights
    setLoading(true); // Set loading to true when file is being processed
  };

  const handleDownload = (text, filename, mimeType) => {
    const blob = new Blob([text], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const toggleOriginalDocModal = () => {
    setShowOriginalDocModal(!showOriginalDocModal);
  };

  return (
    <div className="summaryyy-layout">
      {/* Chatbot Section */}
      <div className="chatbot-container">
        <Chatbot originalText={originalText} />
      </div>

      {/* Key Insights Section */}
      <div className="key-insights-container">
        <h1 className="main-heading">Document Summary and Key Insights</h1>
        
        {loading ? (
          <div className="loading-spinner">
            {/* Add your loading animation here */}
            <div className="spinner"></div>
            <p>Generating Key Insights...</p>
          </div>
        ) : (
          <>
            {showKeyInsights && (
              <div className="key-insights">
                <button
                  onClick={toggleOriginalDocModal}
                  className="view-original-btn"
                >
                  View Original Document
                </button>

                <div className="key-insight-box">
                  <h3>Key Insights</h3>
                  {keyInsights.map((insight, index) => (
                    <div key={index} className="insight">
                      <h4>{index + 1}:</h4>
                      <p>{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Download Buttons */}
            <div className="download-buttons">
              <button
                onClick={() =>
                  handleDownload(
                    originalText,
                    "original_document.txt",
                    "text/plain"
                  )
                }
              >
                Download Original Text
              </button>
              <button
                onClick={() =>
                  handleDownload(summaryText, "document_summary.txt", "text/plain")
                }
              >
                Download Summary
              </button>
            </div>
          </>
        )}
      </div>

      {showOriginalDocModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Original Document</h3>
            <textarea
              value={originalText}
              readOnly
              rows="20"
              cols="80"
              className="modal-textbox"
            />
            <button
              onClick={toggleOriginalDocModal}
              className="close-modal-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryGen;
