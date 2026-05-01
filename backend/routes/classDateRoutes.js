const express = require('express');
const router = express.Router();
const {
  getClassDates,
  addClassDate,
  removeClassDate
} = require('../controllers/classDateController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getClassDates);
router.post('/', protect, authorize('admin', 'teacher'), addClassDate);
router.delete('/:date', protect, authorize('admin', 'teacher'), removeClassDate);

module.exports = router;
