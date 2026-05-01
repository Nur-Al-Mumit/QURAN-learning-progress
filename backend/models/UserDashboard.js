const mongoose = require('mongoose');

const userDashboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalClassesAttended: {
    type: Number,
    default: 0
  },
  attendancePercentage: {
    type: Number,
    default: 0
  },
  currentLesson: {
    type: String,
    default: 'Introduction'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  notifications: [
    {
      message: String,
      isRead: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('UserDashboard', userDashboardSchema);
