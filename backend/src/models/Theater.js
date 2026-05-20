const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  rows: { type: Number, required: true },
  columns: { type: Number, required: true },
  seatLayout: [[{ type: String }]], // 2D array: 'standard' | 'premium' | 'vip' | 'blocked'
  pricing: {
    standard: { type: Number, default: 150 },
    premium: { type: Number, default: 250 },
    vip: { type: Number, default: 400 },
  },
});

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  screens: [screenSchema],
  amenities: [{ type: String }],
  operatingHours: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '23:59' },
  },
  contactNumber: { type: String, default: '' },
  email: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Theater', theaterSchema);
