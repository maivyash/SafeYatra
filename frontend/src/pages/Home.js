import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="container">
        <div className="hero-section">
          <h1>Welcome to MERN Auth App</h1>
          <p className="hero-subtitle">
            Secure authentication with ID verification and live camera capture
          </p>

          {user ? (
            <div className="user-welcome">
              <h2>Hello, {user.name}!</h2>
              <p>You are successfully logged in.</p>
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="features-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure Authentication</h3>
              <p>
                JWT-based authentication with password hashing and secure
                sessions.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>User Management</h3>
              <p>
                Complete user profile management with secure data storage and
                validation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🆔</div>
              <h3>ID Verification</h3>
              <p>
                Secure ID verification with live camera capture for document
                validation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📷</div>
              <h3>Live Camera Capture</h3>
              <p>
                Capture ID proof photos using live camera with real-time
                preview.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Form Validation</h3>
              <p>
                Comprehensive client-side and server-side validation for all
                inputs.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Data Logging</h3>
              <p>
                Complete backend logging of all registration data for audit and
                debugging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
