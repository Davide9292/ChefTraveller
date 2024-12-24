const Chef = require('../models/Chef');

exports.getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChefById = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id).populate('bookings'); // Populate bookings field
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    res.json(chef);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const chefId = req.params.id;
    const { availability } = req.body;

    const chef = await Chef.findById(chefId);
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    chef.availability = availability; // Update the chef's availability
    await chef.save();

    res.json({ message: 'Availability updated successfully' });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add other functions for creating, updating, and deleting chefs as needed