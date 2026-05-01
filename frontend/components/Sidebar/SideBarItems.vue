<template>
  <div class="space-y-1">
    <div v-for="(link, key) in links" :key="key">
      <NuxtLink
        v-if="link.link"
        :to="link.link"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden"
        :class="[
          $route.path === link.link 
            ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        ]"
      >
        <span 
          class="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
          :class="[$route.path === link.link ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500']"
          v-html="getIcons(link.icon, 'w-5 h-5')"
        ></span>
        <span class="relative z-10">{{ link.title }}</span>
        
        <!-- Subtle active indicator -->
        <div 
          v-if="$route.path === link.link"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-600 rounded-r-full"
        ></div>
      </NuxtLink>

      <button
        v-else
        @click="logOut"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group mt-4 border-t border-gray-50 pt-6"
      >
        <span 
          class="flex-shrink-0 text-gray-400 group-hover:text-red-500 transition-transform duration-200 group-hover:scale-110"
          v-html="getIcons(link.icon, 'w-5 h-5')"
        ></span>
        <span>{{ link.title }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
  import getIcons from "./SidebarIcon";
  import { useSideBarStore } from "~/stores/sideBarStore";

  const sideBarStore = useSideBarStore();
  const route = useRoute();

  const props = defineProps({
    links: {
      type: Array,
      required: true,
    },
    customClass: {
      type: String,
    },
  });

  const logOut = async () => {
    try {
      const endpoint = "/user/logout";
      const { data, error } = await callAuthnAxios(endpoint);

      if (data?.data) {
        document.cookie.split(";").forEach((cookie) => {
          const [name] = cookie.split("=");
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
        navigateTo("/");
      } else {
        console.log(error);
      }
    } catch (err) {
      console.log(err);
    }
  };
</script>

<style scoped>
/* Scoped styles removed in favor of utility classes */
</style>

