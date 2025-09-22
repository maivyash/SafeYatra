import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, error, setError } = useAuth();

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
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}
          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: "100%", marginBottom: "20px" }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#666" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#667eea" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
