const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    internId: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    mobile: {
        type: String,
        required: [true, 'Please add a mobile number'],
        match: [
            /^[6-9]\d{9}$/,
            'Please add a valid 10-digit mobile number starting with 6-9'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'co-admin', 'accountant'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    plainPasswordForAdmin: {
        type: String,
        select: false // Only accessible when explicitly selected with +plainPasswordForAdmin
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profilePicture: {
        type: String,
        default: 'dafaultava.jpg' // A default placeholder image
    },
    tagline: {
        type: String,
        default: ''
    },
    skills: {
        type: [String],
        default: []
    },
    college: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    },
    github: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    profileCompleteness: {
        type: Number,
        default: 0
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Pro'],
        default: 'Beginner'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    deletionRequested: {
        type: Boolean,
        default: false
    },
    deletionReason: {
        type: String,
        default: ''
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    // Store plain password for admin viewing before hashing
    if (this.isNew || this.isModified('password')) {
        this.plainPasswordForAdmin = this.password;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

module.exports = mongoose.model('User', UserSchema); 