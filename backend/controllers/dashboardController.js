const User = require('../models/User');
const Attendance = require('../models/Attendance');
const ClassDate = require('../models/ClassDate');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin/Teacher
const getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalClasses = await ClassDate.countDocuments();
    const totalAttendanceRecords = await Attendance.countDocuments();
    
    // Calculate average attendance rate
    // rate = (present + recording) / total records
    const presentCount = await Attendance.countDocuments({ status: 'present' });
    const recordingCount = await Attendance.countDocuments({ status: 'recording' });
    
    let attendanceRate = 0;
    if (totalAttendanceRecords > 0) {
      attendanceRate = ((presentCount + recordingCount) / totalAttendanceRecords) * 100;
    }

    const recentActivity = await Attendance.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('student', 'name studentId');

    // Fetch 3 upcoming classes
    const upcomingClasses = await ClassDate.find({
      date: { $gte: new Date().toISOString().split('T')[0] }
    })
    .sort({ date: 1 })
    .limit(3);

    // Calculate Attendance Health (last 7 class dates)
    const last7Classes = await ClassDate.find()
      .sort({ date: -1 })
      .limit(7);
    
    const attendanceHealth = await Promise.all(last7Classes.map(async (c) => {
      const totalPossible = await User.countDocuments({ role: 'student' });
      const present = await Attendance.countDocuments({ date: c.date, status: { $in: ['present', 'recording'] } });
      const rate = totalPossible > 0 ? (present / totalPossible) * 100 : 0;
      return {
        date: c.date,
        rate: Math.round(rate)
      };
    }));

    res.json({
      totalStudents,
      totalClasses,
      totalAttendanceRecords,
      attendanceRate: attendanceRate.toFixed(1),
      recentActivity: recentActivity.map(item => ({
        id: item._id,
        studentName: item.student?.name || 'Unknown Student',
        studentId: item.student?.studentId || 'N/A',
        status: item.status,
        date: item.date,
        updatedAt: item.updatedAt
      })),
      upcomingClasses: upcomingClasses.map(c => ({
        date: c.date,
        note: c.note || 'General Quran Class'
      })),
      attendanceHealth: attendanceHealth.reverse(),
      stats: [
        {
          title: 'Total Students',
          value: totalStudents,
          change: '+2',
          changeType: 'increase',
        },
        {
          title: 'Attendance Rate',
          value: `${attendanceRate.toFixed(1)}%`,
          change: '+5%',
          changeType: 'increase',
        },
        {
          title: 'Total Sessions',
          value: totalClasses,
          change: 'Active',
          changeType: 'neutral',
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats
};
