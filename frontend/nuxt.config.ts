// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ["~/assets/css/style.css"],
  modules: ["@pinia/nuxt", "pinia-plugin-persistedstate/nuxt"],
  vite: {
    plugins: [tailwindcss()],
  },
  compatibilityDate: "2025-05-03",
});
