import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"; 
import Navbar from "./components/Navbar"; // Import the Navbar component
import Engine from "./components/ResearchEngine";
import CasePrediction from "./components/Predictive";
import Summary from "./components/Summary";
import HomePage from "./components/HomePage";
import Track from "./components/Track";
import { AuthProvider } from "./context/AuthContext"; // Import the AuthProvider
import SignUp from "./components/SignUp";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBarWithConditionalRender />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/engine" element={<Engine />} />
            <Route path="/case-prediction" element={<CasePrediction />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/track" element={<Track />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const NavBarWithConditionalRender = () => {
  const location = useLocation();
  
  // Conditionally render Navbar based on the route
  return location.pathname !== "/signup" && <Navbar />;
};

export default App;
