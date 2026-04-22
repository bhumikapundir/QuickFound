'use client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-surface)',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        textAlign: 'center' as const,
      }}>
        {/* Icon */}
        <div style={{
          width: 72, height: 72,
          borderRadius: '50%',
          background: 'var(--color-brand-amber-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem',
          margin: '0 auto 1.5rem',
        }}>
          🔐
        </div>

        <h2 style={{ marginBottom: '0.75rem' }}>Forgot your password?</h2>

        <p style={{
          color: 'var(--color-text-muted)',
          marginBottom: '2rem',
          lineHeight: 1.7,
        }}>
          Since QuickFound is a closed university system, password resets
          are handled by the administrator. Please contact your campus admin
          with your Student ID to get your password reset.
        </p>

        {/* Info card */}
        <div style={{
          padding: '1.25rem',
          borderRadius: 12,
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          marginBottom: '2rem',
          textAlign: 'left' as const,
        }}>
          <p style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.06em',
            color: 'var(--color-text-muted)',
            marginBottom: '0.75rem',
          }}>
            Steps to reset your password
          </p>
          {[
            'Note down your Student ID',
            'Contact the campus QuickFound administrator',
            'Admin will reset your password',
            'Log in with your new password',
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: i < 3 ? '0.625rem' : 0,
            }}>
              <span style={{
                width: 22, height: 22,
                borderRadius: '50%',
                background: 'var(--color-brand-amber)',
                color: 'var(--color-brand-navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
                flexShrink: 0, marginTop: 1,
              }}>
                {i + 1}
              </span>
              <span style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
              }}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <Link href="/login" className="qf-btn qf-btn-primary"
          style={{ width: '100%', padding: '0.875rem' }}>
          ← Back to Login
        </Link>
      </div>
    </div>
  )
}