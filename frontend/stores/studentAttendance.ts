import { defineStore } from "pinia";
import studentAttendanceData from "@/data/studentAttendanceData";

export const useStudentAttendanceStore = defineStore(
  "StudentAttendance",
  () => {
    const clone = <T>(value: T): T =>
      JSON.parse(JSON.stringify(value)) as T;

    const students = reactive(clone(studentAttendanceData.students));
    const classDates = reactive(clone(studentAttendanceData.classDates));
    const attendance = reactive(clone(studentAttendanceData.attendance));
    return { students, classDates, attendance };
  }
);
