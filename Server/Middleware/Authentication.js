const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token || "";

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    // Decode the token to get user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Get the user ID from the token

    // Find the user by ID
    const user = await User.findById(userId);
    
    if (!user || user.token !== token) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Attach user information to the request object
    req.user = { id: user._id, name: user.name };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    console.error("Error in authentication middleware:", error);
    return res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = authenticateToken;
