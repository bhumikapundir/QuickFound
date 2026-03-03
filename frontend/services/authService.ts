import api from './api'
import type { LoginPayload, RegisterPayload, AuthResponse } from '@/types'

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  return data
}

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout')
}