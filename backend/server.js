const express = require("express");
const cors = require("cors");
require("dotenv").config();

const decisionRoutes = require("./routes/decisionRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/decision", decisionRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("STRATEXA Backend is Running");
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
