const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: false },
  googleId: { type: String, required: false, unique: true, sparse: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  phone: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  savedTheaters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Theater' }],
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  favoriteMovies: [{
    id: { type: String },
    title: { type: String },
    poster: { type: String },
    genre: { type: String },
  }],
  favoriteActors: [{
    name: { type: String },
    image: { type: String }
  }],
  preferences: {
    notifications: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true },
    preferredLanguage: { type: String, default: 'English' },
    preferredFormat: { type: String, default: '2D' },
  },
}, { timestamps: true });

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

module.exports = mongoose.model('User', userSchema);
