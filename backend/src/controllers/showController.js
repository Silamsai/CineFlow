const Show = require('../models/Show');
const Booking = require('../models/Booking');

const ROWS = ['A','B','C','D','E','F','G','H','I','J'];
const COLS = 12;

const buildSeatStatus = async (show) => {
  // Initialize 10x12 2D array with 'available'
  const seatStatus = Array.from({ length: ROWS.length }, () => 
    Array.from({ length: COLS }, () => 'available')
  );

  // Get all confirmed bookings for this show
  const bookings = await Booking.find({ showId: show._id, bookingStatus: 'confirmed' });
  for (const booking of bookings) {
    for (const seat of booking.seatsBooked) {
      const rowIndex = ROWS.indexOf(seat.row);
      const colIndex = seat.col - 1;
      if (rowIndex !== -1 && colIndex >= 0 && colIndex < COLS) {
        seatStatus[rowIndex][colIndex] = 'booked';
      }
    }
  }

  // Get active held seats
  const now = new Date();
  const activeHolds = (show.heldSeats || []).filter(h => h.expiresAt > now);
  for (const hold of activeHolds) {
    const seatId = hold.seatNumber;
    const row = seatId[0];
    const colVal = parseInt(seatId.substring(1));
    const rowIndex = ROWS.indexOf(row);
    const colIndex = colVal - 1;
    if (rowIndex !== -1 && colIndex >= 0 && colIndex < COLS) {
      if (seatStatus[rowIndex][colIndex] === 'available') {
        seatStatus[rowIndex][colIndex] = 'held';
      }
    }
  }

  return seatStatus;
};

const getAllShows = async (req, res, next) => {
  try {
    const { movieId, theaterId, date, format, language } = req.query;
    const filter = { isActive: true };
    if (movieId) filter.movieId = movieId;
    if (theaterId) filter.theaterId = theaterId;
    if (format) filter.format = format;
    if (language) filter.language = language;
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);
      filter.showTime = { $gte: start, $lte: end };
    }
    const shows = await Show.find(filter)
      .populate('movieId', 'title posterUrl duration rating isHouseFull')
      .populate('theaterId', 'name city location')
      .sort('showTime');

    // Dynamically calculate available seats for each show
    const showsWithSeats = [];
    for (const show of shows) {
      const showObj = show.toObject();
      const seatStatus = await buildSeatStatus(show);
      let bookedCount = 0;
      for (const row of seatStatus) {
        for (const seat of row) {
          if (seat === 'booked' || seat === 'held') bookedCount++;
        }
      }
      showObj.availableSeats = Math.max(0, show.totalSeats - bookedCount);
      showsWithSeats.push(showObj);
    }

    res.json({ success: true, data: showsWithSeats });
  } catch (error) { next(error); }
};

const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('theaterId');
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });
    
    const showObj = show.toObject();
    showObj.seatStatus = await buildSeatStatus(show);
    
    let bookedCount = 0;
    for (const row of showObj.seatStatus) {
      for (const seat of row) {
        if (seat === 'booked' || seat === 'held') bookedCount++;
      }
    }
    showObj.availableSeats = Math.max(0, show.totalSeats - bookedCount);
    
    res.json({ success: true, data: showObj });
  } catch (error) { next(error); }
};

const getShowSeats = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });
    
    const seatStatus = await buildSeatStatus(show);
    let bookedCount = 0;
    for (const row of seatStatus) {
      for (const seat of row) {
        if (seat === 'booked' || seat === 'held') bookedCount++;
      }
    }
    const availableSeats = Math.max(0, show.totalSeats - bookedCount);
    
    res.json({
      success: true,
      data: {
        seatStatus,
        heldSeats: show.heldSeats.filter(h => h.expiresAt > new Date()),
        pricing: show.pricing,
        totalSeats: show.totalSeats,
        availableSeats
      }
    });
  } catch (error) { next(error); }
};

const createShow = async (req, res, next) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json({ success: true, data: show });
  } catch (error) { next(error); }
};

const updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });
    res.json({ success: true, data: show });
  } catch (error) { next(error); }
};

const deleteShow = async (req, res, next) => {
  try {
    await Show.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Show deleted' });
  } catch (error) { next(error); }
};

module.exports = { getAllShows, getShowById, getShowSeats, createShow, updateShow, deleteShow };
