const mongoose = require('mongoose');

const bookedSeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  row: { type: String, required: true },
  col: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['standard', 'premium', 'vip'], default: 'standard' },
});

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  seatsBooked: [bookedSeatSchema],
  subtotal: { type: Number, required: true },
  convenienceFee: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'expired'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  qrCode: { type: String, default: '' },
  ticketUrl: { type: String, default: '' },
  showDate: { type: Date, required: true },
  expiresAt: { type: Date }, // for pending bookings - 5 min timeout
  cancellationDate: { type: Date },
  cancellationReason: { type: String },
  notes: { type: String, default: '' },
  bookingRef: { type: String, unique: true }, // human-readable booking ref
}, { timestamps: true });

bookingSchema.index({ userId: 1, bookingStatus: 1 });
bookingSchema.index({ showId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
