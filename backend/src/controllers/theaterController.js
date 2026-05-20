const Theater = require('../models/Theater');

const getAllTheaters = async (req, res, next) => {
  try {
    const { city, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (city) filter.city = { $regex: city, $options: 'i' };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [theaters, total] = await Promise.all([
      Theater.find(filter).skip(skip).limit(parseInt(limit)),
      Theater.countDocuments(filter),
    ]);
    res.json({ success: true, data: theaters, total });
  } catch (error) { next(error); }
};

const getTheaterById = async (req, res, next) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (!theater) return res.status(404).json({ success: false, message: 'Theater not found' });
    res.json({ success: true, data: theater });
  } catch (error) { next(error); }
};

const createTheater = async (req, res, next) => {
  try {
    const theater = await Theater.create(req.body);
    res.status(201).json({ success: true, data: theater });
  } catch (error) { next(error); }
};

const updateTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!theater) return res.status(404).json({ success: false, message: 'Theater not found' });
    res.json({ success: true, data: theater });
  } catch (error) { next(error); }
};

const deleteTheater = async (req, res, next) => {
  try {
    await Theater.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Theater deleted' });
  } catch (error) { next(error); }
};

const addScreen = async (req, res, next) => {
  try {
    const theater = await Theater.findByIdAndUpdate(
      req.params.id,
      { $push: { screens: req.body } },
      { new: true }
    );
    if (!theater) return res.status(404).json({ success: false, message: 'Theater not found' });
    res.json({ success: true, data: theater });
  } catch (error) { next(error); }
};

module.exports = { getAllTheaters, getTheaterById, createTheater, updateTheater, deleteTheater, addScreen };
