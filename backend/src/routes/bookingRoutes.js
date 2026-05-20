const router = require('express').Router();
const { createBooking, getMyBookings, getBookingById, cancelBooking, getAllBookings, getBookingStats } = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

router.post('/', requireAuth, createBooking);
router.get('/user/my-bookings', requireAuth, getMyBookings);
router.get('/:id', requireAuth, getBookingById);
router.put('/:id/cancel', requireAuth, cancelBooking);

// Admin
router.get('/admin/all', requireAuth, requireAdmin, getAllBookings);
router.get('/admin/stats', requireAuth, requireAdmin, getBookingStats);

module.exports = router;
