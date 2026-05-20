const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  screenId: { type: mongoose.Schema.Types.ObjectId, required: true },
  screenName: { type: String, default: '' },
  showTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  format: { type: String, enum: ['2D', '3D', 'IMAX', '4DX'], required: true },
  language: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  pricing: {
    standard: { type: Number, required: true },
    premium: { type: Number, required: true },
    vip: { type: Number, required: true },
  },
  // seatStatus is a 2D array: 'available' | 'booked' | 'held' | 'blocked'
  seatStatus: [[{ type: String, default: 'available' }]],
  heldSeats: [{
    seatNumber: String,
    userId: String,
    expiresAt: Date,
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

showSchema.index({ movieId: 1, theaterId: 1, showTime: 1 });

module.exports = mongoose.model('Show', showSchema);
