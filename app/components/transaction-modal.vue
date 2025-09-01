<template>
    <UModal v-model:open="isOpen">
        <template #content>
            <UCard>
                <template #header>
                    Add Transaction
                </template>

                <UForm :state="state">
                    <UFormField :required="true" label="Transaction Type" name="type" class="mb-4">
                        <USelect placeholder="Select the transaction type" :items="[...TRANSACTIONS]" class="w-full" />
                    </UFormField>

                    <UFormField :required="true" label="Amount" name="amount" class="mb-4">
                        <UInput type="number" placeholder="Amount" class="w-full" v-model.number="state.amount" />
                    </UFormField>

                    <UFormField :required="true" label="Transaction date" name="created_at" class="mb-4">
                        <UInput type="date" icon="i-heroicons-calendar-days-20-solid" class="w-full" v-model="state.created_at" />
                    </UFormField>

                    <UFormField hint="Optional" label="Transaction date" name="description" class="mb-4">
                        <UInput placeholder="Description" class="w-full" v-model="state.description" />
                    </UFormField>

                    <UFormField :required="true" hint="Optional" label="Category" name="category" class="mb-4">
                        <USelect placeholder="Category" :items="[...CATEGORIES]" class="w-full" v-model="state.category" />
                    </UFormField>

                    <UButton type="submit" color="neutral" variant="solid" label="Save" />
                </UForm>
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
import { type ITransaction } from '~/types';
import { TRANSACTIONS, CATEGORIES } from '~/constants';

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

type LocalTransaction = Omit<ITransaction, 'id'>

const state = ref<LocalTransaction>({
    created_at: '',
    amount: 0,
    type: 'Income',
    description: '',
    category: undefined
})
</script>
