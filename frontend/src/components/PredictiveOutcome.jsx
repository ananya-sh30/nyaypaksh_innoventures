import React, { useState, useEffect, useCallback } from "react"; 
import CaseTrendChart from "./CaseTrend";
import JudicialTrends from "./JudicialTrends";
import "../styles/PredictionResults.css";

const PredictiveOutcome = ({ prob, data}) => {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const { case_keywords, court_type } = data;
  const { main_issue } = data;

  const formatPrediction = (predictionValue) => {
    return (predictionValue * 100).toFixed(2); 
  };

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);

    const suggestInput = { ...data, predictionProbability: prob };

    try {
      const response = await fetch("http://localhost:5000/api/suggestions/generateSuggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(suggestInput),
      });

      const result = await response.json();

      if (response.ok && result) {
        setSuggestions(result); 
      } else {
        setSuggestions({ error: "Error generating suggestions." });
      }
    } catch (error) {
      setSuggestions({ error: "Error fetching suggestions." });
      console.error("Error fetching suggestions:", error);
    }

    setLoading(false);
  }, [data, prob]);

  useEffect(() => {
    if (data && prob) {
      fetchSuggestions();
    }
  }, [data, prob, fetchSuggestions]);

  // Function to render suggestions as bullet points for approach
  const renderApproachSuggestions = () => {
    if (suggestions?.approach) {
      const approachList = suggestions.approach.split(".").map(item => item.trim()).filter(item => item !== "");
      return approachList.map((approach, index) => (
        <li key={index}>{approach.trim() && `${approach.trim()}.`}</li>
      ));
    }
    return <p>No approach suggestions available.</p>;
  };


  return (
    <section className="visualization-section">
      <h2>Predicted Outcome Visualization</h2>

      <div className="caseTrend">
        <div className="mock-chart">
           <CaseTrendChart caseKeywords={case_keywords} caseType={court_type} />
        </div>

        <div className="insights-container">
          <h4>Projected Success Probability for the Appellant</h4>
          {prob ? (
            Object.keys(prob).map((key) => (
              <p key={key}>
                <strong>{formatPrediction(prob[key])}%</strong> <br /><br />
                Based on the analysis, the estimated probability of a favorable outcome for the respondent is {formatPrediction(prob[key])}%, reflecting the projected likelihood of success given the case details and current factors.
              </p>
            ))
          ) : (
            <p>Waiting for prediction...</p>
          )}

          <h4>Recommended Strategies</h4>
          {loading ? (
            <div> 
              <div className="pulse-container">
                <div className="pulse"></div>
                <div className="pulse"></div>
                <div className="pulse"></div>
              </div>
              <p className="loading-text">Loading suggestions...</p>
            </div>
          ) : (
            <div>
              <h3>Suggested Approach</h3>
              <ul>{renderApproachSuggestions()}</ul>
     
              <h3>Suggested Action</h3>
              <p>{suggestions?.action}</p>
            </div>
          )}
        </div>
      </div>

      <div className="judicialTrend">
       <JudicialTrends 
          caseKeywords={case_keywords} 
          caseIssue={main_issue} 
        />
      </div>
    </section>
  );
};

export default PredictiveOutcome;
