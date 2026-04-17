<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Learning Progress</h1>
        <p class="text-gray-500 mt-1 text-sm">Track your mastery level for each Arabic letter.</p>
      </div>
      <div class="flex gap-3">
        <div class="flex flex-col items-end">
          <span class="text-sm font-medium text-gray-500 uppercase tracking-wider text-[10px]">Overall Mastery</span>
          <span class="text-2xl font-bold text-primary-600">64%</span>
        </div>
        <div class="w-1.5 h-10 bg-gray-200 rounded-full overflow-hidden">
          <div class="w-full bg-primary-500 h-[64%] mt-auto"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
      <div
        v-for="(letter, index) in arabicLetters"
        :key="index"
        class="pro-card group relative p-6 flex flex-col items-center justify-center aspect-square transition-all duration-500 hover:-translate-y-1 hover:border-primary-200"
        ref="letterRefs"
        :data-index="index"
      >
        <!-- Accuracy background fill -->
        <div
          class="absolute inset-0 bg-primary-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        ></div>

        <span class="relative z-10 text-5xl font-bold text-gray-800 transition-transform duration-500 group-hover:scale-110">{{ letter.char }}</span>
        
        <div class="mt-4 flex flex-col items-center gap-1.5">
          <div class="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
             <div 
              class="h-full transition-all duration-[2000ms] ease-out bg-primary-500"
              :style="{ width: `${visibleLetters.includes(index) ? letter.accuracy : 0}%`, backgroundColor: getColor(letter.accuracy) }"
             ></div>
          </div>
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ letter.accuracy }}% Mastery</span>
        </div>

        <!-- Floating Badge -->
        <div 
          v-if="letter.accuracy > 80"
          class="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 text-white rounded-lg flex items-center justify-center shadow-lg animate-bounce"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
  definePageMeta({
    layout: "split",
  });
  const arabicLetters = ref([
    { char: "ا", accuracy: 50 },
    { char: "ب", accuracy: 70 },
    { char: "ت", accuracy: 30 },
    { char: "ث", accuracy: 80 },
    { char: "ج", accuracy: 60 },
    { char: "ح", accuracy: 90 },
    { char: "خ", accuracy: 20 },
    { char: "د", accuracy: 40 },
    { char: "ذ", accuracy: 75 },
    { char: "ر", accuracy: 55 },
    { char: "ز", accuracy: 65 },
    { char: "س", accuracy: 35 },
    { char: "ش", accuracy: 85 },
    { char: "ص", accuracy: 45 },
    { char: "ض", accuracy: 5 },
    { char: "ط", accuracy: 25 },
    { char: "ظ", accuracy: 17 },
    { char: "ع", accuracy: 50 },
    { char: "غ", accuracy: 80 },
    { char: "ف", accuracy: 60 },
    { char: "ق", accuracy: 70 },
    { char: "ك", accuracy: 40 },
    { char: "ل", accuracy: 50 },
    { char: "م", accuracy: 90 },
    { char: "ن", accuracy: 30 },
    { char: "ه", accuracy: 75 },
    { char: "و", accuracy: 65 },
    { char: "ي", accuracy: 55 },
  ]);

  // Array to track visible elements
  const visibleLetters = ref([]);

  // Function to calculate color based on accuracy
  function getColor(accuracy) {
    const red = accuracy < 50 ? 255 : Math.floor(255 - (accuracy - 50) * 5.1);
    const green = accuracy > 50 ? 255 : Math.floor(accuracy * 5.1);
    return `rgb(${red}, ${green}, 100)`;
  }

  // Intersection Observer setup
  const letterRefs = ref([]);

  onMounted(() => {
    const observerOptions = {
      threshold: 0.1, // Trigger when 10% of element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = entry.target.dataset.index;
        if (
          entry.isIntersecting &&
          !visibleLetters.value.includes(Number(index))
        ) {
          visibleLetters.value.push(Number(index));
        }
      });
    }, observerOptions);

    letterRefs.value.forEach((el) => {
      observer.observe(el);
    });

    // Clean up observer on component unmount
    onBeforeUnmount(() => {
      observer.disconnect();
    });
  });
</script>

<style>
  /* Add any additional styles here */
</style>
