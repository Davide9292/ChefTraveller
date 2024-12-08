// server/app.js
require("dotenv").config(); // Load environment variables

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
const bodyParser = require("body-parser");

// Import routes
const helloRouter = require("./routes/hello");
const proposalRoutes = require("./routes/proposalRoutes");
const authRoutes = require("./routes/authRoutes");
const chefRoutes = require("./routes/chefRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");
const { generateAccessToken } = require("./controllers/authController");

const port = process.env.PORT || 3001; // Use environment variable for port

// Enable CORS dynamically based on environment
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "*",
    credentials: true,
  })
);

// Middleware
app.use(cookieParser()); // Parse cookies
app.use(bodyParser.json()); // Parse JSON bodies
app.use("/api/hello", helloRouter); // Test route
app.use("/api/proposals", proposalRoutes); // Proposal routes

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/chefsdb"; // Use .env variable
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10, // Maintain up to 10 active connections
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Configure session middleware with MongoStore
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_session_secret", // Use a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
      httpOnly: true, // Prevent client-side access to cookies
    },
    store: MongoStore.create({
      mongoUrl: mongoURI, // Use the same MongoDB URI for sessions
    }),
  })
);

// Refresh token endpoint
app.post("/api/auth/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Generate a new access token
    const newAccessToken = generateAccessToken({ _id: decoded.userId });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello from ChefTraveller server!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
