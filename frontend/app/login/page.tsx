'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

/* ============================================================
   ICONS
   ============================================================ */
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
)
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

/* ============================================================
   LOGIN PAGE
   ============================================================ */
export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({ studentId: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.studentId || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login({ studentId: form.studentId, password: form.password })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Invalid Student ID or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'grid',
      gridTemplateColumns: '1fr',
      background: 'var(--color-surface)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        minHeight: '100dvh',
      }}>

        {/* ── LEFT PANEL (branding) ── */}
        <div
          className="hidden md:flex"
          style={{
            background: 'var(--color-brand-navy)',
            padding: 'clamp(2rem, 5vw, 4rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* bg decoration */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `
              radial-gradient(ellipse 60% 40% at 30% 70%, rgba(245,158,11,0.1) 0%, transparent 60%),
              radial-gradient(ellipse 40% 60% at 80% 20%, rgba(59,130,246,0.07) 0%, transparent 60%)
            `,
          }} />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />

          {/* Logo */}
          <div style={{ position: 'relative' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'var(--color-brand-amber)',
                color: 'var(--color-brand-navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem',
              }}>Q</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '1.25rem', color: 'white', letterSpacing: '-0.03em',
              }}>
                Quick<span style={{ color: 'var(--color-brand-amber)' }}>Found</span>
              </span>
            </Link>
          </div>

          {/* Center content */}
          <div style={{ position: 'relative' }} className="stagger">
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: 1 }}>🎒</div>
            <h2 style={{
              color: 'white', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              marginBottom: '1rem', lineHeight: 1.2,
            }}>
              Welcome back to<br />
              <span style={{ color: 'var(--color-brand-amber)' }}>QuickFound</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 320 }}>
              Your campus lost &amp; found platform. Sign in to post items,
              track your claims, and reunite with what matters.
            </p>

            {/* Feature list */}
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                'Post lost or found items instantly',
                'Get notified on smart matches',
                'Secure claim verification system',
              ].map(text => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(245,158,11,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-brand-amber)', fontSize: '0.75rem', flexShrink: 0,
                  }}>✓</span>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <p style={{ position: 'relative', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
            Built by Web_Weavers · University Project
          </p>
        </div>

        {/* ── RIGHT PANEL (form) ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 4rem)',
          background: 'var(--color-surface)',
        }}>
          <div style={{ width: '100%', maxWidth: 420 }} className="stagger">

            {/* Mobile logo */}
            <div className="flex md:hidden" style={{ marginBottom: '2rem' }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'var(--color-brand-amber)',
                  color: 'var(--color-brand-navy)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem',
                }}>Q</span>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '1.1rem', color: 'var(--color-text-primary)',
                }}>
                  Quick<span style={{ color: 'var(--color-brand-amber)' }}>Found</span>
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: 6 }}>Sign in</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Don&apos;t have an account?{' '}
                <Link href="/register" style={{
                  color: 'var(--color-brand-amber)',
                  fontWeight: 600, textDecoration: 'none',
                }}>
                  Sign up free
                </Link>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '0.875rem 1rem',
                borderRadius: 10,
                background: 'var(--color-lost-bg)',
                border: '1px solid rgba(239,68,68,0.2)',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                color: 'var(--color-lost)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Student ID */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label className="qf-label" htmlFor="studentId">Student ID</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)', display: 'flex', pointerEvents: 'none',
                    fontSize: '1rem',
                  }}>
                    🪪
                  </span>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. 230109384"
                    value={form.studentId}
                    onChange={handleChange}
                    className="qf-input"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="qf-label" htmlFor="password">Password</label>
                  <Link href="/forgot-password" style={{
                    fontSize: '0.8rem', color: 'var(--color-brand-amber)',
                    fontWeight: 500, textDecoration: 'none',
                  }}>
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)', display: 'flex', pointerEvents: 'none',
                  }}>
                    <LockIcon />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="qf-input"
                    style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{
                      position: 'absolute', right: 12, top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--color-text-muted)', display: 'flex', padding: 0,
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="qf-btn qf-btn-primary"
                style={{
                  width: '100%', padding: '0.875rem',
                  fontSize: '1rem', marginTop: '0.5rem',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      style={{ animation: 'spin 0.75s linear infinite' }}>
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' as const }}>
                New to QuickFound?
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>

            <Link href="/register" className="qf-btn qf-btn-secondary"
              style={{ width: '100%', textAlign: 'center' as const }}>
              Create an account
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}