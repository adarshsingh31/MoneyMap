import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getProfile } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to load profile:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem("token", data.token);
    // Fetch profile details
    const profile = await getProfile();
    setUser(profile.user);
    return profile;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem("currency") || "₹ Indian Rupee (INR)";
  });

  const setCurrency = (val) => {
    localStorage.setItem("currency", val);
    setCurrencyState(val);
  };

  const currencySymbol = currency.split(" ")[0] || "₹";

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      login, 
      logout, 
      currency, 
      setCurrency, 
      currencySymbol, 
      isAuthenticated: !!localStorage.getItem("token") 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
