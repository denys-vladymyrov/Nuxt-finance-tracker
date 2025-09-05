<template>
    <UForm :state="state" :schema="schema" @submit.prevent="saveProfile">
        <UFormField
            class="mb-4"
            label="Full Name"
            name="name"
        >
            <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField class="mb-4"
                    label="Email"
                    name="email"
                    help="You will receive a confirmation email on both the old and the new addresses if you modify the email address"
        >
            <UInput v-model="state.email" class="w-full" />
        </UFormField>

        <UButton
            type="submit"
            color="neutral"
            variant="solid"
            label="Save"
            :loading="pending"
            :disabled="pending"
        />
    </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { toErrorMessage } from "~/utils";

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { toastSuccess, toastError } = useAppToast();

const pending = ref(false);
const state = ref({
    name: user.value?.user_metadata?.full_name,
    email: user.value?.email
})

const schema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().refine(
        val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        { message: "Invalid email address" }
    )
});

const saveProfile = async () => {
    pending.value = true;

    try {
        const data = {
            data: {
                full_name: state.value.name
            },
            email: ''
        };

        if (state.value.email !== user.value?.email) {
            data.email = state.value.email || '';
        }

        const { error } = await supabase.auth.updateUser(data);
        if (error) throw error;

        toastSuccess({
            title: 'Profile updated',
            description: 'Your profile has been updated'
        })
    } catch (error) {
        toastError({
            title: 'Error updating profile',
            description: toErrorMessage(error)
        })
    } finally {
        pending.value = false;
    }
}
</script>
