const router = require('express').Router();
const { register, login, googleLogin, getProfile, updateProfile, addToWatchlist, removeFromWatchlist, saveTheater, removeTheater, getAllUsers, getUserDetails, blockUser, unblockUser, deleteUser } = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Auth (Public)
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);

router.get('/me', requireAuth, getProfile);
router.put('/me', requireAuth, updateProfile);
router.post('/me/watchlist/:movieId', requireAuth, addToWatchlist);
router.delete('/me/watchlist/:movieId', requireAuth, removeFromWatchlist);
router.post('/me/theaters/:theaterId', requireAuth, saveTheater);
router.delete('/me/theaters/:theaterId', requireAuth, removeTheater);

// Admin
router.get('/admin/all', requireAuth, requireAdmin, getAllUsers);
router.get('/admin/:id', requireAuth, requireAdmin, getUserDetails);
router.put('/admin/:id/block', requireAuth, requireAdmin, blockUser);
router.put('/admin/:id/unblock', requireAuth, requireAdmin, unblockUser);
router.delete('/admin/:id', requireAuth, requireAdmin, deleteUser);

module.exports = router;
