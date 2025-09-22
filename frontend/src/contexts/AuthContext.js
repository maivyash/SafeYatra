import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Set the base URL for all axios requests
const API_URL = "http://localhost:5000/api/auth";
axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";
// Tell axios to send cookies with every request
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true to check auth status
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if the user is already logged in when the app loads
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // The cookie is sent automatically by the browser
        const { data } = await axios.get("/api/auth/me");
        if (data.success) {
          setUser(data.data.user);
        }
      } catch (err) {
        // If the request fails (e.g., 401), it means no valid session
        setUser(null);
      } finally {
        // Stop loading once the check is complete
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setError("");
      setLoading(true);
      const { data } = await axios.post("/api/auth/login", { email, password });

      if (data.success) {
        setUser(data.data.user);
        navigate("/dashboard"); // Redirect to dashboard on successful login
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      setError("");
      setLoading(true);
      const { data } = await axios.post("/api/auth/register", formData);

      if (data.success) {
        setUser(data.data.user);
        navigate("/dashboard"); // Redirect to dashboard on successful registration
        return { success: true };
      }
    } catch (err) {
      console.log(err);

      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call the backend to clear the cookie
      await axios.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Always clear user state on the frontend
      setUser(null);
      setError("");
      navigate("/login");
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
