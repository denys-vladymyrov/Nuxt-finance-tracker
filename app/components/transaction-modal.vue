<template>
    <UModal v-model:open="isOpen">
        <template #content>
            <UCard>
                <template #header>
                    Add Transaction
                </template>

                <div>Hello!</div>
            </UCard>
        </template>
    </UModal>
    <UButton
        icon="i-heroicons-plus-circle"
        color="neutral"
        variant="solid"
        label="Add"
        @click="isOpen = true"
    />
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

const isOpen = computed<boolean>({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});
</script>
