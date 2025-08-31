<template>
    <section class="flex items-center justify-between mb-10">
        <h1 class="text-4xl font-extrabold">
            Summary
        </h1>
        <div>
            <USelectMenu
                :items="transactionViewOptions"
                v-model="selectedView"
                class="w-32"
            />
        </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <Trend color="green" title="Income" :amount="4000" :last-amount="3000" :loading="false" />
        <Trend color="red" title="Expense" :amount="4000" :last-amount="5000" :loading="false" />
        <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="false" />
        <Trend color="red" title="Saving" :amount="4000" :last-amount="4100" :loading="false" />
    </section>

    <section>
        <div v-for="(transactionsOnDay, date) in transactionsGroupedByDate" :key="date" class="mb-10">
            <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
            <Transaction v-for="transaction in transactionsOnDay" :key="transaction.id" :transaction="transaction" />
        </div>
    </section>
</template>

<script setup lang="ts">

import { transactionViewOptions } from '~/constants';
import { type ITransaction } from '~/types';

const supabase = useSupabaseClient();

const selectedView = ref(transactionViewOptions[1]);
const transactions = ref<ITransaction[]>([])

const { data, pending } = await useAsyncData<ITransaction[]>('transactions', async () => {
    const { data, error } = await supabase.from('transactions').select();

    if (error) return [];

    return (data ?? []) as ITransaction[];
})

transactions.value = data.value ?? [];

const transactionsGroupedByDate = computed<Record<string, ITransaction[]>>(() => {
    const grouped: Record<string, ITransaction[]> = {};

    for (const transaction of transactions.value.sort((a, b) => a.id - b.id)) {
        const date = new Date(transaction.created_at).toISOString().split('T')[0]!;

        if (!grouped[date]) {
            grouped[date] = [];
        }

        grouped[date].push(transaction);
    }

    return grouped;
});

</script>
