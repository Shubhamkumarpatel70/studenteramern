const express = require('express');
const { getMyTransactions } = require('../controllers/transactions');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/my-transactions', protect, getMyTransactions);

module.exports = router; 