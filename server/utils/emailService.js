const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
      throw new Error('Missing email environment variables');
    }
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your Login OTP - Sevipure',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="background: #17692D; padding: 20px; text-align: center;">
            <h2 style="color: #fff; margin: 0; font-size: 24px; font-weight: 600;">SeviPure Login OTP</h2>
          </div>
          <div style="padding: 30px; background-color: #f9fdf9;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px; text-align: center;">
              Use the OTP below to securely log in to your <strong>Sevipure</strong> account:
            </p>
            <div style="background: #17692D; color: #fff; font-size: 28px; font-weight: bold; text-align: center; padding: 18px; border-radius: 8px; letter-spacing: 8px; margin: 0 auto; width: fit-content; box-shadow: 0 3px 10px rgba(23,105,45,0.3);">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #555; margin-top: 25px; text-align: center; line-height: 1.6;">
              ⏳ This OTP will expire in <strong>5 minutes</strong>.<br>
              If you did not request this login, please ignore this email.
            </p>
          </div>
          <div style="background-color: #f1f8f3; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            © 2025 <strong>SeviPure</strong>. All rights reserved.
          </div>
        </div>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email: ', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

// Send Order Confirmation Email (to admin)
const sendOrderEmail = async (order, user) => {
  try {
    if (!process.env.EMAIL_FROM) {
      throw new Error('Missing EMAIL_FROM environment variable');
    }
    const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ');
    const address = Object.values(order.address).filter(Boolean).join(', ');
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM,
      subject: `New Order Placed - ${order._id}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="background: #17692D; padding: 20px; text-align: center;">
            <h2 style="color: #fff; margin: 0; font-size: 24px; font-weight: 600;">New Order Received</h2>
          </div>
          <div style="padding: 30px; background-color: #f9fdf9;">
            <p><b style="color:#2d6a4f;">Order ID:</b> ${order._id}</p>
            <p><b style="color:#2d6a4f;">Name:</b> ${order.contactName}</p>
            <p><b style="color:#2d6a4f;">Email:</b> ${user.email}</p>
            <p><b style="color:#2d6a4f;">Phone:</b> ${order.contactPhone}</p>
            <p><b style="color:#2d6a4f;">Address:</b> ${address}</p>
            <p><b style="color:#2d6a4f;">Total Amount:</b> <span style="color:#1b4332; font-weight:bold;">₹${order.totalAmount}</span></p>
            <h3 style="color: #2d6a4f; margin-top: 20px;">🛒 Items</h3>
            <ul style="padding-left: 20px; margin: 10px 0; color: #344e41;">
              ${order.items.map(item => `<li style="margin-bottom:6px;">${item.name} x ${item.quantity} <span style="color:#2d6a4f;">(₹${item.price})</span></li>`).join('')}
            </ul>
            <p><b style="color:#2d6a4f;">Status:</b> <span style="background:#d8f3dc; padding:4px 8px; border-radius:6px; font-weight:500;">${order.status}</span></p>
            <p><b style="color:#2d6a4f;">Placed At:</b> ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
          <div style="background-color: #f1f8f3; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            © 2025 <strong>SeviPure</strong>. All rights reserved.
          </div>
        </div>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending order email: ', error);
    throw new Error(`Failed to send order email: ${error.message}`);
  }
};

// Send Order Delivered Email (to user)
const sendOrderDeliveredEmail = async (order, user) => {
  try {
    if (!process.env.EMAIL_FROM) {
      throw new Error('Missing EMAIL_FROM environment variable');
    }
    const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ');
    const address = Object.values(order.address).filter(Boolean).join(', ');
    const deliveryTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Your SeviPure Order #${order._id} Has Been Delivered`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="background: #17692D; padding: 20px; text-align: center;">
            <h2 style="color: #fff; margin: 0; font-size: 24px; font-weight: 600;">Order Delivered!</h2>
          </div>
          <div style="padding: 30px; background-color: #f9fdf9;">
            <p style="font-size: 16px; color: #344e41; margin-bottom: 20px;">
              Dear ${fullName},<br>
              We're thrilled to inform you that your SeviPure order has been successfully delivered!
            </p>
            <h3 style="color: #2d6a4f; margin-top: 20px;">Order Details</h3>
            <p><b style="color:#2d6a4f;">Order ID:</b> ${order._id}</p>
            <p><b style="color:#2d6a4f;">Name:</b> ${fullName}</p>
            <p><b style="color:#2d6a4f;">Email:</b> ${user.email}</p>
            <p><b style="color:#2d6a4f;">Phone:</b> ${user.phone}</p>
            <p><b style="color:#2d6a4f;">Shipping Address:</b> ${address}</p>
            <p><b style="color:#2d6a4f;">Total Amount:</b> <span style="color:#1b4332; font-weight:bold;">₹${order.totalAmount}</span></p>
            <p><b style="color:#2d6a4f;">Delivered At:</b> ${deliveryTime}</p>
            <h3 style="color: #2d6a4f; margin-top: 20px;">🛒 Items</h3>
            <ul style="padding-left: 20px; margin: 10px 0; color: #344e41;">
              ${order.items.map(item => `<li style="margin-bottom:6px;">${item.name} x ${item.quantity} <span style="color:#2d6a4f;">(₹${item.price})</span></li>`).join('')}
            </ul>
            <p><b style="color:#2d6a4f;">Status:</b> <span style="background:#d8f3dc; padding:4px 8px; border-radius:6px; font-weight:500;">Delivered</span></p>
            <p style="font-size: 14px; color: #555; margin-top: 25px; text-align: center;">
              Thank you for choosing SeviPure! If you have any questions, contact us at <a href="mailto:sevipure@gmail.com" style="color:#2d6a4f;">sevipure@gmail.com</a>.
            </p>
          </div>
          <div style="background-color: #f1f8f3; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            © 2025 <strong>SeviPure</strong>. All rights reserved.
          </div>
        </div>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Delivery email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending delivery email: ', error);
    throw new Error(`Failed to send delivery email: ${error.message}`);
  }
};

// Send New User Email (to admin)
const sendNewUserEmail = async (user) => {
  try {
    if (!process.env.EMAIL_FROM) {
      throw new Error('Missing EMAIL_FROM environment variable');
    }
    const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ');
    const address = ['flatHouseNo', 'areaStreet', 'landmark', 'city', 'state', 'zipCode', 'country']
      .map(key => user.address[key])
      .filter(Boolean)
      .join(', ');
    const signupTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM,
      subject: `New User Signup - ${fullName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="background: #17692D; padding: 20px; text-align: center;">
            <h2 style="color: #fff; margin: 0; font-size: 24px; font-weight: 600;">New User Registered</h2>
          </div>
          <div style="padding: 30px; background-color: #f9fdf9;">
            <p style="font-size: 16px; color: #344e41; margin-bottom: 20px;">
              A new user has signed up for SeviPure. Below are their details:
            </p>
            <h3 style="color: #2d6a4f; margin-top: 20px;">User Details</h3>
            <p><b style="color:#2d6a4f;">Name:</b> ${fullName}</p>
            <p><b style="color:#2d6a4f;">Email:</b> ${user.email}</p>
            <p><b style="color:#2d6a4f;">Phone:</b> ${user.phone}</p>
            <p><b style="color:#2d6a4f;">Address:</b> ${address}</p>
            <p><b style="color:#2d6a4f;">Signup Time:</b> ${signupTime}</p>
            <p style="font-size: 14px; color: #555; margin-top: 25px; text-align: center;">
              This is an automated notification. Please do not reply directly to this email.
            </p>
          </div>
          <div style="background-color: #f1f8f3; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            © 2025 <strong>SeviPure</strong>. All rights reserved.
          </div>
        </div>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('New user email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending new user email: ', error);
    throw new Error(`Failed to send new user email: ${error.message}`);
  }
};

// Send Order Placed Email (to user)
const sendOrderPlacedEmail = async (order, user) => {
  try {
    if (!process.env.EMAIL_FROM) {
      throw new Error('Missing EMAIL_FROM environment variable');
    }
    const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ');
    const address = ['flatHouseNo', 'areaStreet', 'landmark', 'city', 'state', 'zipCode', 'country']
      .map(key => order.address[key])
      .filter(Boolean)
      .join(', ');
    const placedTime = new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Your SeviPure Order #${order._id} Has Been Placed`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="background: #17692D; padding: 20px; text-align: center;">
            <h2 style="color: #fff; margin: 0; font-size: 24px; font-weight: 600;">Order Placed!</h2>
          </div>
          <div style="padding: 30px; background-color: #f9fdf9;">
            <p style="font-size: 16px; color: #344e41; margin-bottom: 20px;">
              Dear ${fullName},<br>
              Thank you for your order with SeviPure! Your order has been successfully placed. Below are the details:
            </p>
            <h3 style="color: #2d6a4f; margin-top: 20px;">Order Details</h3>
            <p><b style="color:#2d6a4f;">Order ID:</b> ${order._id}</p>
            <p><b style="color:#2d6a4f;">Name:</b> ${order.contactName}</p>
            <p><b style="color:#2d6a4f;">Email:</b> ${user.email}</p>
            <p><b style="color:#2d6a4f;">Phone:</b> ${order.contactPhone}</p>
            <p><b style="color:#2d6a4f;">Shipping Address:</b> ${address}</p>
            <p><b style="color:#2d6a4f;">Total Amount:</b> <span style="color:#1b4332; font-weight:bold;">₹${order.totalAmount}</span></p>
            <p><b style="color:#2d6a4f;">Placed At:</b> ${placedTime}</p>
            <h3 style="color: #2d6a4f; margin-top: 20px;">🛒 Items</h3>
            <ul style="padding-left: 20px; margin: 10px 0; color: #344e41;">
              ${order.items.map(item => `<li style="margin-bottom:6px;">${item.name} x ${item.quantity} <span style="color:#2d6a4f;">(₹${item.price})</span></li>`).join('')}
            </ul>
            <p><b style="color:#2d6a4f;">Status:</b> <span style="background:#d8f3dc; padding:4px 8px; border-radius:6px; font-weight:500;">${order.status}</span></p>
            <p style="font-size: 14px; color: #555; margin-top: 25px; text-align: center;">
              We'll notify you once your order is shipped. If you have any questions, contact us at <a href="mailto:sevipure@gmail.com" style="color:#2d6a4f;">sevipure@gmail.com</a>.
            </p>
          </div>
          <div style="background-color: #f1f8f3; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            © 2025 <strong>SeviPure</strong>. All rights reserved.
          </div>
        </div>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Order placed email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending order placed email: ', error);
    throw new Error(`Failed to send order placed email: ${error.message}`);
  }
};

module.exports = {
  sendOTPEmail,
  sendOrderEmail,
  sendOrderDeliveredEmail,
  sendNewUserEmail,
  sendOrderPlacedEmail
};