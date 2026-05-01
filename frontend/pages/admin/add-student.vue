<template>
  <section>
    <AttendanceStudentsList :students="studentAttendanceStore.students" />
  </section>
</template>

<script setup>
  definePageMeta({ layout: "split" });

  const studentAttendanceStore = useStudentAttendanceStore();
</script>
