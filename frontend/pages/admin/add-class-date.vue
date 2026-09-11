<template>
  <div class="space-y-6 pb-20 lg:pb-0">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Class Schedule</h1>
        <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <span class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Teacher Portal
          </span>
          <span class="text-gray-300">•</span>
          <span>{{ studentAttendanceStore.classDates.length }} Scheduled Dates</span>
        </div>
      </div>
    </div>

    <!-- Advanced Class Dates Table -->
    <AttendanceClassDates :filteredDates="studentAttendanceStore.classDates" />
  </div>
</template>

<script setup>
  definePageMeta({ layout: "default" });

  const studentAttendanceStore = useStudentAttendanceStore();

  onMounted(async () => {
    // Attendance powers the per-date "Attendance Marked" column
    await Promise.all([
      studentAttendanceStore.fetchClassDates(),
      studentAttendanceStore.fetchAttendance(),
    ]);
  });
</script>
