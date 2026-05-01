<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Attendance Management</h1>
        <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <span class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.94 49.94 0 0 0-9.902 3.912l-.003.002c-.114.06-.254.06-.368 0l-.003-.002a49.938 49.938 0 0 0-9.902-3.912.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
              <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134.403.233.813.295 1.23.04.27.06.544.06.82 0 3.245-1.188 5.892-3.13 7.738C16.038 23.834 14.116 25 12 25s-4.038-1.166-5.951-2.982C4.1 20.175 3 17.585 3 14.34c0-.276.02-.55.06-.82.062-.417.16-.827.295-1.23a48.45 48.45 0 0 1 7.666 3.282.75.75 0 0 0 .584 0l.003-.002.003.002a.75.75 0 0 0 .584 0l.003-.002.003.002Z" />
              <path d="M12.045 2.89L3 8.11V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-9-5.11Z" />
            </svg>
            Teacher Portal
          </span>
          <span class="text-gray-300">•</span>
          <span>Updated Real-time</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary text-xs py-2 px-3">Mark Bulk</button>
      </div>
    </div>

    <!-- Filter Controls Card -->
    <div class="pro-card p-5">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Time Period</label>
          <select
            v-model="viewPeriod"
            @change="onPeriodChange"
            class="w-full bg-gray-50 border-0 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
          >
            <option value="all">All-Time Cumulative</option>
            <option value="lastClasses">Last N Classes</option>
            <option value="monthly">Monthly View</option>
          </select>
        </div>

        <div v-if="viewPeriod === 'lastClasses'" class="space-y-1.5 animate-in fade-in slide-in-from-left-2 transition-all">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Class Count</label>
          <input
            type="number"
            v-model.number="numberOfClasses"
            min="1"
            class="w-full bg-gray-50 border-0 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500"
            placeholder="Count"
          />
        </div>

        <div v-if="viewPeriod === 'monthly'" class="space-y-1.5 animate-in fade-in slide-in-from-left-2 transition-all">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Select Month</label>
          <select
            v-model="selectedMonth"
            class="w-full bg-gray-50 border-0 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option
              v-for="month in availableMonths"
              :key="month.value"
              :value="month.value"
            >
              {{ month.label }}
            </option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Student Focus</label>
          <select
            v-model="studentView"
            class="w-full bg-gray-50 border-0 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 cursor-pointer text-gray-600"
          >
            <option value="all">View All (Overview)</option>
            <option
              v-for="student in studentAttendanceStore.students"
              :key="student.id"
              :value="student.id"
            >
              {{ student.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Data View -->
    <div class="pro-card overflow-hidden">
      <AttendanceTable
        :studentView="studentView"
        :filteredDates="filteredDates"
      />
    </div>
  </div>
</template>

<script setup>
  definePageMeta({ layout: "default" });

  // Stores
  const menuStore = useMenuStore();
  const studentAttendanceStore = useStudentAttendanceStore();

  // View options
  const viewPeriod = ref("all");
  const studentView = ref("all");
  const selectedMonth = ref("");
  const numberOfClasses = ref(7);

  // Computed properties for available months
  const availableMonths = computed(() => {
    const months = [];
    const dates = [...studentAttendanceStore.classDates].sort();
    const monthMap = new Map();

    dates.forEach((date) => {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          value: monthKey,
          label: new Date(year, month).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          }),
        });
      }
    });

    return Array.from(monthMap.values()).sort((a, b) =>
      b.value.localeCompare(a.value)
    );
  });

  // Computed properties
  const filteredDates = computed(() => {
    const dates = [...studentAttendanceStore.classDates].sort();

    if (viewPeriod.value === "lastClasses") {
      const numClasses = parseInt(numberOfClasses.value);
      return dates.slice(-numClasses);
    } else if (viewPeriod.value === "monthly" && selectedMonth.value) {
      const [year, month] = selectedMonth.value.split("-");
      return dates.filter((date) => {
        const dateObj = new Date(date);
        return (
          dateObj.getFullYear() === parseInt(year) &&
          dateObj.getMonth() === parseInt(month) - 1
        );
      });
    }

    return dates;
  });

  // Period change handler
  const onPeriodChange = () => {
    if (
      viewPeriod.value === "monthly" &&
      availableMonths.value.length > 0
    ) {
      selectedMonth.value = availableMonths.value[0].value;
    }
  };

  // Initialize
  onMounted(async () => {
    await studentAttendanceStore.fetchStudents();
    await studentAttendanceStore.fetchClassDates();
    await studentAttendanceStore.fetchAttendance();
    
    studentAttendanceStore.students.forEach((student) => {
      if (!studentAttendanceStore.attendance[student.id]) {
        studentAttendanceStore.attendance[student.id] = {};
      }
    });

    if (availableMonths.value.length > 0) {
      selectedMonth.value = availableMonths.value[0].value;
    }

    // Set Professional Menu for Teacher Panel
    menuStore.links = [
      {
        title: "Overview",
        icon: "Dashboard",
        link: "/admin/dashboard",
      },
      {
        title: "Attendance Desk",
        icon: "Circular",
        link: "/admin/attendance",
      },
      {
         title: "Schedule Class",
         icon: "Settings",
         link: "/admin/add-class-date",
      },
      {
        title: "Student Roster",
        icon: "ViewProfile",
        link: "/admin/add-student",
      },
      {
        title: "Parent Messaging",
        icon: "Circular",
        link: "/admin/hw-sms",
      },
    ];
  });
</script>

