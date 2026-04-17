<template>
  <div class="min-h-screen bg-gray-50/50 flex flex-col">
    <header class="h-(--navbar-height) glass sticky top-0 z-30 flex items-center px-4 lg:px-8 border-b border-gray-200/50">
      <NuxtLink to="/" class="flex items-center gap-3">

        <img src="~/assets/imgs/logo.png" alt="Logo" class="w-10 h-10 rounded-xl shadow-sm" />
        <span class="text-xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">
          এসো কুরআন শিখি
        </span>
      </NuxtLink>
    </header>
    
    <main class="flex-1">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<script setup>
</script>

