const express = require('express');
const { updateProfile } = require('../controllers/profile');
const { uploadProfileImage } = require('../middleware/upload');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.put('/', protect, updateProfile);

router.put('/picture', protect, uploadProfileImage, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const user = await require('../models/User').findById(req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.profilePicture = `uploads/profileImages/${req.file.filename}`;
    await user.save();
    res.json({ success: true, profilePicture: user.profilePicture });
});

module.exports = router; 