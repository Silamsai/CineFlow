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
    
    // Default to today and future if no date is specified!
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);
      filter.showTime = { $gte: start, $lte: end };
    } else {
      // By default, only show today's and future shows
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      filter.showTime = { $gte: start };
    }

    let shows = await Show.find(filter)
      .populate('movieId', 'title posterUrl duration rating isHouseFull')
      .populate('theaterId', 'name city location')
      .sort('showTime');

    // Auto-generate dummy shows if none exist (useful for portfolio/demo)
    if (shows.length === 0 && movieId) {
      const Theater = require('../models/Theater');
      const Movie = require('../models/Movie');
      const movie = await Movie.findById(movieId);
      if (movie && !movie.isComingSoon) {
        const theaters = await Theater.find().limit(5); // Get a few theaters
        const newShows = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 4; i++) {
          const currentDate = new Date(today);
          currentDate.setDate(today.getDate() + i);
          
          for (const theater of theaters) {
            if (!theater.screens || theater.screens.length === 0) continue;
            const screen = theater.screens[0];
            const showFormat = movie.format?.[0] || '2D';
            const showLang = movie.language?.[0] || 'Hindi';
            
            const showHours = [10, 14, 18, 21.5];
            showHours.forEach(hour => {
              const showTime = new Date(currentDate);
              showTime.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
              
              if (showTime > new Date()) {
                const endTime = new Date(showTime);
                endTime.setMinutes(showTime.getMinutes() + (movie.duration || 150));
                
                const seatStatus = Array(screen.rows).fill(null).map(() => Array(screen.columns).fill('available'));
                newShows.push({
                  movieId: movie._id,
                  theaterId: theater._id,
                  screenId: screen._id,
                  screenName: screen.name,
                  showTime,
                  endTime,
                  format: showFormat,
                  language: showLang,
                  totalSeats: screen.totalSeats,
                  availableSeats: screen.totalSeats,
                  pricing: screen.pricing,
                  seatStatus,
                  heldSeats: [],
                });
              }
            });
          }
        }
        if (newShows.length > 0) {
          await Show.insertMany(newShows);
          shows = await Show.find(filter)
            .populate('movieId', 'title posterUrl duration rating isHouseFull')
            .populate('theaterId', 'name city location')
            .sort('showTime');
        }
      }
    }

    res.json({ success: true, data: shows });
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
