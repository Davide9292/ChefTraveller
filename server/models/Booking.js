// server/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  eventDuration: { type: String, required: true },
  occasion: { type: String, required: true },
  location: { type: String, required: true },
  guests: { type: Number, required: true },
  meal: { type: String, required: true },
  food: { type: String, required: true },
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  proposal: { // Add the proposal field
    chefs: [
      {
        chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
        price: { type: Number },
      }
    ],
  },
  status: {
    type: String,
    enum: [
      "new request",
      "proposal sent",
      "proposal accepted",
      "additional request",
      "proposal rejected",
      "paid",
    ],
    default: 'new request'
  },
  payment: { // Add a payment field to store payment details
    totalAmount: Number,
    amountPaid: Number,
    amountRemaining: Number,
    paymentDate: Date,
    // ... other payment details ...
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;