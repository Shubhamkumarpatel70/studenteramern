const ContactQuery = require('../models/ContactQuery');

// @desc    Create a new contact query
// @route   POST /api/contact-queries
// @access  Public
exports.createContactQuery = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const query = await ContactQuery.create({ name, email, message });
    res.status(201).json({ success: true, data: query });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all contact queries (admin)
// @route   GET /api/contact-queries
// @access  Private/Admin
exports.getAllContactQueries = async (req, res) => {
  try {
    const queries = await ContactQuery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: queries });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}; 