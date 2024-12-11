import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [judgeName, setJudgeName] = useState("");

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, judgeName, setJudgeName }}>
      {children}
    </AuthContext.Provider>
  );
};
