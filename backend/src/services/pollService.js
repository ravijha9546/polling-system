const pool = require("../config/db");  

// Service function to create a poll
const createPoll = async (title, options) => {
  try {
    const query = "INSERT INTO polls (title, options) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(query, [title, JSON.stringify(options)]);

    return result.rows[0];  
  } catch (error) {
    console.error("Error in poll service:", error);
    throw new Error("Error creating poll: " + error.message); 
  }
};

module.exports = { createPoll };
