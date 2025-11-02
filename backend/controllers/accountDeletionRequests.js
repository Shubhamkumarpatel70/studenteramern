const AccountDeletionRequest = require('../models/AccountDeletionRequest');
const User = require('../models/User');

// @desc    Create account deletion request
// @route   POST /api/account-deletion-requests
// @access  Private/User
exports.createDeletionRequest = async (req, res) => {
    try {
        const { reason } = req.body;
        const userId = req.user.id;

        // Check if user already has a pending request
        const existingRequest = await AccountDeletionRequest.findOne({
            userId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending deletion request'
            });
        }

        const deletionRequest = await AccountDeletionRequest.create({
            userId,
            userName: req.user.name,
            userEmail: req.user.email,
            reason
        });

        res.status(201).json({
            success: true,
            data: deletionRequest
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Get all account deletion requests
// @route   GET /api/account-deletion-requests
// @access  Private/Admin
exports.getDeletionRequests = async (req, res) => {
    try {
        const requests = await AccountDeletionRequest.find()
            .populate('userId', 'name email')
            .populate('processedBy', 'name')
            .sort({ requestedAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Approve account deletion request
// @route   PUT /api/account-deletion-requests/:id/approve
// @access  Private/Admin
exports.approveDeletionRequest = async (req, res) => {
    try {
        const request = await AccountDeletionRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Deletion request not found'
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request has already been processed'
            });
        }

        // Update request status
        request.status = 'approved';
        request.processedAt = new Date();
        request.processedBy = req.user.id;
        await request.save();

        // Delete the user account
        await User.findByIdAndDelete(request.userId);

        res.status(200).json({
            success: true,
            message: 'Account deletion request approved and user account deleted',
            data: request
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Reject account deletion request
// @route   PUT /api/account-deletion-requests/:id/reject
// @access  Private/Admin
exports.rejectDeletionRequest = async (req, res) => {
    try {
        const request = await AccountDeletionRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Deletion request not found'
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request has already been processed'
            });
        }

        request.status = 'rejected';
        request.processedAt = new Date();
        request.processedBy = req.user.id;
        await request.save();

        res.status(200).json({
            success: true,
            message: 'Account deletion request rejected',
            data: request
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Get user's own deletion requests
// @route   GET /api/account-deletion-requests/my-requests
// @access  Private/User
exports.getUserDeletionRequests = async (req, res) => {
    try {
        const requests = await AccountDeletionRequest.find({ userId: req.user.id })
            .sort({ requestedAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
