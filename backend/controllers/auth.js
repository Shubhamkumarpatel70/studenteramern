const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ success: false, message: 'User already exists and is verified.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        if (user && !user.isVerified) {
            // Update existing unverified user
            user.otp = hashedOtp;
            user.otpExpires = otpExpires;
            user.name = name; // Update name in case it changed
            user.password = password; // This will trigger the pre-save hook to re-hash
            await user.save();
        } else {
            // Create new user with OTP
            const internId = `SE${Date.now()}`;
            user = await User.create({
                name,
                email,
                password,
                role,
                internId,
                otp: hashedOtp,
                otpExpires: otpExpires
            });
        }
        
        // Send OTP email
        try {
            await sendEmailToUser(user, otp);
            res.status(200).json({ success: true, message: `An OTP has been sent to ${user.email}` });
        } catch (emailError) {
            console.error("Failed to send OTP email:", emailError);
            // Still save the user but inform about email issue
            res.status(200).json({ 
                success: true, 
                message: `Registration successful but OTP email failed. Please contact support.`,
                emailError: true
            });
        }

    } catch (err) {
        console.error('Registration error:', err);
        // Check for duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }
        res.status(400).json({ success: false, message: 'Failed to register user.' });
    }
};

async function sendEmailToUser(user, otp) {
    const html = `
    <div style="font-family: Inter, Arial, sans-serif; color: #222; background: #f8f9fa; padding: 24px; border-radius: 10px; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #0A84FF; margin-bottom: 16px;">Student Era - Email Verification</h2>
      <p style="font-size: 16px; margin-bottom: 12px;">Hello <b>${user.name}</b>,</p>
      <p style="font-size: 16px; margin-bottom: 12px;">Your OTP for verification is:</p>
      <div style="font-size: 32px; font-weight: bold; color: #30D158; letter-spacing: 4px; margin-bottom: 16px;">${otp}</div>
      <p style="font-size: 15px; color: #555; margin-bottom: 12px;">This OTP will expire in <b>10 minutes</b>.</p>
      <p style="font-size: 14px; color: #8E8E93;">If you did not request this, please ignore this email.<br>Never share your OTP with anyone.</p>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 14px; color: #888;">Best regards,<br><b>Student Era Team</b></p>
    </div>
    `;
    const text = `Your OTP for verification is: ${otp}\nIt will expire in 10 minutes.\nNever share your OTP with anyone.`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Student Era - Account Verification OTP',
            message: text,
            html: html
        });
    } catch (emailError) {
        console.error("Failed to send OTP email:", emailError);
    }
}

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Please provide email and OTP.' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    try {
        const user = await User.findOne({
            email,
            otp: hashedOtp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully. Please log in.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error during OTP verification.' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
        return res.status(401).json({ success: false, message: 'Please verify your email before logging in.' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    // Remove password from user object before sending response
    const userObj = user.toObject();
    delete userObj.password;

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: userObj
        });
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        // We don't want to reveal if a user exists or not
        return res.status(200).json({ success: true, data: 'If a user with that email exists, a password reset email has been sent.' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link to reset your password: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOtp = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Please provide an email.' });
    }
    
    try {
        const user = await User.findOne({ email });

        if (!user) {
            // Don't want to reveal if a user exists or not for security reasons
            return res.status(400).json({ success: false, message: 'Invalid request.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'This account is already verified.' });
        }

        const otp = user.getOtp();
        await user.save({ validateBeforeSave: false });

        // Using the existing helper to send the email
        await sendEmailToUser(user, otp);

        res.status(200).json({ success: true, message: `A new OTP has been sent to ${email}` });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error resending OTP.' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await require('../models/User').findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}; 