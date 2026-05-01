const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getClassAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'teacher'), markAttendance);
router.get('/class/:classId', protect, authorize('admin', 'teacher'), getClassAttendance);

module.exports = router;
