const ClassDate = require('../models/ClassDate');

// @desc    Get all class dates
// @route   GET /api/class-dates
// @access  Private
const getClassDates = async (req, res) => {
  try {
    const dates = await ClassDate.find().sort({ date: 1 });
    res.json(dates.map(d => d.date));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a class date
// @route   POST /api/class-dates
// @access  Private/Admin/Teacher
const addClassDate = async (req, res) => {
  const { date } = req.body;

  try {
    const dateExists = await ClassDate.findOne({ date });
    if (dateExists) {
      return res.status(400).json({ message: 'Date already exists' });
    }

    const newDate = await ClassDate.create({ date });
    res.status(201).json(newDate.date);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove a class date
// @route   DELETE /api/class-dates/:date
// @access  Private/Admin/Teacher
const removeClassDate = async (req, res) => {
  try {
    const date = await ClassDate.findOneAndDelete({ date: req.params.date });
    if (!date) {
      return res.status(404).json({ message: 'Date not found' });
    }
    res.json({ message: 'Date removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClassDates,
  addClassDate,
  removeClassDate
};
