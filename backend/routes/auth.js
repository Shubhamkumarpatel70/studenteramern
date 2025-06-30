const express = require('express');
const { register, login, verifyOtp, forgotPassword, resetPassword, resendOtp } = require('../controllers/auth');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/resend-otp', resendOtp);

// Add this route for session persistence
router.get('/me', protect, require('../controllers/auth').getMe);

module.exports = router; 