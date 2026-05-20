const router = require('express').Router();
const { getAllMovies, getMovieById, getTrendingMovies, searchMovies, getMovieReviews, addReview, createMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

router.get('/', getAllMovies);
router.get('/trending', getTrendingMovies);
router.get('/search', searchMovies);
router.get('/:id', getMovieById);
router.get('/:id/reviews', getMovieReviews);
router.post('/:id/reviews', requireAuth, addReview);

// Admin
router.post('/admin', requireAuth, requireAdmin, createMovie);
router.put('/admin/:id', requireAuth, requireAdmin, updateMovie);
router.delete('/admin/:id', requireAuth, requireAdmin, deleteMovie);

module.exports = router;
