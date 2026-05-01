<template>
  <section>
    <div class="max-w-7xl mx-auto mb-6">
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            Class Dates ({{ studentAttendanceStore.classDates.length }})
          </h3>

          <button
            @click="showAddDate = true"
            class="border border-primary text-primary hover:text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors font-semibold cursor-pointer base-trans"
          >
            Add Class Date
          </button>
        </div>
        <div class="p-4">
          <div class="mb-4">
            <input
              v-model="searchDate"
              type="text"
              placeholder="Search dates (e.g., 2024-01, Jan 2024, or specific date)"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Dates Grid -->
          <div class="min-h-[200px]">
            <div
              v-if="paginatedDates.length === 0"
              class="text-center py-8 text-gray-500"
            >
              <p>
                {{
                  searchDate
                    ? "No dates found matching your search"
                    : "No class dates added yet"
                }}
              </p>
            </div>

            <div
              v-else
              class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2"
            >
              <div
                v-for="date in paginatedDates"
                :key="date"
                class="relative p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <button
                  @click="removeDate(date)"
                  class="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm hover:shadow-md transition-all duration-200 z-10"
                  title="Remove date"
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
                  <div class="text-xs font-medium text-blue-600 uppercase">
                    {{ formatDay(date) }}
                  </div>
                  <div class="text-sm font-bold text-gray-800">
                    {{ formatDateNumber(date) }}
                  </div>
                  <div class="text-xs text-gray-600">
                    {{ formatMonth(date) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Pagination
            v-model:current-page="currentPage"
            :total-items="studentAttendanceStore.classDates.length"
            :filtered-items="filteredAndSortedDates.length"
            :items-per-page="itemsPerPage"
            item-type="dates"
            @page-change="onPageChange"
          />
        </div>
      </div>
    </div>

    <Modal v-model:is-open="showAddDate">
      <template #header>
        <h3 class="text-lg font-semibold text-center p-5 pb-0">
          Add Class Date
        </h3>
      </template>
      <template #body>
        <div class="p-5">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              v-model="newClassDate"
              type="date"
              :min="minDate"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Quick Add Options -->
          <div class="border-t pt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">
              Quick Add Options
            </h4>
            <button
              @click="addCurrentMonthFridays"
              class="w-full border border-blue-600 text-blue-600 hover:text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold cursor-pointer base-trans"
            >
              Add Current Month's All Fridays
            </button>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center items-center gap-3 p-5 pt-0">
          <button
            @click="addDate"
            class="border border-green-600 text-green-600 hover:text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold cursor-pointer base-trans"
          >
            Save
          </button>
          <button
            @click="showAddDate = false"
            class="border border-gray-600 text-gray-600 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold cursor-pointer base-trans"
          >
            Cancel
          </button>
        </div>
      </template>
    </Modal>
  </section>
</template>

<script setup>
  const props = defineProps({
    filteredDates: {
      type: Array,
      required: true,
    },
  });

  // Store
  const studentAttendanceStore = useStudentAttendanceStore();

  // State
  const showAddDate = ref(false);
  const newClassDate = ref("");
  const searchDate = ref("");
  const currentPage = ref(1);
  const itemsPerPage = ref(30);

  // Helper function to format date as YYYY-MM-DD in local timezone
  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Set default date to today when modal opens
  watch(showAddDate, (isOpen) => {
    if (isOpen && !newClassDate.value) {
      const today = new Date();
      newClassDate.value = formatDateLocal(today);
    }
  });

  // Computed properties
  const minDate = computed(() => {
    const today = new Date();
    today.setMonth(today.getMonth() - 12);
    return formatDateLocal(today);
  });

  const filteredAndSortedDates = computed(() => {
    let dates = [...props.filteredDates];

    // Filter by search term
    if (searchDate.value) {
      const searchTerm = searchDate.value.toLowerCase();
      dates = dates.filter((date) => {
        const dateObj = new Date(date);
        const formatted = formatDate(date).toLowerCase();
        const monthYear = `${dateObj.toLocaleString("default", {
          month: "long",
        })} ${dateObj.getFullYear()}`.toLowerCase();
        const shortMonthYear = `${dateObj.toLocaleString("default", {
          month: "short",
        })} ${dateObj.getFullYear()}`.toLowerCase();

        return (
          date.includes(searchTerm) ||
          formatted.includes(searchTerm) ||
          monthYear.includes(searchTerm) ||
          shortMonthYear.includes(searchTerm)
        );
      });
    }

    // Sort dates in ascending order
    dates.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    return dates;
  });

  const paginatedDates = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredAndSortedDates.value.slice(start, end);
  });

  // Watch for search changes to reset current page
  watch([searchDate], () => {
    currentPage.value = 1;
  });

  const formatDay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDateNumber = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  };

  const onPageChange = (page) => {
    // Optional: Add any additional logic when page changes
    console.log(`Changed to page ${page}`);
  };

  const addDate = () => {
    if (
      newClassDate.value &&
      !studentAttendanceStore.classDates.includes(newClassDate.value)
    ) {
      studentAttendanceStore.classDates.push(newClassDate.value);
      studentAttendanceStore.classDates.sort();
      newClassDate.value = "";
      showAddDate.value = false;
    }
  };

  const removeDate = (date) => {
    if (confirm("Are you sure you want to remove this class date?")) {
      studentAttendanceStore.classDates =
        studentAttendanceStore.classDates.filter((d) => d !== date);
      // Remove attendance records for this date
      Object.keys(studentAttendanceStore.attendance).forEach((studentId) => {
        delete studentAttendanceStore.attendance[studentId][date];
      });
    }
  };

  const addCurrentMonthFridays = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const fridays = [];

    for (
      let date = new Date(firstDay);
      date <= lastDay;
      date.setDate(date.getDate() + 1)
    ) {
      if (date.getDay() === 5) {
        const fridayDate = formatDateLocal(date);
        fridays.push(fridayDate);
      }
    }

    let addedCount = 0;
    fridays.forEach((friday) => {
      if (!studentAttendanceStore.classDates.includes(friday)) {
        studentAttendanceStore.classDates.push(friday);
        addedCount++;
      }
    });

    studentAttendanceStore.classDates.sort();
    showAddDate.value = false;
  };
</script>
