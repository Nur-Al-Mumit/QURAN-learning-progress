import { useAdminAuthStore } from "~/stores/adminAuthStore";

export const useAdminUserAuth = () => {
  const authStore = useAdminAuthStore();
  // console.log(authStore.isLoggedIn);
  const isAuthenticated = computed(() => authStore.isLoggedIn);


  return { isAuthenticated }
}
