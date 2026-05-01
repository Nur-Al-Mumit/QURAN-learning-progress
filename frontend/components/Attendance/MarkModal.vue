<template>
  <section>
    <Modal v-model:is-open="isOpen" ref="modalRef">
      <template #header>
        <section class="p-5 pb-0">
          <h3 class="text-lg font-semibold mb-4 text-center">
            Mark Attendance
          </h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <select
              v-model="selectedDateForAttendance"
              class="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select a date</option>
              <option
                v-for="date in studentAttendanceStore.classDates"
                :key="date"
                :value="date"
              >
                {{ formatDate(date) }}
              </option>
            </select>
          </div>
        </section>
      </template>
      <template #body>
        <div
          class="relative p-5 max-h-[50vh] overflow-y-auto sm:min-w-md min-w-[90vw]"
        >
          <div v-if="selectedDateForAttendance" class="space-y-3 mb-4 w-full">
            <div
              v-for="student in studentAttendanceStore.students"
              :key="student.id"
              class="w-full flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <span class="font-medium">{{ student.name }}</span>
              <div class="flex gap-2">
                <button
                  @click="
                    markAttendance(
                      student.id,
                      selectedDateForAttendance,
                      'present'
                    )
                  "
                  :class="
                    getAttendanceStatus(
                      student.id,
                      selectedDateForAttendance
                    ) === 'present'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  "
                  class="px-3 py-1 rounded text-sm"
                >
                  Present
                </button>
                <button
                  @click="
                    markAttendance(
                      student.id,
                      selectedDateForAttendance,
                      'recording'
                    )
                  "
                  :class="
                    getAttendanceStatus(
                      student.id,
                      selectedDateForAttendance
                    ) === 'recording'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  "
                  class="px-3 py-1 rounded text-sm"
                >
                  Recording
                </button>
                <button
                  @click="
                    markAttendance(
                      student.id,
                      selectedDateForAttendance,
                      'absent'
                    )
                  "
                  :class="
                    getAttendanceStatus(
                      student.id,
                      selectedDateForAttendance
                    ) === 'absent'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  "
                  class="px-3 py-1 rounded text-sm"
                >
                  Absent
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-3 p-5">
          <button
            @click="closeModal"
            class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
          <button
            @click="saveAttendance"
            class="flex-1 bg-green-400 text-white py-2 rounded-md hover:bg-green-500"
          >
            Save
          </button>
        </div>
      </template>
    </Modal>
  </section>
</template>

<script setup>
  const props = defineProps({
    isModalOpen: {
      type: Boolean,
      required: true,
    },
  });
  const emit = defineEmits(["update:isModalOpen", "upload"]);

  // Store
  const studentAttendanceStore = useStudentAttendanceStore();

  // State
  const modalRef = ref(null);
  const isOpen = ref(props.isModalOpen);
  const selectedDateForAttendance = ref("");

  const markAttendance = (studentId, date, status) => {
    if (!studentAttendanceStore.attendance[studentId]) {
      studentAttendanceStore.attendance[studentId] = {};
    }
    studentAttendanceStore.attendance[studentId][date] = status;
  };

  function closeModal() {
    modalRef.value.handleClose();
  }

  function saveAttendance() {
    modalRef.value.handleClose();
  }

  watch(
    () => props.isModalOpen,
    (value) => {
      isOpen.value = value;
    }
  );

  watch(
    () => isOpen.value,
    (value) => {
      emit("update:isModalOpen", value);
    }
  );
</script>
