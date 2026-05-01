<template>
  <section class="sticky top-0 z-10">
    <form
      class="flex flex-col items-center justify-center w-full gap-3 pb-2 sm:pb-0 sm:flex-row"
      @submit.prevent="formSubmit"
    >
      <div class="flex items-center gap-3">
        <div class="relative flex items-center">
          <label
            for="search"
            @click="
              $emit('searchInput', '');
              searchInput = '';
            "
            v-if="searchInput !== ''"
            class="absolute text-xl font-semibold cursor-pointer right-5 dark:text-dark-text-1"
          >
            <div class="w-4 text-blue-600">
              <svg
                viewBox="0 0 25 25"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
                fill="currentColor"
                stroke="currentColor"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <title>cross</title>
                  <desc>Created with Sketch Beta.</desc>
                  <defs></defs>
                  <g
                    id="Page-1"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                    sketch:type="MSPage"
                  >
                    <g
                      id="Icon-Set-Filled"
                      sketch:type="MSLayerGroup"
                      transform="translate(-469.000000, -1041.000000)"
                      fill="currentColor"
                    >
                      <path
                        d="M487.148,1053.48 L492.813,1047.82 C494.376,1046.26 494.376,1043.72 492.813,1042.16 C491.248,1040.59 488.712,1040.59 487.148,1042.16 L481.484,1047.82 L475.82,1042.16 C474.257,1040.59 471.721,1040.59 470.156,1042.16 C468.593,1043.72 468.593,1046.26 470.156,1047.82 L475.82,1053.48 L470.156,1059.15 C468.593,1060.71 468.593,1063.25 470.156,1064.81 C471.721,1066.38 474.257,1066.38 475.82,1064.81 L481.484,1059.15 L487.148,1064.81 C488.712,1066.38 491.248,1066.38 492.813,1064.81 C494.376,1063.25 494.376,1060.71 492.813,1059.15 L487.148,1053.48"
                        id="cross"
                        sketch:type="MSShapeGroup"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </label>
          <input
            type="text"
            name="Search"
            id="search"
            :placeholder="placeholder"
            v-model="searchInput"
            class="px-2 py-2 border outline-hidden appearance-none sm:px-5 sm:py-4 focus:border-blue-500 rounded-sm  base-dark-input"
          />
        </div>
        <button
          type="submit"
          value=""
          class="base-blank-btn font-semibold sm:py-4 sm:px-8 base-dark-btn"
        >
          Search
        </button>
      </div>
    </form>
  </section>
  <hr class="sm:hidden dark:border-dark-border" />
</template>

<script setup>
  const props = defineProps({
    placeholder: {
      type: String,
      default: "Enter Search",
    },
  });
  const emit = defineEmits(["searchInput"]);
  let searchInput = ref(null);

  function formSubmit() {
    emit("searchInput", searchInput.value);
  }
</script>
