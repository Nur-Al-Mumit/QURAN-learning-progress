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
        <div class="p-4 border-t border-gray-100">
          <div class="relative group">
            <button 
              class="w-full flex items-center gap-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group/btn"
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 group-hover/btn:text-gray-600 transition-transform group-hover/btn:translate-x-0.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>

            <!-- Popover Menu (Above Sidebar Footer) -->
            <div class="absolute bottom-full left-0 mb-2 w-full glass rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
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
    <div class="flex flex-1 flex-col min-w-0 overflow-hidden">
      <header class="h-(--navbar-height) glass sticky top-0 z-30 flex items-center px-4 lg:px-8 border-b border-gray-200/50 justify-between">
        <div class="flex items-center gap-4">
          <button 
            @click="isSidebarOpen = true"
            class="p-2 -ml-2 text-gray-600 hover:text-primary-600 lg:hidden rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          
          <!-- Breadcrumbs or Page Title -->
          <div class="hidden sm:flex items-center gap-2 text-sm text-gray-500 font-medium">
            <span>App</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300"><polyline points="9 18 15 12 9 6"></polyline></svg>
            <span class="text-gray-900">{{ $route.name || 'Dashboard' }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2 md:gap-5">
          <!-- Search Bar (Desktop) -->
          <div class="relative hidden md:block">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input 
              type="text" 
              placeholder="Search..." 
              class="bg-gray-100/50 border-0 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500 w-64 transition-all focus:bg-white focus:shadow-sm"
            />
          </div>

          <div class="flex items-center gap-2">
            <button class="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-xl transition-all relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
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
  const menuStore = useMenuStore();
  const userInfoStore = useUserInfoStore();
  
  const isSidebarOpen = ref(false);
  const profilePictureModal = ref(false);
  const userInfo = computed(() => userInfoStore.userInfo);

  // Logout logic
  const logOut = async () => {
    try {
      const endpoint = "/user/logout";
      const { data, error } = await callAuthnAxios(endpoint);
      if (data?.data) {
        if (process.client) {
          document.cookie.split(";").forEach((cookie) => {
            const [name] = cookie.split("=");
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          });
        }
        navigateTo("/");
      }
    } catch (err) {
      console.error(err);
    }
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

