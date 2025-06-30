const express = require('express');
const { 
    getNotifications, 
    createNotification, 
    markAsRead 
} = require('../controllers/notifications');

const router = express.Router();

const protect = require('../middleware/auth');
const authorize = require('../middleware/auth').authorize;

router
    .route('/')
    .get(protect, getNotifications)
    .post(protect, authorize('admin'), createNotification);

router
    .route('/:id/read')
    .put(protect, markAsRead);

module.exports = router; 