<template>
    <div>
        <div class="mb-4">
            <UFormField label="Current avatar" class="w-full" help="This would be blank by default">
                <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" size="3xl" />
            </UFormField>
        </div>

        <div class="mb-4">
            <UFormField label="New avatar" class="w-full" name="avatar"
                        help="After choosing an image click Save to actually upload the new avatar">
                <UInput type="file" @change="onFileChange" />
            </UFormField>
        </div>

        <UButton type="submit" color="neutral" variant="solid" label="Save" :loading="uploading" :disabled="uploading"
                 @click="saveAvatar" />
    </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { toastSuccess, toastError } = useAppToast();

const uploading = ref(false);
const file = ref(null);

const onFileChange = (e) => {
    const target = e.target;
    file.value = target.files?.[0] ?? null;
};

const saveAvatar = async () => {
    if (!file.value) {
        toastError({ title: 'Select a file to upload first' });
        return;
    }

    const fileExt = file.value.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    try {
        uploading.value = true;

        const currentAvatarUrl = user.value.user_metadata?.avatar_url;

        const { error } = await supabase.storage.from('avatars').upload(fileName, file.value);
        if (error) throw error;

        await supabase.auth.updateUser({
            data: {
                avatar_url: fileName
            }
        });

        if (currentAvatarUrl) {
            const { error } = await supabase.storage.from('avatars').remove([currentAvatarUrl])
            if (error) throw error
        }

        file.value = null;

        toastSuccess({
            title: 'Avatar uploaded',
        })
    } catch (error) {
        toastError({
            title: 'Error uploading avatar',
            description: error.message
        })
    } finally {
        uploading.value = false;
    }
}
</script>
