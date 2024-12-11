import React from "react";

const HistoricalData = ({ tableData }) => {
  if (!tableData || tableData.length === 0) {
    return <p>No historical data available.</p>; // Handle null or empty tableData gracefully
  }

  // Filter out rows where 'link' is null or empty
  const filteredData = tableData.filter(item => item.link);

  if (filteredData.length === 0) {
    return <p>No historical data with valid document links available.</p>; // If no valid rows remain
  }

  return (
    <div className="history-section">
      <h3>Historical Cases</h3>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Case Title</th>
            <th>Jurisdiction</th>
            <th>Resolution Date</th>
            <th>Outcome In Court</th>
            <th>Document Link</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.case_title}</td>
              <td>{item.court_type}</td>
              <td>{item.resolution_date}</td>
              <td>{item.outcome_in_court}</td>
              <td>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Link to Case Document
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoricalData;
