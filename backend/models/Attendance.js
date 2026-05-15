const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  class: {
    type: String, // We'll use a string ID or name for now, e.g., 'quran-class'
    default: 'quran-class'
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'recording', 'na'],
    default: 'present'
  },
  remarks: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one record per student per date
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
