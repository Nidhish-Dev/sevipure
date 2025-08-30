const express = require('express');
const router = express.Router();
const {
  sendLoginOTP,
  verifyOTPAndLogin,
  resendOTP,
  signup,
  sendSignupOTP,
  verifySignupOTP,
  getProfile,
  updateProfile,
  logout,
  getAllUsers
} = require('../controllers/authController');
const { authenticateToken } = require('../utils/auth');

router.post('/send-otp', sendSignupOTP);
router.post('/verify-otp-signup', verifySignupOTP);
router.post('/signup', signup);
router.post('/login-otp', sendLoginOTP);
router.post('/verify-otp', verifyOTPAndLogin);
router.post('/resend-otp', resendOTP);
router.get('/profile', authenticateToken, getProfile);
router.patch('/profile', authenticateToken, updateProfile);
router.post('/logout', authenticateToken, logout);
router.get('/users', authenticateToken, getAllUsers);

module.exports = router;