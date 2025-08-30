const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const OTP = require('../models/OTP');
const Cart = require('../models/Cart');
const { sendOTPEmail, sendNewUserEmail } = require('../utils/emailService');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const generateOTP = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
      console.log(`Invalid email: ${email}`);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found: email=${email}`);
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }
    const otp = generateOTP();
    await OTP.findOneAndUpdate(
      { email },
      { 
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        attempts: 0
      },
      { upsert: true, new: true }
    );
    console.log(`OTP created: email=${email}, otp=${otp}`);
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      console.log(`Failed to send OTP email to ${email}`);
      return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
    res.status(200).json({ 
      message: 'OTP sent successfully',
      email,
      resendAfter: 60
    });
  } catch (error) {
    console.error('Send login OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyOTPAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      console.log(`Missing email or OTP: email=${email}, otp=${otp}`);
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      console.log(`OTP not found: email=${email}, otp=${otp}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      console.log(`OTP expired: email=${email}, otp=${otp}`);
      return res.status(400).json({ message: 'OTP has expired' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found: email=${email}`);
      return res.status(404).json({ message: 'User not found' });
    }
    user.lastLogin = new Date();
    await user.save();
    const token = generateToken(user._id);
    await OTP.deleteOne({ _id: otpRecord._id });
    console.log(`Login successful: email=${email}, userId=${user._id}`);
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
        fullName: [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' '),
        email: user.email,
        phone: user.phone,
        address: user.address
      },
      cart: cart.items
    });
  } catch (error) {
    console.error('Verify login OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
      console.log(`Invalid email: ${email}`);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found: email=${email}`);
      return res.status(404).json({ message: 'User not found' });
    }
    const otp = generateOTP();
    await OTP.findOneAndUpdate(
      { email },
      { 
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        attempts: 0
      },
      { upsert: true, new: true }
    );
    console.log(`OTP resent: email=${email}, otp=${otp}`);
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      console.log(`Failed to send OTP email to ${email}`);
      return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
    res.status(200).json({ 
      message: 'New OTP sent successfully',
      resendAfter: 60
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const sendSignupOTP = async (req, res) => {
  try {
    const { email, userData } = req.body;
    if (!email || !validator.isEmail(email)) {
      console.log(`Invalid email: ${email}`);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (!userData) {
      console.log('Missing userData');
      return res.status(400).json({ message: 'User data is required' });
    }
    const { firstName, lastName, phone, address } = userData;
    if (!firstName || !lastName || !phone || !address) {
      console.log(`Missing required fields: firstName=${firstName}, lastName=${lastName}, phone=${phone}, address=${!!address}`);
      return res.status(400).json({ message: 'First name, last name, phone, and address are required' });
    }
    if (!address.flatHouseNo || !address.areaStreet || !address.city || !address.state || !address.zipCode) {
      console.log(`Missing address fields: ${JSON.stringify(address)}`);
      return res.status(400).json({ message: 'All address fields are required except landmark' });
    }
    if (!validator.isMobilePhone(phone, 'en-IN') || phone.length !== 10) {
      console.log(`Invalid phone: ${phone}`);
      return res.status(400).json({ message: 'Please provide a valid 10-digit phone number' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      console.log(`User already exists: email=${email}, phone=${phone}`);
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered' 
      });
    }
    await PendingUser.deleteOne({ email });
    await OTP.deleteOne({ email });
    const otp = generateOTP();
    const otpRecord = new OTP({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      attempts: 0
    });
    await otpRecord.save();
    console.log(`OTP created: email=${email}, otp=${otp}, expiresAt=${otpRecord.expiresAt}`);
    const pendingUser = new PendingUser({
      firstName,
      middleName: userData.middleName || '',
      lastName,
      email,
      phone,
      address,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
    await pendingUser.save();
    console.log(`PendingUser created: id=${pendingUser._id}, email=${email}`);
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      console.log(`Failed to send OTP email to ${email}`);
      await PendingUser.deleteOne({ _id: pendingUser._id });
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
    res.status(200).json({ 
      message: 'OTP sent successfully',
      email,
      resendAfter: 60
    });
  } catch (error) {
    console.error('Send signup OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      console.log(`Missing email or OTP: email=${email}, otp=${otp}`);
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      console.log(`OTP not found: email=${email}, otp=${otp}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      console.log(`OTP expired: email=${email}, otp=${otp}`);
      return res.status(400).json({ message: 'OTP has expired' });
    }
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      console.log(`PendingUser not found: email=${email}`);
      return res.status(404).json({ message: 'Pending user data not found' });
    }
    const user = new User({
      firstName: pendingUser.firstName,
      middleName: pendingUser.middleName,
      lastName: pendingUser.lastName,
      email: pendingUser.email,
      phone: pendingUser.phone,
      address: pendingUser.address,
      lastLogin: new Date()
    });
    await user.save();
    console.log(`User created: id=${user._id}, email=${email}`);
    const cart = new Cart({ userId: user._id, items: [], totalAmount: 0 });
    await cart.save();
    console.log(`Cart created: userId=${user._id}`);
    const token = generateToken(user._id);
    await OTP.deleteOne({ _id: otpRecord._id });
    await PendingUser.deleteOne({ _id: pendingUser._id });
    console.log(`Cleaned up OTP and PendingUser: email=${email}`);
    // Send new user email to admin
    const emailSent = await sendNewUserEmail(user);
    if (!emailSent) {
      console.log(`Failed to send new user email for ${email}`);
    }
    res.status(201).json({
      message: 'Signup and login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' '),
        email: user.email,
        phone: user.phone,
        address: user.address
      },
      cart: cart.items
    });
  } catch (error) {
    console.error('Verify signup OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const signup = async (req, res) => {
  return res.status(400).json({ message: 'Please use OTP-based signup process' });
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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

const logout = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  sendLoginOTP,
  verifyOTPAndLogin,
  resendOTP,
  signup,
  sendSignupOTP,
  verifySignupOTP,
  getProfile,
  updateProfile,
  logout,
  getAllUsers: exports.getAllUsers
};