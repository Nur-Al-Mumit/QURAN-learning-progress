<template>
  <div class="space-y-6 pb-20 lg:pb-0">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Students Management</h1>
        <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <span class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.94 49.94 0 0 0-9.902 3.912l-.003.002c-.114.06-.254.06-.368 0l-.003-.002a49.938 49.938 0 0 0-9.902-3.912.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
              <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134.403.233.813.295 1.23.04.27.06.544.06.82 0 3.245-1.188 5.892-3.13 7.738C16.038 23.834 14.116 25 12 25s-4.038-1.166-5.951-2.982C4.1 20.175 3 17.585 3 14.34c0-.276.02-.55.06-.82.062-.417.16-.827.295-1.23a48.45 48.45 0 0 1 7.666 3.282.75.75 0 0 0 .584 0l.003-.002.003.002a.75.75 0 0 0 .584 0l.003-.002.003.002a.75.75 0 0 0 .584 0l.003-.002.003.002Z" />
            </svg>
            Teacher Portal
          </span>
          <span class="text-gray-300">•</span>
          <span>{{ studentAttendanceStore.students.length }} Enrolled</span>
        </div>
      </div>
    </div>

    <!-- Advanced Students Table -->
    <AttendanceStudentsList :students="studentAttendanceStore.students" />
  </div>
</template>

<script setup>
  definePageMeta({ layout: "default" });

  const studentAttendanceStore = useStudentAttendanceStore();

  onMounted(async () => {
    await Promise.all([
      studentAttendanceStore.fetchStudents(),
      studentAttendanceStore.fetchAttendance(),
    ]);
  });
</script>
