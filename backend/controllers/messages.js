const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');

// Get all conversations for a user
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all unique conversations (both sent and received)
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(userId) },
                        { receiver: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
                            '$receiver',
                            '$sender'
                        ]
                    },
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$receiver', new mongoose.Types.ObjectId(userId)] },
                                        { $eq: ['$isRead', false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    user: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        role: 1,
                        profileImage: 1
                    },
                    lastMessage: 1,
                    unreadCount: 1
                }
            },
            {
                $sort: { 'lastMessage.createdAt': -1 }
            }
        ]);

        res.json({
            success: true,
            data: conversations
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get messages between two users
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        // Validate that the conversation is between current user and another user
        if (userId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot get messages with yourself'
            });
        }

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        })
        .populate('sender', 'name email profileImage role')
        .populate('receiver', 'name email profileImage role')
        .sort({ createdAt: 1 });

        // Mark messages as read
        await Message.updateMany(
            {
                sender: userId,
                receiver: currentUserId,
                isRead: false
            },
            { isRead: true }
        );

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Send a message
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content, messageType = 'text', attachment } = req.body;
        const senderId = req.user.id;

        // Validate receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: 'Receiver not found'
            });
        }

        // Validate content
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Message content is required'
            });
        }

        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            content: content.trim(),
            messageType,
            attachment
        });

        await message.save();

        // Populate sender and receiver details
        await message.populate('sender', 'name email profileImage role');
        await message.populate('receiver', 'name email profileImage role');

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Mark messages as read
const markAsRead = async (req, res) => {
    try {
        const { senderId } = req.params;
        const receiverId = req.user.id;

        await Message.updateMany(
            {
                sender: senderId,
                receiver: receiverId,
                isRead: false
            },
            { isRead: true }
        );

        res.json({
            success: true,
            message: 'Messages marked as read'
        });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const unreadCount = await Message.countDocuments({
            receiver: userId,
            isRead: false
        });

        res.json({
            success: true,
            data: { unreadCount }
        });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getConversations,
    getMessages,
    sendMessage,
    markAsRead,
    getUnreadCount
}; 