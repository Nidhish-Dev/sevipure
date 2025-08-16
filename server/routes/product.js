const express = require('express');
const router = express.Router();
const { addProduct, getProducts, deleteProduct, updateProductQuantity } = require('../controllers/productController');
const { authenticateToken } = require('../utils/auth');

router.post('/', authenticateToken, addProduct);
router.get('/', getProducts);
router.delete('/:id', authenticateToken, deleteProduct);
router.patch('/:id/quantity', authenticateToken, updateProductQuantity);

module.exports = router;
