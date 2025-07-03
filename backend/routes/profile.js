const express = require('express');
const { updateProfile, uploadProfileImage: uploadProfileImageController } = require('../controllers/profile');
const { uploadProfileImage } = require('../middleware/upload');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.put('/', protect, updateProfile);

router.put('/picture', protect, uploadProfileImage, uploadProfileImageController);

router.get('/', protect, async (req, res) => {
    try {
        const user = await require('../models/User').findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router; 