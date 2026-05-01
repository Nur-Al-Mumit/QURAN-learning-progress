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
          
          <div v-if="selectedDateForAttendance" class="mb-4 flex justify-end">
            <button 
              @click="markAllPresent"
              class="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-600 hover:text-white transition-all flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M16.403 12.652a.5.5 0 0 1 0 .696l-3.75 3.75a.5.5 0 0 1-.696 0l-3.75-3.75a.5.5 0 0 1 .696-.696L12 15.054V7a.5.5 0 0 1 1 0v8.054l2.707-2.707a.5.5 0 0 1 .696 0ZM4 5a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z" clip-rule="evenodd" />
              </svg>
              Mark All Present
            </button>
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

  const markAllPresent = () => {
    if (!selectedDateForAttendance.value) return;
    
    studentAttendanceStore.students.forEach(student => {
      markAttendance(student.id, selectedDateForAttendance.value, 'present');
    });
  };

  const getAttendanceStatus = (studentId, date) => {
    return studentAttendanceStore.attendance[studentId]?.[date] || "";
  };

  function closeModal() {
    modalRef.value.handleClose();
  }

  async function saveAttendance() {
    if (!selectedDateForAttendance.value) {
      alert("Please select a date first");
      return;
    }
    
    const success = await studentAttendanceStore.saveAttendance(selectedDateForAttendance.value);
    if (success) {
      modalRef.value.handleClose();
    } else {
      alert("Failed to save attendance. Please try again.");
    }
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
