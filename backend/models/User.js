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
        default: false
    },
    otp: String,
    otpExpires: Date,
    plainOtpForAdmin: {
        type: String,
        select: false // Only accessible when explicitly selected with +plainOtpForAdmin
    },
    otpAttempts: {
        type: Number,
        default: 0
    },
    otpAttemptsResetAt: Date,
    otpLastAttemptAt: Date,
    lastOtpSentAt: Date,
    otpResendCount: {
        type: Number,
        default: 0
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
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
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

// Generate and store hashed OTP for security
UserSchema.methods.getOtp = async function() {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP before storing (similar to password hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    
    // Store the hashed OTP
    this.otp = hashedOtp;
    
    // Store plain OTP temporarily for admin viewing (will be cleared after verification/expiry)
    this.plainOtpForAdmin = otp;

    // Set an expiry time for the OTP (10 minutes)
    this.otpExpires = Date.now() + 10 * 60 * 1000;
    
    // Reset OTP attempts when generating new OTP
    this.otpAttempts = 0;
    this.otpAttemptsResetAt = Date.now() + 15 * 60 * 1000; // 15 minutes cooldown
    
    // Track when OTP was sent
    this.lastOtpSentAt = Date.now();
    
    // Increment resend count
    this.otpResendCount = (this.otpResendCount || 0) + 1;

    return otp; // Return the plain OTP to be sent via email
};

// Check if user can resend OTP (per-user cooldown)
UserSchema.methods.canResendOtp = function(minCooldownSeconds = 60) {
    if (!this.lastOtpSentAt) {
        return { canResend: true };
    }
    
    const timeSinceLastOtp = (Date.now() - this.lastOtpSentAt) / 1000; // in seconds
    const remainingCooldown = Math.max(0, minCooldownSeconds - timeSinceLastOtp);
    
    if (remainingCooldown > 0) {
        return {
            canResend: false,
            remainingSeconds: Math.ceil(remainingCooldown),
            remainingMinutes: Math.ceil(remainingCooldown / 60)
        };
    }
    
    return { canResend: true };
};

// Match OTP (compare plain OTP with hashed OTP)
UserSchema.methods.matchOtp = async function(enteredOtp) {
    if (!this.otp || !this.otpExpires) {
        return false;
    }
    
    // Check if OTP has expired
    if (Date.now() > this.otpExpires) {
        return false;
    }
    
    // Compare entered OTP with hashed OTP
    return await bcrypt.compare(enteredOtp, this.otp);
};

// Check if OTP attempts are exceeded
UserSchema.methods.canAttemptOtp = function() {
    const maxAttempts = 5;
    const cooldownMinutes = 15;
    
    // Reset attempts if cooldown period has passed
    if (this.otpAttemptsResetAt && Date.now() > this.otpAttemptsResetAt) {
        this.otpAttempts = 0;
        return true;
    }
    
    return this.otpAttempts < maxAttempts;
};

// Increment OTP attempts
UserSchema.methods.incrementOtpAttempts = function() {
    this.otpAttempts = (this.otpAttempts || 0) + 1;
    this.otpLastAttemptAt = Date.now();
    
    // Set cooldown if max attempts reached
    if (this.otpAttempts >= 5) {
        this.otpAttemptsResetAt = Date.now() + 15 * 60 * 1000; // 15 minutes cooldown
    }
};

// Clear expired plain OTP for admin
UserSchema.methods.clearExpiredPlainOtp = function() {
    if (this.otpExpires && Date.now() > this.otpExpires) {
        this.plainOtpForAdmin = undefined;
    }
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