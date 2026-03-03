import { useState, useEffect } from 'react'
import { fetchItems } from '@/services/itemService'
import type { Item, ItemFilters, PaginatedResponse } from '@/types'

export function useItems(filters: ItemFilters = {}, page = 1) {
  const [data, setData] = useState<PaginatedResponse<Item> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    fetchItems(filters, page)
      .then(setData)
      .catch((e) => setError(e.message || 'Failed to load items'))
      .finally(() => setIsLoading(false))
  }, [JSON.stringify(filters), page])

  return { data, isLoading, error }
}