const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    message: {
        type: String,
        required: [true, 'Please add a message'],
        trim: true
    },
    link: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema); 