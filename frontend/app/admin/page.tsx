'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { fetchItems, deleteItem } from '@/services/itemService'
import { Modal } from '@/components/Modal'
import { SkeletonCard } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import type { Item, ItemFilters } from '@/types'
import { timeAgo, CATEGORY_LABELS } from '@/utils/helpers'
import { useDebounce } from '@/hooks/useDebounce'

/* ============================================================
   ICONS
   ============================================================ */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
)
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M3 21v-5h5"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.55 4.24"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <path d="M3.27 6.96 12 12.01l8.73-5.05"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const CATEGORY_EMOJIS: Record<string, string> = {
  electronics: '💻', clothing: '👕', accessories: '⌚',
  documents: '📄', keys: '🔑', bags: '🎒',
  stationery: '✏️', sports: '⚽', other: '📦',
}

/* ============================================================
   ADMIN STAT CARD
   ============================================================ */
function AdminStat({ icon, label, value, sub, color }: {
  icon: React.ReactNode
  label: string
  value: number | string
  sub?: string
  color: string
}) {
  return (
    <div className="qf-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: color + '22',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
        }}>
          {icon}
        </div>
      </div>
      <p style={{
        fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)',
        color: 'var(--color-text-primary)', lineHeight: 1, margin: '0 0 4px',
      }}>
        {value}
      </p>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500 }}>
        {label}
      </p>
      {sub && (
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
          {sub}
        </p>
      )}
    </div>
  )
}

/* ============================================================
   ADMIN PAGE
   ============================================================ */
export default function AdminPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [items, setItems]           = useState<Item[]>([])
  const [total, setTotal]           = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage]             = useState(1)
  const [loading, setLoading]       = useState(true)
  const [activeTab, setActiveTab]   = useState<'all' | 'lost' | 'found' | 'claimed'>('all')
  const [search, setSearch]         = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null)
  const [deleting, setDeleting]     = useState(false)

  const debouncedSearch = useDebounce(search, 400)

  /* ── Auth guard — admin only ── */
  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) { router.push('/login'); return }
    if (user?.role !== 'admin') { router.push('/dashboard'); return }
  }, [authLoading, isAuthenticated, user, router])

  /* ── Fetch all items ── */
  const loadItems = async () => {
    setLoading(true)
    try {
      const filters: ItemFilters = {
        ...(activeTab !== 'all' && activeTab !== 'claimed' && { type: activeTab as any }),
        ...(activeTab === 'claimed' && { status: 'claimed' }),
        ...(debouncedSearch && { search: debouncedSearch }),
      }
      const res = await fetchItems(filters, page, 20)
      setItems(res.data)
      setTotal(res.total)
      setTotalPages(res.totalPages)
    } catch {
      // handle silently
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (user?.role === 'admin') loadItems() },
    [activeTab, debouncedSearch, page, user])

  useEffect(() => { setPage(1) }, [activeTab, debouncedSearch])

  /* ── Delete ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteItem(deleteTarget._id)
      setItems(prev => prev.filter(i => i._id !== deleteTarget._id))
      setTotal(t => t - 1)
      setDeleteTarget(null)
    } catch {
      // handle silently
    } finally {
      setDeleting(false)
    }
  }

  /* ── Stats ── */
  const lostCount    = items.filter(i => i.type === 'lost').length
  const foundCount   = items.filter(i => i.type === 'found').length
  const claimedCount = items.filter(i => i.status === 'claimed' || i.status === 'resolved').length

  /* ── Loading / access ── */
  if (authLoading || !isAuthenticated || user?.role !== 'admin') return (
    <div style={{ minHeight: '60dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h2 style={{ marginBottom: 8 }}>Access Restricted</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          This page is only accessible to admins.
        </p>
        <Link href="/dashboard" className="qf-btn qf-btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100dvh' }}>

      {/* ── HEADER ── */}
      <div style={{
        background: 'var(--color-brand-navy)',
        paddingBlock: 'clamp(2rem, 4vw, 3rem)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 50% 80% at 80% 50%, rgba(245,158,11,0.08) 0%, transparent 60%)',
        }} />
        <div className="qf-container" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-brand-amber)',
              }}>
                <ShieldIcon />
              </div>
              <div>
                <h1 style={{ color: 'white', margin: 0, fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                  Admin Panel
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.875rem' }}>
                  Manage all campus items and activity
                </p>
              </div>
            </div>
            <button onClick={loadItems}
              className="qf-btn"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-btn)',
                gap: 6,
              }}>
              <RefreshIcon /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="qf-container" style={{ paddingBlock: '2rem' }}>

        {/* ── STATS ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem', marginBottom: '2rem',
        }} className="stagger">
          <AdminStat icon={<PackageIcon />} label="Total Items"    value={total}        color="#f59e0b" sub="All time" />
          <AdminStat icon={<AlertIcon />}   label="Lost Items"     value={lostCount}    color="#ef4444" sub="Currently active" />
          <AdminStat icon={<PackageIcon />} label="Found Items"    value={foundCount}   color="#22c55e" sub="Awaiting claims" />
          <AdminStat icon={<UsersIcon />}   label="Claimed"        value={claimedCount} color="#8b5cf6" sub="Successfully resolved" />
        </div>

        {/* ── SEARCH + TABS ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '1rem',
          marginBottom: '1.25rem',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--color-border)' }}>
            {([
              { key: 'all',     label: 'All Items' },
              { key: 'lost',    label: '🔍 Lost'   },
              { key: 'found',   label: '✅ Found'  },
              { key: 'claimed', label: '✓ Claimed' },
            ] as const).map(tab => (
              <button key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '0.625rem 1rem', border: 'none',
                  background: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  color: activeTab === tab.key ? 'var(--color-brand-amber)' : 'var(--color-text-muted)',
                  borderBottom: `2px solid ${activeTab === tab.key ? 'var(--color-brand-amber)' : 'transparent'}`,
                  marginBottom: -2,
                  transition: 'all var(--transition-base)',
                  whiteSpace: 'nowrap' as const,
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)', display: 'flex',
            }}>
              <SearchIcon />
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search items..."
              className="qf-input"
              style={{ paddingLeft: '2.25rem', width: 220 }}
            />
          </div>
        </div>

        {/* ── ITEMS TABLE ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="qf-skeleton" style={{ height: 72, borderRadius: 12 }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No items found"
            description="Try adjusting your search or filter."
          />
        ) : (
          <>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
              gap: '1rem',
              padding: '0.625rem 1rem',
              background: 'var(--color-surface-2)',
              borderRadius: '10px 10px 0 0',
              border: '1px solid var(--color-border)',
              borderBottom: 'none',
            }}>
              {['Item', 'Type', 'Category', 'Location', 'Posted', 'Actions'].map(h => (
                <span key={h} style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.07em',
                  color: 'var(--color-text-muted)',
                }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Table rows */}
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: '0 0 12px 12px',
              overflow: 'hidden',
            }}>
              {items.map((item, idx) => {
                const poster = item.postedBy as any
                return (
                  <div key={item._id} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                    gap: '1rem',
                    padding: '0.875rem 1rem',
                    alignItems: 'center',
                    background: idx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)',
                    borderTop: idx > 0 ? '1px solid var(--color-border)' : 'none',
                    transition: 'background var(--transition-base)',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-brand-amber-dim)')}
                    onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)')}
                  >
                    {/* Item name + poster */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                        background: 'var(--color-surface-3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', overflow: 'hidden', position: 'relative',
                      }}>
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.title} fill
                            style={{ objectFit: 'cover' }} sizes="36px" />
                        ) : CATEGORY_EMOJIS[item.category]}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontWeight: 600, fontSize: '0.875rem',
                          color: 'var(--color-text-primary)',
                          margin: 0, whiteSpace: 'nowrap' as const,
                          overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {item.title}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0 }}>
                          by {poster?.name ?? 'Unknown'}
                        </p>
                      </div>
                    </div>

                    {/* Type */}
                    <span className={`qf-badge qf-badge-${item.status === 'claimed' || item.status === 'resolved' ? 'claimed' : item.type}`}
                      style={{ width: 'fit-content' }}>
                      {item.status === 'claimed' || item.status === 'resolved'
                        ? '✓ Claimed'
                        : item.type === 'lost' ? '🔍 Lost' : '✅ Found'}
                    </span>

                    {/* Category */}
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      {CATEGORY_EMOJIS[item.category]} {CATEGORY_LABELS[item.category]}
                    </span>

                    {/* Location */}
                    <span style={{
                      fontSize: '0.8rem', color: 'var(--color-text-muted)',
                      whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {item.location}
                    </span>

                    {/* Posted time */}
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {timeAgo(item.createdAt)}
                    </span>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/items/${item._id}`}
                        className="qf-btn qf-btn-ghost"
                        style={{ padding: '0.375rem', borderRadius: 6 }}
                        title="View item">
                        <EyeIcon />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        style={{
                          padding: '0.375rem', borderRadius: 6, border: 'none',
                          background: 'var(--color-lost-bg)', color: 'var(--color-lost)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center',
                        }}
                        title="Delete item">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                marginTop: '2rem', flexWrap: 'wrap' as const,
              }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="qf-btn qf-btn-secondary"
                  style={{ padding: '0.5rem 1rem', opacity: page === 1 ? 0.4 : 1 }}>
                  ← Prev
                </button>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Page {page} of {totalPages} · {total} items
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="qf-btn qf-btn-secondary"
                  style={{ padding: '0.5rem 1rem', opacity: page === totalPages ? 0.4 : 1 }}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        title="Delete Item" maxWidth={420}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            padding: '1rem', borderRadius: 10,
            background: 'var(--color-lost-bg)',
            border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--color-lost)', margin: '0 0 4px', fontSize: '0.9rem' }}>
                This action is permanent
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Deleting <strong>&quot;{deleteTarget?.title}&quot;</strong> will permanently
                remove it and all associated claim requests.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setDeleteTarget(null)}
              className="qf-btn qf-btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button onClick={confirmDelete} disabled={deleting}
              className="qf-btn qf-btn-danger"
              style={{ flex: 1, opacity: deleting ? 0.7 : 1 }}>
              {deleting ? 'Deleting...' : '🗑 Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}