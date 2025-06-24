const HelpQuery = require('../models/HelpQuery');

// @desc    User starts a new help query
// @route   POST /api/help-queries/start
// @access  Private/User
exports.startQuery = async (req, res) => {
  try {
    const existing = await HelpQuery.findOne({ user: req.user.id, status: 'open' });
    if (existing) {
      return res.status(200).json({ success: true, data: existing });
    }
    const query = await HelpQuery.create({
      user: req.user.id,
      messages: [{ from: 'user', text: req.body.text }],
      status: 'open'
    });
    res.status(201).json({ success: true, data: query });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Add a message to a help query
// @route   POST /api/help-queries/:id/message
// @access  Private (user or admin)
exports.addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, from } = req.body;
    const query = await HelpQuery.findById(id);
    if (!query || query.status === 'resolved') {
      return res.status(400).json({ success: false, message: 'Query not found or resolved.' });
    }
    query.messages.push({ from, text });
    query.updatedAt = Date.now();
    await query.save();
    res.status(200).json({ success: true, data: query });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all help queries for the logged-in user
// @route   GET /api/help-queries/my
// @access  Private/User
exports.getMyQueries = async (req, res) => {
  try {
    const queries = await HelpQuery.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: queries });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all help queries (admin)
// @route   GET /api/help-queries
// @access  Private/Admin
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await HelpQuery.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: queries });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Mark a help query as resolved
// @route   PUT /api/help-queries/:id/resolve
// @access  Private/Admin
exports.resolveQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await HelpQuery.findById(id);
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found.' });
    }
    query.status = 'resolved';
    query.updatedAt = Date.now();
    await query.save();
    res.status(200).json({ success: true, data: query });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}; 