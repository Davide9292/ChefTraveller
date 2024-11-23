const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('user').populate('chef'); // Populate user and chef fields
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('user').populate('chef'); // Populate user and chef fields
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEvent = async (req, res) => {
    try {
      const { eventType, eventDate, numberOfGuests, location, description } = req.body;
      // You'll need to associate the event with the logged-in user here once authentication is implemented
      const event = new Event({ eventType, eventDate, numberOfGuests, location, description, user: req.user.id }); // Assuming req.user.id holds the user ID
      await event.save();
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Add other functions for creating, updating, and deleting events as needed