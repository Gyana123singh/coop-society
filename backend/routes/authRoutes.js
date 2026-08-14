const express = require('express');
const router = express.Router();
const { getPublicVendors, firebaseOTPLogin, login, sendOTP, verifyOTP, googleSignIn, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/public-vendors', getPublicVendors);
router.post('/firebase-otp', firebaseOTPLogin);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/google', googleSignIn);
router.get('/me', protect, getMe);

module.exports = router;
