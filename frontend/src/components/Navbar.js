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
            MERN Auth
          </Link>

          <div className="navbar-nav">
            {user ? (
              <>
                <span className="nav-link">Welcome, {user.name}!</span>
                <Link to="/settings" className="nav-link">
                  Settings
                </Link>{" "}
                {/* added */}
                <button onClick={logout} className="btn btn-secondary">
                  Logout
                </button>
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
