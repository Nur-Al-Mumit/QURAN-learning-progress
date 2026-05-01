import { defineStore } from "pinia";

export const useAdminAuthStore = defineStore('adminAuth', () => {
    const loggedInData = ref(null);
    const isLoggedIn = ref(false);

    async function login(email, password) {
        const { data, error } = await callAxios('/auth/login', { email, password });
        if (data) {
            loggedInData.value = data;
            isLoggedIn.value = true;
            
            // Initialize menu
            const menuStore = useMenuStore();
            menuStore.setAdminMenu();
            
            return { success: true };
        }
        return { success: false, error };
    }

    function logout() {
        loggedInData.value = null;
        isLoggedIn.value = false;
        
        // Clear menu
        const menuStore = useMenuStore();
        menuStore.clearMenu();
        
        navigateTo('/admin/login');
    }

    return { loggedInData, isLoggedIn, login, logout }
}, {
    persist: {
        storage: piniaPluginPersistedstate.cookies(),
      }
})