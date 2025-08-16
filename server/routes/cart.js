const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../utils/auth');

// All cart routes require authentication
router.use(authenticateToken);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;
