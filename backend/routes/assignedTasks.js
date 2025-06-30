const express = require('express');
const { 
    assignTask, 
    getAllAssignedTasks, 
    getMyAssignedTasks, 
    updateTaskStatus 
} = require('../controllers/assignedTasks');
const protect = require('../middleware/auth');
const authorize = require('../middleware/auth').authorize;

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