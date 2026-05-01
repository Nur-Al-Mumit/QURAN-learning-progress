const express = require('express');
const router = express.Router();
const { 
  getStudents, 
  addStudent, 
  updateStudent, 
  deleteStudent, 
  getProfile 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/students', protect, authorize('admin', 'teacher'), getStudents);
router.post('/students', protect, authorize('admin'), addStudent);
router.put('/students/:id', protect, authorize('admin'), updateStudent);
router.delete('/students/:id', protect, authorize('admin'), deleteStudent);
router.get('/profile', protect, getProfile);

module.exports = router;
