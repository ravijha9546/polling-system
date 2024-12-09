const { producer } = require("../config/kafka");  // Kafka producer
const pool = require("../config/db");  // Database connection

// Submit Vote
const submitVote = async (req, res) => {
  const pollId = req.params.id;
  const { option } = req.body;

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

    // Save vote in the database
    const query = "INSERT INTO votes (poll_id, option) VALUES ($1, $2)";
    await pool.query(query, [pollId, option]);

    res.status(200).send("Vote submitted!");
  } catch (error) {
    console.error("Error processing vote:", error);
    res.status(500).send("Error processing vote");
  }
};

module.exports = { submitVote };
