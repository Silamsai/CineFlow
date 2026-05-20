const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');

const getDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalBookings, revenueData, occupancyData, recentBookings, topMovies] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments({ bookingStatus: 'confirmed' }),
      Payment.aggregate([{ $match: { paymentStatus: 'successful' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Booking.aggregate([
        { $match: { bookingStatus: 'confirmed' } },
        { $group: { _id: '$theaterId', count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 5 },
      ]),
      Booking.find({ bookingStatus: 'confirmed' }).populate('movieId', 'title posterUrl').populate('theaterId', 'name city').sort('-createdAt').limit(10),
      Booking.aggregate([
        { $match: { bookingStatus: 'confirmed' } },
        { $group: { _id: '$movieId', bookings: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
        { $sort: { revenue: -1 } }, { $limit: 10 },
        { $lookup: { from: 'movies', localField: '_id', foreignField: '_id', as: 'movie' } },
        { $unwind: '$movie' },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalRevenue: revenueData[0]?.total || 0,
        recentBookings,
        topMovies,
      },
    });
  } catch (error) { next(error); }
};

const getRevenueAnalytics = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(); startDate.setDate(startDate.getDate() - days);
    const data = await Payment.aggregate([
      { $match: { paymentStatus: 'successful', paymentDate: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' } }, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

const getUserAnalytics = async (req, res, next) => {
  try {
    const data = await User.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }, { $limit: 30 },
    ]);
    const totalUsers = await User.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    res.json({ success: true, data: { timeline: data, totalUsers, blockedUsers } });
  } catch (error) { next(error); }
};

const getMovieAnalytics = async (req, res, next) => {
  try {
    const data = await Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      { $group: { _id: '$movieId', bookings: { $sum: 1 }, revenue: { $sum: '$totalPrice' }, seats: { $sum: { $size: '$seatsBooked' } } } },
      { $sort: { revenue: -1 } }, { $limit: 20 },
      { $lookup: { from: 'movies', localField: '_id', foreignField: '_id', as: 'movie' } },
      { $unwind: { path: '$movie', preserveNullAndEmptyArrays: true } },
    ]);
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

module.exports = { getDashboard, getRevenueAnalytics, getUserAnalytics, getMovieAnalytics };
