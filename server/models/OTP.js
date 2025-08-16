const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true,
    length: 5
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 120 // 2 minutes in seconds
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5
  }
}, {
  timestamps: true
});

// Index for faster queries
otpSchema.index({ email: 1, expiresAt: 1 });

module.exports = mongoose.model('OTP', otpSchema);
