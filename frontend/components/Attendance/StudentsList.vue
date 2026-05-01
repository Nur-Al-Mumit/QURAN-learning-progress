<template>
  <div class="max-w-7xl mx-auto mb-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b flex items-center justify-between">
        <h3 class="text-lg font-semibold">Students ({{ students.length }})</h3>
        <button
          @click="showAddStudent = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Student
        </button>
      </div>

      <!-- Enhanced Students Display with Pagination -->
      <div class="p-4">
        <!-- Search Controls -->
        <div class="mb-4">
          <input
            v-model="searchStudent"
            type="text"
            placeholder="Search students by name or ID..."
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Students Grid -->
        <div class="min-h-[200px]">
          <div
            v-if="paginatedStudents.length === 0"
            class="text-center py-8 text-gray-500"
          >
            <p>
              {{
                searchStudent
                  ? "No students found matching your search"
                  : "No students added yet"
              }}
            </p>
          </div>

          <div
            v-else
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
          >
            <div
              v-for="student in paginatedStudents"
              :key="student.id"
              class="relative p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100 hover:shadow-md base-trans group cursor-pointer"
            >
              <button
                @click="removeStudent(student.id)"
                class="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm hover:shadow-md base-trans z-10 cursor-pointer"
                title="Remove student"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>

              <div class="text-center">
                <!-- Student Avatar -->
                <div
                  class="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mb-2 mx-auto"
                >
                  <span class="text-green-700 font-bold text-lg">
                    {{ getInitials(student.name) }}
                  </span>
                </div>

                <!-- Student Info -->
                <div>
                  <p
                    class="font-medium text-gray-800 text-sm truncate"
                    :title="student.name"
                  >
                    {{ student.name }}
                  </p>
                  <p class="text-xs text-gray-600 mt-1">
                    {{ student.id }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Global Pagination Component -->
        <Pagination
          v-model:current-page="currentPage"
          :total-items="students.length"
          :filtered-items="filteredStudents.length"
          :items-per-page="itemsPerPage"
          item-type="students"
          @page-change="onPageChange"
        />
      </div>
    </div>
  </div>

  <Modal v-model:is-open="showAddStudent">
    <template #header>
      <h3 class="text-lg font-semibold text-center p-5 pb-0">
        Add New Student
      </h3>
    </template>
    <template #body>
      <div class="mb-4 p-5">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Student Name
        </label>
        <input
          v-model="newStudentName"
          type="text"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter student name"
          @keyup.enter="addStudent"
        />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-center items-center gap-3 p-5 pt-0">
        <button
          @click="addStudent"
          class="border border-green-600 text-green-600 hover:text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold cursor-pointer base-trans"
        >
          Add Student
        </button>
        <button
          @click="showAddStudent = false"
          class="border border-gray-600 text-gray-600 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold cursor-pointer base-trans"
        >
          Cancel
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
  const props = defineProps({
    students: {
      type: Array,
      required: true,
    },
  });

  // Store
  const studentAttendanceStore = useStudentAttendanceStore();

  // State
  const showAddStudent = ref(false);
  const newStudentName = ref("");
  const searchStudent = ref("");
  const currentPage = ref(1);
  const itemsPerPage = ref(20);

  // Auto-focus and clear input when modal opens
  watch(showAddStudent, (isOpen) => {
    if (isOpen) {
      newStudentName.value = "";
    }
  });

  // Computed properties
  const filteredStudents = computed(() => {
    if (!searchStudent.value) {
      return [...props.students].sort((a, b) => a.name.localeCompare(b.name));
    }

    const searchTerm = searchStudent.value.toLowerCase();
    return props.students
      .filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm) ||
          student.id.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredStudents.value.slice(start, end);
  });

  // Watch for search changes to reset current page
  watch([searchStudent], () => {
    currentPage.value = 1;
  });

  // Methods
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  const onPageChange = (page) => {
    // Optional: Add any additional logic when page changes
    console.log(`Changed to page ${page}`);
  };

  const addStudent = () => {
    if (newStudentName.value.trim()) {
      const newId =
        "S" +
        String(studentAttendanceStore.students.length + 1).padStart(3, "0");
      studentAttendanceStore.students.push({
        id: newId,
        name: newStudentName.value.trim(),
      });
      newStudentName.value = "";
      showAddStudent.value = false;
    }
  };

  const removeStudent = (studentId) => {
    if (confirm("Are you sure you want to remove this student?")) {
      studentAttendanceStore.students = studentAttendanceStore.students.filter(
        (student) => student.id !== studentId
      );
      delete studentAttendanceStore.attendance[studentId];
    }
  };
</script>
