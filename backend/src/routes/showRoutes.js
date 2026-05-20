const router = require('express').Router();
const { getAllShows, getShowById, getShowSeats, createShow, updateShow, deleteShow } = require('../controllers/showController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

router.get('/', getAllShows);
router.get('/:id', getShowById);
router.get('/:id/seats', getShowSeats);
router.post('/', requireAuth, requireAdmin, createShow);
router.put('/:id', requireAuth, requireAdmin, updateShow);
router.delete('/:id', requireAuth, requireAdmin, deleteShow);

module.exports = router;
