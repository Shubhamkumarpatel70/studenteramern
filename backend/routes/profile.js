const express = require('express');
const { updateProfile, uploadProfileImage: uploadProfileImageController } = require('../controllers/profile');
const { uploadProfileImage } = require('../middleware/upload');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.put('/', protect, updateProfile);

router.put('/picture', protect, uploadProfileImage, uploadProfileImageController);

module.exports = router; 