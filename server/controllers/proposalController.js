// server/controllers/proposalController.js
const Booking = require('../models/Booking'); // Assuming you have a Booking model
const Chef = require('../models/Chef'); // Import the Chef model


exports.createProposal = async (req, res) => {
  try {
    const { bookingId, chefs } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Transform chef data to include chef details
    const chefDetails = await Promise.all(
      chefs.map(async (chefItem) => {
        const chef = await Chef.findById(chefItem.chefId);
        return {
          chef: chef, // Include chef details
          price: chefItem.price,
        };
      })
    );

    booking.proposal = { chefs: chefDetails };
    booking.status = 'proposal sent'; // Update booking status
    await booking.save();

    res.status(201).json({ message: 'Proposal created successfully' });
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: error.message });
  }
};