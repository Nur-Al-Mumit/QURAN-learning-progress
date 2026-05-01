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
              class="relative p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-50/50 transition-all group flex flex-col items-center text-center"
            >
              <!-- Student Avatar -->
              <div
                class="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
              >
                <span class="text-primary-700 font-bold text-xl">
                  {{ getInitials(student.name) }}
                </span>
              </div>

              <!-- Student Info -->
              <div class="mb-4">
                <p
                  class="font-bold text-gray-900 text-sm truncate max-w-[120px]"
                  :title="student.name"
                >
                  {{ student.name }}
                </p>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  ID: {{ student.id }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="w-full flex gap-2 pt-2 border-t border-gray-100 mt-auto">
                <button
                  @click="openEditModal(student)"
                  class="flex-1 py-1.5 px-2 bg-primary-50 text-primary-700 rounded-lg text-[10px] font-bold uppercase hover:bg-primary-600 hover:text-white transition-all active:scale-95"
                >
                  Update
                </button>
                <button
                  @click="removeStudent(student.id)"
                  class="flex-1 py-1.5 px-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all active:scale-95"
                >
                  Remove
                </button>
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
        {{ isEditing ? 'Update Student' : 'Add New Student' }}
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
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          :placeholder="isEditing ? 'Update student name' : 'Enter student name'"
          @keyup.enter="handleSubmit"
        />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-center items-center gap-3 p-5 pt-0">
        <button
          @click="handleSubmit"
          class="border border-primary-600 text-primary-600 hover:text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-semibold cursor-pointer base-trans"
        >
          {{ isEditing ? 'Update' : 'Add Student' }}
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
  const isEditing = ref(false);
  const editingStudentId = ref("");
  const newStudentName = ref("");
  const searchStudent = ref("");
  const currentPage = ref(1);
  const itemsPerPage = ref(20);

  // Auto-focus and clear input when modal opens
  watch(showAddStudent, (isOpen) => {
    if (!isOpen) {
      isEditing.value = false;
      editingStudentId.value = "";
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
          (student._id || student.id).toLowerCase().includes(searchTerm)
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
    console.log(`Changed to page ${page}`);
  };

  const openEditModal = (student) => {
    isEditing.value = true;
    editingStudentId.value = student._id || student.id;
    newStudentName.value = student.name;
    showAddStudent.value = true;
  };

  const handleSubmit = async () => {
    if (!newStudentName.value.trim()) return;

    if (isEditing.value) {
      const success = await studentAttendanceStore.updateStudent(editingStudentId.value, newStudentName.value.trim());
      if (success) showAddStudent.value = false;
    } else {
      const success = await studentAttendanceStore.addStudent(newStudentName.value.trim());
      if (success) showAddStudent.value = false;
    }
  };

  const removeStudent = async (studentId) => {
    if (confirm("Are you sure you want to remove this student? This will also affect their attendance history.")) {
      await studentAttendanceStore.removeStudent(studentId);
    }
  };
</script>
