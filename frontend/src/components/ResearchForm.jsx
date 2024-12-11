import React, { useState } from "react";
import "../styles/ResearchForm.css";

const SearchForm = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    query: "",
    dateRange: [1995, 2024],
    caseType: "",
    sortBy: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (value) => {
    setFormData((prevState) => {
      const newSortBy = prevState.sortBy.includes(value)
        ? prevState.sortBy.filter((item) => item !== value)
        : [...prevState.sortBy, value];

      return { ...prevState, sortBy: newSortBy };
    });
  };

  const handleSubmit = (e) => {
    console.log(formData);
    e.preventDefault();
    onSearch(formData); 
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-container">
    <div className="search-icon">
    <i class='bx bx-search-alt-2'></i>
    </div>
    <input
      type="text"
      name="query"
      placeholder="Enter case keywords (e.g. sales tax, arbitration)..."
      value={formData.query}
      onChange={handleInputChange}
    />
    <div className="submitBtn">
      <button type="submit">Search</button>
    </div>
  </div>
      <p className="filterHead">Common Filters</p>
      <div className="slider-container">
        <label>Select Date Range: </label>
        <p className="range">1995</p>
        <input
          type="range"
          name="dateRange"
          min="1995"
          max="2024"
          value={formData.dateRange[1]}
          onChange={(e) =>
            setFormData({ ...formData, dateRange: [1995, e.target.value] })
          }
        />
        <p className="range">{formData.dateRange[1]}</p>
      </div>
      <div className="caseType">
        <label>Select Case Type:</label>
        <select
          name="caseType"
          value={formData.caseType}
          onChange={handleInputChange}
        >
          <option value=""  selected>
            None
          </option>
          <option value="Contract">Contract</option>
          <option value="Corporate">Corporate</option>
          <option value="Commercial">Commercial</option>
          <option value="Tax">Tax</option>
          <option value="Banking">Banking</option>
          <option value="Property">Property</option>
          <option value="Dispute">Dispute</option>
          <option value="Arbitration">Arbitration</option>
          <option value="Civil">Civil</option>
        </select>
      </div>

      <div className="sort-options">
        <label>Resolution favoring: </label>
        <div
          className={`sort-option ${formData.sortBy.includes("Respondent") ? "selected" : ""}`}
          onClick={() => handleCheckboxChange("Respondent")}
        >
          Respondent
        </div>
        <div
          className={`sort-option ${formData.sortBy.includes("Appellant") ? "selected" : ""}`}
          onClick={() => handleCheckboxChange("Appellant")}
        >
          Appellant
        </div>
      </div>

    </form>
  );
};

export default SearchForm;
