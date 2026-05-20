const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Payment = require('../models/Payment');
const qrcode = require('qrcode');
const crypto = require('crypto');

const generateBookingRef = () => 'CF' + crypto.randomBytes(4).toString('hex').toUpperCase();

// POST /api/bookings - Create booking (pending, hold seats for 5 min)
const createBooking = async (req, res, next) => {
  try {
    const { showId, seatsBooked } = req.body;
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });

    const subtotal = seatsBooked.reduce((sum, s) => sum + s.price, 0);
    const convenienceFee = Math.round(subtotal * 0.05);
    const taxes = Math.round(subtotal * 0.18);
    const totalPrice = subtotal + convenienceFee + taxes;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const booking = await Booking.create({
      userId: req.user._id,
      showId,
      movieId: show.movieId,
      theaterId: show.theaterId,
      seatsBooked,
      subtotal,
      convenienceFee,
      taxes,
      totalPrice,
      showDate: show.showTime,
      expiresAt,
      bookingRef: generateBookingRef(),
    });

    // Hold seats in Show doc
    const heldSeats = seatsBooked.map(s => ({ seatNumber: s.seatNumber, userId: req.user._id, expiresAt }));
    await Show.findByIdAndUpdate(showId, { $push: { heldSeats: { $each: heldSeats } }, $inc: { availableSeats: -seatsBooked.length } });

    res.status(201).json({ success: true, data: booking });
  } catch (error) { next(error); }
};

// GET /api/bookings/user/my-bookings
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('movieId', 'title posterUrl duration')
      .populate('theaterId', 'name city')
      .populate('showId', 'showTime format language')
      .sort('-createdAt');
    res.json({ success: true, data: bookings });
  } catch (error) { next(error); }
};

// GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movieId')
      .populate('theaterId')
      .populate('showId');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: booking });
  } catch (error) { next(error); }
};

// PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }
    booking.bookingStatus = 'cancelled';
    booking.cancellationDate = new Date();
    booking.cancellationReason = req.body.reason || 'User requested';
    await booking.save();
    // Release seats
    await Show.findByIdAndUpdate(booking.showId, {
      $pull: { heldSeats: { seatNumber: { $in: booking.seatsBooked.map(s => s.seatNumber) } } },
      $inc: { availableSeats: booking.seatsBooked.length },
    });
    res.json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (error) { next(error); }
};

// Confirm booking after successful payment (internal)
const confirmBooking = async (bookingId, paymentId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');
  const qrData = JSON.stringify({ bookingRef: booking.bookingRef, bookingId: booking._id });
  const qrCode = await qrcode.toDataURL(qrData);
  booking.bookingStatus = 'confirmed';
  booking.paymentStatus = 'completed';
  booking.paymentId = paymentId;
  booking.qrCode = qrCode;
  await booking.save();
  // Mark seats as booked in Show
  await Show.findByIdAndUpdate(booking.showId, {
    $pull: { heldSeats: { seatNumber: { $in: booking.seatsBooked.map(s => s.seatNumber) } } },
  });
  return booking;
};

// ADMIN: GET /api/admin/bookings
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.bookingStatus = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('movieId', 'title posterUrl')
        .populate('theaterId', 'name city')
        .populate('userId', 'firstName lastName email')
        .populate('showId', 'showTime format language')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(filter),
    ]);
    res.json({ success: true, data: bookings, total });
  } catch (error) { next(error); }
};

// ADMIN: GET /api/admin/bookings/stats
const getBookingStats = async (req, res, next) => {
  try {
    const stats = await Booking.aggregate([
      { $group: { _id: '$bookingStatus', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
    ]);
    res.json({ success: true, data: stats });
  } catch (error) { next(error); }
};

module.exports = { createBooking, getMyBookings, getBookingById, cancelBooking, confirmBooking, getAllBookings, getBookingStats };
