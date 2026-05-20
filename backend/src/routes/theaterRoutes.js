const router = require('express').Router();
const { getAllTheaters, getTheaterById, createTheater, updateTheater, deleteTheater, addScreen } = require('../controllers/theaterController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

router.get('/', getAllTheaters);
router.get('/:id', getTheaterById);
router.post('/', requireAuth, requireAdmin, createTheater);
router.put('/:id', requireAuth, requireAdmin, updateTheater);
router.delete('/:id', requireAuth, requireAdmin, deleteTheater);
router.post('/:id/screen', requireAuth, requireAdmin, addScreen);

module.exports = router;
