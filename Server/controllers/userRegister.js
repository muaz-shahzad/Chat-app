const bcrypt = require("bcrypt");
const User = require("../models/userModel"); // Adjust the path according to your project structure
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userRegister = async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "You already have an account" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a new token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Update user with the new token
    user.token = token;
    await user.save();

    // Send the token in a cookie and return user info
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const userLogout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Successfully logged out" });
};


const getUserInfo = async (req, res) => {
  try {
    const { id } = req.user; // Use the ID from the request object set by the middleware

    // Fetch the user by ID
    const user = await User.findById(id).select("name _id email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ id: user._id, name: user.name });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = getUserInfo;

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  getUserInfo,
};
