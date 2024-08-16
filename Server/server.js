const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const protectedRoutes = require("./routes/protectedRoutes");
const userRoute = require("./routes/userRoute");
const authRoutes = require("./routes/authRoutes");
const { app, server } = require("./Socket/index");

// const app = express();

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Middleware
app.use(express.json({ limit: "500mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the origin of your frontend
    methods: "GET,POST,PUT,DELETE", // Specify allowed methods
    credentials: true, // Allow cookies to be sent and received
  })
);

app.get("/", (req, res) => {
  res.send("Hello World from the server");
});

// Routes
app.use("/api/users", userRoute);

app.use("/api", protectedRoutes);

app.use("/api/auth", authRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
