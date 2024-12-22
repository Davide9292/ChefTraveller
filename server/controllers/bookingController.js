// server/controllers/bookingController.js
const Booking = require("../models/Booking");
const User = require("../models/User");

exports.createBooking = async (req, res) => {
  try {
    console.log(req.user);
    const bookingData = req.body;
    const userId = req.user.userId;

    // Explicitly set the 'user' field
    bookingData.user = userId;

    const booking = new Booking(bookingData);
    await booking.save();

    // Update the user's bookings array
    await User.findByIdAndUpdate(
      userId,
      { $push: { bookings: booking._id } },
      { new: true }
    );

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("chef")
      .populate("proposal.chefs.chef"); // Populate chef details in the proposal
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Booking status updated successfully" });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.editBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { eventDuration, occasion, location, guests, meal, food, date, comments } = req.body; // Include comments in request body

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update the booking with the new data
    booking.eventDuration = eventDuration;
    booking.occasion = occasion;
    booking.location = location;
    booking.guests = guests;
    booking.meal = meal;
    booking.food = food;
    booking.date = date;
    booking.comments = comments; // Add the comments to the booking
    await booking.save();

    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.confirmBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId)
      .populate("chef")
      .populate("user"); // Populate both chef and user fields

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update chef's availability
    const chef = await Chef.findById(booking.chef._id);
    const bookingStart = new Date(booking.date);
    const bookingEnd = new Date(booking.date);
    // bookingEnd.setDate(bookingStart.getDate() + (parseInt(booking.eventDuration) - 1));

    chef.availability = chef.availability.filter((availability) => {
      const startDate = new Date(availability.startDate);
      const endDate = new Date(availability.endDate);
      return !(bookingStart <= endDate && bookingEnd >= startDate);
    });

    await chef.save();

    // Add booking to chef's profile
    chef.bookings.push(booking._id);
    await chef.save();

    // Update booking status
    booking.status = "proposal accepted";
    await booking.save();

    res.json({ message: "Booking confirmed" });
  } catch (error) {
    console.error("Error confirming booking:", error);
    res.status(500).json({ error: error.message });
  }
};