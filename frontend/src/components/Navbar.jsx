import React, { useContext } from "react";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, judgeName } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/signup");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <ul className="nav-links">
        <li><Link to="/home" className="custom-link">
            Home
          </Link>
          </li>
        <li>
          <Link to="/engine" className="custom-link">
            Research Engine
          </Link>
        </li>

        <li>
          <Link to="/case-prediction" className="custom-link">
            Case Prediction
          </Link>
        </li>
        <li>
          <Link to="/summary" className="custom-link">
            File Summariser
          </Link>
        </li>
        <Link to="/track" className="custom-link">
            Judge's Portal
          </Link>
      </ul>
      <ul className="featuresNav">
        <li>
          <select className="language-select">
            <option>Switch Language</option>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </li>
        <li>
          {isLoggedIn ? (
            <span>
              <div className="name"><i class='bx bxs-user-circle'></i> {judgeName}</div>
              </span>
          ) : (
            <button className="signup-button" onClick={handleLogin}>
              Sign Up
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
