const User = require('../models/User');

// @desc    Get all students
// @route   GET /api/users/students
// @access  Private/Admin/Teacher
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a student
// @route   POST /api/users/students
// @access  Private/Admin
const addStudent = async (req, res) => {
  const { name, email, studentId } = req.body;
  try {
    const user = await User.create({
      name,
      email: email || `${studentId || Date.now()}@quran.com`,
      password: 'student123', // Default password
      role: 'student',
      studentId: studentId || `S${Date.now().toString().slice(-3)}`
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a student
// @route   PUT /api/users/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/users/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getProfile
};
