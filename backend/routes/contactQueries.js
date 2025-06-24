const express = require('express');
const { createContactQuery, getAllContactQueries } = require('../controllers/contactQueries');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', createContactQuery);
router.get('/', protect, authorize('admin'), getAllContactQueries);

module.exports = router; 