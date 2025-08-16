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
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your Login OTP - Sevipure',
      html: `
       <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
  
  <!-- Header -->
  <div style="background: #17692D; padding: 20px; text-align: center;">
    <h2 style="color: #fff; margin: 0; font-size: 24px; font-weight: 600;"> SeviPure Login OTP</h2>
  </div>
  
  <!-- Content -->
  <div style="padding: 30px; background-color: #f9fdf9;">
    <p style="font-size: 16px; color: #333; margin-bottom: 20px; text-align: center;">
      Use the OTP below to securely log in to your <strong>Sevipure</strong> account:
    </p>

    <!-- OTP Box -->
    <div style="background: #17692D; color: #fff; font-size: 28px; font-weight: bold; text-align: center; padding: 18px; border-radius: 8px; letter-spacing: 8px; margin: 0 auto; width: fit-content; box-shadow: 0 3px 10px rgba(23,105,45,0.3);">
      ${otp}
    </div>

    <!-- Expiry Info -->
    <p style="font-size: 14px; color: #555; margin-top: 25px; text-align: center; line-height: 1.6;">
      ⏳ This OTP will expire in <strong>2 minutes</strong>.<br>
      If you did not request this login, please ignore this email.
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f1f8f3; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    © 2025 <strong>Sevipure</strong>. All rights reserved.
  </div>
</div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    return false;
  }
};

// Send Order Confirmation Email
const sendOrderEmail = async (order) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM, // send to self
      subject: `New Order Placed - ${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #f9fff9; border: 1px solid #d1e7dd; border-radius: 12px; padding: 24px; color: #1b4332;">
  <h2 style="color: #2d6a4f; text-align: center; margin-bottom: 20px;"> New Order Received</h2>

  <p><b style="color:#2d6a4f;">Order ID:</b> ${order._id}</p>
  <p><b style="color:#2d6a4f;">Name:</b> ${order.contactName}</p>
  <p><b style="color:#2d6a4f;">Phone:</b> ${order.contactPhone}</p>
  <p><b style="color:#2d6a4f;">Address:</b> ${Object.values(order.address).filter(Boolean).join(', ')}</p>
  <p><b style="color:#2d6a4f;">Total Amount:</b> <span style="color:#1b4332; font-weight:bold;">₹${order.totalAmount}</span></p>

  <h3 style="color: #2d6a4f; margin-top: 20px;">🛒 Items</h3>
  <ul style="padding-left: 20px; margin: 10px 0; color: #344e41;">
    ${order.items.map(item => `<li style="margin-bottom:6px;">${item.name} x ${item.quantity} <span style="color:#2d6a4f;">(₹${item.price})</span></li>`).join('')}
  </ul>

  <p><b style="color:#2d6a4f;">Status:</b> <span style="background:#d8f3dc; padding:4px 8px; border-radius:6px; font-weight:500;">${order.status}</span></p>
  <p><b style="color:#2d6a4f;">Placed At:</b> ${new Date(order.createdAt).toLocaleString()}</p>
</div>
      `
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending order email: ', error);
    return false;
  }
};

// Send Order Delivered Email
const sendOrderDeliveredEmail = async (order, userEmail) => {
  try {
    const deliveryTime = new Date().toLocaleString();
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Your SeviPure Order #${order._id} Has Been Delivered`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #f9fff9; border: 1px solid #d1e7dd; border-radius: 12px; padding: 24px; color: #1b4332;">
  <h2 style="color: #2d6a4f; text-align: center; margin-bottom: 20px;">Order Delivered!</h2>

  <p style="font-size: 16px; color: #344e41; margin-bottom: 20px;">
    Dear ${order.contactName},<br>
    We're happy to inform you that your order has been successfully delivered!
  </p>

  <p><b style="color:#2d6a4f;">Order ID:</b> ${order._id}</p>
  <p><b style="color:#2d6a4f;">Delivered At:</b> ${deliveryTime}</p>
  <p><b style="color:#2d6a4f;">Total Amount:</b> <span style="color:#1b4332; font-weight:bold;">₹${order.totalAmount}</span></p>

  <h3 style="color: #2d6a4f; margin-top: 20px;">🛒 Items</h3>
  <ul style="padding-left: 20px; margin: 10px 0; color: #344e41;">
    ${order.items.map(item => `<li style="margin-bottom:6px;">${item.name} x ${item.quantity} <span style="color:#2d6a4f;">(₹${item.price})</span></li>`).join('')}
  </ul>

  <p><b style="color:#2d6a4f;">Shipping Address:</b> ${Object.values(order.address).filter(Boolean).join(', ')}</p>
  <p><b style="color:#2d6a4f;">Status:</b> <span style="background:#d8f3dc; padding:4px 8px; border-radius:6px; font-weight:500;">Delivered</span></p>

  <p style="font-size: 14px; color: #555; margin-top: 25px; text-align: center;">
    Thank you for choosing SeviPure! If you have any questions, contact us at <a href="mailto:support@sevipure.com" style="color:#2d6a4f;">support@sevipure.com</a>.
  </p>

  <div style="background-color: #f1f8f3; padding: 15px; text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
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
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendOrderEmail,
  sendOrderDeliveredEmail
};