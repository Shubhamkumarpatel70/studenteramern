const express = require('express');
const { 
    createInternship, 
    getPublicInternships, 
    getPublicInternshipById,
    getInternships,
    updateInternship,
    deleteInternship
} = require('../controllers/internships');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/public', getPublicInternships);
router.get('/public/:id', getPublicInternshipById);

// Protect this route: only logged-in users can access
router.get('/:id', protect, require('../controllers/internships').getInternshipById);

// Admin routes
router
    .route('/')
    .post(protect, authorize('admin'), createInternship)
    .get(protect, authorize('admin'), getInternships);

router
    .route('/:id')
    .put(protect, authorize('admin'), updateInternship)
    .delete(protect, authorize('admin'), deleteInternship);

module.exports = router; 