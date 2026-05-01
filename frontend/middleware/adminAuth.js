import { useAdminUserAuth } from '~/composables/checkAdminAuth';

export default defineNuxtRouteMiddleware(async (to, from) => {

    if (process.server) return;

    const { isAuthenticated } = useAdminUserAuth();

    if (to.path === '/admin/sign-in') {
        return;
    }

    await nextTick(); // Wait for the next DOM update cycle, ensuring reactivity

    if (!isAuthenticated.value) {
        return navigateTo('/admin/sign-in');
    }


});
