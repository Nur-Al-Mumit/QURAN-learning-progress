import axios from "axios";

export async function callAxios(endpoint, payload, config, method = 'post') {
  const config_runtime = useRuntimeConfig();
  const apiBase = config_runtime.public.apiBase;
  const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint}`;
  
  let data = null;
  let error = {};
  try {
    let response;
    const m = method.toLowerCase();
    if (m === 'get') {
      response = await axios.get(url, config);
    } else if (m === 'put') {
      response = await axios.put(url, payload, config);
    } else if (m === 'delete') {
      response = await axios.delete(url, config);
    } else {
      response = await axios.post(url, payload, config);
    }
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
