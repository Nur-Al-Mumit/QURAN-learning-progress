import { defineStore } from "pinia";
import { callAdminAuthnAxios } from "~/composables/adminAuthenticatedAxios";

export const useDashboardStore = defineStore("Dashboard", () => {
  const stats = ref([]);
  const recentActivity = ref([]);
  const upcomingClasses = ref([]);
  const attendanceHealth = ref([]);
  const loading = ref(false);

  const fetchStats = async () => {
    loading.value = true;
    try {
      const { data } = await callAdminAuthnAxios("/dashboard/stats", null, null, "get");
      if (data) {
        stats.value = data.stats;
        recentActivity.value = data.recentActivity;
        upcomingClasses.value = data.upcomingClasses;
        attendanceHealth.value = data.attendanceHealth;
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      loading.value = false;
    }
  };

  return { stats, recentActivity, upcomingClasses, attendanceHealth, loading, fetchStats };
});
