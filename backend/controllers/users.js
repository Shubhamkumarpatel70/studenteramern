const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({ success: false, message: 'Role is required' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Failed to update role' });
    }
}; 