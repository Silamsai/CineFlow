const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// AUTH controllers
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ firstName, lastName, email, password: hashedPassword });
    
    const token = generateToken(user._id);
    const { password: _, ...userData } = user._doc;
    res.json({ success: true, token, user: userData });
  } catch (error) { next(error); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    
    const token = generateToken(user._id);
    const { password: _, ...userData } = user._doc;
    res.json({ success: true, token, user: userData });
  } catch (error) { next(error); }
};

const googleLogin = async (req, res, next) => {
  try {
    // The frontend sends the Google profile data after decoding the JWT
    const { email, given_name, family_name, picture, sub } = req.body;
    
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        googleId: sub,
        firstName: given_name,
        lastName: family_name || '',
        profileImage: picture || '',
      });
    } else if (!user.googleId) {
      user.googleId = sub;
      if (!user.profileImage && picture) user.profileImage = picture;
      await user.save();
    }
    
    const token = generateToken(user._id);
    const { password: _, ...userData } = user._doc;
    res.json({ success: true, token, user: userData });
  } catch (error) { next(error); }
};

const getProfile = async (req, res, next) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, preferences, profileImage, picture, favoriteMovies, favoriteActors } = req.body;
    const finalImage = profileImage || picture;
    const updateData = { firstName, lastName, phone, preferences };
    if (finalImage !== undefined) {
      updateData.profileImage = finalImage;
    }
    if (favoriteMovies !== undefined) {
      updateData.favoriteMovies = favoriteMovies;
    }
    if (favoriteActors !== undefined) {
      updateData.favoriteActors = favoriteActors;
    }
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

const addToWatchlist = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { $addToSet: { watchlist: req.params.movieId } }, { new: true });
    res.json({ success: true, data: user.watchlist });
  } catch (error) { next(error); }
};

const removeFromWatchlist = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { $pull: { watchlist: req.params.movieId } }, { new: true });
    res.json({ success: true, data: user.watchlist });
  } catch (error) { next(error); }
};

const saveTheater = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedTheaters: req.params.theaterId } }, { new: true });
    res.json({ success: true, data: user.savedTheaters });
  } catch (error) { next(error); }
};

const removeTheater = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { $pull: { savedTheaters: req.params.theaterId } }, { new: true });
    res.json({ success: true, data: user.savedTheaters });
  } catch (error) { next(error); }
};

// ADMIN controllers
const getAllUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(filter).sort('-createdAt').skip(skip).limit(parseInt(limit));
    const total = await User.countDocuments(filter);

    const usersWithStats = await Promise.all(users.map(async (u) => {
      const [bookingCount, payments] = await Promise.all([
        Booking.countDocuments({ userId: u._id, bookingStatus: 'confirmed' }),
        Payment.aggregate([
          { $match: { userId: u._id, paymentStatus: 'successful' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
      ]);
      return {
        ...u.toObject(),
        bookingCount,
        totalSpent: payments[0]?.total || 0
      };
    }));

    res.json({ success: true, data: usersWithStats, total });
  } catch (error) { next(error); }
};

const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('watchlist', 'title posterUrl').populate('savedTheaters', 'name city');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const [bookings, spent] = await Promise.all([
      Booking.find({ userId: req.params.id }).populate('movieId', 'title').sort('-createdAt').limit(5),
      Payment.aggregate([{ $match: { userId: user._id, paymentStatus: 'successful' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);
    res.json({ success: true, data: { user, recentBookings: bookings, totalSpent: spent[0]?.total || 0 } });
  } catch (error) { next(error); }
};

const blockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    res.json({ success: true, message: 'User blocked', data: user });
  } catch (error) { next(error); }
};

const unblockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    res.json({ success: true, message: 'User unblocked', data: user });
  } catch (error) { next(error); }
};

const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};

module.exports = { register, login, googleLogin, getProfile, updateProfile, addToWatchlist, removeFromWatchlist, saveTheater, removeTheater, getAllUsers, getUserDetails, blockUser, unblockUser, deleteUser };
