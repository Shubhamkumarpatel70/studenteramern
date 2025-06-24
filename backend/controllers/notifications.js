const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private/Admin
exports.createNotification = async (req, res, next) => {
    const { message, target } = req.body;

    if (!message || !target || !target.type) {
        return res.status(400).json({ success: false, message: 'Please provide a message and a valid target' });
    }

    try {
        let users = [];
        let query;

        switch (target.type) {
            case 'all':
                query = { role: 'user' };
                break;
            case 'co-admins':
                query = { role: 'co-admin' };
                break;
            case 'user':
                if (!target.email) {
                    return res.status(400).json({ success: false, message: 'Please provide a user email' });
                }
                const user = await User.findOne({ email: target.email });
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }
                users = [user];
                break;
            case 'domain':
                if (!target.domain) {
                    return res.status(400).json({ success: false, message: 'Please provide a domain' });
                }
                const domain = target.domain.startsWith('@') ? target.domain.substring(1) : target.domain;
                query = { email: new RegExp(`@${domain}$`, 'i') };
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid target type' });
        }

        if (query) {
            users = await User.find(query);
        }

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'No users found for the specified target' });
        }

        const notifications = users.map(user => ({
            user: user._id,
            message
        }));

        await Notification.insertMany(notifications);

        res.status(201).json({ success: true, message: `Notification sent to ${users.length} user(s).` });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        // Ensure user owns notification
        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this notification' });
        }

        notification.read = true;
        await notification.save();
        
        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}; 