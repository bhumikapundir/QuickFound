'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Theme } from '@/types'

interface ThemeContextType {
  theme: Theme
  setTheme: (t: Theme) => void
  isDark: boolean
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = (localStorage.getItem('qf_theme') as Theme) || 'system'
    setThemeState(saved)
    applyTheme(saved)
    setMounted(true)
  }, [])

  const applyTheme = (t: Theme) => {
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = t === 'dark' || (t === 'system' && prefersDark)
    root.setAttribute('data-theme', dark ? 'dark' : 'light')
  }

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('qf_theme', t)
    applyTheme(t)
  }

  // Before mounted, always return false to match server render
  const prefersDark =
    mounted && typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false

  const isDark = mounted && (theme === 'dark' || (theme === 'system' && prefersDark))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
