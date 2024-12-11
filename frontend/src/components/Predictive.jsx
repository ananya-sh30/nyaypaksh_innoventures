import React, { useState } from "react";
import PredictiveForm from "./PredictiveForm";
import PredictiveOutcome from "./PredictiveOutcome";
import HistoricalData from "./PredictiveHistorical";
import "../styles/Predicitve.css";

const Predictive = () => {
  const [predictions, setPredictions] = useState(null);
  const [formData, setFormData] = useState(null); // State to store form data
  const [loading, setLoading] = useState(false); // Loading state for fetching predictions
  const [error, setError] = useState(null); // Error state
  const [tableData, setTableData] = useState(null); // State to store table data

  // Function to handle predictions from PredictiveForm
  const handlePredictions = (formData, predictions) => {
    
    setFormData(formData); // Store the form data
    setPredictions(predictions); // Store the predictions
    setLoading(false); // Set loading to false after predictions are set

    // Call updateTableData once predictions are available
    updateTableData(formData);
  };

  const handleError = (error) => {
    setError(error);
    setLoading(false);
  };

  // Function to update table data by querying the backend API
  const updateTableData = async (formData) => {
    setLoading(true); // Set loading state while fetching table data

    try {
      // API call to fetch table data from backend
      const response = await fetch("http://localhost:5000/api/historic/getHistoricData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Sending formData to the API
  
      });

      if (!response.ok) {
        throw new Error("Failed to fetch table data.");
      }

      const result = await response.json();
      setTableData(result.rows); 
    } catch (error) {
      setError(error.message); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="predictive-analytics">
      <h1>Predictive & Precedent Analysis</h1>
      <p className="subHead">Utilize advanced analytics to predict case outcomes based on historical data</p>
      <PredictiveForm onPredict={handlePredictions} onError={handleError} />

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading predictions...</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {predictions && !loading && (
        <>
          <PredictiveOutcome prob={predictions} data={formData} />
          <HistoricalData tableData={tableData} />
        </>
      )}
    </div>
  );
};

export default Predictive;
