'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

/* ============================================================
   ICONS (inline SVGs — no extra dependency)
   ============================================================ */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
)
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5v14"/>
  </svg>
)
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

/* ============================================================
   NAV LINKS config
   ============================================================ */
const NAV_LINKS = [
  { href: '/items',     label: 'Browse Items' },
  { href: '/post-item', label: 'Post Item'    },
  { href: '/dashboard', label: 'Dashboard'   },
]

const ADMIN_LINKS = [
  { href: '/admin', label: 'Admin Panel' },
]

/* ============================================================
   NAVBAR COMPONENT
   ============================================================ */
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { isDark, setTheme, theme } = useTheme()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  const allLinks = [
    ...NAV_LINKS,
    ...(user?.role === 'admin' ? ADMIN_LINKS : []),
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '64px',
          background: 'var(--color-surface)',
          borderBottom: `1px solid ${scrolled ? 'var(--color-border)' : 'transparent'}`,
          boxShadow: scrolled ? 'var(--shadow-card)' : 'none',
          transition: 'border-color var(--transition-smooth), box-shadow var(--transition-smooth)',
        }}
      >
        <div className="qf-container h-full flex items-center justify-between gap-4">

          {/* ── LOGO ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'var(--color-brand-amber)',
              color: 'var(--color-brand-navy)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1rem',
            }}>Q</span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.125rem',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.03em',
            }}>
              Quick<span style={{ color: 'var(--color-brand-amber)' }}>Found</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden md:flex items-center gap-1">
            {allLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: 8,
                  fontSize: '0.9rem',
                  fontWeight: isActive(href) ? 600 : 500,
                  color: isActive(href)
                    ? 'var(--color-brand-amber)'
                    : 'var(--color-text-secondary)',
                  background: isActive(href)
                    ? 'var(--color-brand-amber-dim)'
                    : 'transparent',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={e => {
                  if (!isActive(href)) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-3)'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(href)) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'
                  }
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-2">

            {/* Search shortcut */}
            <Link href="/items" aria-label="Search items"
              className="hidden md:flex qf-btn qf-btn-ghost"
              style={{ padding: '0.5rem', borderRadius: 8 }}>
              <SearchIcon />
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="qf-btn qf-btn-ghost"
              style={{ padding: '0.5rem', borderRadius: 8 }}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Post Item CTA */}
                <Link href="/post-item"
                  className="hidden md:flex qf-btn qf-btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  <PlusIcon /> Post Item
                </Link>

                {/* User avatar / dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(p => !p)}
                    aria-label="User menu"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.75rem',
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      transition: 'all var(--transition-base)',
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--color-brand-navy)',
                      color: 'var(--color-text-inverse)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700,
                    }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden md:block">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        minWidth: 200,
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 12,
                        boxShadow: 'var(--shadow-card-hover)',
                        zIndex: 50,
                        overflow: 'hidden',
                        animation: 'fadeInUp 0.15s ease',
                      }}>
                        {/* User info */}
                        <div style={{
                          padding: '0.875rem 1rem',
                          borderBottom: '1px solid var(--color-border)',
                        }}>
                          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                            {user?.name}
                          </p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                            {user?.email}
                          </p>
                        </div>

                        {/* Links */}
                        {[
                          { href: '/dashboard', label: 'My Dashboard' },
                          { href: '/dashboard?tab=claims', label: 'My Claims' },
                          ...(user?.role === 'admin' ? [{ href: '/admin', label: 'Admin Panel' }] : []),
                        ].map(({ href, label }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setDropdownOpen(false)}
                            style={{
                              display: 'block',
                              padding: '0.625rem 1rem',
                              fontSize: '0.875rem',
                              color: 'var(--color-text-secondary)',
                              transition: 'background var(--transition-base)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-3)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            {label}
                          </Link>
                        ))}

                        {/* Logout */}
                        <div style={{ borderTop: '1px solid var(--color-border)', padding: '0.5rem' }}>
                          <button
                            onClick={() => { logout(); setDropdownOpen(false) }}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              borderRadius: 8,
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: 'var(--color-lost)',
                              textAlign: 'left',
                              transition: 'background var(--transition-base)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-lost-bg)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* Not authenticated */
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="qf-btn qf-btn-ghost"
                  style={{ fontSize: '0.9rem' }}>
                  Log In
                </Link>
                <Link href="/register" className="qf-btn qf-btn-primary"
                  style={{ fontSize: '0.9rem' }}>
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="flex md:hidden qf-btn qf-btn-ghost"
              style={{ padding: '0.5rem', borderRadius: 8 }}
              onClick={() => setMenuOpen(p => !p)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: '64px 0 0 0',
            zIndex: 40,
            background: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {allLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: '0.875rem 1rem',
                borderRadius: 10,
                fontSize: '1rem',
                fontWeight: isActive(href) ? 600 : 500,
                color: isActive(href) ? 'var(--color-brand-amber)' : 'var(--color-text-primary)',
                background: isActive(href) ? 'var(--color-brand-amber-dim)' : 'var(--color-surface-2)',
              }}
            >
              {label}
            </Link>
          ))}

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <>
                <Link href="/post-item" className="qf-btn qf-btn-primary">
                  <PlusIcon /> Post an Item
                </Link>
                <button
                  onClick={logout}
                  className="qf-btn qf-btn-secondary"
                  style={{ color: 'var(--color-lost)' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="qf-btn qf-btn-primary">Sign Up</Link>
                <Link href="/login" className="qf-btn qf-btn-secondary">Log In</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}