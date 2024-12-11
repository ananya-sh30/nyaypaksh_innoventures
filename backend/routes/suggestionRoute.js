const express = require("express");
const router = express.Router();
const suggestionController = require("../controllers/suggestionController");
const judicialController = require("../controllers/JudicialController");
const caseTrends = require("../controllers/caseTrends");

router.post("/generateSuggestions", suggestionController.generateSuggestions);
router.post("/getJudicialTrends", judicialController.getJudicialTrends);
router.post("/getCaseTrends", caseTrends.getCaseTrends);
module.exports = router;