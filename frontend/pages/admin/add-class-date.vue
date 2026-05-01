<template>
  <section>
    <AttendanceClassDates :filteredDates="studentAttendanceStore.classDates" />
  </section>
</template>

<script setup>
  definePageMeta({ layout: "split" });

  const studentAttendanceStore = useStudentAttendanceStore();
</script>
