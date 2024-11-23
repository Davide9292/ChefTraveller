const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // e.g., dinner, lunch, buffet
  eventDate: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  status: { type: String, enum: ['requested', 'confirmed', 'completed'], default: 'requested' },
  // ... other fields like budget, culinary preferences, etc.
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;