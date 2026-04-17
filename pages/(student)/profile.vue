<template>
  <div class="space-y-6">
    <div class="pro-card p-8">
      <div class="flex items-center gap-6">
        <div class="relative group">
          <img 
            v-if="userInfo?.user_profile?.profile_picture" 
            :src="userInfo.user_profile.profile_picture" 
            class="w-24 h-24 rounded-2xl shadow-lg group-hover:opacity-80 transition-opacity"
          />
          <div v-else class="w-24 h-24 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 text-3xl font-bold">
            {{ userInfo?.name?.[0]?.toUpperCase() }}
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ userInfo?.name }}</h1>
          <p class="text-gray-500">{{ userInfo?.email }}</p>
          <div class="mt-2 flex gap-2">
            <span class="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg uppercase tracking-wider">Student</span>
            <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg uppercase tracking-wider">Active</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="pro-card p-6">
        <h2 class="text-lg font-bold mb-4">Personal Information</h2>
        <div class="space-y-4">
          <div>
            <label class="text-xs font-bold text-gray-400 uppercase">Full Name</label>
            <p class="text-gray-900 font-medium">{{ userInfo?.name }}</p>
          </div>
          <div>
            <label class="text-xs font-bold text-gray-400 uppercase">Email Address</label>
            <p class="text-gray-900 font-medium">{{ userInfo?.email }}</p>
          </div>
        </div>
      </div>
      
      <div class="pro-card p-6">
        <h2 class="text-lg font-bold mb-4">Account Actions</h2>
        <div class="space-y-4">
          <button class="btn-primary w-full">Update Profile</button>
          <button class="btn-secondary w-full">Change Password</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'default'
  });

  const userInfoStore = useUserInfoStore();
  const userInfo = computed(() => userInfoStore.userInfo);
</script>
