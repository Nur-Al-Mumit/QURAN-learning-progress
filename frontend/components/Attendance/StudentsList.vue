<template>
  <section class="space-y-6">
    <!-- Summary Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in summaryStats"
        :key="stat.label"
        class="pro-card p-5 relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300"
      >
        <div class="absolute -right-4 -bottom-4 opacity-[0.06] group-hover:opacity-[0.12] group-hover:scale-110 transition-all duration-500 text-gray-700">
          <span v-html="stat.icon" class="w-20 h-20 block"></span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ stat.label }}</p>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{{ stat.value }}</span>
          <span v-if="stat.suffix" class="text-xs font-bold text-gray-400">{{ stat.suffix }}</span>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="pro-card overflow-hidden">
      <!-- Toolbar -->
      <div class="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center gap-3">
        <!-- Search -->
        <div class="relative flex-1 min-w-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search by name, email or ID..."
            class="w-full bg-gray-50 border-0 rounded-xl pl-10 pr-9 py-2.5 text-sm font-medium placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-primary-500 transition-all"
          />
          <button
            v-if="searchTerm"
            @click="searchTerm = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            title="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Attendance filter -->
          <select
            v-model="attendanceFilter"
            class="bg-gray-50 border-0 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
            title="Filter by attendance"
          >
            <option value="all">All Students</option>
            <option value="excellent">Excellent (80%+)</option>
            <option value="good">Good (60–79%)</option>
            <option value="risk">At Risk (&lt;60%)</option>
            <option value="none">No Records</option>
          </select>

          <!-- Rows per page -->
          <select
            v-model.number="itemsPerPage"
            class="bg-gray-50 border-0 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
            title="Rows per page"
          >
            <option :value="10">10 rows</option>
            <option :value="25">25 rows</option>
            <option :value="50">50 rows</option>
            <option :value="100">100 rows</option>
          </select>

          <!-- Export CSV -->
          <button
            @click="exportCsv"
            :disabled="filteredStudents.length === 0"
            class="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 hover:text-gray-900 active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            title="Export current view as CSV"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span class="hidden sm:inline">CSV</span>
          </button>

          <!-- Add Student -->
          <button
            @click="openAddModal"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 active:scale-95 transition-all shadow-sm shadow-primary-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Student
          </button>
        </div>
      </div>

      <!-- Bulk Actions Bar -->
      <div
        v-if="selectedIds.length > 0"
        class="px-5 py-3 bg-primary-50/70 border-b border-primary-100 flex flex-wrap items-center justify-between gap-3"
      >
        <p class="text-sm font-bold text-primary-800">
          {{ selectedIds.length }} student{{ selectedIds.length > 1 ? "s" : "" }} selected
        </p>
        <div class="flex items-center gap-2">
          <button
            @click="confirmDeleteSelected"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Delete Selected
          </button>
          <button
            @click="selectedIds = []"
            class="px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-800 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="relative">
        <!-- Right-edge fade hints there is more content to scroll on small screens -->
        <div
          v-if="tableCanScroll && !tableAtEnd"
          class="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-50/90 to-transparent pointer-events-none z-10 print:hidden"
        ></div>
        <div ref="tableWrapper" class="overflow-x-auto custom-scrollbar" @scroll.passive="onTableScroll">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-100">
              <!-- Select -->
              <th scope="col" class="w-14 px-4 py-3.5 sticky left-0 z-20 bg-gray-50">
                <input
                  type="checkbox"
                  :checked="allOnPageSelected"
                  :indeterminate="someOnPageSelected && !allOnPageSelected"
                  @change="toggleSelectAll"
                  class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  title="Select all on this page"
                />
              </th>
              <!-- Student -->
              <th scope="col" class="px-4 py-3.5 text-left sticky left-14 z-20 bg-gray-50 min-w-[240px]">
                <button
                  @click="toggleSort('name')"
                  class="group inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors"
                  :class="sortKey === 'name' ? 'text-primary-700' : 'text-gray-400 hover:text-gray-600'"
                >
                  Student
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3" :class="sortKey === 'name' ? 'text-primary-600' : 'text-gray-300 group-hover:text-gray-400'">
                    <path v-if="sortKey !== 'name'" stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18l3.75-3M8.25 9 12 6l3.75 3" />
                    <path v-else-if="sortDir === 1" stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </th>
              <!-- ID -->
              <th scope="col" class="hidden lg:table-cell px-4 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                ID
              </th>
              <!-- Attendance -->
              <th scope="col" class="px-4 py-3.5 text-center">
                <button
                  @click="toggleSort('present')"
                  class="group inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors"
                  :class="sortKey === 'present' ? 'text-primary-700' : 'text-gray-400 hover:text-gray-600'"
                >
                  Attendance
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3" :class="sortKey === 'present' ? 'text-primary-600' : 'text-gray-300 group-hover:text-gray-400'">
                    <path v-if="sortKey !== 'present'" stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18l3.75-3M8.25 9 12 6l3.75 3" />
                    <path v-else-if="sortDir === 1" stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </th>
              <!-- Rate -->
              <th scope="col" class="px-4 py-3.5 text-left min-w-[160px]">
                <button
                  @click="toggleSort('rate')"
                  class="group inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors"
                  :class="sortKey === 'rate' ? 'text-primary-700' : 'text-gray-400 hover:text-gray-600'"
                >
                  Rate
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3" :class="sortKey === 'rate' ? 'text-primary-600' : 'text-gray-300 group-hover:text-gray-400'">
                    <path v-if="sortKey !== 'rate'" stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18l3.75-3M8.25 9 12 6l3.75 3" />
                    <path v-else-if="sortDir === 1" stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </th>
              <!-- Joined -->
              <th scope="col" class="hidden xl:table-cell px-4 py-3.5 text-left">
                <button
                  @click="toggleSort('joined')"
                  class="group inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors"
                  :class="sortKey === 'joined' ? 'text-primary-700' : 'text-gray-400 hover:text-gray-600'"
                >
                  Joined
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3" :class="sortKey === 'joined' ? 'text-primary-600' : 'text-gray-300 group-hover:text-gray-400'">
                    <path v-if="sortKey !== 'joined'" stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18l3.75-3M8.25 9 12 6l3.75 3" />
                    <path v-else-if="sortDir === 1" stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </th>
              <!-- Actions -->
              <th scope="col" class="px-4 py-3.5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <!-- Loading Skeleton -->
            <template v-if="studentAttendanceStore.loading && props.students.length === 0">
              <tr v-for="i in 8" :key="`skeleton-${i}`" class="animate-pulse">
                <td class="px-4 py-4 sticky left-0 z-10 bg-white"><div class="w-4 h-4 bg-gray-200 rounded"></div></td>
                <td class="px-4 py-4 sticky left-14 z-10 bg-white">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-gray-100 rounded-xl"></div>
                    <div class="space-y-1.5">
                      <div class="h-3.5 bg-gray-200 rounded w-28"></div>
                      <div class="h-2.5 bg-gray-100 rounded w-36"></div>
                    </div>
                  </div>
                </td>
                <td class="hidden lg:table-cell px-4 py-4"><div class="h-3 bg-gray-100 rounded w-14"></div></td>
                <td class="px-4 py-4"><div class="h-5 bg-gray-100 rounded-full w-28 mx-auto"></div></td>
                <td class="px-4 py-4"><div class="h-5 bg-gray-100 rounded-full w-32"></div></td>
                <td class="hidden xl:table-cell px-4 py-4"><div class="h-3 bg-gray-100 rounded w-16"></div></td>
                <td class="px-4 py-4"><div class="h-7 bg-gray-100 rounded-lg w-16 ml-auto"></div></td>
              </tr>
            </template>

            <!-- Rows -->
            <template v-else-if="paginatedStudents.length > 0">
              <tr
                v-for="student in paginatedStudents"
                :key="student.id"
                class="group transition-colors"
                :class="isSelected(student.id) ? 'bg-primary-50' : 'bg-white hover:bg-gray-50/70'"
              >
                <!-- Select -->
                <td
                  class="px-4 py-3.5 sticky left-0 z-10 transition-colors"
                  :class="isSelected(student.id) ? 'bg-primary-50' : 'bg-white group-hover:bg-gray-50/70'"
                >
                  <input
                    type="checkbox"
                    :checked="isSelected(student.id)"
                    @change="toggleSelect(student.id)"
                    class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    :title="`Select ${student.name}`"
                  />
                </td>

                <!-- Student -->
                <td
                  class="px-4 py-3.5 sticky left-14 z-10 transition-colors"
                  :class="isSelected(student.id) ? 'bg-primary-50' : 'bg-white group-hover:bg-gray-50/70'"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white"
                      :class="avatarGradient(student.name)"
                    >
                      <span class="text-xs font-black text-white drop-shadow">{{ getInitials(student.name) }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="font-bold text-gray-900 truncate max-w-[180px] leading-tight" :title="student.name">
                        {{ student.name }}
                      </p>
                      <p v-if="student.email" class="text-[11px] text-gray-400 truncate max-w-[180px]" :title="student.email">
                        {{ student.email }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- ID -->
                <td class="hidden lg:table-cell px-4 py-3.5 whitespace-nowrap">
                  <span class="font-mono text-[11px] text-gray-400" :title="student.id">
                    {{ shortId(student.id) }}
                  </span>
                </td>

                <!-- Attendance counts -->
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <div v-if="statsFor(student).marked > 0" class="flex items-center justify-center gap-1">
                    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-50 text-green-700 text-[11px] font-bold tabular-nums" title="Present">
                      ✓ {{ statsFor(student).present }}
                    </span>
                    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-50 text-red-600 text-[11px] font-bold tabular-nums" title="Absent">
                      ✗ {{ statsFor(student).absent }}
                    </span>
                    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-bold tabular-nums" title="Watched recording">
                      ◯ {{ statsFor(student).recording }}
                    </span>
                  </div>
                  <span v-else class="text-[11px] text-gray-300 font-medium">No records</span>
                </td>

                <!-- Rate -->
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <div v-if="statsFor(student).rate !== null" class="flex items-center gap-2.5">
                    <div class="flex-1 h-1.5 bg-gray-200/80 rounded-full overflow-hidden min-w-[72px]">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="rateBarClass(statsFor(student).rate)"
                        :style="{ width: statsFor(student).rate + '%' }"
                      ></div>
                    </div>
                    <span class="text-xs font-black tabular-nums w-9 text-right" :class="rateTextClass(statsFor(student).rate)">
                      {{ statsFor(student).rate }}%
                    </span>
                  </div>
                  <span v-else class="text-xs text-gray-300 font-bold">—</span>
                </td>

                <!-- Joined -->
                <td class="hidden xl:table-cell px-4 py-3.5 whitespace-nowrap">
                  <span v-if="student.createdAt" class="text-xs font-medium text-gray-500">
                    {{ formatDate(student.createdAt) }}
                  </span>
                  <span v-else class="text-xs text-gray-300">—</span>
                </td>

                <!-- Actions -->
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="openEditModal(student)"
                      class="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 active:scale-90 transition-all"
                      title="Edit student"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button
                      @click="confirmDelete(student)"
                      class="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 active:scale-90 transition-all"
                      title="Remove student"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Empty State -->
            <tr v-else>
              <td colspan="7" class="px-4 py-16">
                <div class="flex flex-col items-center text-center max-w-sm mx-auto">
                  <div class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4 ring-1 ring-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                  </div>
                  <h4 class="text-sm font-bold text-gray-900">
                    {{ hasActiveFilters ? "No students match your filters" : "No students yet" }}
                  </h4>
                  <p class="text-xs text-gray-400 mt-1.5 leading-relaxed">
                    {{ hasActiveFilters
                      ? "Try a different search term or clear the attendance filter."
                      : "Add your first student to start tracking their Quran learning progress." }}
                  </p>
                  <button
                    v-if="hasActiveFilters"
                    @click="clearFilters"
                    class="mt-4 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 active:scale-95 transition-all"
                  >
                    Clear Filters
                  </button>
                  <button
                    v-else
                    @click="openAddModal"
                    class="mt-4 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-white bg-primary-600 rounded-xl hover:bg-primary-700 active:scale-95 transition-all shadow-sm shadow-primary-100"
                  >
                    Add Student
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <!-- Footer / Pagination -->
      <div class="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-gray-400 font-medium order-2 sm:order-1">
          {{ rangeText }}
          <span v-if="hasActiveFilters" class="text-gray-300">· filtered from {{ props.students.length }} total</span>
        </p>
        <div class="order-1 sm:order-2">
          <Pagination
            v-model:current-page="currentPage"
            :total-items="props.students.length"
            :filtered-items="filteredStudents.length"
            :items-per-page="itemsPerPage"
            item-type="students"
            :show-summary="false"
          />
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <Modal v-model:is-open="showStudentModal">
      <template #header>
        <div class="p-5 pb-0 flex flex-col items-center text-center">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
            :class="isEditing ? 'bg-primary-50 text-primary-600' : 'bg-primary-600 text-white'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path v-if="isEditing" stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">
            {{ isEditing ? "Update Student" : "Add New Student" }}
          </h3>
          <p class="text-xs text-gray-400 mt-1">
            {{ isEditing ? "Update the student's details below." : "Leave email empty to auto-generate one." }}
          </p>
        </div>
      </template>
      <template #body>
        <form class="p-5 space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-1.5">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              Full Name <span class="text-red-400">*</span>
            </label>
            <input
              ref="nameInput"
              v-model="form.name"
              type="text"
              placeholder="e.g. Abdur Rouf"
              class="w-full bg-gray-50 border-0 rounded-xl px-4 py-2.5 text-sm font-medium placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-primary-500 transition-all"
              :class="formErrors.name ? 'ring-2 ring-red-300' : ''"
            />
            <p v-if="formErrors.name" class="text-[11px] font-medium text-red-500 px-1">{{ formErrors.name }}</p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              Email <span class="text-gray-300 font-bold">(optional)</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="e.g. student@example.com"
              class="w-full bg-gray-50 border-0 rounded-xl px-4 py-2.5 text-sm font-medium placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-primary-500 transition-all"
              :class="formErrors.email ? 'ring-2 ring-red-300' : ''"
            />
            <p v-if="formErrors.email" class="text-[11px] font-medium text-red-500 px-1">{{ formErrors.email }}</p>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-center gap-3 px-5 pb-5">
          <button
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 active:scale-95 transition-all shadow-sm shadow-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isEditing ? "Save Changes" : "Add Student" }}
          </button>
          <button
            @click="showStudentModal = false"
            :disabled="isSubmitting"
            class="px-5 py-2.5 bg-white text-gray-500 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 hover:text-gray-700 active:scale-95 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model:is-open="showDeleteModal">
      <template #header>
        <div class="p-5 pb-0 flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-3 ring-1 ring-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Remove {{ pendingDelete.ids.length > 1 ? `${pendingDelete.ids.length} Students` : "Student" }}?</h3>
          <p class="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
            <template v-if="pendingDelete.ids.length > 1">
              You are about to permanently remove <span class="font-bold text-gray-600">{{ pendingDelete.ids.length }} selected students</span>.
            </template>
            <template v-else>
              <span class="font-bold text-gray-600">{{ pendingDelete.label }}</span> will be permanently removed.
            </template>
            This will also affect their attendance history.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-center gap-3 p-5 pt-3">
          <button
            @click="handleDelete"
            :disabled="isDeleting"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 active:scale-95 transition-all shadow-sm shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isDeleting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Yes, Remove
          </button>
          <button
            @click="showDeleteModal = false"
            :disabled="isDeleting"
            class="px-5 py-2.5 bg-white text-gray-500 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 hover:text-gray-700 active:scale-95 transition-all disabled:opacity-50"
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
    students: {
      type: Array,
      required: true,
    },
  });

  // Store
  const studentAttendanceStore = useStudentAttendanceStore();

  // --------------- Table state ---------------
  const searchTerm = ref("");
  const attendanceFilter = ref("all");
  const sortKey = ref("name");
  const sortDir = ref(1); // 1 = asc, -1 = desc
  const currentPage = ref(1);
  const itemsPerPage = ref(25);
  const selectedIds = ref([]);

  // --------------- Modal state ---------------
  const showStudentModal = ref(false);
  const isEditing = ref(false);
  const editingId = ref("");
  const form = ref({ name: "", email: "" });
  const formErrors = ref({ name: "", email: "" });
  const isSubmitting = ref(false);

  const showDeleteModal = ref(false);
  const isDeleting = ref(false);
  const pendingDelete = ref({ ids: [], label: "" });

  // --------------- Attendance stats ---------------
  // Per-student counts + rate, derived once from the attendance map
  const statsMap = computed(() => {
    const map = {};
    props.students.forEach((student) => {
      const records = studentAttendanceStore.attendance[student.id] || {};
      let present = 0;
      let absent = 0;
      let recording = 0;
      Object.values(records).forEach((status) => {
        if (status === "present") present++;
        else if (status === "absent") absent++;
        else if (status === "recording") recording++;
      });
      const marked = present + absent + recording;
      map[student.id] = {
        present,
        absent,
        recording,
        marked,
        rate: marked > 0 ? Math.round(((present + recording) / marked) * 100) : null,
      };
    });
    return map;
  });

  const statsFor = (student) =>
    statsMap.value[student.id] || { present: 0, absent: 0, recording: 0, marked: 0, rate: null };

  const summaryStats = computed(() => {
    const rates = Object.values(statsMap.value)
      .map((s) => s.rate)
      .filter((r) => r !== null);
    const avg = rates.length > 0 ? Math.round(rates.reduce((sum, r) => sum + r, 0) / rates.length) : null;
    const atRisk = Object.values(statsMap.value).filter((s) => s.rate !== null && s.rate < 60).length;
    const noRecords = Object.values(statsMap.value).filter((s) => s.rate === null).length;

    return [
      {
        label: "Total Students",
        value: props.students.length,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>',
      },
      {
        label: "Avg Attendance",
        value: avg ?? "—",
        suffix: avg !== null ? "%" : "",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>',
      },
      {
        label: "At Risk (<60%)",
        value: atRisk,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>',
      },
      {
        label: "No Records",
        value: noRecords,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
      },
    ];
  });

  // --------------- Filtering / sorting / paging ---------------
  const hasActiveFilters = computed(
    () => searchTerm.value.trim() !== "" || attendanceFilter.value !== "all"
  );

  const filteredStudents = computed(() => {
    const term = searchTerm.value.trim().toLowerCase();

    return props.students.filter((student) => {
      const matchesTerm =
        term === "" ||
        student.name.toLowerCase().includes(term) ||
        (student.email || "").toLowerCase().includes(term) ||
        (student.id || "").toLowerCase().includes(term);

      if (!matchesTerm) return false;

      if (attendanceFilter.value === "all") return true;
      const rate = statsFor(student).rate;
      switch (attendanceFilter.value) {
        case "excellent":
          return rate !== null && rate >= 80;
        case "good":
          return rate !== null && rate >= 60 && rate < 80;
        case "risk":
          return rate !== null && rate < 60;
        case "none":
          return rate === null;
        default:
          return true;
      }
    });
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredStudents.value.length / itemsPerPage.value))
  );

  const sortedStudents = computed(() => {
    const list = [...filteredStudents.value];
    const dir = sortDir.value;

    list.sort((a, b) => {
      let va;
      let vb;

      switch (sortKey.value) {
        case "present":
          va = statsFor(a).present + statsFor(a).recording;
          vb = statsFor(b).present + statsFor(b).recording;
          break;
        case "rate":
          va = statsFor(a).rate ?? -1;
          vb = statsFor(b).rate ?? -1;
          break;
        case "joined":
          va = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          vb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          break;
        default:
          va = (a.name || "").toLowerCase();
          vb = (b.name || "").toLowerCase();
      }

      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return (a.name || "").localeCompare(b.name || "");
    });

    return list;
  });

  const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return sortedStudents.value.slice(start, start + itemsPerPage.value);
  });

  const rangeText = computed(() => {
    const total = filteredStudents.value.length;
    if (total === 0) return "No students to show";
    const start = (currentPage.value - 1) * itemsPerPage.value + 1;
    const end = Math.min(start + itemsPerPage.value - 1, total);
    return `Showing ${start}–${end} of ${total} students`;
  });

  const toggleSort = (key) => {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value * -1;
    } else {
      sortKey.value = key;
      sortDir.value = 1;
    }
  };

  const clearFilters = () => {
    searchTerm.value = "";
    attendanceFilter.value = "all";
  };

  // Reset paging whenever the result set or page size changes
  watch([searchTerm, attendanceFilter], () => {
    currentPage.value = 1;
  });

  watch(itemsPerPage, () => {
    currentPage.value = 1;
  });

  watch(filteredStudents, () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  });

  // --------------- Selection ---------------
  const pageIds = computed(() => paginatedStudents.value.map((s) => s.id));

  const isSelected = (id) => selectedIds.value.includes(id);

  const toggleSelect = (id) => {
    selectedIds.value = isSelected(id)
      ? selectedIds.value.filter((i) => i !== id)
      : [...selectedIds.value, id];
  };

  const allOnPageSelected = computed(
    () => pageIds.value.length > 0 && pageIds.value.every((id) => selectedIds.value.includes(id))
  );

  const someOnPageSelected = computed(() =>
    pageIds.value.some((id) => selectedIds.value.includes(id))
  );

  const toggleSelectAll = () => {
    if (allOnPageSelected.value) {
      selectedIds.value = selectedIds.value.filter((id) => !pageIds.value.includes(id));
    } else {
      selectedIds.value = [...new Set([...selectedIds.value, ...pageIds.value])];
    }
  };

  // --------------- Add / Edit ---------------
  const nameInput = ref(null);

  const openAddModal = () => {
    isEditing.value = false;
    editingId.value = "";
    form.value = { name: "", email: "" };
    formErrors.value = { name: "", email: "" };
    showStudentModal.value = true;
    nextTick(() => nameInput.value?.focus());
  };

  const openEditModal = (student) => {
    isEditing.value = true;
    editingId.value = student.id;
    form.value = { name: student.name, email: student.email || "" };
    formErrors.value = { name: "", email: "" };
    showStudentModal.value = true;
    nextTick(() => nameInput.value?.focus());
  };

  const validateForm = () => {
    const errors = { name: "", email: "" };
    const name = form.value.name.trim();
    const email = form.value.email.trim();

    if (!name) {
      errors.name = "Student name is required";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    formErrors.value = errors;
    return !errors.name && !errors.email;
  };

  const handleSubmit = async () => {
    if (isSubmitting.value || !validateForm()) return;

    isSubmitting.value = true;
    try {
      const name = form.value.name.trim();
      const email = form.value.email.trim();

      const success = isEditing.value
        ? await studentAttendanceStore.updateStudent(editingId.value, name, email)
        : await studentAttendanceStore.addStudent(name, email);

      if (success) {
        showStudentModal.value = false;
      }
    } finally {
      isSubmitting.value = false;
    }
  };

  // Reset form state when the add/edit modal closes
  watch(showStudentModal, (isOpen) => {
    if (!isOpen) {
      isEditing.value = false;
      editingId.value = "";
      form.value = { name: "", email: "" };
      formErrors.value = { name: "", email: "" };
    }
  });

  // --------------- Delete ---------------
  const confirmDelete = (student) => {
    pendingDelete.value = { ids: [student.id], label: student.name };
    showDeleteModal.value = true;
  };

  const confirmDeleteSelected = () => {
    pendingDelete.value = { ids: [...selectedIds.value], label: "" };
    showDeleteModal.value = true;
  };

  const handleDelete = async () => {
    if (isDeleting.value) return;

    isDeleting.value = true;
    try {
      await Promise.all(pendingDelete.value.ids.map((id) => studentAttendanceStore.removeStudent(id)));
      selectedIds.value = selectedIds.value.filter((id) => !pendingDelete.value.ids.includes(id));
      showDeleteModal.value = false;
    } finally {
      isDeleting.value = false;
    }
  };

  // --------------- CSV export ---------------
  const exportCsv = () => {
    if (sortedStudents.value.length === 0) return;

    const header = ["Name", "Email", "ID", "Present", "Absent", "Recording", "Attendance Rate (%)", "Joined"];
    const rows = sortedStudents.value.map((s) => {
      const stats = statsFor(s);
      return [
        s.name,
        s.email,
        s.id,
        stats.present,
        stats.absent,
        stats.recording,
        stats.rate ?? "",
        s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-US") : "",
      ];
    });

    const escapeCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `students-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --------------- Table horizontal scroll hint ---------------
  const tableWrapper = ref(null);
  const tableCanScroll = ref(false);
  const tableAtEnd = ref(false);

  const onTableScroll = () => {
    const el = tableWrapper.value;
    if (!el) return;
    tableCanScroll.value = el.scrollWidth > el.clientWidth;
    tableAtEnd.value = el.scrollWidth - el.clientWidth - el.scrollLeft < 8;
  };

  onMounted(() => nextTick(onTableScroll));
  watch(() => props.students.length, () => nextTick(onTableScroll));

  // --------------- Display helpers ---------------
  const AVATAR_GRADIENTS = [
    "from-emerald-400 to-teal-600",
    "from-sky-400 to-blue-600",
    "from-violet-400 to-purple-600",
    "from-rose-400 to-pink-600",
    "from-amber-400 to-orange-600",
    "from-lime-500 to-green-600",
    "from-cyan-400 to-sky-600",
    "from-fuchsia-400 to-purple-600",
  ];

  const getInitials = (name) =>
    (name || "")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2) || "?";

  const avatarGradient = (name) => {
    const hash = (name || "").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
  };

  const shortId = (id) => (id ? `${id.slice(0, 4)}…${id.slice(-4)}` : "—");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const rateBarClass = (rate) => {
    if (rate >= 80) return "bg-primary-500";
    if (rate >= 60) return "bg-amber-400";
    return "bg-red-400";
  };

  const rateTextClass = (rate) => {
    if (rate >= 80) return "text-primary-700";
    if (rate >= 60) return "text-amber-600";
    return "text-red-500";
  };
</script>
