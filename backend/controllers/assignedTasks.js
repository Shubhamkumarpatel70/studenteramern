const AssignedTask = require('../models/AssignedTask');
const User = require('../models/User');
const Internship = require('../models/Internship');

// @desc    Assign a task to a user
// @route   POST /api/assigned-tasks
// @access  Private/Admin
exports.assignTask = async (req, res, next) => {
    try {
        const { userId, internshipId, title, description, dueDate, domain } = req.body;

        // Validate required fields
        if (!userId || !internshipId || !title || !description || !dueDate || !domain) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields' 
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Check if internship exists
        const internship = await Internship.findById(internshipId);
        if (!internship) {
            return res.status(404).json({ 
                success: false, 
                message: 'Internship not found' 
            });
        }

        // Create the assigned task
        const assignedTask = await AssignedTask.create({
            user: userId,
            internship: internshipId,
            title,
            description,
            dueDate,
            domain,
            assignedBy: req.user.id
        });

        // Populate user and internship details
        await assignedTask.populate('user', 'name email internId');
        await assignedTask.populate('internship', 'title company');

        res.status(201).json({
            success: true,
            data: assignedTask
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
};

// @desc    Get all assigned tasks (for admin)
// @route   GET /api/assigned-tasks
// @access  Private/Admin
exports.getAllAssignedTasks = async (req, res, next) => {
    try {
        const assignedTasks = await AssignedTask.find()
            .populate('user', 'name email internId')
            .populate('internship', 'title company')
            .populate('assignedBy', 'name')
            .sort({ assignedDate: -1 });

        res.status(200).json({
            success: true,
            count: assignedTasks.length,
            data: assignedTasks
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
};

// @desc    Get assigned tasks for a specific user
// @route   GET /api/assigned-tasks/my-tasks
// @access  Private/User
exports.getMyAssignedTasks = async (req, res, next) => {
    try {
        const assignedTasks = await AssignedTask.find({ user: req.user.id })
            .populate('internship', 'title company')
            .populate('assignedBy', 'name')
            .sort({ assignedDate: -1 });

        res.status(200).json({
            success: true,
            count: assignedTasks.length,
            data: assignedTasks
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
};

// @desc    Update assigned task status
// @route   PUT /api/assigned-tasks/:id/status
// @access  Private/User
exports.updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['assigned', 'in-progress', 'completed', 'overdue'].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status' 
            });
        }

        const assignedTask = await AssignedTask.findById(req.params.id);

        if (!assignedTask) {
            return res.status(404).json({ 
                success: false, 
                message: 'Assigned task not found' 
            });
        }

        // Check if user owns the task or is admin
        if (assignedTask.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized to update this task' 
            });
        }

        assignedTask.status = status;
        await assignedTask.save();

        res.status(200).json({
            success: true,
            data: assignedTask
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
}; 