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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Internship', InternshipSchema); 