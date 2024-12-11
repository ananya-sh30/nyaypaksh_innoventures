const pool = require('../config/dbConfig');

const getHistoricalData = async (req, res) => {
    const { case_keywords, main_issue } = req.body;

    if (!case_keywords || !main_issue) {
        return res.status(400).json({ error: "Required fields 'case_keywords' and 'main_issue' are missing." });
    }

    try {
        // Split the case_keywords into an array of individual keywords
        const keywords = case_keywords.split(',').map(keyword => keyword.trim());

        // Build the query conditions for each individual keyword
        const keywordConditions = keywords.map((_, index) => `case_keywords ILIKE $${index + 1}`).join(' OR ');

        // Prepare the query to search case_keywords and main_issue
        const query = `
            SELECT 
            case_title,
            court_type,
            resolution_date,
            outcome_in_court, 
            link
        FROM cases
        WHERE 
            (${keywordConditions})
            OR (main_issue ILIKE $${keywords.length + 1} AND link IS NOT NULL AND link != '');

        `;

        // Prepare the values array with keywords and main_issue
        const values = [...keywords.map(keyword => `%${keyword}%`), `%${main_issue}%`];

        console.log("Running query with values: ", values); 

        // Execute the query
        const result = await pool.query(query, values);

      
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No historical data found matching the criteria." });
        }

        // Return the result
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching historical data:", error);
        return res.status(500).json({ error: `Failed to fetch historical data: ${error.message}` });
    }
};

module.exports = { getHistoricalData };
