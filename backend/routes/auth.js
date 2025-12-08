const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  register,
  login,
  verifyOtp,
  forgotPassword,
  resetPassword,
  resendOtp,
  getMe,
  getResetPassword,
  verifyAdminOtp,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Rate limiting for registration
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 registration requests per windowMs
  message: {
    success: false,
    message: "Too many registration attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for OTP resend
const resendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 OTP resend requests per windowMs
  message: {
    success: false,
    message: "Too many OTP resend requests. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for OTP verification
const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 OTP verification attempts per windowMs
  message: {
    success: false,
    message: "Too many OTP verification attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per windowMs
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for forgot password
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 forgot password requests per windowMs
  message: {
    success: false,
    message: "Too many password reset requests. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/verify-otp", verifyOtpLimiter, verifyOtp);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/forgotpassword", forgotPasswordLimiter, forgotPassword); // Legacy route support
router.post("/send-email-token", require("../controllers/auth").sendEmailToken);
router.get(
  "/verify-email-token/:token",
  require("../controllers/auth").getEmailTokenDetails
);
router.post(
  "/verify-email-token",
  require("../controllers/auth").verifyEmailToken
);
router.get(
  "/check-verification",
  require("../controllers/auth").checkVerification
);
router.get("/reset-password/:resettoken", getResetPassword);
router.put("/reset-password/:resettoken", resetPassword);
router.post("/admin-verify-otp", verifyOtpLimiter, verifyAdminOtp);
router.post("/resend-otp", resendOtpLimiter, resendOtp);
router.get("/me", protect, getMe);

module.exports = router;
