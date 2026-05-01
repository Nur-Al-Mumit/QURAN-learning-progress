import { useAdminAuthStore } from "~/stores/adminAuthStore";

export async function callAdminAuthnAxios(api, payLoad, headers) {
    const authStore = useAdminAuthStore();
    const tokenType = authStore.loggedInData?.token_type || 'Bearer';
    const accessToken = authStore.loggedInData?.access_token || '';

    const config = headers === undefined ? {
        headers: {
            'Authorization': `${tokenType} ${accessToken}`
        }
    } : headers;


    const { data, error } = await callAxios(api, payLoad, config)

    return { data, error }
}