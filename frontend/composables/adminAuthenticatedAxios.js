import { useAdminAuthStore } from "~/stores/adminAuthStore";

export async function callAdminAuthnAxios(api, payLoad, headers, method = 'post') {
    const authStore = useAdminAuthStore();
    const tokenType = 'Bearer';
    const accessToken = authStore.loggedInData?.token || '';

    const config = headers === undefined ? {
        headers: {
            'Authorization': `${tokenType} ${accessToken}`
        }
    } : {
        ...headers,
        headers: {
            ...headers?.headers,
            'Authorization': `${tokenType} ${accessToken}`
        }
    };


    const { data, error } = await callAxios(api, payLoad, config, method)

    return { data, error }
}