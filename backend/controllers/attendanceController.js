const Attendance = require('../models/Attendance');

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private/Teacher/Admin
const markAttendance = async (req, res) => {
  const { classId, studentId, status, remarks } = req.body;

  try {
    const attendance = await Attendance.create({
      class: classId,
      student: studentId,
      status,
      remarks
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get attendance for a class
// @route   GET /api/attendance/class/:classId
// @access  Private/Teacher/Admin
const getClassAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ class: req.params.classId })
      .populate('student', 'name email');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  getClassAttendance
};
