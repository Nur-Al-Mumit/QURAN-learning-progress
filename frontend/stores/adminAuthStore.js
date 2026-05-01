import { defineStore } from "pinia";

export const useAdminAuthStore = defineStore('adminAuth', () => {
    const loggedInData = ref(null);
    const isLoggedIn = ref(false);
    return { loggedInData, isLoggedIn }
}, {
    persist: {
        storage: piniaPluginPersistedstate.cookies(),
      }
})