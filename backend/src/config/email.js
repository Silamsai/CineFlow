const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'CineFlow <noreply@cineflow.com>',
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email send failed: ${error.message}`);
    throw error;
  }
};

const bookingConfirmationEmail = (booking, movie, theater) => ({
  subject: `🎬 Booking Confirmed — ${movie.title} | CineFlow`,
  html: `
    <div style="font-family:Inter,sans-serif;background:#0a0a0a;color:#F5F5F5;padding:32px;border-radius:12px;max-width:600px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#D4AF37;font-size:28px;margin:0;">🎬 CineFlow</h1>
        <p style="color:#9ca3af;margin:8px 0 0;">Your booking is confirmed!</p>
      </div>
      <div style="background:#1a1a1a;border-radius:12px;padding:24px;border:1px solid #2a2a2a;">
        <h2 style="color:#F5F5F5;margin:0 0 16px;">${movie.title}</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#9ca3af;padding:6px 0;">📍 Theater</td><td style="color:#F5F5F5;text-align:right;">${theater.name}, ${theater.city}</td></tr>
          <tr><td style="color:#9ca3af;padding:6px 0;">🎟️ Seats</td><td style="color:#F5F5F5;text-align:right;">${booking.seatsBooked.map(s => s.seatNumber).join(', ')}</td></tr>
          <tr><td style="color:#9ca3af;padding:6px 0;">💰 Total</td><td style="color:#D4AF37;text-align:right;font-weight:bold;">₹${booking.totalPrice}</td></tr>
          <tr><td style="color:#9ca3af;padding:6px 0;">🔖 Ref</td><td style="color:#F5F5F5;text-align:right;font-family:monospace;">${booking.bookingRef}</td></tr>
        </table>
      </div>
      <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:24px;">Show your QR code at the theater entrance. Enjoy the show! 🍿</p>
    </div>
  `,
});

module.exports = { sendEmail, bookingConfirmationEmail };
