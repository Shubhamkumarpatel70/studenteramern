const express = require('express');
const { 
    assignTask, 
    getAllAssignedTasks, 
    getMyAssignedTasks, 
    updateTaskStatus 
} = require('../controllers/assignedTasks');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin routes
router
    .route('/')
    .post(protect, authorize('admin'), assignTask)
    .get(protect, authorize('admin'), getAllAssignedTasks);

// User routes
router
    .route('/my-tasks')
    .get(protect, authorize('user'), getMyAssignedTasks);

router
    .route('/:id/status')
    .put(protect, updateTaskStatus);

module.exports = router; 