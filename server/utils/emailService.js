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

module.exports = {
  sendOTPEmail
};
