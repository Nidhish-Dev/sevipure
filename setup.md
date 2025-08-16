# Setup Guide

## Environment Configuration

Create a `.env` file in the `server/` directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sevipure
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
CLIENT_URL=http://localhost:5173
```

## Gmail Setup for OTP

1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings > Security
3. Generate an App Password
4. Use the App Password in `EMAIL_PASS` (not your regular password)

## MongoDB Setup

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service: `mongod`
3. Database will be created automatically

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com/atlas
2. Create a new cluster
3. Get connection string and replace `MONGODB_URI`

## Running the Application

1. **Start MongoDB**
2. **Start Backend**: `cd server && npm start`
3. **Start Frontend**: `cd client && npm run dev`

## Testing the Setup

1. Visit http://localhost:5173
2. Try to sign up with a new account
3. Check your email for OTP
4. Login with the OTP
5. Test adding items to cart
6. Update your profile

## Troubleshooting

- **Email not sending**: Check Gmail app password and 2FA
- **MongoDB connection failed**: Ensure MongoDB is running
- **Frontend errors**: Check all dependencies are installed
