const express = require('express');
const { 
    getMeetings, 
    createMeeting,
    updateMeeting,
    deleteMeeting
} = require('../controllers/meetings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(protect, getMeetings)
    .post(protect, authorize('admin'), createMeeting);

router
    .route('/:id')
    .put(protect, authorize('admin'), updateMeeting)
    .delete(protect, authorize('admin'), deleteMeeting);

module.exports = router; 