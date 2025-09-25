import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { login, error, setError } = useAuth();

  // Animation effect on component mount
  useEffect(() => {
    setIsAnimating(true);
    return () => setIsAnimating(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (error) {
      setError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setErrors({ submit: result.message });
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className={`modern-login-card ${isAnimating ? 'animate-in' : ''}`}>
        {/* Header Section */}
        <div className="login-header">
          <div className="login-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue your journey</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="modern-login-form">
          <div className="input-group">
            <div className={`input-container ${formData.email ? 'has-value' : ''}`}>
              <input
                type="email"
                id="email"
                name="email"
                className={`modern-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="email" className="floating-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <div className="input-border"></div>
            </div>
            {errors.email && (
              <div className="error-message-modern">
                <span className="error-icon">⚠️</span>
                {errors.email}
              </div>
            )}
          </div>

          <div className="input-group">
            <div className={`input-container ${formData.password ? 'has-value' : ''}`}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`modern-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="password" className="floating-label">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                tabIndex="-1"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <div className="input-border"></div>
            </div>
            {errors.password && (
              <div className="error-message-modern">
                <span className="error-icon">⚠️</span>
                {errors.password}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          {/* Error Messages */}
          {errors.submit && (
            <div className="error-message-modern submit-error">
              <span className="error-icon">❌</span>
              {errors.submit}
            </div>
          )}
          {error && (
            <div className="error-message-modern submit-error">
              <span className="error-icon">❌</span>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`modern-submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            <span className="btn-content">
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Sign In
                </>
              )}
            </span>
            <div className="btn-ripple"></div>
          </button>
        </form>

        {/* Footer Section */}
        <div className="login-footer">
          <div className="divider">
            <span>or</span>
          </div>
          
          <p className="signup-prompt">
            Don't have an account?{" "}
            <Link to="/register" className="signup-link">
              Create Account
              <span className="link-arrow">→</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
