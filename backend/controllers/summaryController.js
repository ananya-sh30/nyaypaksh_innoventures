const axios = require('axios');
require('dotenv').config();

exports.generateSummary = async (req, res) => {
  try {

    const { main_issue, outcome_in_favor_of, number_of_evidences, outcome_in_court, case_keywords } = req.body;
    const text = `The case revolves around the issue: '${main_issue}'. Key highlights and keywords include: '${case_keywords}'. The court's decision favored ${outcome_in_favor_of.toLowerCase()}. The evidence was classified as ${number_of_evidences.toLowerCase()}, leading to the final verdict: '${outcome_in_court}'.The case took place in Indian Courts and focused on Commercial issues.`;

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: text,
        parameters: {
            min_length: 200,
            max_length: 300,
            length_penalty: 2.0,
          },

       },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,  
          'Content-Type': 'application/json',
        },
      }
    );
    
    let summary = response.data[0]?.summary_text || 'No summary available';
    if (summary.includes("For confidential support")) {
      summary = summary.split("For confidential support")[0]; 
    }

    res.json({ summary });
  } 
  catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Error generating summary' });
  }
};