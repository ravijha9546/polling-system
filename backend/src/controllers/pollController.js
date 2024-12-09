const { createPoll } = require("../services/pollService");  // Service for poll creation

const createPollController = async (req, res) => {
  const { title, options } = req.body;

  try {
   
    const newPoll = await createPoll(title, options);

    res.status(201).json(newPoll);
  } catch (error) {
    console.error("Error creating poll:", error);  
    res.status(500).json({ message: "Error creating poll", error: error.message });
  }
};

module.exports = { createPollController };
