const pool = require('../config/dbConfig');  // Importing the database connection configuration
require('dotenv').config();  // Load environment variables

const getCaseTrends = async (req, res) => {
  try {
    const { caseKeywords, caseType } = req.body;  

    if (!caseKeywords || !caseType) {
      return res.status(400).json({ message: 'caseKeywords and caseType are required.' });
    }

    const keywordsArray = caseKeywords.split(',').map((keyword) => `%${keyword.trim()}%`);

    const query = `
      SELECT
        case_year,
        COUNT(CASE WHEN outcome_in_favor_of = 'Respondent' THEN 1 END) AS respondent_count,
        COUNT(CASE WHEN outcome_in_favor_of = 'Against Respondent' THEN 1 END) AS appellant_count
      FROM cases
      WHERE (${keywordsArray.map((_, idx) => `case_keywords ILIKE $${idx + 1}`).join(' OR ')})
        OR category_of_case ILIKE $${keywordsArray.length + 1}
      GROUP BY case_year
      ORDER BY case_year;
    `;

    const params = [...keywordsArray, `%${caseType}%`];

    const result = await pool.query(query, params);

    console.log(result.rows);
    return res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error fetching case trends:', error.message);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  getCaseTrends,
};
