export const getAttendanceStatus = (studentId, date) => {
  const studentAttendanceStore = useStudentAttendanceStore();
  return studentAttendanceStore.attendance[studentId]?.[date] || "absent";
};
