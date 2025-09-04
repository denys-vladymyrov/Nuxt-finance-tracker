import { type ITransaction, TransactionTypeEnum, type Period } from "~/types";

export const useFetchTransactions = (period: Period) => {
    const supabase = useSupabaseClient();

    const {
        data: transactions,
        pending,
        refresh
    } = useAsyncData<ITransaction[]>(
        `transactions-${period.value?.from.toDateString()}-${period.value?.to.toDateString()}`,
        async () => {
            const { data, error } = await supabase.from('transactions')
                .select()
                .gte('created_at', period.value?.from.toISOString())
                .lte('created_at', period.value?.to.toISOString())
                .order('created_at', { ascending: false })
            if (error) return []
            return data ?? []
        }
    )

    watch(period, async () => await refresh(), { immediate: true });

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

    return {
        transactions: {
            all: transactions,
            grouped: {
                byDate: transactionsGroupedByDate
            },
            income,
            expense,
            incomeTotal,
            expenseTotal,
            incomeCount,
            expenseCount
        },
        refresh,
        pending
    }
};
