const express = require('express');
const {
    getAllHRs,
    getHRById,
    getHRByCategory,
    createHR,
    updateHR,
    deleteHR
} = require('../controllers/hr');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// More specific routes must come before generic routes
router
    .route('/category/:category')
    .get(protect, authorize('admin'), getHRByCategory);

router
    .route('/')
    .get(protect, authorize('admin'), getAllHRs)
    .post(protect, authorize('admin'), createHR);

router
    .route('/:id')
    .get(protect, authorize('admin'), getHRById)
    .put(protect, authorize('admin'), updateHR)
    .delete(protect, authorize('admin'), deleteHR);

module.exports = router;

