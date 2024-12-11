const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const caseRoutes = require('./routes/caseRoutes'); 
const suggestionRoute = require('./routes/suggestionRoute'); 
const historicRoute = require('./routes/historicRoutes'); 
const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");

app.use("/api/cases", caseRoutes);
app.use("/api/suggestions", suggestionRoute) ;
app.use("/api/historic", historicRoute) ;
app.use("/api/auth", authRoutes);
app.use("/api/track", trackRoutes);

module.exports = app;
