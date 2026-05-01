import { useAdminAuthStore } from '~/stores/adminAuthStore';

export default defineNuxtRouteMiddleware(async (to, from) => {
    // Skip if not on client-side (to avoid SSR issues with cookies/store)
    if (process.server) return;

    const authStore = useAdminAuthStore();
    const isLoggedIn = authStore.isLoggedIn;

    // 1. If trying to access login page while already logged in
    if (to.path === '/admin/login' && isLoggedIn) {
        return navigateTo('/admin/dashboard');
    }

    // 2. If trying to access any admin page OR home page (except login) while NOT logged in
    const isAdminRoute = to.path.startsWith('/admin') && to.path !== '/admin/login';
    const isHomeRoute = to.path === '/';

    if ((isAdminRoute || isHomeRoute) && !isLoggedIn) {
        return navigateTo('/admin/login');
    }
});
