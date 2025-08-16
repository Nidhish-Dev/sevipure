const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, inStock, stockQuantity } = req.body;
    if (!name || !price || !category || !stockQuantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const product = new Product({ name, description, price, image, category, inStock, stockQuantity });
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockQuantity } = req.body;
    const product = await Product.findByIdAndUpdate(id, { stockQuantity, inStock: stockQuantity > 0 }, { new: true });
    res.status(200).json({ message: 'Product quantity updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
