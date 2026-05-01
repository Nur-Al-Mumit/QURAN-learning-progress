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
        const { data, error } = await callAdminAuthnAxios("/users/students", null, null, "get");
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

    const fetchClassDates = async () => {
      try {
        const { data } = await callAdminAuthnAxios("/class-dates", null, null, "get");
        if (data) {
          classDates.value = data;
        }
      } catch (err) {
        console.error("Failed to fetch class dates", err);
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

    return { 
      students, 
      classDates, 
      attendance, 
      loading,
      fetchStudents,
      fetchClassDates,
      addClassDate,
      removeClassDate
    };
  }
);
