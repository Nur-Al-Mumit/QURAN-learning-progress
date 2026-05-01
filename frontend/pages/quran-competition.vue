<template>
  <div class="max-w-3xl mx-auto py-10 px-4 space-y-6 min-h-screen">
    <h1 class="text-3xl font-bold text-center text-blue-700">
      প্রেজেন্টেশন পেজ
    </h1>
    <p class="text-center text-gray-600">
      প্রতিযোগিতার পরিকল্পনা ও ব্যবস্থাপনার বিভিন্ন অংশে যেতে নিচের লিংকগুলো
      ব্যবহার করুন।
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <NuxtLink
        to="/competition-plan"
        class="block p-4 bg-blue-100 rounded-xl shadow hover:bg-blue-200"
      >
        📝 প্রতিযোগিতার ধাপ ও নিয়ম
      </NuxtLink>
      <NuxtLink
        to="/arrangement"
        class="block p-4 bg-yellow-100 rounded-xl shadow hover:bg-yellow-200"
      >
        🏛 আয়োজন ও বাস্তবায়ন
      </NuxtLink>
      <NuxtLink
        to="/management"
        class="block p-4 bg-green-100 rounded-xl shadow hover:bg-green-200"
      >
        🧭 ম্যানেজমেন্ট পরিকল্পনা
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
  // Static presentation links
</script>

<style scoped>
  body {
    background-color: #f9fafb;
  }
</style>
