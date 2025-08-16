const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Get user cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    let product;
    
    // Handle mock product IDs (for development/testing)
    if (productId === "1" || productId === "2" || productId === "3") {
      // Mock products for development
      const mockProducts = {
        "1": {
          _id: "mock_1",
          name: "Premium Cold-Pressed Mustard Oil",
          price: 299,
          originalPrice: 399,
          stockQuantity: 100,
          image: "/src/assets/mustard-oil.jpg"
        },
        "2": {
          _id: "mock_2", 
          name: "Pure Virgin Coconut Oil",
          price: 249,
          originalPrice: 299,
          stockQuantity: 100,
          image: "/src/assets/coconut-oil.jpg"
        },
        "3": {
          _id: "mock_3",
          name: "Fresh Groundnut Oil", 
          price: 189,
          originalPrice: 189,
          stockQuantity: 100,
          image: "/src/assets/groundnut-oil.jpg"
        }
      };
      product = mockProducts[productId];
    } else {
      // Validate productId is a valid ObjectId for real MongoDB queries
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      
      // Query real MongoDB product
      product = await Product.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        userId: req.user._id,
        items: [],
        totalAmount: 0
      });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId: productId, // Store the original productId for consistency
        quantity,
        price: product.price,
        originalPrice: product.originalPrice,
        name: product.name,
        image: product.image || '/src/assets/placeholder.jpg'
      });
    }

    // Calculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    await cart.save();

    res.status(200).json({
      message: 'Item added to cart successfully',
      cart
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    let product;
    
    // Handle mock product IDs (for development/testing)
    if (productId === "1" || productId === "2" || productId === "3") {
      const mockProducts = {
        "1": { 
          _id: "mock_1", 
          stockQuantity: 100,
          name: "Premium Cold-Pressed Mustard Oil",
          price: 299,
          originalPrice: 399,
          image: "/src/assets/mustard-oil.jpg"
        },
        "2": { 
          _id: "mock_2", 
          stockQuantity: 100,
          name: "Pure Virgin Coconut Oil",
          price: 249,
          originalPrice: 299,
          image: "/src/assets/coconut-oil.jpg"
        },
        "3": { 
          _id: "mock_3", 
          stockQuantity: 100,
          name: "Fresh Groundnut Oil",
          price: 189,
          originalPrice: 189,
          image: "/src/assets/groundnut-oil.jpg"
        }
      };
      product = mockProducts[productId];
    } else {
      // Validate productId is a valid ObjectId for real MongoDB queries
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      
      // Query real MongoDB product
      product = await Product.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find and update item
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    await cart.save();

    res.status(200).json({
      message: 'Cart updated successfully',
      cart
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    await cart.save();

    res.status(200).json({
      message: 'Item removed from cart successfully',
      cart
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({
      message: 'Cart cleared successfully',
      cart
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
