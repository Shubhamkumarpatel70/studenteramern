const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password, mobile } = req.body; // Role is intentionally omitted for security
  
  // Validate required fields
  if (!name || !email || !password || !mobile) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields: name, email, password, and mobile.",
    });
  }
  
  const normalizedEmail = email.toLowerCase();

  try {
    let user = await User.findOne({ email: normalizedEmail });

    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already exists and is verified. Please login instead.",
      });
    }

    if (user && user.deletionRequested) {
      return res.status(400).json({
        success: false,
        message:
          "This email is associated with a pending account deletion. Please register with a different email or contact support.",
      });
    }

    if (user && !user.isVerified) {
      // Update existing unverified user and verify them
      user.name = name; // Update name in case it changed
      user.password = password; // This will trigger the pre-save hook to re-hash
      user.mobile = mobile; // Update mobile number
      user.isVerified = true; // Auto-verify on registration
      await user.save();
    } else {
      // Create new user and verify them automatically
      const internId = `SE${Date.now()}`;
      user = await User.create({
        name,
        email: normalizedEmail,
        password,
        mobile,
        role: "user", // Force role to user for all new registrations
        internId,
        isVerified: true, // Auto-verify on registration
      });
    }

    // Return success - user is automatically verified
    return res.status(200).json({
      success: true,
      message: `Registration successful! You can now login to your account.`,
      email: normalizedEmail,
      internId: user.internId,
      isVerified: true,
    });
  } catch (err) {
    console.error("Registration error:", err);
    console.error("Registration error details:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
    });
    
    // Check for duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists. Please login instead.",
      });
    }
    // Handle validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(". ") });
    }
    
    // Return 500 for server errors, 400 for client errors
    const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
    res.status(statusCode).json({ 
      success: false, 
      message: err.message || "Failed to register user.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password, captchaId, captchaCode } = req.body;
  const normalizedEmail = email.toLowerCase();

  // Validate email & password
  if (!normalizedEmail || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email and password",
    });
  }

  // Verify CAPTCHA
  if (!captchaId || !captchaCode) {
    return res.status(400).json({
      success: false,
      message: "Please complete the CAPTCHA verification",
    });
  }

  const Captcha = require("../models/Captcha");
  try {
    const captcha = await Captcha.findById(captchaId);
    
    if (!captcha) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired CAPTCHA. Please refresh and try again.",
      });
    }

    if (captcha.used) {
      return res.status(400).json({
        success: false,
        message: "CAPTCHA has already been used. Please refresh and try again.",
      });
    }

    if (captcha.expiresAt < new Date()) {
      await captcha.deleteOne();
      return res.status(400).json({
        success: false,
        message: "CAPTCHA has expired. Please refresh and try again.",
      });
    }

    // Verify CAPTCHA code (case-insensitive)
    if (captcha.code.toUpperCase() !== captchaCode.toUpperCase().trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid CAPTCHA code. Please try again.",
      });
    }

    // Mark CAPTCHA as used
    captcha.used = true;
    await captcha.save();
  } catch (captchaError) {
    console.error("CAPTCHA verification error:", captchaError);
    return res.status(400).json({
      success: false,
      message: "CAPTCHA verification failed. Please refresh and try again.",
    });
  }

  // Check for user
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password"
  );

  if (user && user.deletionRequested) {
    return res.status(403).json({
      success: false,
      message:
        "Your account is pending deletion and cannot be accessed. Please contact support if this is a mistake.",
    });
  }

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  // Users are now auto-verified on registration, so no need to check verification
  // This check is removed to allow immediate login after registration

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  // Generate new CAPTCHA for next login attempt
  const generateRandomCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  try {
    const newCaptchaCode = generateRandomCaptcha();
    await Captcha.create({
      code: newCaptchaCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
  } catch (captchaGenError) {
    console.error("Failed to generate new CAPTCHA after login:", captchaGenError);
    // Don't fail login if CAPTCHA generation fails
  }

  // Admin login is now simple - no OTP required
  sendTokenResponse(user, 200, res);
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  // Remove password from user object before sending response
  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user: userObj,
  });
};

// @desc    Check email and return user name
// @route   POST /api/auth/check-email
// @access  Public
exports.checkEmail = async (req, res, next) => {
  try {
    const normalizedEmail = req.body.email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email address.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Check email error:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Reset password directly with email
// @route   PUT /api/auth/reset-password-direct
// @access  Public
exports.resetPasswordDirect = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email address.",
      });
    }

    // Update password (plainPasswordForAdmin will be set in pre-save hook)
    user.password = password;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("Reset password direct error:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  const normalizedEmail = req.body.email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    // We don't want to reveal if a user exists or not
    return res.status(200).json({
      success: true,
      data: "If a user with that email exists, a password reset email has been sent.",
    });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset URL - prefer FRONTEND URL when available so the user lands on the client app
  const frontendBase =
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    (process.env.NODE_ENV !== "production"
      ? "http://localhost:3000"
      : `${req.protocol}://${req.get("host")}`);
  const resetUrl = `${frontendBase}/reset-password/${resetToken}`;

  const text = `You are receiving this email because you (or someone else) has requested the reset of a password.
Please copy and paste the following link into your browser to reset your password:

${resetUrl}

If you did not request this, please ignore this email.`;

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; background:#f8f9fa; padding:24px; max-width:600px; margin:0 auto; border-radius:8px;">
      <h2 style="color:#0A2463;">Student Era — Password Reset Request</h2>
      <p style="color:#333; font-size:16px;">Hello <strong>${user.name}</strong>,</p>
      <p style="color:#333; font-size:15px;">We received a request to reset the password for your account (${user.email}). Click the button below to reset your password. This link will expire in a short time.</p>
      <div style="text-align:center; margin:20px 0;">
        <a href="${resetUrl}" style="background:#0A2463;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">Reset Password</a>
      </div>
      <p style="color:#666; font-size:13px;">If the button doesn't work, copy and paste the following URL into your browser:</p>
      <p style="word-break:break-all;color:#0A2463;font-size:13px;">${resetUrl}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
      <p style="color:#888;font-size:13px;">If you did not request a password reset, please ignore this email or contact support.</p>
      <p style="color:#888;font-size:13px;">Best regards,<br/>Student Era Team</p>
    </div>
    `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Student Era — Password Reset",
      message: text,
      html,
    });

    res.status(200).json({ 
      success: true, 
      data: "If a user with that email exists, a password reset email has been sent.",
      message: "Password reset email sent successfully. Please check your inbox and spam folder."
    });
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    
    // Revert the token generation
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    // Provide more specific error message
    let errorMessage = "Email could not be sent. Please try again later.";
    
    if (err.message && err.message.includes("Missing EMAIL_USER")) {
      errorMessage = "Email service is not configured. Please contact support.";
    } else if (err.message && err.message.includes("authentication")) {
      errorMessage = "Email authentication failed. Please contact support.";
    } else if (err.message && err.message.includes("timeout")) {
      errorMessage = "Email service timeout. Please try again in a few moments.";
    }

    return res
      .status(500)
      .json({ 
        success: false, 
        message: errorMessage,
        error: process.env.NODE_ENV === "development" ? err.message : undefined
      });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid token" });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Send a confirmation email about the successful password reset
  try {
    const text = `Your password has been successfully reset. You can now log in with your new password.`;
    const html = `
                <div style="font-family:Inter, Arial, sans-serif; padding:20px; background:#f8f9fa; max-width:600px; margin:0 auto; border-radius:8px;">
                    <h2 style="color:#0A2463;">Password Reset Successful</h2>
                    <p style="color:#333;">Hello <strong>${
                      user.name
                    }</strong>,</p>
                    <p style="color:#333;">Your password has been successfully reset. Click the button below to go to the login page and sign in with your new password.</p>
                    <div style="text-align:center;margin:20px 0;">
                        <a href="${(
                          process.env.FRONTEND_URL ||
                          process.env.CLIENT_URL ||
                          (process.env.NODE_ENV !== "production"
                            ? "http://localhost:3000"
                            : `${req.protocol}://${req.get("host")}`)
                        ).replace(
                          /\/$/,
                          ""
                        )}/login" style="background:#0A2463;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none;font-weight:600;">Login Now</a>
                    </div>
                    <p style="color:#666;font-size:13px;">If you did not request this change, please contact support immediately.</p>
                </div>
                `;
    await sendEmail({
      email: user.email,
      subject: "Student Era — Password Reset Successful",
      message: text,
      html,
    });
  } catch (emailErr) {
    console.error(
      "Failed to send password reset confirmation email:",
      emailErr
    );
  }

  sendTokenResponse(user, 200, res);
};

// @desc    Get reset password page data (name/email) if token valid
// @route   GET /api/auth/reset-password/:resettoken
// @access  Public
exports.getResetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    return res
      .status(200)
      .json({ success: true, data: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// @desc    Send email token for verification
// @route   POST /api/auth/send-email-token
// @access  Public
exports.sendEmailToken = async (req, res, next) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase();

  if (!normalizedEmail) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide an email." });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified." });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Save token
    const EmailToken = require("../models/EmailToken");
    await EmailToken.create({
      email: normalizedEmail,
      tokenHash,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Send email
    const resetUrl = `${
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      (process.env.NODE_ENV !== "production"
        ? "http://localhost:3000"
        : `${req.protocol}://${req.get("host")}`)
    }/verify-email-token/${token}`;

    const text = `Please verify your email by clicking the link: ${resetUrl}`;
    const html = `<p>Please verify your email by clicking <a href="${resetUrl}">here</a>.</p>`;

    await sendEmail({
      email: normalizedEmail,
      subject: "Student Era - Email Verification",
      message: text,
      html,
    });

    res
      .status(200)
      .json({ success: true, message: "Verification email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc    Get user details from email token
// @route   GET /api/auth/verify-email-token/:token
// @access  Public
exports.getEmailTokenDetails = async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a token." });
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const EmailToken = require("../models/EmailToken");

    const emailToken = await EmailToken.findOne({
      tokenHash,
      used: false,
      expiresAt: { $gt: Date.now() },
    });

    if (!emailToken) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    }

    // Get user details
    const user = await User.findOne({ email: emailToken.email }).select(
      "name email"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        token: token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc    Verify email token
// @route   POST /api/auth/verify-email-token
// @access  Public
exports.verifyEmailToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a token." });
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const EmailToken = require("../models/EmailToken");

    const emailToken = await EmailToken.findOne({
      tokenHash,
      used: false,
      expiresAt: { $gt: Date.now() },
    });

    if (!emailToken) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    }

    // Mark token as used
    emailToken.used = true;
    await emailToken.save();

    // Verify user
    const user = await User.findOne({ email: emailToken.email });
    if (user) {
      user.isVerified = true;
      await user.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc    Check verification status
// @route   GET /api/auth/check-verification
// @access  Public
exports.checkVerification = async (req, res, next) => {
  const { email } = req.query;
  const normalizedEmail = email.toLowerCase();

  if (!normalizedEmail) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide an email." });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Prevent caching since verification status can change
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    res.status(200).json({ success: true, isVerified: user.isVerified });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await require("../models/User")
      .findById(req.user.id)
      .select("-password");
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
