const Attendance = require('../models/Attendance');

// @desc    Mark attendance (Single or Multiple)
// @route   POST /api/attendance
// @access  Private/Teacher/Admin
const markAttendance = async (req, res) => {
  const { studentId, date, status, remarks } = req.body;

  try {
    const attendance = await Attendance.findOneAndUpdate(
      { student: studentId, date },
      { status, remarks },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Bulk mark attendance
// @route   POST /api/attendance/bulk
// @access  Private/Teacher/Admin
const bulkMarkAttendance = async (req, res) => {
  const { records } = req.body; // Array of { studentId, date, status }

  try {
    const ops = records.map(record => ({
      updateOne: {
        filter: { student: record.studentId, date: record.date },
        update: { status: record.status },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(ops);
    res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all attendance
// @route   GET /api/attendance
// @access  Private/Teacher/Admin
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  bulkMarkAttendance,
  getAllAttendance
};
