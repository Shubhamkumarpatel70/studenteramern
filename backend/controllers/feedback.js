const Feedback = require('../models/Feedback');
const User = require('../models/User');

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private
exports.createFeedback = async (req, res, next) => {
    try {
        const { rating, description, isPublic } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!rating || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide rating and description'
            });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Create feedback
        const feedback = await Feedback.create({
            user: userId,
            rating: Number(rating),
            description: description.trim(),
            isPublic: isPublic !== undefined ? isPublic : true
        });

        // Populate user details
        await feedback.populate('user', 'name email internId');

        res.status(201).json({
            success: true,
            data: feedback
        });
    } catch (err) {
        console.error('Create feedback error:', err);
        res.status(400).json({
            success: false,
            message: 'Could not create feedback'
        });
    }
};

// @desc    Get all feedbacks (Admin)
// @route   GET /api/feedback
// @access  Private/Admin
exports.getAllFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('user', 'name email internId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedbacks.length,
            data: feedbacks
        });
    } catch (err) {
        console.error('Get feedbacks error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private/Admin
exports.getFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findById(req.params.id)
            .populate('user', 'name email internId');

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.status(200).json({
            success: true,
            data: feedback
        });
    } catch (err) {
        console.error('Get feedback error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
exports.deleteFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        await feedback.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error('Delete feedback error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

