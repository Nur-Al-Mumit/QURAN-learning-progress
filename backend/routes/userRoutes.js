const express = require('express');
const router = express.Router();
const { getStudents, getProfile } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/students', protect, authorize('admin', 'teacher'), getStudents);
router.get('/profile', protect, getProfile);

module.exports = router;
