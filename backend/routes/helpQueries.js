const express = require('express');
const { startQuery, addMessage, getMyQueries, getAllQueries, resolveQuery } = require('../controllers/helpQueries');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// User starts a new query
router.post('/start', protect, authorize('user'), startQuery);
// Add message to a query
router.post('/:id/message', protect, addMessage);
// User fetches their queries
router.get('/my', protect, authorize('user'), getMyQueries);
// Admin fetches all queries
router.get('/', protect, authorize('admin'), getAllQueries);
// Admin resolves a query
router.put('/:id/resolve', protect, authorize('admin'), resolveQuery);

module.exports = router; 