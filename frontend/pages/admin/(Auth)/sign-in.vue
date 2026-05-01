<template>
  <section class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-4 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <h2 class="text-3xl font-black text-gray-900 tracking-tight">Admin Login</h2>
        <p class="mt-2 text-sm text-gray-500 font-medium italic">Esho Quran Shikhi Teacher Portal</p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
            <input 
              id="email" 
              v-model="form.email" 
              type="email" 
              required 
              class="appearance-none relative block w-full px-4 py-3 border-0 bg-gray-50 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 sm:text-sm font-medium transition-all"
              placeholder="admin@eshoquran.com"
            />
          </div>
          <div>
            <label for="password" class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Password</label>
            <input 
              id="password" 
              v-model="form.password" 
              type="password" 
              required 
              class="appearance-none relative block w-full px-4 py-3 border-0 bg-gray-50 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 sm:text-sm font-medium transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="loading"
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-lg shadow-primary-200 disabled:opacity-70"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating...
            </span>
            <span v-else>Sign In</span>
          </button>
        </div>
      </form>
      
      <p v-if="errorMsg" class="mt-4 text-center text-xs font-bold text-red-500 bg-red-50 py-2 rounded-lg border border-red-100 animate-bounce">
        {{ errorMsg }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { useAdminAuthStore } from '~/stores/adminAuthStore';

definePageMeta({
  layout: false
});

const authStore = useAdminAuthStore();
const form = reactive({
  email: '',
  password: ''
});
const loading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  
  const { success, error } = await authStore.login(form.email, form.password);
  
  if (success) {
    navigateTo('/admin/dashboard');
  } else {
    errorMsg.value = error?.message || 'Login failed. Please check your credentials.';
  }
  
  loading.value = false;
};
</script>
