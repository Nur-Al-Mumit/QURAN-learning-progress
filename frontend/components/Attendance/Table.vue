<template>
  <section>
    <div class="max-w-7xl mx-auto mb-6">
      <div
        class="bg-white rounded-lg shadow overflow-hidden"
        id="attendance-table"
      >
        <div
          data-export-exclude
          class="p-5 border-b border-gray-100 print:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <h3 class="text-xl font-bold text-gray-900 tracking-tight">Attendance Report</h3>

          <div class="flex flex-wrap items-center gap-3">
            <button
              @click="printAttendance"
              class="flex-1 sm:flex-none px-4 py-2 bg-white text-gray-700 font-bold text-xs uppercase tracking-widest border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              Print Report
            </button>
            <button
              @click="exportAttendanceAsJpg"
              class="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary-700 active:scale-95 transition-all shadow-sm shadow-primary-100"
            >
              Export JPG
            </button>
            <button
              @click="showMarkAttendance = true"
              class="flex-1 sm:flex-none px-4 py-2 bg-purple-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-purple-700 active:scale-95 transition-all shadow-sm shadow-purple-100"
            >
              Mark Attendance
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Student
                </th>
                <th
                  v-for="date in filteredDates"
                  :key="date"
                  class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ formatDateShort(date) }}
                </th>
                <th
                  class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Present
                </th>
                <th
                  class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Absent
                </th>
                <th
                  class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rec
                </th>
                <th
                  class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  %
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 overflow-hidden">
              <tr v-for="student in filteredStudents" :key="student.id">
                <td class="px-4 print:px-2 py-3 print:py-1.5 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ student.name }}
                    </div>
                    <!-- <div class="text-sm text-gray-500">
                      ID: {{ student.id }}
                    </div> -->
                  </div>
                </td>
                <td
                  v-for="date in filteredDates"
                  :key="date"
                  class="px-2 print:px-1 py-3 print:py-1.5 text-center"
                >
                  <span
                    :class="{
                      'text-green-600': getAttendanceStatus(student.id, date) === 'present',
                      'text-blue-600': getAttendanceStatus(student.id, date) === 'recording',
                      'text-red-600': getAttendanceStatus(student.id, date) === 'absent',
                      'text-gray-400': getAttendanceStatus(student.id, date) === 'upcoming'
                    }"
                  >
                    <template v-if="getAttendanceStatus(student.id, date) === 'present'">✓</template>
                    <template v-else-if="getAttendanceStatus(student.id, date) === 'recording'">◯</template>
                    <template v-else-if="getAttendanceStatus(student.id, date) === 'upcoming'">-</template>
                    <template v-else>✗</template>
                  </span>
                </td>
                <td
                  class="px-4 py-3 print:py-1.5 text-center text-sm font-medium text-green-600"
                >
                  {{ getStudentStats(student.id).present }}
                </td>
                <td
                  class="px-4 py-3 print:py-1.5 text-center text-sm font-medium text-red-600"
                >
                  {{ getStudentStats(student.id).absent }}
                </td>
                <td
                  class="px-4 py-3 print:py-1.5 text-center text-sm font-medium text-blue-600"
                >
                  {{ getStudentStats(student.id).recording }}
                </td>
                <td class="px-4 py-3 print:py-1.5 text-center text-sm font-medium">
                  <span class="text-gray-900 font-semibold">
                    {{ getStudentStats(student.id).percentage }}%
                  </span>
                  <br>
                  <template
                    v-if="
                      getStudentStats(student.id).presentPercentage ||
                      getStudentStats(student.id).recordingPercentage
                    "
                  >
                    <span class="text-gray-500"> (</span>
                    <template v-if="getStudentStats(student.id).presentPercentage">
                      <span class="text-green-600">
                        {{ getStudentStats(student.id).presentPercentage }}
                      </span>
                    </template>
                    <template
                      v-if="
                        getStudentStats(student.id).presentPercentage &&
                        getStudentStats(student.id).recordingPercentage
                      "
                    >
                      <span class="text-gray-500"> + </span>
                    </template>
                    <template v-if="getStudentStats(student.id).recordingPercentage">
                      <span class="text-blue-600">
                        {{ getStudentStats(student.id).recordingPercentage }}
                      </span>
                    </template>
                    <span class="text-gray-500">)</span>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Legend for print -->
        <div class="p-4 border-t print:block hidden" data-export-show>
          <div class="text-xs text-gray-600 flex items-center gap-4 justify-center">
            <span class="flex items-center gap-1">
              <span class="text-green-600">✓</span>
              <span>Present</span>
            </span>
            <span class="flex items-center gap-1">
              <span class="text-blue-600">◯</span>
              <span>Recording</span>
            </span>
            <span class="flex items-center gap-1">
              <span class="text-red-600">✗</span>
              <span>Absent</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <AttendanceMarkModal v-model:is-modal-open="showMarkAttendance" />
  </section>
</template>

<script setup>
  const props = defineProps({
    filteredDates: {
      type: Array,
      required: true,
    },
    studentView: {
      type: String,
      default: "all",
    },
  });

  // Store
  const studentAttendanceStore = useStudentAttendanceStore();

  // State
  const showMarkAttendance = ref(false);

  const filteredStudents = computed(() => {
    if (props.studentView === "all") {
      return studentAttendanceStore.students;
    }
    return studentAttendanceStore.students.filter(
      (student) => student.id === props.studentView
    );
  });

  const activeDates = computed(() => {
    const dates = new Set();
    Object.values(studentAttendanceStore.attendance).forEach(studentRecords => {
      Object.keys(studentRecords).forEach(date => {
        dates.add(date);
      });
    });
    return dates;
  });

  const distributePercentages = (counts) => {
    const total = counts.reduce((sum, count) => sum + count, 0);

    if (total === 0) {
      return counts.map(() => 0);
    }

    const rawPercentages = counts.map((count) => (count / total) * 100);
    const basePercentages = rawPercentages.map((value) => Math.floor(value));
    let remainder =
      100 - basePercentages.reduce((sum, value) => sum + value, 0);

    const fractionalRanks = rawPercentages
      .map((value, index) => ({
        index,
        fraction: value - Math.floor(value),
      }))
      .sort((a, b) => b.fraction - a.fraction);

    let rankIndex = 0;
    while (remainder > 0) {
      const targetIndex = fractionalRanks[rankIndex].index;
      basePercentages[targetIndex] += 1;
      remainder -= 1;
      rankIndex = (rankIndex + 1) % fractionalRanks.length;
    }

    return basePercentages;
  };

  const getAttendanceStatus = (studentId, date) => {
    const studentAttendance = studentAttendanceStore.attendance[studentId] || {};
    const status = studentAttendance[date];
    
    if (status) return status;

    // If the date has ANY attendance recorded for ANY student, it's no longer "upcoming"
    if (activeDates.value.has(date)) {
      return "absent";
    }

    // If no status and no one marked yet, check if date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    
    if (checkDate > today) {
      return "upcoming";
    }
    
    return "absent";
  };

  const getStudentStats = (studentId) => {
    const studentAttendance =
      studentAttendanceStore.attendance[studentId] || {};
    const relevantDates = props.filteredDates;

    let present = 0;
    let absent = 0;
    let recording = 0;

    relevantDates.forEach((date) => {
      const status = getAttendanceStatus(studentId, date);
      if (status === "present") {
        present++;
      } else if (status === "recording") {
        recording++;
      } else if (status === "absent") {
        absent++;
      }
    });

    const [presentPercentage, recordingPercentage, absentPercentage] =
      distributePercentages([present, recording, absent]);
    const presentWithRecording = present + recording;
    const combinedPercentage = presentPercentage + recordingPercentage;

    return {
      present: presentWithRecording,
      absent,
      recording,
      percentage: combinedPercentage,
      presentPercentage,
      recordingPercentage,
      absentPercentage,
    };
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const printAttendance = () => {
    window.print();
  };

  const exportAttendanceAsJpg = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const table = document.getElementById("attendance-table");
    if (!table) {
      console.error("Unable to find attendance table element for JPG export.");
      return;
    }

    const elementsToToggle = Array.from(
      table.querySelectorAll("[data-export-show]")
    );

    const revertVisibility = elementsToToggle.map((element) => {
      const hiddenBefore = element.classList.contains("hidden");
      if (hiddenBefore) {
        element.classList.remove("hidden");
      }
      return () => {
        if (hiddenBefore) {
          element.classList.add("hidden");
        }
      };
    });

    try {
      const { toJpeg } = await import("html-to-image");
      const rect = table.getBoundingClientRect();
      const pixelRatio = Math.min(
        3,
        Math.max(1, (window.devicePixelRatio || 1) * 3)
      );

      const dataUrl = await toJpeg(table, {
        quality: 0.95,
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio,
        width: rect.width,
        height: rect.height,
        filter: (node) => {
          if (
            node instanceof Element &&
            node.hasAttribute("data-export-exclude")
          ) {
            return false;
          }
          return true;
        },
      });

      const link = document.createElement("a");
      link.download = `attendance-report-${new Date()
        .toISOString()
        .slice(0, 10)}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export attendance report as JPG:", error);
    } finally {
      revertVisibility.forEach((restore) => restore());
    }
  };
</script>
<style>
  @media print {
    body * {
      visibility: hidden;
    }
    #attendance-table,
    #attendance-table * {
      visibility: visible;
    }
    #attendance-table {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
    }
    .print\\:hidden {
      display: none !important;
    }
  }
</style>
