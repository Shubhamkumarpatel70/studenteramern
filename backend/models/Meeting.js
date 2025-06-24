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
    target: {
        type: {
            type: String,
            enum: ['all', 'co-admins', 'internship'],
            required: true
        },
        internship: {
            type: mongoose.Schema.ObjectId,
            ref: 'Internship'
        }
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