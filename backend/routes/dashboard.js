const express = require('express');
const { getDashboardStats, getPublicStats } = require('../controllers/dashboard');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/public-stats', getPublicStats);
router.get('/stats', protect, getDashboardStats);

module.exports = router;
