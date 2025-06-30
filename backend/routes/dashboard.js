const express = require('express');
const { getDashboardStats } = require('../controllers/dashboard');

const router = express.Router();

const protect = require('../middleware/auth');
const authorize = require('../middleware/auth').authorize;

router.get('/stats', protect, getDashboardStats);

module.exports = router;
