export function useToast() {
    const showToast = ref(false);
    const message = ref('');
    const type = ref('success'); // success, error, warning, info

    const triggerToast = (msg, toastType = 'success', duration = 3000) => {
        message.value = msg;
        type.value = toastType;
        showToast.value = true;

        setTimeout(() => {
            showToast.value = false;
        }, duration);
    };

    return {
        showToast,
        message,
        type,
        triggerToast
    };
}
