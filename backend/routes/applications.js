const express = require('express');
const {
    getMyApplications,
    createApplication,
    getAllApplications,
    updateApplicationStatus,
    updatePaymentReceived,
    getApplicationById,
    uploadPaymentScreenshot: uploadPaymentScreenshotController
} = require('../controllers/applications');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadPaymentScreenshot } = require('../middleware/upload');

const router = express.Router();

// User routes
router.route('/').post(protect, createApplication);
router.route('/my-applications').get(protect, getMyApplications);
router.route('/:id').get(protect, getApplicationById);

// Admin routes
router.route('/').get(protect, authorize('admin', 'accountant'), getAllApplications);
router.route('/:id/status').put(protect, authorize('admin', 'accountant'), updateApplicationStatus);
router.route('/:id/payment-received').put(protect, authorize('admin', 'accountant'), updatePaymentReceived);

router.post('/upload-payment-screenshot', protect, uploadPaymentScreenshot, uploadPaymentScreenshotController);

module.exports = router; 