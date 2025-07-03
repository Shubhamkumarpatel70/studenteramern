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
const { uploadPaymentScreenshot } = require('../middleware/upload');

const router = express.Router();

// User routes
router.route('/').post(protect, createApplication);
router.route('/my-applications').get(protect, getMyApplications);
router.route('/:id').get(protect, getApplicationById);

// Admin routes
router.route('/').get(protect, authorize('admin'), getAllApplications);
router.route('/:id/status').put(protect, authorize('admin'), updateApplicationStatus);

router.post('/upload-payment-screenshot', protect, uploadPaymentScreenshot, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.json({ success: true, screenshot: `uploads/paymentScreenshots/${req.file.filename}` });
});

module.exports = router; 