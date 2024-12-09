const express = require("express");
const { submitVote } = require("../controllers/voteController");

const router = express.Router();

// Route for submitting a vote
router.post("/polls/:id/vote", submitVote);

module.exports = router;
