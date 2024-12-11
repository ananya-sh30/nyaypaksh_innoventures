const pool = require("../config/dbConfig");

const addCase = async (caseId, caseName, partiesInvolved, hearingDate, status, documentLink) => {
  const query = `
    INSERT INTO tracker (case_id, case_name, parties_involved, hearing_date, status, document_link)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [caseId, caseName, partiesInvolved, hearingDate, status, documentLink];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error adding case:", err);
    throw err;
  }
};

module.exports = { addCase };
