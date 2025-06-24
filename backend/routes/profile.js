const express = require('express');
const { updateProfile } = require('../controllers/profile');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.put('/', protect, updateProfile);

module.exports = router; 