const express = require('express');
const { getAllTasks, updateTaskStatus, submitTask, getMyTasks, getMyUploads } = require('../controllers/tasks');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// User routes
router.route('/').post(protect, authorize('user'), upload, submitTask);
router.route('/my-tasks').get(protect, authorize('user'), getMyTasks);
router.route('/my-uploads').get(protect, authorize('user'), getMyUploads);

// Admin routes
router.route('/admin').get(protect, authorize('admin'), getAllTasks);
router.route('/:id/status').put(protect, authorize('admin'), updateTaskStatus);

module.exports = router; 