const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const summaryController = require("../controllers/summaryController");

router.post("/search", caseController.searchCases);
router.post('/generateSummary', summaryController.generateSummary);

module.exports = router;