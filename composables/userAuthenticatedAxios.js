import { useStudentAuthInfoStore } from "~/stores/studentAuthInfo";
import axios from "axios";

export async function callAuthnAxios(endpoint, payLoad, headers, method = 'post') {

    let data = null;
    let error = {};
    const authStore = useStudentAuthInfoStore();
    const tokenType = authStore.loggedInData?.token_type || 'Bearer';
    const accessToken = authStore.loggedInData?.access_token || '';

    const config = headers === undefined ? {
        headers: {
            'Authorization': `${tokenType} ${accessToken}`
        }
    } : headers;


    try {
        const response = method.toLowerCase() === 'get'
            ? await axios.get(endpoint, config)
            : await axios.post(endpoint, payLoad, config);
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