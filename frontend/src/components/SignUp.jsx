import React, { useState, useContext, useEffect } from "react";
import "../styles/Sign.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [captchaToken, setCaptchaToken] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setIsLoggedIn, setJudgeName } = useContext(AuthContext);
  const navigate = useNavigate();

  // Effect to load reCAPTCHA and execute it
  useEffect(() => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute("6Lc-V5gqAAAAAFLQGiMbIXWvCjjQElXcBU-Rwkz5", { action: "signup" })
          .then((token) => {
            setCaptchaToken(token);
          })
          .catch((error) => {
            console.error("Error executing reCAPTCHA:", error);
          });
      });
    } else {
      // Load reCAPTCHA script dynamically if not already loaded
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?render=6Lc-V5gqAAAAAFLQGiMbIXWvCjjQElXcBU-Rwkz5";
      script.async = true;
      script.onload = () => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute("6Lc-V5gqAAAAAFLQGiMbIXWvCjjQElXcBU-Rwkz5", { action: "signup" })
            .then((token) => {
              setCaptchaToken(token);
            });
        });
      };
      document.head.appendChild(script);
    }
  }, []); // Empty dependency array to run only once when component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate reCAPTCHA
    if (!captchaToken) {
      alert("Please complete the CAPTCHA");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Send sign-up request to the backend
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          email,
          username,
          password,
          captchaToken,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // On success, set judge name and log in
        setJudgeName(fullname);
        setIsLoggedIn(true);
        navigate("/engine");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error during registration");
    }
  };

  return (
    <div className="signPage">
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <input type="hidden" name="captchaToken" value={captchaToken} />
        <button type="submit" className="btn">Sign Up</button>
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
    </div>
  );
}

export default SignUp;
