import api from './api'
import type { Item, ItemFormValues, ItemFilters, PaginatedResponse, ClaimPayload, ClaimRequest } from '@/types'

export const fetchItems = async (
  filters: ItemFilters = {},
  page = 1,
  limit = 12
): Promise<PaginatedResponse<Item>> => {
  const { data } = await api.get('/items', { params: { ...filters, page, limit } })
  return data
}

export const fetchItemById = async (id: string): Promise<Item> => {
  const { data } = await api.get(`/items/${id}`)
  return data
}

export const postItem = async (payload: ItemFormValues): Promise<Item> => {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, val]) => {
    if (key === 'image' && val instanceof File) formData.append('image', val)
    else if (key === 'extraAttributes') formData.append(key, JSON.stringify(val))
    else if (val !== undefined) formData.append(key, String(val))
  })
  const { data } = await api.post('/items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/items/${id}`)
}

export const claimItem = async (payload: ClaimPayload): Promise<ClaimRequest> => {
  const { data } = await api.post(`/items/${payload.itemId}/claim`, payload)
  return data
}

export const fetchMyItems = async (): Promise<Item[]> => {
  const { data } = await api.get('/items/mine')
  return data
}

export const fetchMyClaims = async (): Promise<ClaimRequest[]> => {
  const { data } = await api.get('/claims/mine')
  return data
}

export const updateClaimStatus = async (
  claimId: string,
  status: 'approved' | 'rejected'
): Promise<ClaimRequest> => {
  const { data } = await api.patch(`/claims/${claimId}`, { status })
  return data
}