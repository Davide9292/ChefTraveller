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
    const chef = await Chef.findById(req.params.id);
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    res.json(chef);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add other functions for creating, updating, and deleting chefs as needed