import { defineStore } from "pinia";
import { callAdminAuthnAxios } from "~/composables/adminAuthenticatedAxios";

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
        const { data, error } = await callAdminAuthnAxios("/users/students", null, { method: 'get' });
        if (data) {
          students.value = data.map(s => ({
            id: s._id,
            name: s.name,
            email: s.email
          }));
        }
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        loading.value = false;
      }
    };

    return { 
      students, 
      classDates, 
      attendance, 
      loading,
      fetchStudents 
    };
  }
);
