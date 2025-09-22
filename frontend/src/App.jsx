import React from "react";
// Make sure you are NOT importing BrowserRouter here
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import { Settings } from "../src/pages/Settings";// Assuming you have a Navbar component

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  // Video event handlers for better control
  const handleVideoLoad = (e) => {
    console.log('Video loaded successfully');
  };

  const handleVideoError = (e) => {
    console.error('Video failed to load:', e);
  };

  const handleVideoCanPlay = (e) => {
    console.log('Video can start playing');
    // Try to play the video
    e.target.play().catch(err => {
      console.log('Autoplay prevented:', err);
    });
  };

  return (
    // Remove any <Router> or <BrowserRouter> wrapper from here
    <div className="App">
      {/* Video Background */}
      <video
        className="video-background"
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onCanPlay={handleVideoCanPlay}
        preload="auto"
      >
        <source src="/videos/bg1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-background-overlay"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
           <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        {/* Add other routes here */}
      </Routes>
    </div>
  );
}

export default App;
