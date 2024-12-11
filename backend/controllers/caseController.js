const pool = require('../config/dbConfig'); 

exports.searchCases = async (req, res) => {
  try {
    const { query, dateRange, caseType, sortBy } = req.body;
    console.log(req.body);
    
    let whereConditions = [];
    let queryParams = [];

    // Handle query
    if (query) {
      const keywords = query.split(',').map(keyword => keyword.trim());
      let queryConditions = [];

      keywords.forEach((keyword, index) => {
        queryConditions.push(`LOWER(case_keywords) LIKE $${index + 1}`);
        queryParams.push(`%${keyword.toLowerCase()}%`);
      });
      if (queryConditions.length > 0) {
        whereConditions.push(`(${queryConditions.join(' OR ')})`);
      }
    }

  
    if (caseType) {
        const startIndex = queryParams.length + 1; 
        whereConditions.push(`category_of_case LIKE $${startIndex}`);
        queryParams.push(`%${caseType}%`);
    }

    if (dateRange && dateRange.length === 2) {
        const startIndex = queryParams.length + 1;
        whereConditions.push(`case_year BETWEEN $${startIndex} AND $${startIndex + 1}`);
        queryParams.push(parseInt(dateRange[0]), parseInt(dateRange[1]));
    }

    // Handle sortBy
    if (sortBy && sortBy.length > 0) {
        const startIndex = queryParams.length + 1; // Adjust index
        if (sortBy.length === 1) {
            whereConditions.push(`outcome_in_favor_of = $${startIndex}`);
            if(sortBy[0] === 'Appellant'){
              queryParams.push('Against Respondent');
            }
            else{
              queryParams.push('Respondent');
            }
            
        } else {
            whereConditions.push(`(outcome_in_favor_of = $${startIndex} OR outcome_in_favor_of = $${startIndex + 1})`);
            queryParams.push('Respondent', 'Against Respondent');
        }
    }

    // Construct the final SQL query
    let sql = "SELECT * FROM cases WHERE 1=1";
    if (whereConditions.length > 0) {
      sql += " AND " + whereConditions.join(" AND ");
    }
    console.log(sql);
    console.log(queryParams);

    const { rows: results } = await pool.query(sql, queryParams);

    res.status(200).json(results);
  } 
  catch (error) {
    console.error("Error during database query:", error);
    res.status(500).send("Server Error");
  }
};
