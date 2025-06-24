const express = require('express');
const router = express.Router();

const { 
    getLatestAnnouncement, 
    createAnnouncement,
    deleteAnnouncement,
    getAnnouncements
} = require('../controllers/announcements');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/latest', getLatestAnnouncement);
router.get('/', getAnnouncements);

// Admin routes
router.post('/', protect, authorize('admin'), createAnnouncement);
router.delete('/:id', protect, authorize('admin'), deleteAnnouncement);

module.exports = router; 