
<template>
    <transition name="fade" mode="out-in">
      <div v-if="showToast" :class="toastClass" class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white">
        <span>{{ message }}</span>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useToast } from '~/composables/useToast';
  
  const { showToast, message, type } = useToast();
  
  const toastClass = computed(() => {
    switch (type.value) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  });
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  