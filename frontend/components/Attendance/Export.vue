<template>
  <section>
    <div class="border-t pt-4">
      <h4 class="text-md font-semibold mb-3">Export Data</h4>
      <div class="flex flex-wrap gap-3">
        <button
          @click="exportData('students')"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Export Students JSON
        </button>
        <button
          @click="exportData('classDates')"
          class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Export Class Dates JSON
        </button>
        <button
          @click="exportData('attendance')"
          class="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Export Attendance JSON
        </button>
        <button
          @click="exportData('all')"
          class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
        >
          Export All Data JSON
        </button>
        <button
          @click="syncStoreData"
          class="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
        >
          Sync Data to Store
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { $fetch } from "ofetch";

  const studentAttendanceStore = useStudentAttendanceStore();

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const getSortedClassDates = () =>
    [...studentAttendanceStore.classDates].sort();

  const buildAttendanceSummary = () => {
    const summary = {};
    Object.keys(studentAttendanceStore.attendance).forEach((studentId) => {
      const studentData = studentAttendanceStore.attendance[studentId];
      let present = 0;
      let absent = 0;

      Object.values(studentData).forEach((status) => {
        if (status === "present") present++;
        else absent++;
      });

      summary[studentId] = {
        present,
        absent,
        total: present + absent,
        percentage:
          present + absent > 0
            ? Math.round((present / (present + absent)) * 100)
            : 0,
      };
    });
    return summary;
  };

  const buildExportBundle = (type) => {
    const timestamp = new Date().toISOString();
    const bundle = {
      data: {},
      filename: "",
    };

    switch (type) {
      case "students":
        bundle.data = {
          students: clone(studentAttendanceStore.students),
          exportDate: timestamp,
          totalStudents: studentAttendanceStore.students.length,
        };
        bundle.filename = "students_data.json";
        break;
      case "classDates": {
        const dates = getSortedClassDates();
        bundle.data = {
          classDates: dates,
          exportDate: timestamp,
          totalDates: dates.length,
          dateRange: {
            earliest: dates[0],
            latest: dates[dates.length - 1],
          },
        };
        bundle.filename = "class_dates_data.json";
        break;
      }
      case "attendance": {
        const summary = buildAttendanceSummary();
        bundle.data = {
          attendance: clone(studentAttendanceStore.attendance),
          summary,
          exportDate: timestamp,
          totalRecords: Object.keys(studentAttendanceStore.attendance).reduce(
            (acc, studentId) =>
              acc +
              Object.keys(studentAttendanceStore.attendance[studentId]).length,
            0
          ),
        };
        bundle.filename = "attendance_data.json";
        break;
      }
      case "all": {
        const dates = getSortedClassDates();
        bundle.data = {
          students: clone(studentAttendanceStore.students),
          classDates: dates,
          attendance: clone(studentAttendanceStore.attendance),
          exportDate: timestamp,
          metadata: {
            totalStudents: studentAttendanceStore.students.length,
            totalDates: dates.length,
            totalAttendanceRecords: Object.keys(
              studentAttendanceStore.attendance
            ).reduce(
              (acc, studentId) =>
                acc +
                Object.keys(studentAttendanceStore.attendance[studentId])
                  .length,
              0
            ),
            dateRange: {
              earliest: dates[0],
              latest: dates[dates.length - 1],
            },
          },
        };
        bundle.filename = "complete_attendance_system_data.json";
        break;
      }
      default:
        throw new Error(`Unsupported export type: ${type}`);
    }

    return bundle;
  };

  const downloadJson = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportData = (type) => {
    const { data, filename } = buildExportBundle(type);
    downloadJson(data, filename);
    alert(
      `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } data exported successfully!`
    );
  };

  const syncStoreData = async () => {
    const { data } = buildExportBundle("all");
    try {
      await $fetch("/api/attendance-data", {
        method: "PUT",
        body: {
          students: data.students,
          classDates: data.classDates,
          attendance: data.attendance,
        },
      });
      alert("Store data updated successfully!");
    } catch (error) {
      console.error("Failed to sync store data:", error);
      alert("Failed to sync data. Check console for details.");
    }
  };
</script>
