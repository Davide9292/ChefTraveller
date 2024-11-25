require('dotenv').config(); // Load environment variables

const express = require('express');
const session = require('express-session'); // Import express-session
const cookieParser = require("cookie-parser"); // Import cookie-parser
const cors = require("cors");
const mongoose = require("mongoose");
const helloRouter = require('./routes/hello'); // Import the route


const app = express();
const proposalRoutes = require('./routes/proposalRoutes');

const { generateAccessToken } = require('./controllers/authController'); // Import generateAccessToken

app.use('/api/hello', helloRouter); // Mount the route


// Enable CORS for all origins
app.use(cors({
  origin: 'http://localhost:3000', // Or your frontend origin
  credentials: true, // Allow credentials (cookies)
}));

const port = 3001;
const bodyParser = require("body-parser");


// Import routes
const authRoutes = require("./routes/authRoutes");
const chefRoutes = require("./routes/chefRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://davidepedone1:mlTIK3SHD1FIe8lu@cluster0.carom.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Middleware
app.use(cookieParser()); // Use cookie-parser middleware
app.use(bodyParser.json());
app.use('/api/proposals', proposalRoutes); // Mount proposal routes
// Configure session middleware
app.use(session({
  secret: 'your_session_secret', // Replace with a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }, // Set secure: true in production
}));


app.post('/api/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Get refresh token from cookie
  console.log
  
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Generate a new access token
    const newAccessToken = generateAccessToken({ _id: decoded.userId });
    console.log
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});