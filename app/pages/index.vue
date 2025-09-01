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
        <Trend v-if="incomeTotal" color="green" title="Income" :amount="incomeTotal" :last-amount="4100" :loading="pending" />
        <Trend v-if="expenseTotal" color="red" title="Expense" :amount="expenseTotal" :last-amount="3800" :loading="pending" />
        <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="pending" />
        <Trend color="red" title="Saving" :amount="4000" :last-amount="4100" :loading="pending" />
    </section>

    <section class="flex justify-between mb-10">
        <div>
            <h2 class="text-2xl font-extrabold">Transactions</h2>
            <div class="text-gray-500 dark:text-gray-400">
                You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
            </div>
        </div>
        <div>
            <TransactionModal v-model="isOpen" />
        </div>
    </section>

    <section v-if="!pending">
        <div v-for="(transactionsOnDay, date) in transactionsGroupedByDate" :key="date" class="mb-10">
            <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
            <Transaction
                v-for="transaction in transactionsOnDay"
                :key="transaction.id"
                :transaction="transaction"
                @deleted="refreshTransactions"
            />
        </div>
    </section>
    <section v-else>
        <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
</template>

<script setup lang="ts">

import { transactionViewOptions } from '~/constants';
import { type ITransaction, TransactionTypeEnum } from '~/types';

const supabase = useSupabaseClient();

const selectedView = ref(transactionViewOptions[1]);

const isOpen = ref(false);

const {
    data: transactions,
    pending,
    refresh: refreshTransactions
} = await useAsyncData<ITransaction[]>(
    'transactions',
    async () => {
        const { data, error } = await supabase.from('transactions').select().order('created_at', { ascending: true })
        if (error) return []
        return data ?? []
    }
)

const transactionsGroupedByDate = computed<Record<string, ITransaction[]>>(() => {
    const grouped: Record<string, ITransaction[]> = {};

    for (const transaction of transactions.value ?? []){
        const date = new Date(transaction.created_at).toISOString().split('T')[0]!;

        if (!grouped[date]) {
            grouped[date] = [];
        }

        grouped[date].push(transaction);
    }

    return grouped;
});


// Trends section

const income = computed<ITransaction[] | undefined>(
    () => transactions.value?.filter(t => t.type === TransactionTypeEnum.Income)
)
const expense = computed<ITransaction[] | undefined>(
    () => transactions.value?.filter(t => t.type === TransactionTypeEnum.Expense)
)

const incomeCount = computed<number | undefined>(() => income.value?.length)
const expenseCount = computed<number | undefined>(() => expense.value?.length)

const incomeTotal = computed<number | undefined>(
    () => income.value?.reduce((sum, transaction) => sum + transaction.amount, 0)
)
const expenseTotal = computed<number | undefined>(
    () => expense.value?.reduce((sum, transaction) => sum + transaction.amount, 0)
)

</script>
