import { defineStore } from "pinia";

export const useStudentAuthInfoStore = defineStore(
  "StudentAuthInfo",
  () => {
    let loggedInData = ref(null);
    let isLoggedIn = ref(false);
    return { loggedInData, isLoggedIn };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(),
    },
  }
);
