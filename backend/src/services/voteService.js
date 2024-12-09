const { producer } = require("../config/kafka");  // Kafka producer
const pool = require("../config/db");  // PostgreSQL connection

// Service to submit a vote
const submitVote = async (pollId, option) => {
  try {
    // Send vote data to Kafka
    await new Promise((resolve, reject) => {
      producer.send(
        [
          {
            topic: "votes",
            messages: JSON.stringify({ pollId, option }),
          },
        ],
        (err, data) => {
          if (err) reject("Error sending vote to Kafka");
          resolve(data);
        }
      );
    });

    // Save the vote in the database
    const query = "INSERT INTO votes (poll_id, option) VALUES ($1, $2)";
    await pool.query(query, [pollId, option]);
    return { success: true, message: "Vote submitted successfully!" };
  } catch (error) {
    throw new Error("Error processing vote: " + error.message);
  }
};

module.exports = { submitVote };
