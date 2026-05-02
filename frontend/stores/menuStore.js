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
        title: "HW/SMS",
        icon: "Circular",
        link: "/admin/hw-sms",
      }
    ];
  };

  const setStudentMenu = () => {
    links.value = [
      {
        title: "Dashboard",
        icon: "Dashboard",
        link: "/dashboard",
      },
      {
        title: "My Attendance",
        icon: "Circular",
        link: "/attendance",
      },
      {
        title: "Profile",
        icon: "ViewProfile",
        link: "/profile",
      }
    ];
  };

  const clearMenu = () => {
    links.value = [];
  };

  return { links, setAdminMenu, setStudentMenu, clearMenu }
}, {
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
  }
})
