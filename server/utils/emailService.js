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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Sevipure Login OTP</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #555; margin-bottom: 15px;">Your login OTP is:</p>
            <div style="background-color: #007bff; color: white; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; border-radius: 5px; letter-spacing: 5px;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 15px; text-align: center;">
              This OTP will expire in 2 minutes.<br>
              If you didn't request this, please ignore this email.
            </p>
          </div>
          <p style="text-align: center; color: #999; font-size: 12px;">
            © 2024 Sevipure. All rights reserved.
          </p>
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
