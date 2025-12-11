const mongoose = require('mongoose');

const HRSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add HR name'],
        trim: true
    },
    internshipCategory: {
        type: String,
        required: [true, 'Please add internship category'],
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HR', HRSchema);

