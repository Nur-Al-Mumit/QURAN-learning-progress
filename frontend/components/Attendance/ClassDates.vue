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
            <!-- Loading Skeleton -->
            <div v-if="studentAttendanceStore.loading && filteredAndSortedDates.length === 0" class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 mb-6">
              <div v-for="i in 16" :key="i" class="p-3 bg-white rounded-2xl border border-gray-100 animate-pulse flex flex-col items-center">
                <div class="h-3 bg-gray-100 rounded w-10 mb-2"></div>
                <div class="h-6 bg-gray-100 rounded w-8 mb-2"></div>
                <div class="h-3 bg-gray-100 rounded w-12 mb-3"></div>
                <div class="w-full pt-2 border-t border-gray-50 mt-auto">
                   <div class="w-full h-6 bg-gray-50 rounded-lg"></div>
                </div>
              </div>
            </div>

            <div
              v-else-if="paginatedDates.length === 0"
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
              class="relative p-3 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-50/50 transition-all group flex flex-col items-center text-center"
            >
              <div class="text-center pb-2">
                <div class="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">
                  {{ formatDay(date) }}
                </div>
                <div class="text-lg font-black text-gray-900 leading-none">
                  {{ formatDateNumber(date) }}
                </div>
                <div class="text-[10px] text-gray-400 font-bold uppercase mt-1">
                  {{ formatMonth(date) }}
                </div>
              </div>
              <div class="w-full pt-2 border-t border-gray-100 mt-auto">
                 <button
                  @click="removeDate(date)"
                  class="w-full py-1.5 px-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all active:scale-95"
                >
                  Remove
                </button>
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

  const addDate = async () => {
    if (
      newClassDate.value &&
      !studentAttendanceStore.classDates.includes(newClassDate.value)
    ) {
      const success = await studentAttendanceStore.addClassDate(newClassDate.value);
      if (success) {
        newClassDate.value = "";
        showAddDate.value = false;
      }
    }
  };

  const removeDate = async (date) => {
    if (confirm("Are you sure you want to remove this class date?")) {
      const success = await studentAttendanceStore.removeClassDate(date);
      if (success) {
        // Attendance records on the frontend are reactive to classDates change
      }
    }
  };

  const addCurrentMonthFridays = async () => {
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
    for (const friday of fridays) {
      if (!studentAttendanceStore.classDates.includes(friday)) {
        await studentAttendanceStore.addClassDate(friday);
        addedCount++;
      }
    }

    studentAttendanceStore.classDates.sort();
    showAddDate.value = false;
  };

  onMounted(() => {
    studentAttendanceStore.fetchClassDates();
  });
</script>
