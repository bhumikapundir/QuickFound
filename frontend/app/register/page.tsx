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
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const HashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"/>
    <line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/>
    <line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
)
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

/* ============================================================
   STEP INDICATOR
   ============================================================ */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: i < current ? 28 : 28,
            height: 28,
            borderRadius: '50%',
            background: i < current
              ? 'var(--color-brand-amber)'
              : i === current
                ? 'var(--color-brand-navy)'
                : 'var(--color-surface-3)',
            border: i === current
              ? '2px solid var(--color-brand-amber)'
              : '2px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700,
            color: i < current
              ? 'var(--color-brand-navy)'
              : i === current
                ? 'white'
                : 'var(--color-text-muted)',
            transition: 'all 0.3s ease',
            flexShrink: 0,
          }}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div style={{
              width: 32, height: 2,
              background: i < current ? 'var(--color-brand-amber)' : 'var(--color-border)',
              transition: 'background 0.3s ease',
            }} />
          )}
        </div>
      ))}
      <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
        Step {current + 1} of {total}
      </span>
    </div>
  )
}

/* ============================================================
   REGISTER PAGE
   ============================================================ */
export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    email: '',
    universityRollNumber: '',
    studentId: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  /* ── Step validation ── */
  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim()) return 'Please enter your full name.'
      if (!form.email.trim()) return 'Please enter your university email.'
      if (!form.email.includes('@')) return 'Please enter a valid email address.'
    }
    if (step === 1) {
      if (!form.universityRollNumber.trim()) return 'Please enter your university roll number.'
      if (!form.studentId.trim()) return 'Please enter your student ID.'
    }
    if (step === 2) {
      if (!form.password) return 'Please enter a password.'
      if (form.password.length < 6) return 'Password must be at least 6 characters.'
      if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    }
    return ''
  }

  const handleNext = () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setError('')
    setStep(s => s + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(s => s - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validateStep()
    if (err) { setError(err); return }
    setLoading(true)
    setError('')
    try {
      await register({
        name: form.name,
        email: form.email,
        universityRollNumber: form.universityRollNumber,
        studentId: form.studentId,
        password: form.password,
      })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Field styles ── */
  const fieldWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 }
  const iconWrap: React.CSSProperties = {
    position: 'absolute', left: 12, top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-text-muted)', display: 'flex', pointerEvents: 'none',
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-surface)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        minHeight: '100dvh',
      }}>

        {/* ── LEFT PANEL ── */}
        <div
          className="hidden md:flex"
          style={{
            background: 'var(--color-brand-navy)',
            padding: 'clamp(2rem, 5vw, 4rem)',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `
              radial-gradient(ellipse 60% 40% at 70% 30%, rgba(245,158,11,0.1) 0%, transparent 60%),
              radial-gradient(ellipse 40% 60% at 20% 80%, rgba(34,197,94,0.07) 0%, transparent 60%)
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
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: 1 }}>🎓</div>
            <h2 style={{
              color: 'white', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              marginBottom: '1rem', lineHeight: 1.2,
            }}>
              Join{' '}
              <span style={{ color: 'var(--color-brand-amber)' }}>QuickFound</span>
              <br />today
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.55)', fontSize: '1rem',
              lineHeight: 1.7, maxWidth: 320,
            }}>
              Create your campus account in under 2 minutes and start
              posting or searching for lost items instantly.
            </p>

            {/* Steps preview */}
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: '👤', label: 'Personal details', done: step > 0 },
                { icon: '🪪', label: 'University credentials', done: step > 1 },
                { icon: '🔒', label: 'Secure your account', done: step > 2 },
              ].map(({ icon, label, done }, i) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  opacity: step === i ? 1 : 0.5,
                  transition: 'opacity 0.3s ease',
                }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: done
                      ? 'rgba(245,158,11,0.2)'
                      : step === i
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', flexShrink: 0,
                    border: step === i ? '1px solid rgba(245,158,11,0.4)' : '1px solid transparent',
                  }}>{done ? '✓' : icon}</span>
                  <span style={{
                    fontSize: '0.875rem',
                    color: step === i ? 'white' : 'rgba(255,255,255,0.5)',
                    fontWeight: step === i ? 600 : 400,
                  }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ position: 'relative', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
            Built by Web_Weavers · University Project
          </p>
        </div>

        {/* ── RIGHT PANEL (form) ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 4rem)',
          background: 'var(--color-surface)',
        }}>
          <div style={{ width: '100%', maxWidth: 420 }}>

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
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ marginBottom: 6 }}>Create account</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Already have an account?{' '}
                <Link href="/login" style={{
                  color: 'var(--color-brand-amber)',
                  fontWeight: 600, textDecoration: 'none',
                }}>Sign in</Link>
              </p>
            </div>

            {/* Step indicator */}
            <StepIndicator current={step} total={3} />

            {/* Error */}
            {error && (
              <div style={{
                padding: '0.875rem 1rem', borderRadius: 10,
                background: 'var(--color-lost-bg)',
                border: '1px solid rgba(239,68,68,0.2)',
                marginBottom: '1.5rem',
                fontSize: '0.875rem', color: 'var(--color-lost)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* ── STEP 0: Personal Info ── */}
              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
                  <div style={fieldWrap}>
                    <label className="qf-label" htmlFor="name">Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <span style={iconWrap}><UserIcon /></span>
                      <input
                        id="name" name="name" type="text"
                        placeholder="e.g. Bhumika Pundir"
                        value={form.name} onChange={handleChange}
                        className="qf-input" style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>
                  </div>

                  <div style={fieldWrap}>
                    <label className="qf-label" htmlFor="email">University Email</label>
                    <div style={{ position: 'relative' }}>
                      <span style={iconWrap}><MailIcon /></span>
                      <input
                        id="email" name="email" type="email"
                        placeholder="you@university.edu"
                        value={form.email} onChange={handleChange}
                        className="qf-input" style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>
                  </div>

                  <button
                    type="button" onClick={handleNext}
                    className="qf-btn qf-btn-primary"
                    style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }}
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* ── STEP 1: University Credentials ── */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
                  <div style={fieldWrap}>
                    <label className="qf-label" htmlFor="universityRollNumber">University Roll Number</label>
                    <div style={{ position: 'relative' }}>
                      <span style={iconWrap}><HashIcon /></span>
                      <input
                        id="universityRollNumber" name="universityRollNumber" type="text"
                        placeholder="e.g. 2318666"
                        value={form.universityRollNumber} onChange={handleChange}
                        className="qf-input" style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>
                  </div>

                  <div style={fieldWrap}>
                    <label className="qf-label" htmlFor="studentId">Student ID</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ ...iconWrap, fontSize: '1rem' }}>🪪</span>
                      <input
                        id="studentId" name="studentId" type="text"
                        placeholder="e.g. 230121903"
                        value={form.studentId} onChange={handleChange}
                        className="qf-input" style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      This will be used to log in to your account.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="button" onClick={handleBack}
                      className="qf-btn qf-btn-secondary"
                      style={{ flex: 1, padding: '0.875rem' }}
                    >
                      ← Back
                    </button>
                    <button
                      type="button" onClick={handleNext}
                      className="qf-btn qf-btn-primary"
                      style={{ flex: 2, padding: '0.875rem', fontSize: '1rem' }}
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Password ── */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
                  <div style={fieldWrap}>
                    <label className="qf-label" htmlFor="password">Password</label>
                    <div style={{ position: 'relative' }}>
                      <span style={iconWrap}><LockIcon /></span>
                      <input
                        id="password" name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 6 characters"
                        value={form.password} onChange={handleChange}
                        className="qf-input"
                        style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                      />
                      <button type="button"
                        onClick={() => setShowPassword(p => !p)}
                        style={{
                          position: 'absolute', right: 12, top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--color-text-muted)', display: 'flex', padding: 0,
                        }}>
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  <div style={fieldWrap}>
                    <label className="qf-label" htmlFor="confirmPassword">Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <span style={iconWrap}><LockIcon /></span>
                      <input
                        id="confirmPassword" name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        value={form.confirmPassword} onChange={handleChange}
                        className="qf-input"
                        style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                      />
                      <button type="button"
                        onClick={() => setShowConfirm(p => !p)}
                        style={{
                          position: 'absolute', right: 12, top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--color-text-muted)', display: 'flex', padding: 0,
                        }}>
                        {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>

                    {/* Password match indicator */}
                    {form.confirmPassword && (
                      <p style={{
                        fontSize: '0.78rem', marginTop: 2,
                        color: form.password === form.confirmPassword
                          ? 'var(--color-found)'
                          : 'var(--color-lost)',
                      }}>
                        {form.password === form.confirmPassword
                          ? '✓ Passwords match'
                          : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>

                  {/* Terms note */}
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    By creating an account you agree to use QuickFound responsibly
                    within your campus community.
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="button" onClick={handleBack}
                      className="qf-btn qf-btn-secondary"
                      style={{ flex: 1, padding: '0.875rem' }}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="qf-btn qf-btn-primary"
                      style={{
                        flex: 2, padding: '0.875rem', fontSize: '1rem',
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
                          Creating account...
                        </span>
                      ) : 'Create Account 🎉'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}