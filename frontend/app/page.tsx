'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

/* ============================================================
   ICONS
   ============================================================ */
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const BellIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)
const ZapIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)
const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
  </svg>
)

/* ============================================================
   ANIMATED COUNTER
   ============================================================ */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / 60)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <>{count.toLocaleString()}{suffix}</>
}

/* ============================================================
   DATA
   ============================================================ */
const STATS = [
  { label: 'Items Posted',   value: 1240, suffix: '+', emoji: '📦' },
  { label: 'Items Returned', value: 892,  suffix: '+', emoji: '🎉' },
  { label: 'Active Students',value: 3500, suffix: '+', emoji: '🎓' },
  { label: 'Recovery Rate',  value: 72,   suffix: '%', emoji: '⚡' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <SearchIcon />,
    title: 'Post or Search',
    desc: 'Lost something? Post it in 60 seconds. Found something? Upload it with a photo and location.',
    color: 'var(--color-brand-amber)',
    bg: 'var(--color-brand-amber-dim)',
  },
  {
    step: '02',
    icon: <ZapIcon />,
    title: 'Smart Matching',
    desc: 'Our system instantly notifies you when a potential match is found based on category and keywords.',
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    step: '03',
    icon: <ShieldIcon />,
    title: 'Secure Claiming',
    desc: 'Prove ownership by answering a security question set by the finder. No fraud, no fake claims.',
    color: '#22c55e',
    bg: '#f0fdf4',
  },
  {
    step: '04',
    icon: <BellIcon />,
    title: 'Get Reunited',
    desc: 'Coordinate pickup on campus and mark the item as resolved. Peace of mind restored.',
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
]

const RECENT_ITEMS = [
  { id: '1', type: 'lost',  title: 'Blue HP Laptop',         category: 'electronics', location: 'Main Library',   date: '2 hours ago',  emoji: '💻' },
  { id: '2', type: 'found', title: 'Black Leather Wallet',   category: 'accessories', location: 'Cafeteria',      date: '3 hours ago',  emoji: '👛' },
  { id: '3', type: 'lost',  title: 'University ID Card',     category: 'documents',   location: 'Block B, F2',    date: '5 hours ago',  emoji: '🪪' },
  { id: '4', type: 'found', title: 'Set of Keys (3 keys)',   category: 'keys',        location: 'Parking Area',   date: '6 hours ago',  emoji: '🔑' },
  { id: '5', type: 'lost',  title: 'Red Nike Backpack',      category: 'bags',        location: 'Sports Complex', date: '8 hours ago',  emoji: '🎒' },
  { id: '6', type: 'found', title: 'Apple AirPods Pro',      category: 'electronics', location: 'Auditorium',     date: '10 hours ago', emoji: '🎧' },
]

/* ============================================================
   HOME PAGE
   ============================================================ */
export default function HomePage() {
  const [search, setSearch] = useState('')

  return (
    <div style={{ background: 'var(--color-surface)' }}>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section style={{
        background: 'var(--color-brand-navy)',
        position: 'relative',
        overflow: 'hidden',
        paddingBlock: 'clamp(4rem, 10vw, 7rem)',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(245,158,11,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 10% 80%, rgba(59,130,246,0.08) 0%, transparent 60%)
          `,
        }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }} />

        <div className="qf-container" style={{ position: 'relative' }}>
          <div style={{ maxWidth: 680 }} className="stagger">

            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '0.375rem 1rem',
              borderRadius: 99,
              border: '1px solid rgba(245,158,11,0.3)',
              background: 'rgba(245,158,11,0.08)',
              marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-amber)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                🎓 Campus Lost &amp; Found Platform
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              color: '#ffffff',
              fontFamily: 'var(--font-display)',
              marginBottom: '1.25rem',
              lineHeight: 1.1,
            }}>
              Lost something?{' '}
              <span style={{
                color: 'var(--color-brand-amber)',
                position: 'relative',
                display: 'inline-block',
              }}>
                Find it fast.
              </span>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.65)',
              marginBottom: '2.5rem',
              maxWidth: 540,
              lineHeight: 1.7,
            }}>
              QuickFound connects students who lose items with those who find them —
              all within your campus, in real time.
            </p>

            {/* Search bar */}
            <div style={{
              display: 'flex',
              gap: 0,
              background: 'white',
              borderRadius: 12,
              padding: 6,
              maxWidth: 520,
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                }}>
                  <SearchIcon />
                </span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search for lost items..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.9375rem',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-primary)',
                    background: 'transparent',
                    borderRadius: 8,
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && search.trim()) {
                      window.location.href = `/items?search=${encodeURIComponent(search)}`
                    }
                  }}
                />
              </div>
              <Link
                href={search.trim() ? `/items?search=${encodeURIComponent(search)}` : '/items'}
                className="qf-btn qf-btn-primary"
                style={{ borderRadius: 8, padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
              >
                Search
              </Link>
            </div>

            {/* Quick links */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { label: '📱 Electronics', q: 'electronics' },
                { label: '🔑 Keys',        q: 'keys' },
                { label: '🪪 Documents',   q: 'documents' },
                { label: '🎒 Bags',        q: 'bags' },
              ].map(({ label, q }) => (
                <Link key={q} href={`/items?category=${q}`} style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.55)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 99,
                  border: '1px solid rgba(255,255,255,0.12)',
                  transition: 'all var(--transition-base)',
                  fontWeight: 500,
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════ */}
      <section style={{
        background: 'var(--color-surface-2)',
        borderBottom: '1px solid var(--color-border)',
        borderTop: '1px solid var(--color-border)',
        paddingBlock: '2.5rem',
      }}>
        <div className="qf-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2rem',
          }} className="stagger">
            {STATS.map(({ label, value, suffix, emoji }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 4 }}>{emoji}</div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                  fontWeight: 800,
                  color: 'var(--color-brand-navy)',
                  lineHeight: 1,
                }}>
                  <Counter target={value} suffix={suffix} />
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                  marginTop: 4,
                  fontWeight: 500,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="qf-section">
        <div className="qf-container">

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--color-brand-amber)',
              marginBottom: 12,
            }}>
              How It Works
            </span>
            <h2 style={{ marginBottom: 12 }}>From lost to found in 4 steps</h2>
            <p style={{ maxWidth: 480, margin: '0 auto', color: 'var(--color-text-muted)' }}>
              A structured, secure pipeline designed specifically for campus environments.
            </p>
          </div>

          {/* Steps grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }} className="stagger">
            {HOW_IT_WORKS.map(({ step, icon, title, desc, color, bg }) => (
              <div key={step} className="qf-card" style={{ padding: '1.75rem' }}>
                {/* Step number */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: '1.25rem',
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color,
                  }}>
                    {icon}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem', fontWeight: 800,
                    color: 'var(--color-border)',
                    lineHeight: 1,
                  }}>
                    {step}
                  </span>
                </div>
                <h4 style={{ marginBottom: 8, color: 'var(--color-text-primary)' }}>{title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RECENT ITEMS PREVIEW
      ══════════════════════════════════════════ */}
      <section className="qf-section" style={{ background: 'var(--color-surface-2)', borderTop: '1px solid var(--color-border)' }}>
        <div className="qf-container">

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '2rem',
            flexWrap: 'wrap', gap: '1rem',
          }}>
            <div>
              <span style={{
                display: 'inline-block',
                fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--color-brand-amber)', marginBottom: 8,
              }}>
                Recently Posted
              </span>
              <h2 style={{ margin: 0 }}>Latest on campus</h2>
            </div>
            <Link href="/items" className="qf-btn qf-btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              View All Items <ArrowRightIcon />
            </Link>
          </div>

          {/* Items grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }} className="stagger">
            {RECENT_ITEMS.map((item) => (
              <Link key={item.id} href={`/items/${item.id}`}
                className="qf-card"
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: '1rem', padding: '1rem',
                  textDecoration: 'none',
                }}
              >
                {/* Emoji thumb */}
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                  background: item.type === 'lost' ? 'var(--color-lost-bg)' : 'var(--color-found-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                }}>
                  {item.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span className={`qf-badge qf-badge-${item.type}`}>
                      {item.type === 'lost' ? '🔍 Lost' : '✅ Found'}
                    </span>
                  </div>
                  <p style={{
                    fontWeight: 600, fontSize: '0.9rem',
                    color: 'var(--color-text-primary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    marginBottom: 2,
                  }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    📍 {item.location} · {item.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section style={{
        background: 'var(--color-brand-navy)',
        paddingBlock: 'clamp(3rem, 6vw, 5rem)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 50% 80% at 50% 50%, rgba(245,158,11,0.1) 0%, transparent 70%)',
        }} />

        <div className="qf-container" style={{ position: 'relative', textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>
            Missing something?
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '1.05rem',
            maxWidth: 440,
            margin: '0 auto 2rem',
          }}>
            Post your lost item now and let the campus help you find it.
            Takes less than 60 seconds.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/post-item" className="qf-btn qf-btn-primary"
              style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Post a Lost Item
            </Link>
            <Link href="/items" className="qf-btn"
              style={{
                fontSize: '1rem', padding: '0.875rem 2rem',
                background: 'rgba(255,255,255,0.08)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-btn)',
              }}>
              Browse Found Items
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap',
          }}>
            {[
              '✅ University emails only',
              '🔒 Secure verification',
              '⚡ Real-time alerts',
            ].map(text => (
              <span key={text} style={{
                fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500,
              }}>
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        paddingBlock: '2rem',
        background: 'var(--color-surface)',
      }}>
        <div className="qf-container" style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--color-brand-amber)',
              color: 'var(--color-brand-navy)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800, fontSize: '0.875rem',
            }}>Q</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '1rem', color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}>
              Quick<span style={{ color: 'var(--color-brand-amber)' }}>Found</span>
            </span>
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Built by <strong style={{ color: 'var(--color-text-secondary)' }}>Web_Weavers</strong> · Campus Lost &amp; Found System
          </p>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { href: '/items', label: 'Browse' },
              { href: '/post-item', label: 'Post Item' },
              { href: '/register', label: 'Sign Up' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontSize: '0.825rem',
                color: 'var(--color-text-muted)',
                transition: 'color var(--transition-base)',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}