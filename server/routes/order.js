const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getUserOrders, getOrdersPaginated, markOrderDelivered } = require('../controllers/orderController');
const { authenticateToken } = require('../utils/auth');

// Place order (user)
router.post('/place', authenticateToken, placeOrder);
// Get all orders (admin)
router.get('/', authenticateToken, getOrders);
// Get user orders
router.get('/my', authenticateToken, getUserOrders);
router.get('/paginated', authenticateToken, getOrdersPaginated);
router.patch('/:id/delivered', authenticateToken, markOrderDelivered);

module.exports = router;
