const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check for token in http-only cookie first
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Authorization header (optional, but good for other clients like mobile apps)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
