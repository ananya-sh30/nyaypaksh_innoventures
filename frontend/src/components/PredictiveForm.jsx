import React, { useState } from "react";
import "../styles/PredictiveForm.css";

function InputField({ label, value, onChange, required, placeholder }) {
  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, required, placeholder }) {
  return (
    <div>
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} required={required}>
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PredictiveForm({ onPredict, onError }) {
  const [caseKeywords, setCaseKeywords] = useState("");
  const [courtType, setCourtType] = useState("");
  const [mainIssue, setMainIssue] = useState(""); // State for main_issue
  const [numEvidences, setNumEvidences] = useState("");
  const [dataset, setDataset] = useState("");
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEvidenceChange = (event) => {
    const value = event.target.value;
    setNumEvidences(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = {
      case_keywords: caseKeywords,
      court_type: courtType,
      main_issue: mainIssue, // Include main_issue in formData
      number_of_evidences: numEvidences,
      dataset: dataset,
    };

    try {
      const response = await fetch("http://localhost:5001/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        setPredictions(result);
        onPredict(formData, result); // Pass both form data and predictions to the parent
        setError(null);
      } else {
        setError(result.error);
        onError(result.error);
        setPredictions(null);
      }
    } catch (err) {
      setError("An error occurred while fetching predictions.");
      onError("An error occurred while fetching predictions.");
      setPredictions(null);
    }

    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="predictForm">
        <div className="inputHead">
          <p>Input Case Parameters</p>
        </div>
        <div className="formDiv">
          <div className="typeOfCase">
            <SelectField
              label="Type of Case"
              value={dataset}
              onChange={setDataset}
              options={[
                { label: "Arbitration & Disputes", value: "dispute" },
                { label: "Contracts", value: "contract" },
                { label: "Tax", value: "tax" },
                { label: "Property", value: "property" },
                { label: "Corporate", value: "corporate" },
              ]}
              required={true}
              placeholder="Select case type"
            />
          </div>
          <div className="keywords">
            <InputField
              label="Key Terms"
              value={caseKeywords}
              onChange={setCaseKeywords}
              required={true}
              placeholder="e.g., Intellectual Property, Sales tax"
            />
          </div>
          <div className="jury">
            <InputField
              label="Jurisdiction"
              value={courtType}
              onChange={setCourtType}
              required={true}
              placeholder="e.g., Supreme Court, High Court"
            />
          </div>
          <div className="mainIssue">
            <InputField
              label="Main Issue"
              value={mainIssue}
              onChange={setMainIssue}
              required={true}
              placeholder="e.g., Breach of Contract"
            />
          </div>
          <div className="evidenceStrength">
            <label>Evidence Strength</label>
            <div>
              {["High", "Medium", "Low"].map((level) => (
                <label key={level}>
                  <input
                    type="radio"
                    name="evidenceStrength"
                    value={level}
                    checked={numEvidences === level}
                    onChange={handleEvidenceChange}
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="preBtn">Predict</button>
        </div>
      </form>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default PredictiveForm;
