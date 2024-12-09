require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const pollRoutes = require("./routes/pollRoutes");
const voteRoutes = require("./routes/voteRoutes");

const app = express();
const PORT = process.env.PORT || 3014;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Routes
app.use(pollRoutes);
app.use(voteRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
