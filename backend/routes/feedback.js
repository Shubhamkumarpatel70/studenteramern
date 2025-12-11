const express = require('express');
const {
    createFeedback,
    getAllFeedbacks,
    getFeedback,
    deleteFeedback
} = require('../controllers/feedback');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .post(protect, createFeedback)
    .get(protect, authorize('admin'), getAllFeedbacks);

router
    .route('/:id')
    .get(protect, authorize('admin'), getFeedback)
    .delete(protect, authorize('admin'), deleteFeedback);

module.exports = router;

