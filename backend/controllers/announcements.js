const Announcement = require('../models/Announcement');

// @desc    Get the latest announcement
// @route   GET /api/announcements/latest
// @access  Public
exports.getLatestAnnouncement = async (req, res, next) => {
    try {
        // Find the most recently created announcement
        const announcement = await Announcement.findOne().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: announcement });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
exports.getAnnouncements = async (req, res, next) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: announcements });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private/Admin
exports.createAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.create(req.body);
        res.status(201).json({ success: true, data: announcement });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }
        await announcement.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}; 