import { defineStore } from "pinia";

export const useUserInfoStore = defineStore(
  "UserInfoStores",
  () => {
    let error: any = ref(null);
    let loading = ref(false);
    let userInfo = ref(null);
    let isUpdate = ref(false);

    const getProfileInfo = async () => {
      loading.value = true;
      try {
        const endpoint = "/user/profile-information";
        const { data } = await callAuthnAxios(endpoint, null, null, "get");
        userInfo.value = data.data;
      } catch (err) {
        error.value = err;
      } finally {
        loading.value = false;
      }
    };

    return {
      getProfileInfo,
      userInfo: computed(() => userInfo.value), // Access non-reactive value
      loading: computed(() => loading.value), // Access non-reactive value
      isUpdate: computed(() => isUpdate.value), // Access non-reactive value
      error: computed(() => error.value), // Access non-reactive value
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(),
    },
  }
);
