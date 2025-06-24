const mongoose = require('mongoose');

const AssignedTaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    internship: {
        type: mongoose.Schema.ObjectId,
        ref: 'Internship',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a task title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a task description'],
        trim: true
    },
    dueDate: {
        type: Date,
        required: [true, 'Please add a due date']
    },
    status: {
        type: String,
        enum: ['assigned', 'in-progress', 'completed', 'overdue'],
        default: 'assigned'
    },
    assignedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    assignedDate: {
        type: Date,
        default: Date.now
    },
    domain: {
        type: String,
        required: [true, 'Please specify the domain'],
        trim: true
    }
});

module.exports = mongoose.model('AssignedTask', AssignedTaskSchema); 