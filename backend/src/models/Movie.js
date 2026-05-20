const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  genre: [{ type: String, required: true }],
  director: { type: String, required: true },
  cast: [{ type: String }],
  duration: { type: Number, required: true }, // in minutes
  releaseDate: { type: Date, default: Date.now },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  language: [{ type: String, required: true }],
  format: [{ type: String, enum: ['2D', '3D', 'IMAX', '4DX', 'Dolby', 'ICE'], required: true }],
  posterUrl: { type: String, default: '' },
  bannerUrl: { type: String, default: '' },
  trailerUrl: { type: String, default: '' },
  cloudinaryPosterPublicId: { type: String, default: '' },
  cloudinaryBannerPublicId: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isHot: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isHouseFull: { type: Boolean, default: false },
  isComingSoon: { type: Boolean, default: false },
  totalReviews: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  certificate: { type: String, enum: ['U', 'UA', 'U/A', 'A', 'S', 'PG-13'], default: 'UA' },
  country: { type: String, default: 'India' },
  tags: [{ type: String }],
}, { timestamps: true });

movieSchema.index({ title: 'text', description: 'text', genre: 'text' }, { language_override: 'none' });

module.exports = mongoose.model('Movie', movieSchema);
