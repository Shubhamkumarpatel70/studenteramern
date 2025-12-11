const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Please add a company name']
    },
    shortDescription: {
        type: String,
        required: [true, 'Please add a short description']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    image: {
        type: String, // URL to the image
        required: [true, 'Please add an image URL']
    },
    stipend: {
        type: Number,
        default: 0
    },
    stipendType: {
        type: String,
        enum: ['day', 'week', 'month'],
        default: 'month'
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    technologies: {
        type: [String],
        required: true
    },
    isAccepting: {
        type: Boolean,
        default: true
    },
    features: {
        type: [String],
        default: []
    },
    totalPositions: {
        type: Number,
        required: true,
        default: 1
    },
    currentRegistrations: {
        type: Number,
        default: 0
    },
    registrationFee: {
        type: Number,
        default: 149
    },
    tag: {
        type: String,
        trim: true,
        default: ''
    },
    tagColor: {
        type: String,
        trim: true,
        default: '#3B82F6' // Default blue color
    },
    order: {
        type: Number,
        default: 999 // Higher number means lower priority (appears later)
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Internship', InternshipSchema); 