import { defineStore } from "pinia";
import { callAdminAuthnAxios } from "~/composables/adminAuthenticatedAxios";

// API returns raw Mongo docs (_id, createdAt, ...); components work with a flat shape
const normalizeStudent = (s: any) => ({
  id: s?._id ?? s?.id ?? "",
  name: s?.name ?? "",
  email: s?.email ?? "",
  createdAt: s?.createdAt ?? null,
});

export const useStudentAttendanceStore = defineStore(
  "StudentAttendance",
  () => {
    const students = ref([]);
    const classDates = ref([]);
    const attendance = ref({});
    const loading = ref(false);

    const fetchStudents = async () => {
      loading.value = true;
      try {
        const { data, error } = await callAdminAuthnAxios("/users/students", null, null, "get");
        if (data) {
          students.value = data.map(normalizeStudent);
        }
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        loading.value = false;
      }
    };

    const fetchClassDates = async () => {
      loading.value = true;
      try {
        const { data } = await callAdminAuthnAxios("/class-dates", null, null, "get");
        if (data) {
          classDates.value = data;
        }
      } catch (err) {
        console.error("Failed to fetch class dates", err);
      } finally {
        loading.value = false;
      }
    };

    const addClassDate = async (date: string) => {
      try {
        const { data } = await callAdminAuthnAxios("/class-dates", { date });
        if (data) {
          if (!classDates.value.includes(data)) {
            classDates.value.push(data);
            classDates.value.sort();
          }
          return true;
        }
      } catch (err) {
        console.error("Failed to add class date", err);
      }
      return false;
    };

    const removeClassDate = async (date: string) => {
      try {
        const { data } = await callAdminAuthnAxios(`/class-dates/${date}`, null, null, "delete");
        if (data) {
          classDates.value = classDates.value.filter(d => d !== date);
          return true;
        }
      } catch (err) {
        console.error("Failed to remove class date", err);
      }
      return false;
    };

    const fetchAttendance = async () => {
      loading.value = true;
      try {
        const { data } = await callAdminAuthnAxios("/attendance", null, null, "get");
        if (data) {
          const formattedAttendance = {};
          data.forEach(record => {
            const studentId = record.student;
            if (!formattedAttendance[studentId]) {
              formattedAttendance[studentId] = {};
            }
            formattedAttendance[studentId][record.date] = record.status;
          });
          attendance.value = formattedAttendance;
        }
      } catch (err) {
        console.error("Failed to fetch attendance", err);
      } finally {
        loading.value = false;
      }
    };

    const saveAttendance = async (date: string) => {
      try {
        const records = [];
        Object.keys(attendance.value).forEach(studentId => {
          if (attendance.value[studentId][date]) {
            records.push({
              studentId,
              date,
              status: attendance.value[studentId][date]
            });
          }
        });

        if (records.length > 0) {
          const { data } = await callAdminAuthnAxios("/attendance/bulk", { records });
          return !!data;
        }
      } catch (err) {
        console.error("Failed to save attendance", err);
      }
      return false;
    };

    const addStudent = async (name: string, email?: string) => {
      try {
        const { data } = await callAdminAuthnAxios("/users/students", { name, email: email || undefined });
        if (data) {
          students.value.push(normalizeStudent(data));
          return true;
        }
      } catch (err) {
        console.error("Failed to add student", err);
      }
      return false;
    };

    const updateStudent = async (id: string, name: string, email?: string) => {
      try {
        const { data } = await callAdminAuthnAxios(`/users/students/${id}`, { name, email: email || undefined }, null, "put");
        if (data) {
          const index = students.value.findIndex(s => s.id === id);
          if (index !== -1) {
            students.value[index] = normalizeStudent(data);
          }
          return true;
        }
      } catch (err) {
        console.error("Failed to update student", err);
      }
      return false;
    };

    const removeStudent = async (id: string) => {
      try {
        const { data } = await callAdminAuthnAxios(`/users/students/${id}`, null, null, "delete");
        if (data) {
          students.value = students.value.filter(s => (s._id || s.id) !== id);
          return true;
        }
      } catch (err) {
        console.error("Failed to remove student", err);
      }
      return false;
    };

    return { 
      students, 
      classDates, 
      attendance, 
      loading,
      fetchStudents,
      fetchClassDates,
      addClassDate,
      removeClassDate,
      fetchAttendance,
      saveAttendance,
      addStudent,
      updateStudent,
      removeStudent
    };
  }
);
