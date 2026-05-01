import { useCheckUserAuth } from '~/composables/checkUserAuth';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { isAuthenticated, userRole } = useCheckUserAuth();

    if (process.server) return;

    await nextTick();

    if (!isAuthenticated.value) {
        console.log('object');
        return navigateTo('/sign-in');
    }

    if (to.path === '/applied-jobs' && (![1, 3, 4].includes(userRole.value))) {
        return navigateTo('/');
    }

    // Check user role for accessing recruiter pages
    if (to.path.startsWith('/recruiter')) {

        // If userRole is not 2 or 4, redirect
        if (![1, 2, 4, 21, 22].includes(userRole.value)) {
            return navigateTo('/');
        }

        if (to.path === '/recruiter/user-roles' && userRole.value !== 1) {
            return navigateTo('/');
        }
    }

});
