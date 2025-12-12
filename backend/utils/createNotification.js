const Notification = require('../models/Notification');

/**
 * Create a notification for a user
 * @param {String} userId - User ID to send notification to
 * @param {String} message - Notification message
 * @returns {Promise<Object>} Created notification
 */
const createNotification = async (userId, message) => {
    try {
        const notification = await Notification.create({
            user: userId,
            message: message
        });
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        // Don't throw error - notifications are not critical
        return null;
    }
};

module.exports = createNotification;

