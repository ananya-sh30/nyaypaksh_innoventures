import React, { useState } from "react";
import axios from 'axios';
import "../styles/CardList.css";
import "../styles/Popup.css";

function CardList(props) {

  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [summary, setSummary] = useState("");

  const handleOpenPopup = async(card) => {
    setSelectedCard(card); 
    await generateSummary(card); 
  };

  const handleClosePopup = () => {
    setSelectedCard(null); 
    setSummary(""); 
  };

  const generateSummary = async (card) => {
    setLoading(true); // Start loading
    try {
      const main_issue = card.main_issue;
      const outcome_in_favor_of = card.outcome_in_favor_of;
      const number_of_evidences = card.number_of_evidences;
      const outcome_in_court = card.outcome_in_court;
      const case_keywords = card.case_keywords;

      // Send the data to the backend API
      const response = await axios.post('http://localhost:5000/api/cases/generateSummary', {
        main_issue,
        outcome_in_favor_of,
        number_of_evidences,
        outcome_in_court,
        case_keywords
      });
   
      setSummary(response.data.summary);

    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary("Error generating summary.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <div className="results">
        <h2>Results</h2>
        <div className="review">
        <p>Search Results: {props.cards.length} Match Found </p>
        <p>
          Did you find what you were looking for? 
          <i class='bx bxs-like'></i> 
          <i class='bx bxs-dislike' ></i>
          </p>
        </div>
      </div>
      <div className="card-list">
        {props.cards.map((card) => (
          <div className="card" key={card.case_id}>
            <h3>{card.case_title}</h3>
            <p>{card.court_type}</p>
            <p>
              <strong>Judgment Date:</strong> {card.resolution_date.slice(0, 10).split('-').reverse().join('-')}
            </p>
            <div className="tags">
              {card.category_of_case.split(',').map((tag, idx) => (
                <span className="tag" key={idx}>
                  {tag.trim()}
                </span>
              ))}
            </div>
           
            <div
              className="corner-box"
              onClick={() => handleOpenPopup(card)} 
            >
              <i className='bx bx-right-arrow-alt'></i>
            </div>
          </div>
        ))}

        {selectedCard && (
          <div className="popup-overlay">
            <div className="popup-content">
              <button className="close-button" onClick={handleClosePopup}>
                ✖
              </button>
              <h4>{selectedCard.case_title}</h4>
              <p>{selectedCard.court_type}</p>
              <p>Judgment Date: {selectedCard.resolution_date.slice(0, 10).split('-').reverse().join('-')}</p>

              {loading ? (
                <div>   
                <div className="loading-icon">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <p>Loading Summary...</p>
                </div>
              ) : (
                <p><strong style={{textAlign: "center", fontSize: "27px"}}>Summary:</strong> <br /> <p style={{textAlign: "justify", fontSize: "18px"}}>{summary}</p></p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardList;
