const express = require("express");
const router = express.Router();
const historicController = require("../controllers/historicController");

router.post("/getHistoricData", historicController.getHistoricalData);

module.exports = router;