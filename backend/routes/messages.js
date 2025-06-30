const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getConversations,
    getMessages,
    sendMessage,
    markAsRead,
    getUnreadCount
} = require('../controllers/messages');

console.log('getConversations:', typeof getConversations);
console.log('getMessages:', typeof getMessages);
console.log('sendMessage:', typeof sendMessage);
console.log('markAsRead:', typeof markAsRead);
console.log('getUnreadCount:', typeof getUnreadCount);

// Get all conversations for the authenticated user
router.get('/conversations', auth, getConversations);

// Get unread message count
router.get('/unread/count', auth, getUnreadCount);

// Get messages between current user and another user
router.get('/:userId', auth, getMessages);

// Send a message
router.post('/', auth, sendMessage);

// Mark messages as read
router.put('/mark-read/:senderId', auth, markAsRead);

module.exports = router; 