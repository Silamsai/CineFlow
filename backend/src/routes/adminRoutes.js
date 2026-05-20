const router = require('express').Router();
const { getDashboard, getRevenueAnalytics, getUserAnalytics, getMovieAnalytics } = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

router.use(requireAuth, requireAdmin);
router.get('/dashboard', getDashboard);
router.get('/revenue', getRevenueAnalytics);
router.get('/users', getUserAnalytics);
router.get('/movies', getMovieAnalytics);

module.exports = router;
