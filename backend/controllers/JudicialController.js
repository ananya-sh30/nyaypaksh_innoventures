const pool = require('../config/dbConfig');
require('dotenv').config();

const getJudicialTrends = async (req, res) => {
  try {
    const { caseKeywords, caseIssue } = req.body;

    if (!caseKeywords || !caseIssue) {
      return res.status(400).json({ message: 'caseKeywords and caseIssue are required.' });
    }

    // Prepare keywords array
    const keywordsArray = caseKeywords.split(',').map((keyword) => `%${keyword.trim()}%`);

    // Bar Chart Query
    const queryBarChart = `
      SELECT 
        court_type,
        COUNT(CASE WHEN outcome_in_favor_of = 'Respondent' THEN 1 END) AS respondent_wins,
        COUNT(CASE WHEN outcome_in_favor_of = 'Against Respondent' THEN 1 END) AS appellant_wins
      FROM cases
      WHERE (${keywordsArray.map((_, idx) => `case_keywords ILIKE $${idx + 1}`).join(' OR ')})
        OR main_issue ILIKE $${keywordsArray.length + 1}
      GROUP BY court_type
      ORDER BY court_type;
    `;
    const paramsBarChart = [...keywordsArray, `%${caseIssue}%`];
    const resultBarChart = await pool.query(queryBarChart, paramsBarChart);

    // Return only bar chart data
    return res.status(200).json({
      barChartData: resultBarChart.rows,
    });
  } catch (error) {
    console.error('Error fetching judicial trends:', error.message);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  getJudicialTrends,
};
