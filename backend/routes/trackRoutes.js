const express = require("express");
const multer = require("multer");
const path = require("path");
const { addNewCase } = require("../controllers/trackController");

const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Use timestamp as filename
  },
});

const upload = multer({ storage });

router.post("/add-case", upload.single("document"), addNewCase);

module.exports = router;
