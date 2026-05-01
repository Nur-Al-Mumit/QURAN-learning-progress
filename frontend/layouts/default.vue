<template>
  <div class="flex h-screen bg-gray-50/50 overflow-hidden">

    <!-- Mobile Sidebar Backdrop -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-(--sidebar-width) transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-y-0 lg:h-full',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >

      <div class="flex h-full flex-col">
        <!-- Sidebar Header (Logo) -->
        <div class="flex h-(--navbar-height) items-center px-6 border-b border-gray-100">
          <NuxtLink to="/" class="flex items-center gap-3">
             <img src="~/assets/imgs/logo.png" alt="Logo" class="w-10 h-10 rounded-xl shadow-sm" />
             <span class="text-xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">
               এসো কুরআন শিখি
             </span>
          </NuxtLink>
        </div>

        <!-- Sidebar Navigation -->
        <nav class="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <SidebarSideBarItems :links="menuStore.links" />
        </nav>

        <!-- Sidebar Footer (User Info) -->
        <div class="p-4 border-t border-gray-100 relative">
          <div class="relative">
            <!-- Backdrop for closing menu on click outside (Mobile friendly) -->
            <div v-if="isProfileMenuOpen" @click="isProfileMenuOpen = false" class="fixed inset-0 z-40 lg:hidden"></div>

            <button 
              @click="isProfileMenuOpen = !isProfileMenuOpen"
              class="w-full flex items-center gap-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group/btn relative z-50"
            >
              <div class="relative">
                <img 
                  v-if="userInfo?.user_profile?.profile_picture"
                  :src="userInfo.user_profile.profile_picture" 
                  class="w-10 h-10 rounded-lg object-cover ring-2 ring-white shadow-sm"
                />
                <div v-else class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                  {{ userInfo?.name?.[0]?.toUpperCase() || 'U' }}
                </div>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div class="flex-1 min-w-0 text-left">
                <p class="text-sm font-bold text-gray-900 truncate leading-tight">{{ userInfo?.name }}</p>
                <p class="text-[10px] text-gray-500 truncate uppercase tracking-wider mt-0.5">Active Session</p>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                class="text-gray-400 group-hover/btn:text-gray-600 transition-transform"
                :class="{ 'rotate-180': isProfileMenuOpen }"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>

            <!-- Popover Menu -->
            <div 
              class="absolute bottom-full left-0 mb-2 w-full glass rounded-2xl shadow-2xl border border-gray-100 transition-all duration-200 z-50 overflow-hidden"
              :class="[
                isProfileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2 lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:translate-y-0'
              ]"
            >
               <div class="p-3 border-b border-gray-100 bg-gray-50/50">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Info</p>
                  <p class="text-xs font-semibold text-gray-700 truncate mt-1">{{ userInfo?.email }}</p>
               </div>
               <div class="p-1.5">
                  <NuxtLink to="/profile" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-primary-700 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Profile Details
                  </NuxtLink>
                  <button @click="profilePictureModal = true" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-primary-700 transition-all text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    Edit Photo
                  </button>
                  <div class="h-px bg-gray-50 my-1 mx-2"></div>
                  <button @click="logOut" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-all text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Log Out
                  </button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </aside>

    <!-- Main Content Area -->
    <!-- Main Content Area -->
    <div class="flex flex-1 flex-col min-w-0 overflow-hidden relative">
      
      <!-- Top Mobile Navbar (Clean) -->
      <header class="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center px-4 shrink-0 relative">
        <!-- Sidebar Toggle (Left) -->
        <button 
          @click="isSidebarOpen = true"
          class="p-2 rounded-xl text-gray-500 hover:bg-gray-50 active:scale-90 transition-all z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <!-- Centered Title -->
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full flex justify-center pointer-events-none px-16">
          <span class="text-sm md:text-base font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent truncate">
            এসো কুরআন শিখি
          </span>
        </div>

        <div class="flex-1"></div>

        <!-- Logo (Right) -->
        <div class="z-20">
          <img src="~/assets/imgs/logo.png" alt="Logo" class="w-8 h-8 rounded-lg shadow-sm" />
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
        <div class="animate-fade-in-up">
          <slot />
        </div>
      </main>
    </div>

    <!-- Modals -->
    <ProfilePictureUploadModal v-model:is-modal-open="profilePictureModal" />
  </div>
</template>

<script setup>
  import { useAdminAuthStore } from '~/stores/adminAuthStore';
  const menuStore = useMenuStore();
  const userInfoStore = useUserInfoStore();
  
  const isSidebarOpen = ref(false);
  const isProfileMenuOpen = ref(false);
  const profilePictureModal = ref(false);
  const authStore = useAdminAuthStore();
  const userInfo = computed(() => userInfoStore.userInfo);

  // Logout logic
  const logOut = () => {
    authStore.logout();
  };


  // Close sidebar on route change (mobile)
  const route = useRoute();
  watch(() => route.path, () => {
    isSidebarOpen.value = false;
  });
</script>


<style scoped>
/* Page transition or local styles */
</style>

