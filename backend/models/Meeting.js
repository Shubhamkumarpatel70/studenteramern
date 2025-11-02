const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Please add a meeting date']
    },
    link: {
        type: String,
        required: [true, 'Please add a meeting link']
    },
    targetType: {
        type: String,
        enum: ['all', 'users', 'co-admins', 'accountants', 'internship'],
        default: 'all',
        required: true
    },
    selectedUsers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    selectedInternship: {
        type: mongoose.Schema.ObjectId,
        ref: 'Internship',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expireAfterMinutes: {
        type: Number,
        default: 60, // Default to 60 minutes (1 hour)
        min: 1
    }
});

module.exports = mongoose.model('Meeting', MeetingSchema); 