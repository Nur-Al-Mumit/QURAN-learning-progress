const express = require('express');
const router = express.Router();
const {
  markAttendance,
  bulkMarkAttendance,
  getAllAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'teacher'), getAllAttendance);
router.post('/', protect, authorize('admin', 'teacher'), markAttendance);
router.post('/bulk', protect, authorize('admin', 'teacher'), bulkMarkAttendance);

module.exports = router;
