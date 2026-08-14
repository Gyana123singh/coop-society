const express = require('express');
const router = express.Router();
const { getPublicVendors, firebaseLogin, login, googleSignIn, getMe, updateMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/public-vendors', getPublicVendors);
router.post('/firebase-login', firebaseLogin);
router.post('/firebase-otp', firebaseLogin);
router.post('/login', login);
router.post('/google', googleSignIn);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
