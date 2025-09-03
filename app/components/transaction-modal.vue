<template>
    <UModal v-model:open="isOpen">
        <template #content>
            <UCard>
                <template #header>
                    Add Transaction
                </template>

                <UForm :state="state" :schema="schema" ref="form" @submit="save">
                    <UFormField :required="true" label="Transaction Type" name="type" class="mb-4">
                        <USelect placeholder="Select the transaction type" :items="[...TRANSACTIONS]" class="w-full" v-model="state.type" />
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

                    <UFormField :required="true" hint="Optional" label="Category" name="category" class="mb-4" v-if="state.type === TransactionTypeEnum.Expense">
                        <USelect placeholder="Category" :items="[...CATEGORIES]" class="w-full" v-model="state.category" />
                    </UFormField>

                    <UButton type="submit" color="neutral" variant="solid" label="Save" :loading="isLoading" />
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
import { z } from 'zod'
import {type ITransaction, type TransactionType, TransactionTypeEnum} from '~/types';
import { TRANSACTIONS, CATEGORIES } from '~/constants';
import type {FormSchema} from "#ui/types/form";


const props = defineProps<{
    modelValue: boolean
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'saved'): void
}>();

const isOpen = computed<boolean>({
    get: () => props.modelValue,
    set: (value) => {
        if (!value) resetForm()
        emit('update:modelValue', value)
    }
});

type LocalTransaction = Omit<ITransaction, 'id' | 'type'> & {
    type?: TransactionType
}

const initialState: LocalTransaction = {
    created_at: '',
    amount: 0,
    type: undefined,
    description: '',
    category: undefined
}

const state = ref<LocalTransaction>({
    ...initialState
});

const resetForm = () => {
    state.value = { ...initialState };
    form.value.clear();
}

const defaultSchema = z.object({
    created_at: z.string()
        .min(1, 'Please select a date')
        .refine(val => !isNaN(Date.parse(val)), {
            message: 'Invalid date'
        }),
    description: z.string().optional(),
    amount: z.number().positive('Amount needs to be more than 0')
});
const incomeSchema = z.object({
    type: z.literal('Income')
});
const expenseSchema = z.object({
    type: z.literal('Expense'),
    category: z.enum(CATEGORIES)
});
const investmentSchema = z.object({
    type: z.literal('Investment')
});
const savingSchema = z.object({
    type: z.literal('Saving')
});
const schema = z.intersection(
    z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
    defaultSchema
);

const form = ref<FormSchema>();
const isLoading = ref(false);
const supabase = useSupabaseClient()
const toast = useToast()

const save = async () => {
    emit('saved');

    if (form.value.errors.length) return

    isLoading.value = true
    try {
        const { error } = await supabase.from('transactions')
            .upsert({ ...state.value as any })

        if (!error) {
            toast.add({
                'title': 'Transaction saved',
                'icon': 'i-heroicons-check-circle'
            })

            isOpen.value = false;
            emit('saved');

            return;
        }

        throw error;
    } catch (e: any) {
        toast.add({
            title: 'Transaction not saved',
            description: e.message,
            icon: 'i-heroicons-exclamation-circle',
            color: 'warning'
        })
    } finally {
        isLoading.value = false
    }
};
</script>
