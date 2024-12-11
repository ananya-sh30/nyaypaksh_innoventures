const path = require("path");
const fs = require("fs");
const { addCase } = require("../models/trackModel");

const addNewCase = async (req, res) => {
  const { caseId, caseName, partiesInvolved, hearingDate, status } = req.body;
  const uploadedFile = req.file;

  if (!caseId || !caseName || !partiesInvolved || !hearingDate || !uploadedFile) {
    return res.status(400).json({ message: "Please provide all required details." });
  }

  const documentLink = `/uploads/${uploadedFile.filename}`;  // Link to the uploaded document

  try {
    const newCase = await addCase(caseId, caseName, partiesInvolved, hearingDate, status, documentLink);
    return res.status(201).json({
      message: "Case added successfully",
      case: newCase,
      documentLink,
    });
  } catch (error) {
    console.error("Error adding case:", error);
    return res.status(500).json({ message: "Failed to add case." });
  }
};

module.exports = { addNewCase };
