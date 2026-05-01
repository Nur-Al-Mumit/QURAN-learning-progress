import { defineStore } from 'pinia'

export const useSideBarStore = defineStore('SideBarStore', () => {
  let user = ref({});

  return { user }
}, {
  persist: {
    // storage: persistedState.cookies,
    storage: piniaPluginPersistedstate.cookies()
  }
})
