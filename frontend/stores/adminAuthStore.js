import { defineStore } from "pinia";

export const useAdminAuthStore = defineStore('adminAuth', () => {
    const loggedInData = ref(null);
    const isLoggedIn = ref(false);

    async function login(email, password) {
        const { data, error } = await callAxios('/auth/login', { email, password });
        if (data) {
            loggedInData.value = data;
            isLoggedIn.value = true;
            return { success: true };
        }
        return { success: false, error };
    }

    function logout() {
        loggedInData.value = null;
        isLoggedIn.value = false;
        navigateTo('/login');
    }

    return { loggedInData, isLoggedIn, login, logout }
}, {
    persist: {
        storage: piniaPluginPersistedstate.cookies(),
      }
})