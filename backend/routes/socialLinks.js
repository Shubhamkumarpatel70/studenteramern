const express = require('express');
const {
    getSocialLinks,
    getSocialLink,
    createOrUpdateSocialLink,
    updateSocialLinkStatus,
    deleteSocialLink
} = require('../controllers/socialLinks');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for getting active social links (for footer)
// Admin route for getting all links (including inactive)
router
    .route('/')
    .get(getSocialLinks) // Public access, but returns different data based on auth status
    .post(protect, authorize('admin'), createOrUpdateSocialLink);

router
    .route('/:id')
    .get(protect, authorize('admin'), getSocialLink)
    .delete(protect, authorize('admin'), deleteSocialLink);

router
    .route('/:id/status')
    .patch(protect, authorize('admin'), updateSocialLinkStatus);

module.exports = router;

