import { defineStore } from 'pinia'

export const useMenuStore = defineStore('MenuStore', () => {
  const links = ref([]);

  const setAdminMenu = () => {
    links.value = [
      {
        title: "Overview",
        icon: "Dashboard",
        link: "/admin/dashboard",
      },
      {
        title: "Attendance Desk",
        icon: "Circular",
        link: "/admin/attendance",
      },
      {
        title: "Schedule Class",
        icon: "Settings",
        link: "/admin/add-class-date",
      },
      {
        title: "Students",
        icon: "ViewProfile",
        link: "/admin/students",
      },
      {
        title: "Parent Messaging",
        icon: "AddContact",
        link: "/admin/hw-sms",
      }
    ];
  };

  const clearMenu = () => {
    links.value = [];
  };

  return { links, setAdminMenu, clearMenu }
}, {
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
  }
})
