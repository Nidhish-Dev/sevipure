const User = require('../models/User');
const OTP = require('../models/OTP');
const Cart = require('../models/Cart');
const { sendOTPEmail } = require('../utils/emailService');
const { generateToken } = require('../utils/auth');
const validator = require('validator');

// Generate 5-digit OTP
const generateOTP = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Send OTP for login
const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Save OTP to database
    await OTP.findOneAndUpdate(
      { email },
      { 
        otp,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        attempts: 0
      },
      { upsert: true, new: true }
    );

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }

    res.status(200).json({ 
      message: 'OTP sent successfully',
      email,
      resendAfter: 60 // 1 minute
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify OTP and login
const verifyOTPAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find and validate OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Get user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    // Get or create cart for user
    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id, items: [], totalAmount: 0 });
      await cart.save();
    }

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address
      },
      cart: cart.items
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new OTP
    const otp = generateOTP();
    
    // Save new OTP
    await OTP.findOneAndUpdate(
      { email },
      { 
        otp,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        attempts: 0
      },
      { upsert: true, new: true }
    );

    // Send new OTP
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }

    res.status(200).json({ 
      message: 'New OTP sent successfully',
      resendAfter: 60 // 1 minute
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User signup
const signup = async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, phone, address } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !address) {
      return res.status(400).json({ message: 'First name, last name, email, phone, and address are required' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Validate phone format (10 digits)
    if (!validator.isMobilePhone(phone, 'en-IN') || phone.length !== 10) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit phone number' });
    }

    // Validate address fields
    if (!address.flatHouseNo || !address.areaStreet || !address.city || !address.state || !address.zipCode) {
      return res.status(400).json({ message: 'All address fields are required except landmark' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ message: 'Phone number already registered' });
      }
    }

    // Create new user
    const user = new User({
      firstName,
      middleName: middleName || '',
      lastName,
      email,
      phone,
      address
    });

    await user.save();

    // Create cart for new user
    const cart = new Cart({ userId: user._id, items: [], totalAmount: 0 });
    await cart.save();

    res.status(201).json({
      message: 'User registered successfully. Please login with your email.',
      user: {
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, middleName, lastName, address } = req.body;
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (middleName !== undefined) updates.middleName = middleName;
    if (lastName) updates.lastName = lastName;
    if (address) updates.address = address;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  sendLoginOTP,
  verifyOTPAndLogin,
  resendOTP,
  signup,
  getProfile,
  updateProfile,
  logout
};
