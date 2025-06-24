const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
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
    assignedTask: {
        type: mongoose.Schema.ObjectId,
        ref: 'AssignedTask',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a task title'],
        trim: true
    },
    fileLinks: {
        type: [String],
        validate: [
            val => val.length >= 1 && val.length <= 5,
            'Please submit between 1 and 5 file links.'
        ]
    },
    filePath: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema); 