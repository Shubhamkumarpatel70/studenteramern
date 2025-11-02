const express = require('express');
const { register, login, verifyOtp, forgotPassword, resetPassword, resendOtp, getMe, getResetPassword, verifyAdminOtp } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:resettoken', getResetPassword);
router.put('/reset-password/:resettoken', resetPassword);
router.post('/admin-verify-otp', verifyAdminOtp);
router.post('/resend-otp', resendOtp);
router.get('/me', protect, getMe);

module.exports = router; 