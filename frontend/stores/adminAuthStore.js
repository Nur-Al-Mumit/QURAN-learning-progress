import { defineStore } from "pinia";

export const useAdminAuthStore = defineStore('adminAuth', () => {
    const loggedInData = ref(null);
    const isLoggedIn = ref(false);

    async function login(email, password) {
        const { data, error } = await callAxios('/auth/login', { email, password });
        if (data) {
            loggedInData.value = data;
            isLoggedIn.value = true;
            
            // Initialize menu based on role
            const menuStore = useMenuStore();
            if (data.role === 'admin') {
                menuStore.setAdminMenu();
            } else {
                menuStore.setStudentMenu();
            }
            
            return { success: true, role: data.role };
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