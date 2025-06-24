const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: [true, 'Please add a quote'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Please add the person\'s name'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Please add the person\'s role (e.g., internship title)'],
        trim: true
    },
    avatar: {
        type: String, // URL to image
        default: 'https://i.pravatar.cc/150'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema); 