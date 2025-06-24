const express = require('express');
const router = express.Router();

const {
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} = require('../controllers/testimonials');

const { protect, authorize } = require('../middleware/auth');

// Public route to get all testimonials
router.get('/', getTestimonials);

// Admin routes
router.post('/', protect, authorize('admin'), createTestimonial);
router.put('/:id', protect, authorize('admin'), updateTestimonial);
router.delete('/:id', protect, authorize('admin'), deleteTestimonial);

module.exports = router;