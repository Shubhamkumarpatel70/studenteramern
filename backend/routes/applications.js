const express = require('express');
const { 
    getMyApplications,
    createApplication,
    getAllApplications,
    updateApplicationStatus,
    getApplicationById
} = require('../controllers/applications');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// User routes
router.route('/').post(protect, upload.uploadPaymentScreenshot, createApplication);
router.route('/my-applications').get(protect, getMyApplications);
router.route('/:id').get(protect, getApplicationById);

// Admin routes
router.route('/').get(protect, authorize('admin'), getAllApplications);
router.route('/:id/status').put(protect, authorize('admin'), updateApplicationStatus);

module.exports = router; 