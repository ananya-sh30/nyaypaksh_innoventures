import React, { useState } from "react";
import axios from "axios";
import "../styles/Track.css";

function Track() {
  const [caseId, setCaseId] = useState("");
  const [caseName, setCaseName] = useState("");
  const [partiesInvolved, setPartiesInvolved] = useState("");
  const [hearingDate, setHearingDate] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [cases, setCases] = useState([
    {
      caseId: "12345",
      caseName: "XYZ vs ABC Corp",
      partiesInvolved: "XYZ Corp, ABC Corp",
      hearingDate: "Oct 15, 2024",
      status: "Ongoing",
      documentLink: "N/A",
    },
  ]);

  const handleAddCase = async (e) => {
    e.preventDefault();

    if (!caseId || !caseName || !partiesInvolved || !hearingDate || !uploadedFile) {
      alert("Please provide all required details.");
      return;
    }

    const formData = new FormData();
    formData.append("caseId", caseId);
    formData.append("caseName", caseName);
    formData.append("partiesInvolved", partiesInvolved);
    formData.append("hearingDate", hearingDate);
    formData.append("status", status);
    formData.append("document", uploadedFile);

    try {
      const response = await axios.post("http://localhost:5000/api/track/add-case", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);

      setCases((prevCases) => [
        ...prevCases,
        {
          caseId,
          caseName,
          partiesInvolved,
          hearingDate,
          status,
          documentLink: response.data.documentLink || "Uploaded Document", // Assuming response returns document link
        },
      ]);

      // Clear inputs after adding case
      setCaseId("");
      setCaseName("");
      setPartiesInvolved("");
      setHearingDate("");
      setUploadedFile(null);
    } catch (error) {
      console.error("Error adding case:", error);
      alert("Failed to add case.");
    }
  };

  const calculateSummary = () => {
    const totalCases = cases.length;
    const ongoingCases = cases.filter((caseItem) => caseItem.status === "Ongoing").length;
    const dueThisWeek = cases.filter((caseItem) => {
      const hearingDate = new Date(caseItem.hearingDate);
      const today = new Date();
      return (
        hearingDate.getFullYear() === today.getFullYear() &&
        hearingDate.getMonth() === today.getMonth() &&
        hearingDate.getDate() <= today.getDate() + 7
      );
    }).length;
    const closedCases = totalCases - ongoingCases;

    return {
      totalCases,
      ongoingCases,
      dueThisWeek,
      closedCases,
    };
  };

  const { totalCases, ongoingCases, dueThisWeek, closedCases } = calculateSummary();

  return (
    <div className="tracker">
      <div className="tracker-head"> 
        <h2>Case Tracking</h2>
        <div className="summary">
          <div className="summary-box">
            Total Active Cases
            <br />
            <span>{totalCases}</span>
          </div>
          <div className="summary-box">
            Cases Due This Week
            <br />
            <span>{dueThisWeek}</span>
          </div>
          <div className="summary-box">
            Pending Actions
            <br />
            <span>{ongoingCases}</span>
          </div>
          <div className="summary-box">
            Closed Cases
            <br />
            <span>{closedCases}</span>
          </div>
        </div>
      </div>

      <section className="case-details">
        <h3>Ongoing Cases</h3>
        <table>
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Case Name</th>
              <th>Parties Involved</th>
              <th>Hearing Date</th>
              <th>Status</th>
              <th>Document</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem, index) => (
              <tr key={index}>
                <td>{caseItem.caseId}</td>
                <td>{caseItem.caseName}</td>
                <td>{caseItem.partiesInvolved}</td>
                <td>{caseItem.hearingDate}</td>
                <td>{caseItem.status}</td>
                <td>
                  {caseItem.documentLink !== "N/A" ? (
                    <a href={caseItem.documentLink} target="_blank" rel="noopener noreferrer">
                      View Document
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  {/* Remove Edit button, no longer necessary */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="add-case-section">
          <h3>Add New Case</h3>
          <form onSubmit={handleAddCase}>
            <label>
              Case ID:
              <input
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="Enter Case ID"
                required
              />
            </label>
            <label>
              Case Name:
              <input
                type="text"
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                placeholder="Enter Case Name"
                required
              />
            </label>
            <label>
              Parties Involved:
              <input
                type="text"
                value={partiesInvolved}
                onChange={(e) => setPartiesInvolved(e.target.value)}
                placeholder="Enter Parties Involved"
                required
              />
            </label>
            <label>
              Hearing Date:
              <input
                type="date"
                value={hearingDate}
                onChange={(e) => setHearingDate(e.target.value)}
                required
              />
            </label>
            <label>
              Upload Document:
              <input
                type="file"
                onChange={(e) => setUploadedFile(e.target.files[0])}
                required
              />
            </label>
            <button type="submit">Add Case</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Track;
