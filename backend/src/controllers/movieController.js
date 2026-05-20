const Movie = require('../models/Movie');
const Review = require('../models/Review');

// GET /api/movies
const getAllMovies = async (req, res, next) => {
  try {
    const { genre, language, format, rating, search, featured, trending, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const filter = { isActive: true };
    if (genre) filter.genre = { $in: genre.split(',') };
    if (language) filter.language = { $in: language.split(',') };
    if (format) filter.format = { $in: format.split(',') };
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    if (featured === 'true') filter.isFeatured = true;
    if (trending === 'true') filter.isTrending = true;
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [movies, total] = await Promise.all([
      Movie.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Movie.countDocuments(filter),
    ]);

    res.json({ success: true, data: movies, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { next(error); }
};

// GET /api/movies/:id
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, data: movie });
  } catch (error) { next(error); }
};

// GET /api/movies/trending
const getTrendingMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ isActive: true, isTrending: true }).sort('-rating').limit(10);
    res.json({ success: true, data: movies });
  } catch (error) { next(error); }
};

// GET /api/movies/search
const searchMovies = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });
    const movies = await Movie.find({
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } },
        { director: { $regex: q, $options: 'i' } },
        { cast: { $regex: q, $options: 'i' } },
      ],
    }).limit(10);
    res.json({ success: true, data: movies });
  } catch (error) { next(error); }
};

// GET /api/movies/:id/reviews
const getMovieReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ movieId: req.params.id })
      .populate('userId', 'firstName lastName profileImage')
      .sort('-createdAt');
    res.json({ success: true, data: reviews });
  } catch (error) { next(error); }
};

// POST /api/movies/:id/reviews [Auth]
const addReview = async (req, res, next) => {
  try {
    const { rating, reviewText } = req.body;
    const existing = await Review.findOne({ movieId: req.params.id, userId: req.user._id });
    if (existing) return res.status(409).json({ success: false, message: 'You already reviewed this movie' });

    const review = await Review.create({ movieId: req.params.id, userId: req.user._id, rating, reviewText });

    // Update movie average rating
    const stats = await Review.aggregate([
      { $match: { movieId: review.movieId } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length > 0) {
      await Movie.findByIdAndUpdate(req.params.id, { averageRating: stats[0].avg.toFixed(1), totalReviews: stats[0].count });
    }
    res.status(201).json({ success: true, data: review });
  } catch (error) { next(error); }
};

// ADMIN: POST /api/admin/movies
const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: movie });
  } catch (error) { next(error); }
};

// ADMIN: PUT /api/admin/movies/:id
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, data: movie });
  } catch (error) { next(error); }
};

// ADMIN: DELETE /api/admin/movies/:id
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, message: 'Movie deleted' });
  } catch (error) { next(error); }
};

module.exports = { getAllMovies, getMovieById, getTrendingMovies, searchMovies, getMovieReviews, addReview, createMovie, updateMovie, deleteMovie };
