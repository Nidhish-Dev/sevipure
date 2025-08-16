const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../utils/auth');
const { getAllUsers } = require('../controllers/authController');

// Public routes
router.post('/signup', authController.signup);
router.post('/send-otp', authController.sendLoginOTP);
router.post('/verify-otp', authController.verifyOTPAndLogin);
router.post('/resend-otp', authController.resendOTP);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.post('/logout', authenticateToken, authController.logout);
router.get('/users', authenticateToken, getAllUsers);

module.exports = router;
