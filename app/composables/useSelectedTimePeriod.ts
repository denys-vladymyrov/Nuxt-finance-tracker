import { startOfYear, endOfYear, subYears, subMonths, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export const useSelectedTimePeriod = (period: Ref<string>) => {
    const dates = computed(
        () => {
            switch (period.value) {
                case 'Yearly':
                    return {
                        current: {
                            from: startOfYear(new Date()),
                            to: new Date()
                        },
                        previous: {
                            from: startOfYear(subYears(new Date(), 1)),
                            to: endOfYear(subYears(new Date(), 1))
                        }
                    }
                case 'Monthly':
                    return {
                        current: {
                            from: startOfMonth(new Date()),
                            to: new Date()
                        },
                        previous: {
                            from: startOfMonth(subMonths(new Date(), 1)),
                            to: endOfMonth(subMonths(new Date(), 1))
                        }
                    }
                case 'Daily':
                    return {
                        current: {
                            from: startOfDay(new Date()),
                            to: new Date()
                        },
                        previous: {
                            from: startOfDay(subDays(new Date(), 1)),
                            to: endOfDay(subDays(new Date(), 1))
                        }
                    }
            }
        }
    )

    return dates;
}
