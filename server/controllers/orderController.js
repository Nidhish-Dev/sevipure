const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const { sendOrderEmail, sendOrderDeliveredEmail } = require('../utils/emailService');

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { address, contactName, contactPhone } = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
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
    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    // Send email to self
    await sendOrderEmail(order);
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
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getOrdersPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments();
    const orders = await Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.status(200).json({ orders, total });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.markOrderDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = 'Delivered';
    await order.save();

    // Fetch user to get email
    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send delivery email
    const emailSent = await sendOrderDeliveredEmail(order, user.email);
    if (!emailSent) {
      console.error('Failed to send delivery email');
    }

    res.status(200).json({ message: 'Order marked as delivered', order });
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};