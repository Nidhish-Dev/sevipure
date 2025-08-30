const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const { sendOrderEmail, sendOrderDeliveredEmail, sendOrderPlacedEmail } = require('../utils/emailService');

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { address, contactName, contactPhone } = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      console.log(`Cart empty or not found: userId=${userId}`);
      return res.status(400).json({ message: 'Cart is empty' });
    }
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User not found: userId=${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    const order = new Order({
      userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      address,
      contactName,
      contactPhone
    });
    await order.save();
    console.log(`Order placed: id=${order._id}, userId=${userId}`);
    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    console.log(`Cart cleared: userId=${userId}`);
    // Send order confirmation email to admin
    const adminEmailSent = await sendOrderEmail(order, user);
    if (!adminEmailSent) {
      console.log(`Failed to send admin order email for order: ${order._id}`);
    }
    // Send order placed email to user
    const userEmailSent = await sendOrderPlacedEmail(order, user);
    if (!userEmailSent) {
      console.log(`Failed to send user order placed email for order: ${order._id}`);
    }
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all orders (admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'firstName lastName email phone');
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId });
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get paginated orders
exports.getOrdersPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments();
    const orders = await Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.status(200).json({ orders, total });
  } catch (error) {
    console.error('Get orders paginated error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark order as delivered
exports.markOrderDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      console.log(`Order not found: id=${id}`);
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = 'Delivered';
    await order.save();
    console.log(`Order marked as delivered: id=${order._id}`);
    // Fetch user to get details
    const user = await User.findById(order.userId);
    if (!user) {
      console.log(`User not found: userId=${order.userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    // Send delivery email with full user details
    const emailSent = await sendOrderDeliveredEmail(order, user);
    if (!emailSent) {
      console.error('Failed to send delivery email for order:', order._id);
    }
    res.status(200).json({ message: 'Order marked as delivered', order });
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  placeOrder: exports.placeOrder,
  getOrders: exports.getOrders,
  getUserOrders: exports.getUserOrders,
  getOrdersPaginated: exports.getOrdersPaginated,
  markOrderDelivered: exports.markOrderDelivered
};