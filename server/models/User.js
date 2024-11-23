// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['chef', 'host', 'staff'], // Include 'staff' role 
    default: 'host', // Set the default role to 'host'
    required: true 
  },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;