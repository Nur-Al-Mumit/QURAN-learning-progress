<template>
  <div class="min-h-screen flex overflow-hidden bg-white font-sans">
    <!-- Left Side: Visual Illustration (Hidden on Mobile) -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-primary-900 items-center justify-center overflow-hidden">
      <img 
        src="/images/login-bg.png" 
        alt="Login Background" 
        class="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[10s] ease-linear"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50"></div>
      
      <div class="relative z-10 text-center p-12 max-w-lg">
        <div class="mb-8 inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl animate-bounce-slow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-primary-200">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
          </svg>
        </div>
        <h1 class="text-5xl font-black text-white tracking-tighter leading-none mb-6">
          এসো কুরআন শিখি <br/>
          <span class="text-primary-400 text-3xl font-bold tracking-normal italic">Teacher Portal</span>
        </h1>
        <p class="text-primary-100/80 text-lg font-medium leading-relaxed">
          Manage your students, track their progress, and nurture their spiritual journey with our advanced learning management system.
        </p>
      </div>

      <!-- Floating Decorative Elements -->
      <div class="absolute bottom-10 left-10 flex gap-4">
        <div class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
        <div class="w-3 h-3 rounded-full bg-primary-400 animate-pulse delay-75"></div>
        <div class="w-3 h-3 rounded-full bg-blue-400 animate-pulse delay-150"></div>
      </div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-gray-50/30">
      <div class="w-full max-w-md space-y-10">
        <!-- Brand Header (Mobile) -->
        <div class="lg:hidden text-center mb-10">
           <img src="~/assets/imgs/logo.png" alt="Logo" class="w-20 h-20 mx-auto mb-4 rounded-3xl shadow-xl border-4 border-white" />
           <h2 class="text-3xl font-black text-gray-900 tracking-tight">Admin Access</h2>
        </div>

        <div class="space-y-2">
          <h2 class="hidden lg:block text-4xl font-black text-gray-900 tracking-tighter">Welcome Back!</h2>
          <p class="text-gray-500 font-medium italic">Please enter your credentials to access the dashboard.</p>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-5">
            <div class="group">
              <label for="email" class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1 group-focus-within:text-primary-600 transition-colors">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input 
                  id="email" 
                  v-model="form.email"
                  type="email" 
                  required 
                  placeholder="name@example.com"
                  class="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div class="group">
              <div class="flex justify-between items-center mb-2 px-1">
                <label for="password" class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-focus-within:text-primary-600 transition-colors">Password</label>
                <a href="#" class="text-[10px] font-bold text-primary-600 hover:text-primary-700 transition-colors">Forgot Password?</a>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <input 
                  id="password" 
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'" 
                  required 
                  placeholder="••••••••"
                  class="block w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
                />
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center">
            <input id="remember-me" type="checkbox" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-md cursor-pointer">
            <label for="remember-me" class="ml-2 block text-xs font-bold text-gray-500 cursor-pointer">Keep me logged in for 30 days</label>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full flex items-center justify-center gap-3 py-4 px-6 border border-transparent rounded-2xl text-sm font-black text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all shadow-xl shadow-primary-200 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating...
            </span>
            <template v-else>
              <span>Access Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </template>
          </button>
        </form>

        <p v-if="errorMsg" class="text-center text-xs font-bold text-red-500 bg-red-50 py-3 rounded-xl border-2 border-red-100 animate-in fade-in zoom-in duration-300">
          {{ errorMsg }}
        </p>

        <div class="pt-6 border-t border-gray-100 text-center">
          <p class="text-xs font-medium text-gray-400">
            Need help? Contact <a href="mailto:support@eshoquran.com" class="text-primary-600 font-bold hover:underline">System Support</a>
          </p>
        </div>
      </div>
    </div>
  </div>
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
const showPassword = ref(false);

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  
  try {
    const { success, error } = await authStore.login(form.email, form.password);
    
    if (success) {
      navigateTo('/admin/dashboard');
    } else {
      errorMsg.value = error?.message || 'Unauthorized: Please check your credentials and try again.';
    }
  } catch (err) {
    errorMsg.value = 'A network error occurred. Please try again later.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-slow {
  animation: bounce-slow 4s infinite ease-in-out;
}
</style>
