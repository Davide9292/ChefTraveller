const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  biography: { type: String },
  specialization: { type: String },
  profilePicture: { type: String }, // URL of the image
  availability: [
    {
      location: { type: String, required: true }, // e.g., "Germany", "Berlin", "Bavaria"
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
  ],
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }], // Add bookings field
  // ... other fields like experience, hourlyRate, reviews, etc.
});

const Chef = mongoose.model('Chef', chefSchema);

module.exports = Chef;