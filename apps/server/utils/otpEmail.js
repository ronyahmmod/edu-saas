// utils/templates/otpEmail.js
export const otpEmailTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
    <h2 style="color: #333;">Password Reset Request</h2>
    <p>Hello,</p>
    <p>You requested to reset your password. Use the following OTP to reset it:</p>
    <h1 style="color: #2e6c80; letter-spacing: 5px;">${otp}</h1>
    <p>This OTP is valid for <b>5 minutes</b>.</p>
    <p>If you didn’t request this, please ignore this email.</p>
    <br/>
    <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} EduSaaS. All rights reserved.</p>
  </div>
`;
