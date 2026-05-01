import axios from "axios";

export default defineNuxtPlugin(() => {
  axios.defaults.baseURL = "http://127.0.0.1:8000/api";

  return {
    provide: {
      axios: axios,
    },
  };
});
