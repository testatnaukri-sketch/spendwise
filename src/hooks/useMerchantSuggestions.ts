import { useMemo } from 'react'
import { useExpenseStore } from '@/store/expenseStore'

export const useMerchantSuggestions = (searchTerm: string) => {
  const merchants = useExpenseStore((state) => state.merchants)

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) {
      return merchants
    }

    const lowerSearch = searchTerm.toLowerCase()
    return merchants.filter((merchant) =>
      merchant.toLowerCase().includes(lowerSearch)
    )
  }, [merchants, searchTerm])

  return suggestions
}
