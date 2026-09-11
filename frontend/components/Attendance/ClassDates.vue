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
            placeholder="Search dates (e.g. Jan 2026, 2026-01, Friday...)"
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
          <!-- Month filter -->
          <select
            v-model="monthFilter"
            class="bg-gray-50 border-0 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer max-w-[190px]"
            title="Filter by month"
          >
            <option value="all">All Months</option>
            <option v-for="month in availableMonths" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
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

          <!-- Add Class Date -->
          <button
            @click="openAddModal"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 active:scale-95 transition-all shadow-sm shadow-primary-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Class Date
          </button>
        </div>
      </div>

      <!-- Bulk Actions Bar -->
      <div
        v-if="selectedDates.length > 0"
        class="px-5 py-3 bg-primary-50/70 border-b border-primary-100 flex flex-wrap items-center justify-between gap-3"
      >
        <p class="text-sm font-bold text-primary-800">
          {{ selectedDates.length }} date{{ selectedDates.length > 1 ? "s" : "" }} selected
        </p>
        <div class="flex items-center gap-2">
          <button
            @click="confirmDeleteSelected"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Remove Selected
          </button>
          <button
            @click="selectedDates = []"
            class="px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-800 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="relative">
        <div ref="tableWrapper" class="overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-gray-50/80 border-b border-gray-100">
                <!-- Select -->
                <th scope="col" class="w-14 px-4 py-3.5">
                  <input
                    type="checkbox"
                    :checked="allOnPageSelected"
                    :indeterminate="someOnPageSelected && !allOnPageSelected"
                    @change="toggleSelectAll"
                    class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    title="Select all on this page"
                  />
                </th>
                <!-- Date -->
                <th scope="col" class="px-4 py-3.5 text-left">
                  <button
                    @click="toggleSort"
                    class="group inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors"
                    :class="sortDir === -1 ? 'text-primary-700' : 'text-gray-400 hover:text-gray-600'"
                  >
                    Date
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3" :class="sortDir === -1 ? 'text-primary-600' : 'text-gray-300 group-hover:text-gray-400'">
                      <path v-if="sortDir === 1" stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </th>
                <!-- Status -->
                <th scope="col" class="px-4 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Status
                </th>
                <!-- Attendance -->
                <th scope="col" class="px-4 py-3.5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Attendance Marked
                </th>
                <!-- Actions -->
                <th scope="col" class="px-4 py-3.5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
              <!-- Loading Skeleton -->
              <template v-if="studentAttendanceStore.loading && props.filteredDates.length === 0">
                <tr v-for="i in 8" :key="`skeleton-${i}`" class="animate-pulse">
                  <td class="px-4 py-4"><div class="w-4 h-4 bg-gray-200 rounded"></div></td>
                  <td class="px-4 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 bg-gray-100 rounded-xl"></div>
                      <div class="space-y-1.5">
                        <div class="h-3.5 bg-gray-200 rounded w-28"></div>
                        <div class="h-2.5 bg-gray-100 rounded w-20"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4"><div class="h-5 bg-gray-100 rounded-full w-20"></div></td>
                  <td class="px-4 py-4"><div class="h-5 bg-gray-100 rounded-full w-32 mx-auto"></div></td>
                  <td class="px-4 py-4"><div class="h-8 bg-gray-100 rounded-lg w-8 ml-auto"></div></td>
                </tr>
              </template>

              <!-- Rows -->
              <template v-else-if="paginatedDates.length > 0">
                <tr
                  v-for="date in paginatedDates"
                  :key="date"
                  class="group transition-colors"
                  :class="isSelected(date) ? 'bg-primary-50' : 'bg-white hover:bg-gray-50/70'"
                >
                  <!-- Select -->
                  <td class="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      :checked="isSelected(date)"
                      @change="toggleSelect(date)"
                      class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      :title="`Select ${formatFullDate(date)}`"
                    />
                  </td>

                  <!-- Date -->
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm"
                        :class="dateStatus(date) === 'upcoming' ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-100' : 'bg-gray-50 text-gray-500 ring-1 ring-gray-100'"
                      >
                        <span class="text-[9px] font-black uppercase tracking-wider leading-none">{{ formatMonth(date) }}</span>
                        <span class="text-base font-black leading-none mt-0.5 tabular-nums">{{ formatDateNumber(date) }}</span>
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 leading-tight">{{ formatFullDate(date) }}</p>
                        <p class="text-[11px] text-gray-400 font-medium mt-0.5">
                          {{ formatDay(date) }} · {{ relativeLabel(date) }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                      :class="statusClass(date)"
                    >
                      <span class="w-1.5 h-1.5 rounded-full current-color-bg"></span>
                      {{ statusLabel(date) }}
                    </span>
                  </td>

                  <!-- Attendance Marked -->
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div v-if="markedCountFor(date) > 0" class="flex items-center justify-center gap-1">
                      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-50 text-green-700 text-[11px] font-bold tabular-nums" title="Present">
                        ✓ {{ statsFor(date).present }}
                      </span>
                      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-50 text-red-600 text-[11px] font-bold tabular-nums" title="Absent">
                        ✗ {{ statsFor(date).absent }}
                      </span>
                      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-bold tabular-nums" title="Watched recording">
                        ◯ {{ statsFor(date).recording }}
                      </span>
                    </div>
                    <span v-else class="text-[11px] text-gray-300 font-medium">Not marked yet</span>
                  </td>

                  <!-- Actions -->
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        @click="confirmDelete(date)"
                        class="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 active:scale-90 transition-all"
                        title="Remove class date"
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
                <td colspan="5" class="px-4 py-16">
                  <div class="flex flex-col items-center text-center max-w-sm mx-auto">
                    <div class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4 ring-1 ring-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                    </div>
                    <h4 class="text-sm font-bold text-gray-900">
                      {{ hasActiveFilters ? "No class dates match your filters" : "No class dates scheduled" }}
                    </h4>
                    <p class="text-xs text-gray-400 mt-1.5 leading-relaxed">
                      {{ hasActiveFilters
                        ? "Try a different search term or clear the month filter."
                        : "Schedule your first class date to start tracking attendance." }}
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
                      Add Class Date
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
          <span v-if="hasActiveFilters" class="text-gray-300">· filtered from {{ props.filteredDates.length }} total</span>
        </p>
        <div class="order-1 sm:order-2">
          <Pagination
            v-model:current-page="currentPage"
            :total-items="props.filteredDates.length"
            :filtered-items="filteredDates.length"
            :items-per-page="itemsPerPage"
            item-type="dates"
            :show-summary="false"
          />
        </div>
      </div>
    </div>

    <!-- Add Date Modal -->
    <Modal v-model:is-open="showAddDate">
      <template #header>
        <div class="p-5 pb-0 flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center mb-3 shadow-sm shadow-primary-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Add Class Date</h3>
          <p class="text-xs text-gray-400 mt-1">Pick a date, or quickly add all Fridays of the current month.</p>
        </div>
      </template>
      <template #body>
        <div class="p-5 space-y-4">
          <div class="space-y-1.5">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              Class Date <span class="text-red-400">*</span>
            </label>
            <input
              v-model="newClassDate"
              type="date"
              :min="minDate"
              class="w-full bg-gray-50 border-0 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <p v-if="dateError" class="text-[11px] font-medium text-red-500 px-1">{{ dateError }}</p>
          </div>

          <div class="border-t border-gray-100 pt-4">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 mb-2.5">Quick Add</p>
            <button
              @click="addCurrentMonthFridays"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white hover:border-primary-600 active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              Add This Month's Fridays
            </button>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-center gap-3 p-5 pt-0">
          <button
            @click="addDate"
            :disabled="isSubmitting"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 active:scale-95 transition-all shadow-sm shadow-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Save Date
          </button>
          <button
            @click="showAddDate = false"
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
          <h3 class="text-lg font-bold text-gray-900">
            Remove {{ pendingDelete.dates.length > 1 ? `${pendingDelete.dates.length} Class Dates` : "Class Date" }}?
          </h3>
          <p class="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
            <template v-if="pendingDelete.dates.length > 1">
              <span class="font-bold text-gray-600">{{ pendingDelete.dates.length }} selected dates</span> will be permanently removed.
            </template>
            <template v-else>
              <span class="font-bold text-gray-600">{{ pendingDelete.label }}</span> will be permanently removed.
            </template>
            Attendance marked on these dates stays in history.
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
    filteredDates: {
      type: Array,
      required: true,
    },
  });

  // Store
  const studentAttendanceStore = useStudentAttendanceStore();

  // --------------- Table state ---------------
  const searchTerm = ref("");
  const monthFilter = ref("all");
  const sortDir = ref(-1); // -1 = newest first (default), 1 = oldest first
  const currentPage = ref(1);
  const itemsPerPage = ref(25);
  const selectedDates = ref([]);

  // --------------- Modal state ---------------
  const showAddDate = ref(false);
  const newClassDate = ref("");
  const dateError = ref("");
  const isSubmitting = ref(false);

  const showDeleteModal = ref(false);
  const isDeleting = ref(false);
  const pendingDelete = ref({ dates: [], label: "" });

  // --------------- Per-date attendance stats ---------------
  const dateStatsMap = computed(() => {
    const map = {};
    Object.values(studentAttendanceStore.attendance).forEach((studentRecords) => {
      Object.entries(studentRecords).forEach(([date, status]) => {
        if (!map[date]) map[date] = { present: 0, absent: 0, recording: 0 };
        if (status === "present") map[date].present++;
        else if (status === "absent") map[date].absent++;
        else if (status === "recording") map[date].recording++;
      });
    });
    return map;
  });

  const statsFor = (date) =>
    dateStatsMap.value[date] || { present: 0, absent: 0, recording: 0 };

  const markedCountFor = (date) => {
    const s = statsFor(date);
    return s.present + s.absent + s.recording;
  };

  // --------------- Summary stats ---------------
  const summaryStats = computed(() => {
    const dates = props.filteredDates.map((d) => new Date(d).getTime());
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const today = now.getTime();

    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const thisMonth = props.filteredDates.filter((d) => d.startsWith(currentKey)).length;
    const upcoming = dates.filter((t) => t >= today).length;

    const rates = Object.entries(dateStatsMap.value)
      .filter(([date]) => props.filteredDates.includes(date))
      .map(([, s]) => {
        const marked = s.present + s.absent + s.recording;
        return marked > 0 ? (s.present + s.recording) / marked : null;
      })
      .filter((r) => r !== null);
    const avg = rates.length > 0 ? Math.round((rates.reduce((sum, r) => sum + r, 0) / rates.length) * 100) : null;

    return [
      {
        label: "Total Classes",
        value: props.filteredDates.length,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>',
      },
      {
        label: "This Month",
        value: thisMonth,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
      },
      {
        label: "Upcoming",
        value: upcoming,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
      },
      {
        label: "Avg Attendance",
        value: avg ?? "—",
        suffix: avg !== null ? "%" : "",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>',
      },
    ];
  });

  // --------------- Month filter options ---------------
  const availableMonths = computed(() => {
    const monthMap = new Map();
    [...props.filteredDates].sort().forEach((date) => {
      const dateObj = new Date(date);
      const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, {
          value: key,
          label: dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long" }),
        });
      }
    });
    return Array.from(monthMap.values()).sort((a, b) => b.value.localeCompare(a.value));
  });

  // --------------- Filtering / sorting / paging ---------------
  const hasActiveFilters = computed(
    () => searchTerm.value.trim() !== "" || monthFilter.value !== "all"
  );

  const filteredDates = computed(() => {
    const term = searchTerm.value.trim().toLowerCase();

    let dates = props.filteredDates.filter((date) => {
      if (monthFilter.value !== "all" && !date.startsWith(monthFilter.value)) {
        return false;
      }

      if (term === "") return true;

      const dateObj = new Date(date);
      const formatted = formatFullDate(date).toLowerCase();
      const monthYear = `${dateObj.toLocaleString("default", { month: "long" })} ${dateObj.getFullYear()}`.toLowerCase();
      const shortMonthYear = `${dateObj.toLocaleString("default", { month: "short" })} ${dateObj.getFullYear()}`.toLowerCase();
      const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

      return (
        date.includes(term) ||
        formatted.includes(term) ||
        monthYear.includes(term) ||
        shortMonthYear.includes(term) ||
        weekday.includes(term)
      );
    });

    dates = dates.sort((a, b) => (new Date(a) - new Date(b)) * sortDir.value);
    return dates;
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredDates.value.length / itemsPerPage.value))
  );

  const paginatedDates = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredDates.value.slice(start, start + itemsPerPage.value);
  });

  const rangeText = computed(() => {
    const total = filteredDates.value.length;
    if (total === 0) return "No class dates to show";
    const start = (currentPage.value - 1) * itemsPerPage.value + 1;
    const end = Math.min(start + itemsPerPage.value - 1, total);
    return `Showing ${start}–${end} of ${total} dates`;
  });

  const toggleSort = () => {
    sortDir.value = sortDir.value * -1;
  };

  const clearFilters = () => {
    searchTerm.value = "";
    monthFilter.value = "all";
  };

  watch([searchTerm, monthFilter], () => {
    currentPage.value = 1;
  });

  watch(itemsPerPage, () => {
    currentPage.value = 1;
  });

  watch(filteredDates, () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  });

  // --------------- Selection ---------------
  const pageDates = computed(() => paginatedDates.value);

  const isSelected = (date) => selectedDates.value.includes(date);

  const toggleSelect = (date) => {
    selectedDates.value = isSelected(date)
      ? selectedDates.value.filter((d) => d !== date)
      : [...selectedDates.value, date];
  };

  const allOnPageSelected = computed(
    () => pageDates.value.length > 0 && pageDates.value.every((d) => selectedDates.value.includes(d))
  );

  const someOnPageSelected = computed(() =>
    pageDates.value.some((d) => selectedDates.value.includes(d))
  );

  const toggleSelectAll = () => {
    if (allOnPageSelected.value) {
      selectedDates.value = selectedDates.value.filter((d) => !pageDates.value.includes(d));
    } else {
      selectedDates.value = [...new Set([...selectedDates.value, ...pageDates.value])];
    }
  };

  // --------------- Add date ---------------
  // Helper function to format date as YYYY-MM-DD in local timezone
  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const minDate = computed(() => {
    const today = new Date();
    today.setMonth(today.getMonth() - 12);
    return formatDateLocal(today);
  });

  const openAddModal = () => {
    dateError.value = "";
    if (!newClassDate.value) {
      newClassDate.value = formatDateLocal(new Date());
    }
    showAddDate.value = true;
  };

  const addDate = async () => {
    if (isSubmitting.value) return;

    dateError.value = "";
    if (!newClassDate.value) {
      dateError.value = "Please pick a date first";
      return;
    }
    if (studentAttendanceStore.classDates.includes(newClassDate.value)) {
      dateError.value = "This date is already scheduled";
      return;
    }

    isSubmitting.value = true;
    try {
      const success = await studentAttendanceStore.addClassDate(newClassDate.value);
      if (success) {
        newClassDate.value = "";
        showAddDate.value = false;
      }
    } finally {
      isSubmitting.value = false;
    }
  };

  const addCurrentMonthFridays = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const fridays = [];

    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      if (date.getDay() === 5) {
        fridays.push(formatDateLocal(date));
      }
    }

    isSubmitting.value = true;
    try {
      for (const friday of fridays) {
        if (!studentAttendanceStore.classDates.includes(friday)) {
          await studentAttendanceStore.addClassDate(friday);
        }
      }
      studentAttendanceStore.classDates.sort();
      showAddDate.value = false;
    } finally {
      isSubmitting.value = false;
    }
  };

  // --------------- Delete ---------------
  const confirmDelete = (date) => {
    pendingDelete.value = { dates: [date], label: formatFullDate(date) };
    showDeleteModal.value = true;
  };

  const confirmDeleteSelected = () => {
    pendingDelete.value = { dates: [...selectedDates.value], label: "" };
    showDeleteModal.value = true;
  };

  const handleDelete = async () => {
    if (isDeleting.value) return;

    isDeleting.value = true;
    try {
      await Promise.all(pendingDelete.value.dates.map((d) => studentAttendanceStore.removeClassDate(d)));
      selectedDates.value = selectedDates.value.filter((d) => !pendingDelete.value.dates.includes(d));
      showDeleteModal.value = false;
    } finally {
      isDeleting.value = false;
    }
  };

  // --------------- Display helpers ---------------
  const formatDay = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { weekday: "long" });

  const formatDateNumber = (dateString) => new Date(dateString).getDate();

  const formatMonth = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short" });

  const formatFullDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const relativeLabel = (dateString) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((date - today) / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  const dateStatus = (dateString) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) return "today";
    return date > today ? "upcoming" : "past";
  };

  const statusLabel = (dateString) => {
    const status = dateStatus(dateString);
    if (status === "today") return "Today";
    return status === "upcoming" ? "Upcoming" : "Past";
  };

  const statusClass = (dateString) => {
    const status = dateStatus(dateString);
    if (status === "today") return "bg-primary-600 text-white";
    if (status === "upcoming") return "bg-amber-50 text-amber-700";
    return "bg-gray-100 text-gray-500";
  };

  onMounted(() => {
    studentAttendanceStore.fetchClassDates();
  });
</script>

<style scoped>
  .current-color-bg {
    background-color: currentColor;
  }
</style>
