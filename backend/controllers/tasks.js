const Task = require('../models/Task');
const User = require('../models/User');
const AssignedTask = require('../models/AssignedTask');

// @desc    Get all tasks for admin
// @route   GET /api/tasks
// @access  Private/Admin
exports.getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find()
            .populate({
                path: 'user',
                select: 'name internId' 
            })
            .populate({
                path: 'internship',
                select: 'title'
            })
            .sort({ dateSubmitted: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all tasks for a specific user
// @route   GET /api/tasks/my-tasks
// @access  Private/User
exports.getMyTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ user: req.user.id })
            .populate('internship', 'title')
            .sort({ dateSubmitted: -1 });

        res.status(200).json({ success: true, data: tasks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    User submits a task for an assigned task
// @route   POST /api/tasks
// @access  Private/User
exports.submitTask = async (req, res, next) => {
    try {
        const { internship, title, fileLinks, assignedTask } = req.body;

        if (!internship || !title || !assignedTask || (!fileLinks && !req.file)) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        const taskData = {
            ...req.body,
            user: req.user.id,
            filePath: req.file ? req.file.path.replace(/\\/g, "/") : undefined, // Store file path if it exists, normalize slashes
            fileLinks: fileLinks ? (Array.isArray(fileLinks) ? fileLinks : [fileLinks]) : []
        };
        
        const task = await Task.create(taskData);

        // Also update the status of the assigned task to 'in-progress' if it's not already completed
        await AssignedTask.findByIdAndUpdate(assignedTask, { $set: { status: 'in-progress' } });


        res.status(201).json({ success: true, data: task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update task status (for submitted tasks)
// @route   PUT /api/tasks/:id/status
// @access  Private/Admin
exports.updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        
        task.status = status;
        await task.save();

        // If the submitted task is approved, mark the original assigned task as 'completed'
        if (status === 'approved' && task.assignedTask) {
            await AssignedTask.findByIdAndUpdate(task.assignedTask, { status: 'completed' });
        }

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all uploaded tasks for the logged-in user
// @route   GET /api/tasks/my-uploads
// @access  Private/User
exports.getMyUploads = async (req, res, next) => {
    try {
        const tasks = await Task.find({ user: req.user.id })
            .populate('internship', 'title')
            .sort({ dateSubmitted: -1 });
        res.status(200).json({ success: true, data: tasks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}; 