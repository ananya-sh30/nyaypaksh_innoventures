const pool = require('../config/dbConfig');
require('dotenv').config();

const generateSuggestions = async (req, res) => {
    const { case_keywords, court_type, number_of_evidences, dataset, main_issue, predictionProbability } = req.body;

    if (!main_issue || !dataset || !case_keywords) {
        return res.status(400).json({ error: "Required fields are missing." });
    }

    const winProbability = predictionProbability
        ? Number((Object.values(predictionProbability)[0] * 100).toFixed(2))
        : 50;
    let winRange;
    if (winProbability >= 0 && winProbability <= 25) winRange = "0%-25%";
    else if (winProbability > 25 && winProbability <= 50) winRange = "26%-50%";
    else if (winProbability > 50 && winProbability <= 75) winRange = "51%-75%";
    else if (winProbability > 75 && winProbability <= 100) winRange = "76%-100%";

    try {
        const query = `
            SELECT approach, action
            FROM category_suggestions
            WHERE casecategory = $1 AND probabilityrange = $2
        `;
        const queryResult = await pool.query(query, [dataset, winRange]);
        const { approach, action } = queryResult.rows[0] || {};

        if (!approach || !action) {
            return res.status(404).json({ error: "No data found for the given parameters." });
        }

        // Create the suggestions object with the approach and action
        const suggestions = {
            approach,
            action
        };

        return res.status(200).json(suggestions);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to get personalized suggestions." });
    }
};

module.exports = { generateSuggestions };
