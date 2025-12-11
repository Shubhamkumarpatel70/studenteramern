const mongoose = require('mongoose');

const CaptchaSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        trim: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
    },
    used: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Auto-delete after 10 minutes (in seconds)
    }
});

// Index for faster queries
CaptchaSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Captcha', CaptchaSchema);

