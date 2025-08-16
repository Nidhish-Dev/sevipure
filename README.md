# SeviPure - Organic Products E-commerce Platform

A modern e-commerce platform built with React, TypeScript, and Node.js, featuring OTP-based authentication and comprehensive cart management.

## Features

### 🔐 Authentication System
- **OTP-based Login**: Secure 5-digit OTP sent via email with 2-minute expiry
- **Auto-logout**: 30-day JWT token with automatic logout
- **Resend OTP**: Available after 1 minute with countdown timer
- **Email & Phone Validation**: Comprehensive validation during signup

### 🛒 Cart Management
- **User-specific Carts**: Each user has their own cart
- **Real-time Updates**: Cart updates reflect immediately across the app
- **Authentication Required**: Unauthenticated users are redirected to login
- **Persistent Storage**: Cart data persists in MongoDB

### 👤 User Profile
- **Editable Fields**: Full name and address can be updated
- **Read-only Fields**: Email and phone number cannot be changed
- **Address Management**: Complete address with street, city, state, ZIP, and country

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on all devices
- **Shadcn/ui Components**: Beautiful, accessible UI components
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Smooth user experience with loading indicators

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Nodemailer** for email services
- **bcryptjs** for password hashing
- **Validator** for input validation

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Gmail account for email services

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sevipure
```

### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure Environment Variables** (`.env`):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sevipure
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
CLIENT_URL=http://localhost:5173
```

**Gmail Setup**:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS`

### 3. Frontend Setup
```bash
cd client

# Install dependencies
npm install
```

### 4. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

### 5. Run the Application

**Terminal 1 - Backend**:
```bash
cd server
npm start
```

**Terminal 2 - Frontend**:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/send-otp` - Send login OTP
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/resend-otp` - Resend OTP
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Cart Management
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

## Database Models

### User
- Full name, email, phone, password
- Address (street, city, state, ZIP, country)
- Email and phone verification status
- Last login timestamp

### OTP
- Email, OTP code, expiry time
- Attempt tracking and automatic cleanup

### Cart
- User ID, items array, total amount
- Automatic total calculation

### Product
- Basic product information for cart functionality

## Usage Examples

### User Registration
1. Navigate to `/signup`
2. Fill in personal information (Step 1)
3. Fill in address information (Step 2)
4. Account created successfully

### User Login
1. Navigate to `/login`
2. Enter email address
3. Check email for 5-digit OTP
4. Enter OTP to complete login
5. Use resend button if needed (after 1 minute)

### Adding to Cart
1. Browse products
2. Click "Add to Cart" button
3. If not logged in, redirected to login
4. After login, item added to cart
5. Cart count updates in navbar

### Profile Management
1. Click on your name in navbar
2. Select "Profile" from dropdown
3. Click "Edit" to modify information
4. Save changes or cancel

## Security Features

- **JWT Tokens**: Secure authentication with 30-day expiry
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Comprehensive validation on all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured CORS for security

## Development

### Project Structure
```
sevipure/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── package.json
└── README.md
```

### Adding New Features
1. **Backend**: Add models, controllers, and routes
2. **Frontend**: Create components and integrate with contexts
3. **Testing**: Test API endpoints and UI interactions
4. **Documentation**: Update this README

## Troubleshooting

### Common Issues

**Email Not Sending**:
- Check Gmail app password configuration
- Verify email credentials in `.env`
- Check Gmail security settings

**MongoDB Connection Failed**:
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access

**Frontend Build Errors**:
- Clear `node_modules` and reinstall
- Check TypeScript configuration
- Verify all dependencies are installed

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
