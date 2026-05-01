import axios from "axios";

export async function callAxios(endpoint, payload, config, method = 'post') {
  const config_runtime = useRuntimeConfig();
  const apiBase = config_runtime.public.apiBase;
  const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint}`;
  
  let data = null;
  let error = {};
  try {
    const response = method.toLowerCase() === 'get'
      ? await axios.get(url, config)
      : await axios.post(url, payload, config);
    data = response.data;
  } catch (e) {
    error = e.response?.data || e.message;
    alert(error.message || "An error occurred");
    // if (error.message === 'Unauthenticated') {
    //   navigateTo('./')
    // }
  }
  return { data, error };
}
