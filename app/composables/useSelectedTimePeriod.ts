import { startOfYear, endOfYear, subYears, subMonths, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export const useSelectedTimePeriod = (period: Ref<string>) => {
    const current = computed(
        () => {
            switch (period.value) {
                case 'Yearly':
                    return {
                        from: startOfYear(new Date()),
                        to: new Date()
                    }
                case 'Monthly':
                    return {
                        from: startOfMonth(new Date()),
                        to: new Date()
                    }
                case 'Daily':
                    return {
                        from: startOfDay(new Date()),
                        to: new Date()
                    }
            }
        }
    )

    const previous = computed(
        () => {
            switch (period.value) {
                case 'Yearly':
                    return {
                        from: startOfYear(subYears(new Date(), 1)),
                        to: endOfYear(subYears(new Date(), 1))
                    }
                case 'Monthly':
                    return {
                        from: startOfMonth(subMonths(new Date(), 1)),
                        to: endOfMonth(subMonths(new Date(), 1))
                    }
                case 'Daily':
                    return {
                        from: startOfDay(subDays(new Date(), 1)),
                        to: endOfDay(subDays(new Date(), 1))
                    }
            }
        }
    )

    return {
        current,
        previous,
    }
}
