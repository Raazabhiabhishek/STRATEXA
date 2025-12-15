const express = require("express");
const router = express.Router();
const { analyzeDecision } = require("../controllers/decisionController");

router.post("/analyze", analyzeDecision);

module.exports = router;
