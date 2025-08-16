require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const axios = require('axios'); // <-- Add axios for HTTP requests

// Import routes
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`MongoDB connected successfully`);
  
  // 🔥 Keep-Alive Function
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  
  setInterval(async () => {
    try {
      const res = await axios.get(`${baseUrl}/health`);
      console.log(`[KeepAlive] Pinged /health at ${new Date().toISOString()} →`, res.data);
    } catch (err) {
      console.error('[KeepAlive] Failed to ping /health:', err.message);
    }
  }, 10 * 60 * 1000); // every 10 minutes
});
