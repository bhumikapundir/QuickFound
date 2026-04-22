'use client' //next js ko batata hai ki ye component runs on browser not on server
import { ReactNode } from 'react'   //reusable UI component bana raha hai jo tab use hota hai jab koi data nahi hota

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      gap: '1rem',
    }}>
      <span style={{ fontSize: '3.5rem', lineHeight: 1 }}>{icon}</span>
      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 6,
        }}>
          {title}
        </h3>
        {description && (
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-muted)',
            maxWidth: 320,
            margin: '0 auto',
          }}>
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}