const express = require('express');
const { getDashboardStats } = require('../controllers/dashboard');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);

module.exports = router;
