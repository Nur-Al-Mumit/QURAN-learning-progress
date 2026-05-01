import { useStudentAuthInfoStore } from "~/stores/studentAuthInfo";

export const useCheckUserAuth = () => {
  const authStore = useStudentAuthInfoStore();
  const isAuthenticated = computed(() => authStore.isLoggedIn);
  const userRole = computed(() => authStore.userRole);


  return { isAuthenticated, userRole }
}
