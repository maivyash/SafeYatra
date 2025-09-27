// ...existing code...
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            SafeYatra
          </Link>

          <div className="navbar-nav">
            {user ? (
              <>
                <div className="navbar-welcome" title={user.name}>
                  <img
                    src={`https://i.pravatar.cc/64?u=${user._id || "anon"}`}
                    alt="avatar"
                    className="navbar-avatar"
                  />
                  <div className="navbar-welcome-text">
                    <div className="navbar-welcome-title">Welcome, {user.name}</div>
                    <div className="navbar-welcome-sub">Digital Tourist ID: Valid until Dec 31, 2024</div>
                  </div>
                </div>
                <Link to="/police-dashboard" className="nav-link">
                  Police Dashboard
                </Link>
                <Link to="/demo" className="nav-link">
                  Demo
                </Link>
                <Link to="/settings" className="nav-link">
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
// ...existing code...
