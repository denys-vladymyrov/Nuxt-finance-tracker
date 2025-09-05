interface AppToast {
    title: string;
    description?: string;
}

export const useAppToast = () => {
    const toast = useToast();

    return {
        toastSuccess: ({ title, description = '' }: AppToast) => {
            toast.add({
                title,
                description,
                icon: 'i-heroicons-check-circle',
                color: 'success'
            })
        },
        toastError: ({ title, description = '' }: AppToast) => {
            toast.add({
                title,
                description,
                icon: 'i-heroicons-exclamation-circle',
                color: 'error'
            })
        }
    }
}
