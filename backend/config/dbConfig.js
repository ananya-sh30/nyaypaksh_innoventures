require('dotenv').config();
const { Pool } = require('pg');


const pool = new Pool({
  connectionString: process.env.DB_URI, 
});

module.exports = pool;