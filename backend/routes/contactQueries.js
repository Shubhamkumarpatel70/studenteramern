const express = require('express');
const { createContactQuery, getAllContactQueries } = require('../controllers/contactQueries');
const protect = require('../middleware/auth');
const authorize = require('../middleware/auth').authorize;

const router = express.Router();

router.post('/', createContactQuery);
router.get('/', protect, authorize('admin'), getAllContactQueries);

module.exports = router; 