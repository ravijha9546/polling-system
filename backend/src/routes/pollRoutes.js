const express = require("express");
const { createPollController } = require("../controllers/pollController");  

const router = express.Router();

// Route for creating a poll
router.post("/polls", createPollController); 

module.exports = router;
