console.log('Auth controller loaded');

require('dotenv').config(); // Load environment variables in this file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

console.log(process.env)

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Booking = require('../models/Booking'); // Import the Booking model

// Function to generate access token
const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, accessTokenSecret, {
    expiresIn: "15m",
  });
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, refreshTokenSecret, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  try {
    console.log("Registration data received:", req.body);
    const { firstName, lastName, email, password, bookingId } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "host",
    });
    await user.save();
    console.log("User registered:", user);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log('Generated refresh token:', refreshToken);

    // Associate booking with user
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.user = user._id;
      await booking.save();

      // Add the booking to the user's bookings array
      user.bookings.push(booking._id);
      await user.save();
    } else {
      console.error("Booking not found for ID:", bookingId);
    }

    res
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .status(201)
      .json({ accessToken });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, bookingId } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log('Generated refresh token:', refreshToken);

    // Associate booking with user
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.user = user._id;
        await booking.save();

        // Add the booking to the user's bookings array
        user.bookings.push(booking._id);
        await user.save();
      } else {
        console.error('Booking not found for ID:', bookingId);
      }
    }

    res
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateAccessToken = generateAccessToken;