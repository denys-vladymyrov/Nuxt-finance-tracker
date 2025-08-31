export type TransactionType = 'Income' | 'Expense';

export interface ITransaction {
    id: number
    created_at: string
    amount: number
    type: TransactionType
    description: string
    category?: string
}

export interface DailyTransactionProps {
    date: String
    transactions: ITransaction[]
}

export interface TrendProps {
    title: string
    amount: number
    lastAmount: number
    color: 'green' | 'red'
    loading?: boolean
}

export interface TransactionProps {
    transaction: ITransaction
}
