const mongoose = require('mongoose');

const SocialLinkSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: [true, 'Please add a platform'],
        enum: ['whatsapp', 'instagram', 'linkedin'],
        unique: true
    },
    url: {
        type: String,
        required: [true, 'Please add a URL'],
        trim: true
    },
    isActive: {
        type: Boolean,
        default: false // Default is inactive
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
SocialLinkSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('SocialLink', SocialLinkSchema);

