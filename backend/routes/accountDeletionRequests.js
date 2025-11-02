const express = require('express');
const {
    createDeletionRequest,
    getDeletionRequests,
    approveDeletionRequest,
    rejectDeletionRequest,
    getUserDeletionRequests
} = require('../controllers/accountDeletionRequests');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createDeletionRequest);
router.get('/my-requests', protect, getUserDeletionRequests);
router.get('/', protect, authorize('admin', 'co-admin'), getDeletionRequests);
router.put('/:id/approve', protect, authorize('admin', 'co-admin'), approveDeletionRequest);
router.put('/:id/reject', protect, authorize('admin', 'co-admin'), rejectDeletionRequest);

module.exports = router;
