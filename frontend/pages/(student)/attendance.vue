<template>
  <div class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <h1
          class="text-2xl sm:text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600"
        >
          Weekly Attendance Dashboard
        </h1>
        <p class="mt-2 text-sm sm:text-base text-gray-600">
          Track your Friday class attendance and progress
        </p>
      </div>

      <!-- Stats Cards -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <div
          class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 border border-gray-100"
        >
          <h3
            class="text-base sm:text-lg font-medium text-gray-900 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Monthly Attendance
          </h3>
          <p class="mt-2 text-2xl sm:text-3xl font-bold text-indigo-600">
            {{ monthlyAttendance }}%
          </p>
          <p class="text-xs sm:text-sm text-gray-500 mt-1">
            {{ attendedFridays }} out of {{ totalFridays }} Fridays
          </p>
        </div>
        <div
          class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 border border-gray-100"
        >
          <h3
            class="text-base sm:text-lg font-medium text-gray-900 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Total Classes Attended
          </h3>
          <p class="mt-2 text-2xl sm:text-3xl font-bold text-green-600">
            {{ totalClassesAttended }}
          </p>
          <p class="text-xs sm:text-sm text-gray-500 mt-1">
            Out of {{ totalClasses }} classes
          </p>
        </div>
        <div
          class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 border border-gray-100"
        >
          <h3
            class="text-base sm:text-lg font-medium text-gray-900 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Current Streak
          </h3>
          <p class="mt-2 text-2xl sm:text-3xl font-bold text-blue-600">
            {{ currentStreak }} weeks
          </p>
          <p class="text-xs sm:text-sm text-gray-500 mt-1">
            Consecutive attendance
          </p>
        </div>
      </div>

      <!-- Calendar View -->
      <div class="bg-white rounded-xl shadow-lg mb-6 sm:mb-8 overflow-hidden">
        <div class="p-4 sm:p-6">
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2"
          >
            <div class="flex items-center justify-between w-full sm:w-auto">
              <h2
                class="text-lg sm:text-xl font-semibold text-gray-900 flex items-center"
              >
                <svg
                  class="w-5 h-5 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {{ currentMonth }} {{ currentYear }}
              </h2>
              <div class="flex items-center space-x-2 sm:hidden">
                <button
                  @click="previousMonth"
                  class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  :disabled="loading"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  @click="nextMonth"
                  class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  :disabled="loading"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="hidden sm:flex space-x-2">
              <button
                @click="previousMonth"
                class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                :disabled="loading"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button
                @click="nextMonth"
                class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                :disabled="loading"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Month Navigation for Mobile -->
          <div class="sm:hidden mb-4">
            <div
              class="flex items-center justify-between bg-gray-50 rounded-lg p-2"
            >
              <button
                @click="previousMonth"
                class="flex-1 text-center py-2 px-3 rounded-md hover:bg-white transition-colors duration-200"
                :disabled="loading"
              >
                <span class="text-sm font-medium text-gray-700">Previous</span>
              </button>
              <div class="h-6 w-px bg-gray-300 mx-2"></div>
              <button
                @click="nextMonth"
                class="flex-1 text-center py-2 px-3 rounded-md hover:bg-white transition-colors duration-200"
                :disabled="loading"
              >
                <span class="text-sm font-medium text-gray-700">Next</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="friday in fridaysInMonth"
              :key="friday.date"
              class="h-32 border rounded-lg p-4 transition-all duration-200 hover:shadow-md"
              :class="{
                'bg-green-50 border-green-200': friday.attended,
                'bg-red-50 border-red-200':
                  !friday.attended && friday.date < today,
                'bg-gray-50 border-gray-200':
                  !friday.attended && friday.date >= today,
              }"
            >
              <span class="text-sm font-medium text-gray-700">
                Week {{ friday.weekNumber }}
              </span>
              <p class="text-xs text-gray-500 mt-1">
                {{ friday.formattedDate }}
              </p>
              <p
                class="text-xs mt-2"
                :class="friday.attended ? 'text-green-600' : 'text-gray-500'"
              >
                {{
                  friday.attended
                    ? "Present"
                    : friday.date < today
                    ? "Absent"
                    : "Upcoming"
                }}
              </p>
              <button
                v-if="friday.date >= today"
                @click="markAttendance(friday.date, !friday.attended)"
                class="mt-2 text-xs px-3 py-1.5 rounded-full transition-colors duration-200"
                :class="
                  friday.attended
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                "
              >
                {{ friday.attended ? "Mark Absent" : "Mark Present" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Attendance -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-4 sm:p-6">
          <h2
            class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Recent Attendance
          </h2>
          <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(record, index) in attendanceRecords.slice(0, 5)"
                  :key="index"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td
                    class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {{ new Date(record.date).toLocaleDateString() }}
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      :class="
                        record.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ record.status }}
                    </span>
                  </td>
                  <td
                    class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {{ record.time }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: "split",
    // middleware: 'user-auth'
  });

  import { ref, computed, onMounted } from "vue";

  // Current date handling
  const currentDate = ref(new Date());
  const currentMonth = computed(() =>
    currentDate.value.toLocaleString("default", { month: "long" })
  );
  const currentYear = computed(() => currentDate.value.getFullYear());
  const today = new Date();

  // Navigation functions
  const previousMonth = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1
    );
    fetchAttendance();
  };

  const nextMonth = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1
    );
    fetchAttendance();
  };

  // Attendance data
  const attendanceRecords = ref([]);
  const loading = ref(false);

  // Fetch attendance data
  const fetchAttendance = async () => {
    loading.value = true;
    try {
      const response = await $fetch("/api/attendance", {
        query: {
          userId: "current-user-id", // Replace with actual user ID from auth
          month: currentDate.value.getMonth() + 1,
          year: currentDate.value.getFullYear(),
        },
      });
      attendanceRecords.value = response;
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      loading.value = false;
    }
  };

  // Mark attendance
  const markAttendance = async (date, status) => {
    try {
      await $fetch("/api/attendance", {
        method: "POST",
        body: {
          userId: "current-user-id", // Replace with actual user ID from auth
          date: date.toISOString(),
          status: status ? "present" : "absent",
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      });
      await fetchAttendance();
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  // Get all Fridays in the current month
  const fridaysInMonth = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const fridays = [];
    let weekNumber = 1;

    // Get the first day of the month
    const firstDay = new Date(year, month, 1);

    // Find the first Friday of the month
    let firstFriday = new Date(firstDay);
    while (firstFriday.getDay() !== 5) {
      firstFriday.setDate(firstFriday.getDate() + 1);
    }

    // Add all Fridays in the month
    while (firstFriday.getMonth() === month) {
      const attendanceRecord = attendanceRecords.value.find(
        (record) =>
          new Date(record.date).toDateString() === firstFriday.toDateString()
      );

      fridays.push({
        date: new Date(firstFriday),
        weekNumber: weekNumber++,
        formattedDate: firstFriday.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        attended: attendanceRecord?.status === "present",
        recordId: attendanceRecord?.id,
      });
      firstFriday.setDate(firstFriday.getDate() + 7);
    }

    return fridays;
  });

  // Calculate statistics
  const totalFridays = computed(() => fridaysInMonth.value.length);
  const attendedFridays = computed(
    () => fridaysInMonth.value.filter((f) => f.attended).length
  );
  const monthlyAttendance = computed(() => {
    return Math.round((attendedFridays.value / totalFridays.value) * 100);
  });

  // Mock data - these should be replaced with actual data from your backend
  const totalClasses = 16;
  const totalClassesAttended = 12;
  const currentStreak = 3;

  // Fetch initial data
  onMounted(() => {
    fetchAttendance();
  });
</script>
