<template>
  <section>
    <AttendanceStudentsList :students="studentAttendanceStore.students" />
  </section>
</template>

<script setup>
  definePageMeta({ layout: "default" });

  const studentAttendanceStore = useStudentAttendanceStore();

  onMounted(async () => {
    await studentAttendanceStore.fetchStudents();
  });
</script>
