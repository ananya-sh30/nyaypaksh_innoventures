const pool = require('../config/dbConfig'); 

// Function to find user by email or username
const findUserByEmailOrUsername = async (email, username) => {
  const query = 'SELECT * FROM users WHERE email = $1 OR username = $2';
  const values = [email, username];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (err) {
    throw new Error('Error finding user: ' + err.message);
  }
};

// Function to create a new user
const createUser = async (fullname, email, username, hashedPassword) => {
  const query =
    'INSERT INTO users (fullname, email, username, password) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [fullname, email, username, hashedPassword];

  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Return the created user
  } catch (err) {
    throw new Error('Error creating user: ' + err.message);
  }
};

module.exports = { createUser, findUserByEmailOrUsername };
