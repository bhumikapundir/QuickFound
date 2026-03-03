'use client'
import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'
import type { User, LoginPayload, RegisterPayload } from '@/types'
import { loginUser, registerUser } from '@/services/authService'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } }

const initialState: AuthState = {
  user: null, token: null,
  isAuthenticated: false, isLoading: true,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_SESSION':
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, isLoading: false }
    case 'LOGOUT':
      return { ...initialState, isLoading: false }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('qf_token')
      const user = localStorage.getItem('qf_user')
      if (token && user) {
        dispatch({ type: 'RESTORE_SESSION', payload: { token, user: JSON.parse(user) } })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const login = async (payload: LoginPayload) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const res = await loginUser(payload)
    localStorage.setItem('qf_token', res.token)
    localStorage.setItem('qf_user', JSON.stringify(res.user))
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: res.user, token: res.token } })
  }

  const register = async (payload: RegisterPayload) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const res = await registerUser(payload)
    localStorage.setItem('qf_token', res.token)
    localStorage.setItem('qf_user', JSON.stringify(res.user))
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: res.user, token: res.token } })
  }

  const logout = () => {
    localStorage.removeItem('qf_token')
    localStorage.removeItem('qf_user')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}