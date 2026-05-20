const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentMethod: {
    type: String,
    enum: ['card', 'wallet', 'upi', 'net_banking', 'unknown'],
    default: 'unknown',
  },
  gateway: { type: String, enum: ['stripe', 'razorpay', 'mock'], default: 'razorpay' },
  transactionId: { type: String, unique: true, sparse: true },
  gatewayOrderId: { type: String },
  gatewayPaymentId: { type: String },
  gatewaySignature: { type: String },
  paymentStatus: {
    type: String,
    enum: ['pending', 'successful', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending',
  },
  paymentDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  refundId: { type: String },
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'completed', 'failed'],
    default: 'none',
  },
  refundAmount: { type: Number, default: 0 },
  refundReason: { type: String, default: '' },
  attemptCount: { type: Number, default: 1 },
  paymentDate: { type: Date },
  refundDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
