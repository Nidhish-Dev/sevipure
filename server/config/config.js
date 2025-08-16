module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sevipure',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-change-in-production',

  // Email Configuration (Gmail example)
  EMAIL_USER: process.env.EMAIL_USER || 'your-email@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'your-app-password',
  EMAIL_FROM: process.env.EMAIL_FROM || 'your-email@gmail.com',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 900000,
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 100,

  // Client URL
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};
