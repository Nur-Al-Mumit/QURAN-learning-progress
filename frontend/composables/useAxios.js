import axios from "axios";

export async function callAxios(endpoint, payload, config, method = 'post') {
  let data = null;
  let error = {};
  try {
    const response = method.toLowerCase() === 'get'
      ? await axios.get(endpoint, config)
      : await axios.post(endpoint, payload, config);
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
