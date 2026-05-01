<template>
  <div class="space-y-6 pb-20 lg:pb-0">
    <!-- Welcome Header -->
    <div class="pro-card p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white border-0 shadow-lg relative overflow-hidden">
       <!-- Decorative circle -->
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Assalamu Alaikum, {{ userInfo?.name }}!</h1>
          <p class="text-primary-100/90 mt-1 text-sm md:text-base font-medium">Welcome to your Teacher Control Panel.</p>
        </div>
        <div class="flex items-center gap-3 bg-white/10 p-2 rounded-2xl backdrop-blur-md self-start md:self-center border border-white/20 shadow-inner">
          <div class="text-right">
            <p class="text-[10px] font-bold uppercase tracking-widest text-primary-200 opacity-80">Today's Date</p>
            <p class="text-sm font-bold">{{ formattedDate }}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg transform rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Grid (Mobile Optimized) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <NuxtLink 
        v-for="action in quickActions" 
        :key="action.title"
        :to="action.link"
        class="pro-card p-4 flex flex-col items-center text-center gap-3 hover:border-primary-300 group transition-all duration-300 active:scale-95"
      >
        <div 
          class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ring-1 ring-gray-100 group-hover:shadow-md group-hover:scale-105"
          :class="action.color"
        >
          <span v-html="action.icon" class="w-7 h-7"></span>
        </div>
        <div>
          <p class="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary-700 transition-colors">{{ action.title }}</p>
          <p class="text-[10px] text-gray-500 mt-1 font-medium">{{ action.desc }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Stats & Management -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2 space-y-6">
        <!-- Highlights -->
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="stat in statsWithIcons" :key="stat.label" class="pro-card p-5 relative overflow-hidden group hover:bg-white transition-colors">
            <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-primary-900">
              <span v-html="stat.icon" class="w-24 h-24"></span>
            </div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ stat.label }}</p>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-3xl font-black text-gray-900 tracking-tighter">{{ stat.value }}</span>
              <span 
                v-if="stat.change"
                class="text-[10px] font-bold px-1.5 py-0.5 rounded-lg border"
                :class="[
                  stat.changeType === 'increase' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                  stat.changeType === 'decrease' ? 'text-red-600 bg-red-50 border-red-100' : 
                  'text-gray-600 bg-gray-50 border-gray-100'
                ]"
              >
                {{ stat.change }}
              </span>
            </div>
          </div>
        </div>

        <!-- Progress Log -->
        <div class="pro-card overflow-hidden">
          <div class="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900 tracking-tight">Student Activity Log</h3>
            <button class="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest border border-primary-100 px-3 py-1 rounded-lg">History</button>
          </div>
          <div class="divide-y divide-gray-50">
            <div v-if="dashboardStore.recentActivity.length === 0" class="p-8 text-center text-gray-400 text-sm italic">
              No recent activity found.
            </div>
            <div v-for="activity in dashboardStore.recentActivity" :key="activity.id" class="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer group">
              <div 
                class="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center font-black border transition-all"
                :class="[
                  activity.status === 'present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  activity.status === 'recording' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-red-50 text-red-600 border-red-100'
                ]"
              >
                {{ activity.status[0].toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 truncate">{{ activity.studentName }}</p>
                <p class="text-xs text-gray-400 truncate font-medium">
                  Marked as {{ activity.status }} • {{ formatTimeAgo(activity.updatedAt) }}
                </p>
              </div>
              <div class="flex gap-1.5">
                 <div 
                  class="w-2 h-2 rounded-full shadow-sm"
                  :class="[
                    activity.status === 'present' ? 'bg-emerald-500 shadow-emerald-200' :
                    activity.status === 'recording' ? 'bg-blue-500 shadow-blue-200' :
                    'bg-red-500 shadow-red-200'
                  ]"
                 ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Section -->
      <div class="space-y-6">
        <div class="pro-card p-5 border-0 bg-primary-900 text-white shadow-xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary-800/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <h3 class="text-lg font-bold mb-5 flex items-center gap-2 relative z-10 text-primary-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-emerald-400">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd" />
            </svg>
            Upcoming Schedule
          </h3>
          <div class="space-y-4 relative z-10">
            <div v-if="dashboardStore.upcomingClasses.length === 0" class="text-center text-primary-300 text-xs italic py-4">
              No classes scheduled.
            </div>
            <div v-for="cls in dashboardStore.upcomingClasses" :key="cls.date" class="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex gap-4 hover:bg-white/20 transition-all">
              <div class="text-center bg-white/20 px-3 py-2 rounded-xl font-black min-w-[55px] shadow-inner">
                <p class="text-[9px] text-primary-200 uppercase tracking-tighter">{{ formatDay(cls.date) }}</p>
                <p class="text-sm">{{ formatDayNum(cls.date) }}</p>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold truncate">{{ cls.note }}</p>
                <p class="text-[10px] text-primary-200 font-bold uppercase tracking-widest mt-1 opacity-80">{{ formatMonth(cls.date) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Graph -->
        <div class="pro-card p-5">
           <div class="flex items-center justify-between mb-4">
              <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance Health</h3>
              <span class="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Real-time</span>
           </div>
           <div class="flex items-end gap-2 h-24 mb-2 px-1">
              <div v-if="dashboardStore.attendanceHealth.length === 0" class="flex-1 text-center text-[10px] text-gray-300 italic self-center">
                Insufficient data.
              </div>
              <div v-for="item in dashboardStore.attendanceHealth" :key="item.date" 
                   @click="selectedBar = item.date"
                   class="flex-1 bg-gray-100 rounded-lg relative group cursor-help transition-all hover:bg-primary-100"
                   :style="{ height: (item.rate || 5) + '%' }">
                 <div 
                   class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-2 py-1 rounded-lg transition-all z-20 whitespace-nowrap shadow-xl border border-white/10"
                   :class="[
                     selectedBar === item.date ? 'opacity-100 visible -translate-y-1' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:-translate-y-1'
                   ]"
                 >
                    {{ item.rate }}% Attendance<br/>
                    <span class="text-gray-400">{{ item.date }}</span>
                    <!-- Small arrow -->
                    <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-white/10"></div>
                 </div>
                 <div class="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-lg transition-all" :style="{ height: '100%' }"></div>
              </div>
           </div>
           <p class="text-[10px] text-gray-400 font-medium text-center">Trend of last {{ dashboardStore.attendanceHealth.length }} sessions</p>
           <p class="lg:hidden text-[9px] text-gray-400 text-center mt-1">Tap bars to view details</p>
        </div>
      </div>
     </div>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'default'
  });

  const dashboardStore = useDashboardStore();
  const menuStore = useMenuStore();
  const userInfoStore = useUserInfoStore();
  const studentAttendanceStore = useStudentAttendanceStore();
  const userInfo = computed(() => userInfoStore.userInfo);
  const selectedBar = ref(null);

  const formattedDate = computed(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  });

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now - past;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  const formatDay = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDayNum = (dateStr) => {
    return new Date(dateStr).getDate();
  };

  const formatMonth = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Dynamic stats from store
  const statsWithIcons = computed(() => {
    const icons = [
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>',
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
    ];
    
    return dashboardStore.stats.map((stat, index) => ({
      ...stat,
      label: stat.title,
      icon: icons[index] || icons[0]
    }));
  });

  const quickActions = [
    {
      title: 'Attendance',
      desc: 'Mark daily',
      link: '/admin/attendance',
      color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 ring-emerald-100',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>'
    },
    {
      title: 'Students',
      desc: 'Management',
      link: '/admin/students',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 ring-blue-100',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>'
    },
    {
      title: 'Schedule',
      desc: 'New Class',
      link: '/admin/add-class-date',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100 ring-purple-100',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>'
    },
    {
      title: 'SMS & HW',
      desc: 'Notices',
      link: '/admin/hw-sms',
      color: 'bg-amber-50 text-amber-600 hover:bg-amber-100 ring-amber-100',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>'
    }
  ];

  onMounted(async () => {
    await userInfoStore.getProfileInfo();
    await dashboardStore.fetchStats();
    await studentAttendanceStore.fetchStudents();
  });
</script>
