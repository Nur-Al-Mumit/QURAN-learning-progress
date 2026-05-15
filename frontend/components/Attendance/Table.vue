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
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 z-10 bg-gray-50"
                >
                  Student
                </th>
                <template v-if="studentAttendanceStore.loading && filteredDates.length === 0">
                  <th
                    v-for="i in 7"
                    :key="i"
                    class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider animate-pulse"
                  >
                    <div class="h-3 bg-gray-200 rounded w-10 mx-auto"></div>
                  </th>
                </template>
                <template v-else>
                  <th
                    v-for="date in filteredDates"
                    :key="date"
                    class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ formatDateShort(date) }}
                  </th>
                </template>
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
              <!-- Loading Skeleton -->
              <template v-if="studentAttendanceStore.loading && filteredStudents.length === 0">
                <tr v-for="i in 5" :key="i" class="animate-pulse">
                  <td class="px-4 py-4 whitespace-nowrap sticky left-0 z-10 bg-white">
                    <div class="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td v-for="j in filteredDates.length" :key="j" class="px-2 py-4">
                    <div class="h-4 bg-gray-100 rounded w-4 mx-auto"></div>
                  </td>
                  <td v-for="k in 4" :key="k" class="px-4 py-4">
                    <div class="h-4 bg-gray-100 rounded w-8 mx-auto"></div>
                  </td>
                </tr>
              </template>

              <tr v-else v-for="student in filteredStudents" :key="student.id">
                <td class="px-4 print:px-2 py-3 print:py-1.5 whitespace-nowrap sticky left-0 z-10 bg-white group-hover:bg-gray-50 transition-colors">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ student.name }}
                    </div>
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
                      'text-amber-500': getAttendanceStatus(student.id, date) === 'na',
                      'text-gray-400': getAttendanceStatus(student.id, date) === 'upcoming'
                    }"
                  >
                    <template v-if="getAttendanceStatus(student.id, date) === 'present'">✓</template>
                    <template v-else-if="getAttendanceStatus(student.id, date) === 'recording'">◯</template>
                    <template v-else-if="getAttendanceStatus(student.id, date) === 'na'">—</template>
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
            <span class="flex items-center gap-1">
              <span class="text-amber-500">—</span>
              <span>N/A</span>
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
      return "na";
    }

    // If no status and no one marked yet, check if date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    
    if (checkDate > today) {
      return "upcoming";
    }
    
    return "na";
  };

  const getStudentStats = (studentId) => {
    const studentAttendance =
      studentAttendanceStore.attendance[studentId] || {};
    const relevantDates = props.filteredDates;

    let present = 0;
    let absent = 0;
    let recording = 0;
    let na = 0;

    relevantDates.forEach((date) => {
      const status = getAttendanceStatus(studentId, date);
      if (status === "present") {
        present++;
      } else if (status === "recording") {
        recording++;
      } else if (status === "absent") {
        absent++;
      } else if (status === "na") {
        na++;
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
      na,
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

    // Prepare for export: show hidden elements and ensure full width
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
      
      // Target the inner table for accurate width measurement
      const innerTable = table.querySelector('table');
      const scrollWidth = innerTable ? Math.max(innerTable.scrollWidth, table.scrollWidth) : table.scrollWidth;
      const scrollHeight = table.scrollHeight;

      // Force expansion for capture
      const originalWidth = table.style.width;
      const originalMaxWidth = table.style.maxWidth;
      const originalOverflow = table.style.overflow;
      
      table.style.width = scrollWidth + 'px';
      table.style.maxWidth = 'none';
      table.style.overflow = 'visible';

      const dataUrl = await toJpeg(table, {
        quality: 0.95,
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        width: scrollWidth,
        height: scrollHeight,
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

      // Revert styles
      table.style.width = originalWidth;
      table.style.maxWidth = originalMaxWidth;
      table.style.overflow = originalOverflow;

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
