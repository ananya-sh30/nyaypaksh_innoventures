const bcrypt = require("bcryptjs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmailOrUsername } = require("../models/userModel");
require('dotenv').config();

const registerUser = async (req, res) => {
  const { fullname, email, username, password, captchaToken } = req.body;
  

  try {
    const captchaVerification = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captchaToken
      }
    });
    
    if (!captchaVerification.data.success) {
      return res.status(400).json({ message: "Captcha verification failed" });
    }
    console.log(captchaVerification.data);
   
    const existingUser = await findUserByEmailOrUsername(email, username);
    if (existingUser) {
      return res.status(400).json({ message: "Email or Username already exists" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser(fullname, email, username, hashedPassword);

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { registerUser };
