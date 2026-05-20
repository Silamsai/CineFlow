const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { confirmBooking } = require('./bookingController');
const logger = require('../utils/logger');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const initiatePayment = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.userId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    const amountPaise = Math.round(booking.totalPrice * 100);
    const order = await razorpay.orders.create({ amount: amountPaise, currency: 'INR', receipt: booking.bookingRef });
    const payment = await Payment.create({ bookingId, userId: req.user._id, amount: booking.totalPrice, currency: 'INR', gateway: 'razorpay', gatewayOrderId: order.id });
    res.json({ success: true, data: { orderId: order.id, amount: amountPaise, currency: 'INR', paymentId: payment._id, key: process.env.RAZORPAY_KEY_ID } });
  } catch (error) { next(error); }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, paymentId } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    if (expectedSig !== razorpay_signature) {
      await Payment.findByIdAndUpdate(paymentId, { paymentStatus: 'failed' });
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    const payment = await Payment.findByIdAndUpdate(paymentId, { gatewayPaymentId: razorpay_payment_id, gatewaySignature: razorpay_signature, paymentStatus: 'successful', paymentDate: new Date() }, { new: true });
    const booking = await confirmBooking(bookingId, payment._id);
    res.json({ success: true, message: 'Payment verified', data: { booking, payment } });
  } catch (error) { next(error); }
};

const handleWebhook = async (req, res) => {
  logger.info(`Webhook event: ${req.body.event}`);
  res.json({ success: true });
};

const getAllPayments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.paymentStatus = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [payments, total] = await Promise.all([
      Payment.find(filter).populate('bookingId', 'bookingRef totalPrice').populate('userId', 'firstName lastName email').sort('-createdAt').skip(skip).limit(parseInt(limit)),
      Payment.countDocuments(filter),
    ]);
    res.json({ success: true, data: payments, total });
  } catch (error) { next(error); }
};

const processRefund = async (req, res, next) => {
  try {
    const { amount, reason } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    const refund = await razorpay.payments.refund(payment.gatewayPaymentId, { amount: Math.round(amount * 100) });
    await Payment.findByIdAndUpdate(req.params.id, { refundId: refund.id, refundStatus: 'pending', refundAmount: amount, refundReason: reason });
    res.json({ success: true, message: 'Refund initiated', data: refund });
  } catch (error) { next(error); }
};

const getPaymentStats = async (req, res, next) => {
  try {
    const stats = await Payment.aggregate([
      { $match: { paymentStatus: 'successful' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' } }, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }, { $limit: 30 },
    ]);
    const total = await Payment.aggregate([
      { $match: { paymentStatus: 'successful' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    res.json({ success: true, data: { timeline: stats, summary: total[0] || {} } });
  } catch (error) { next(error); }
};

module.exports = { initiatePayment, verifyPayment, handleWebhook, getAllPayments, processRefund, getPaymentStats };
