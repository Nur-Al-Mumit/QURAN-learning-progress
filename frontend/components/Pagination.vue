<template>
  <div
    v-if="totalPages > 1"
    class="flex justify-center items-center mt-6 gap-2"
  >
    <!-- First Page Button -->
    <button
      @click="goToPage(1)"
      :disabled="currentPage === 1"
      class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      title="First page"
    >
      ««
    </button>

    <!-- Previous Page Button -->
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      title="Previous page"
    >
      ‹
    </button>

    <!-- Page Numbers -->
    <div class="flex gap-1">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'px-3 py-1 rounded border transition-colors',
          currentPage === page
            ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
            : 'hover:bg-gray-50',
        ]"
        :title="`Go to page ${page}`"
      >
        {{ page }}
      </button>
    </div>

    <!-- Next Page Button -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      title="Next page"
    >
      ›
    </button>

    <!-- Last Page Button -->
    <button
      @click="goToPage(totalPages)"
      :disabled="currentPage === totalPages"
      class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      title="Last page"
    >
      »»
    </button>
  </div>

  <!-- Summary Info (Optional) -->
  <div
    v-if="showSummary && totalItems > 0"
    class="mt-4 text-sm text-gray-600 text-center"
  >
    <slot
      name="summary"
      :current-items="currentItems"
      :total-items="totalItems"
      :filtered-items="filteredItems"
    >
      Showing {{ currentItems }} of {{ filteredItems }} {{ itemType }}
      {{
        filteredItems !== totalItems
          ? `(filtered from ${totalItems} total)`
          : ""
      }}
    </slot>
  </div>
</template>

<script setup>
  const props = defineProps({
    // Required props
    currentPage: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: 20,
    },

    // Optional props
    filteredItems: {
      type: Number,
      default: null,
    },
    maxVisiblePages: {
      type: Number,
      default: 7,
    },
    showSummary: {
      type: Boolean,
      default: true,
    },
    itemType: {
      type: String,
      default: "items",
    },
  });

  const emit = defineEmits(["update:currentPage", "page-change"]);

  // Computed properties
  const totalPages = computed(() => {
    const items = props.filteredItems ?? props.totalItems;
    return Math.ceil(items / props.itemsPerPage);
  });

  const currentItems = computed(() => {
    const items = props.filteredItems ?? props.totalItems;
    const start = (props.currentPage - 1) * props.itemsPerPage;
    const end = Math.min(start + props.itemsPerPage, items);
    return end - start;
  });

  const filteredItems = computed(() => {
    return props.filteredItems ?? props.totalItems;
  });

  const visiblePages = computed(() => {
    const pages = [];
    const maxVisible = props.maxVisiblePages;
    const current = props.currentPage;
    const total = totalPages.value;

    if (total <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end pages to show
      let start = Math.max(1, current - Math.floor(maxVisible / 2));
      let end = Math.min(total, start + maxVisible - 1);

      // Adjust start if we're near the end
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  });

  // Methods
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
      emit("update:currentPage", page);
      emit("page-change", page);
    }
  };

  // Expose methods for parent components
  defineExpose({
    goToPage,
    totalPages,
    visiblePages,
  });
</script>
