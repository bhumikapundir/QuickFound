'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { fetchMyItems, fetchMyClaims, updateClaimStatus, deleteItem } from '@/services/itemService'
import { Modal } from '@/components/Modal'
import { SkeletonCard } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import type { Item, ClaimRequest } from '@/types'
import { formatDate, timeAgo, CATEGORY_LABELS } from '@/utils/helpers'

/* ============================================================
   ICONS
   ============================================================ */
const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)
const ClaimIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <path d="M14 2v6h6M9 15l2 2 4-4"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
)
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
)
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)
const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

const CATEGORY_EMOJIS: Record<string, string> = {
  electronics: '💻', clothing: '👕', accessories: '⌚',
  documents: '📄', keys: '🔑', bags: '🎒',
  stationery: '✏️', sports: '⚽', other: '📦',
}

/* ============================================================
   STAT CARD
   ============================================================ */
function StatCard({ emoji, label, value, color }: {
  emoji: string; label: string; value: number; color: string
}) {
  return (
    <div className="qf-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: color + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem',
      }}>
        {emoji}
      </div>
      <div className="qf-container" style={{ paddingBlock: '2rem' }}>
      </div>
      <div>
        <p style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)', lineHeight: 1, margin: 0 }}>
          {value}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, marginTop: 2 }}>
          {label}
        </p>
      </div>
    </div>
  )
}

/* ============================================================
   MY ITEMS TAB
   ============================================================ */
function MyItemsTab({ items, loading, onDelete }: {
  items: Item[]
  loading: boolean
  onDelete: (id: string) => void
}) {
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null)
  const [deleting, setDeleting] = useState(false)

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteItem(deleteTarget._id)
      onDelete(deleteTarget._id)
      setDeleteTarget(null)
    } catch {
      // handle silently
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
      {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )

  if (items.length === 0) return (
    <EmptyState
      icon="📭"
      title="No items posted yet"
      description="Start by posting a lost or found item on campus."
      action={<Link href="/post-item" className="qf-btn qf-btn-primary">Post an Item</Link>}
    />
  )

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {items.map(item => (
          <div key={item._id} className="qf-card" style={{ overflow: 'hidden' }}>
            {/* Image */}
            <div style={{ position: 'relative', height: 140, background: 'var(--color-surface-3)' }}>
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.title} fill
                  style={{ objectFit: 'cover' }} sizes="320px" />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                  {CATEGORY_EMOJIS[item.category]}
                </div>
              )}
              <span className={`qf-badge qf-badge-${item.type}`}
                style={{ position: 'absolute', top: 8, left: 8 }}>
                {item.type === 'lost' ? '🔍 Lost' : '✅ Found'}
              </span>
              {(item.status === 'claimed' || item.status === 'resolved') && (
                <span className="qf-badge qf-badge-claimed"
                  style={{ position: 'absolute', top: 8, right: 8 }}>
                  ✓ Claimed
                </span>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '0.875rem' }}>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>
                {item.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 10 }}>
                <MapPinIcon /> {item.location} · {timeAgo(item.createdAt)}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6 }}>
                <Link href={`/items/${item._id}`}
                  className="qf-btn qf-btn-secondary"
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.5rem', gap: 4 }}>
                  <EyeIcon /> View
                </Link>
                <button onClick={() => setDeleteTarget(item)}
                  className="qf-btn"
                  style={{
                    padding: '0.4rem 0.625rem', borderRadius: 8,
                    background: 'var(--color-lost-bg)', color: 'var(--color-lost)',
                    border: 'none', cursor: 'pointer',
                  }}>
                  <TrashIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Item" maxWidth={420}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            Are you sure you want to delete <strong>&quot;{deleteTarget?.title}&quot;</strong>?
            This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setDeleteTarget(null)}
              className="qf-btn qf-btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button onClick={confirmDelete} disabled={deleting}
              className="qf-btn qf-btn-danger"
              style={{ flex: 1, opacity: deleting ? 0.7 : 1 }}>
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

/* ============================================================
   MY CLAIMS TAB
   ============================================================ */
function MyClaimsTab({ claims, loading, onUpdate }: {
  claims: ClaimRequest[]
  loading: boolean
  onUpdate: (id: string, status: 'approved' | 'rejected') => void
}) {
  const [updating, setUpdating] = useState<string | null>(null)

  const handleUpdate = async (claimId: string, status: 'approved' | 'rejected') => {
    setUpdating(claimId)
    try {
      await updateClaimStatus(claimId, status)
      onUpdate(claimId, status)
    } catch {
      // handle silently
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="qf-skeleton" style={{ height: 100, borderRadius: 12 }} />
      ))}
    </div>
  )

  if (claims.length === 0) return (
    <EmptyState
      icon="📋"
      title="No claims yet"
      description="When someone claims one of your found items, it will appear here."
    />
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {claims.map(claim => {
        const item = claim.item as Item
        const claimedBy = claim.claimedBy as any
        const isPending = claim.status === 'pending'

        return (
          <div key={claim._id} className="qf-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>

              {/* Item thumb */}
              <div style={{
                width: 56, height: 56, borderRadius: 10, flexShrink: 0,
                background: 'var(--color-surface-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', overflow: 'hidden', position: 'relative',
              }}>
                {item?.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.title || ''} fill
                    style={{ objectFit: 'cover' }} sizes="56px" />
                ) : (
                  CATEGORY_EMOJIS[item?.category] ?? '📦'
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' as const }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', margin: 0 }}>
                    {item?.title ?? 'Item'}
                  </p>
                  <span style={{
                    padding: '0.15rem 0.5rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700,
                    background: isPending
                      ? 'var(--color-brand-amber-dim)'
                      : claim.status === 'approved'
                        ? 'var(--color-found-bg)'
                        : 'var(--color-lost-bg)',
                    color: isPending
                      ? 'var(--color-brand-navy)'
                      : claim.status === 'approved'
                        ? 'var(--color-found)'
                        : 'var(--color-lost)',
                    textTransform: 'capitalize' as const,
                  }}>
                    {claim.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 4px' }}>
                  Claimed by <strong>{claimedBy?.name ?? 'A student'}</strong> · {timeAgo(claim.createdAt)}
                </p>

                {claim.securityAnswer && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                    Answer: <em>&quot;{claim.securityAnswer}&quot;</em>
                  </p>
                )}

                {claim.message && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '4px 0 0', fontStyle: 'italic' }}>
                    &quot;{claim.message}&quot;
                  </p>
                )}
              </div>

              {/* Actions — only for pending */}
              {isPending && (
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => handleUpdate(claim._id, 'approved')}
                    disabled={updating === claim._id}
                    className="qf-btn"
                    style={{
                      padding: '0.4rem 0.75rem', borderRadius: 8, border: 'none',
                      background: 'var(--color-found-bg)', color: 'var(--color-found)',
                      cursor: 'pointer', gap: 4, fontSize: '0.8rem', fontWeight: 600,
                      opacity: updating === claim._id ? 0.6 : 1,
                    }}>
                    <CheckIcon /> Approve
                  </button>
                  <button
                    onClick={() => handleUpdate(claim._id, 'rejected')}
                    disabled={updating === claim._id}
                    className="qf-btn"
                    style={{
                      padding: '0.4rem 0.75rem', borderRadius: 8, border: 'none',
                      background: 'var(--color-lost-bg)', color: 'var(--color-lost)',
                      cursor: 'pointer', gap: 4, fontSize: '0.8rem', fontWeight: 600,
                      opacity: updating === claim._id ? 0.6 : 1,
                    }}>
                    <XIcon /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ============================================================
   DASHBOARD PAGE
   ============================================================ */
export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'claims' ? 'claims' : 'items'
  )
  const [myItems, setMyItems]   = useState<Item[]>([])
  const [myClaims, setMyClaims] = useState<ClaimRequest[]>([])
  const [itemsLoading, setItemsLoading]   = useState(true)
  const [claimsLoading, setClaimsLoading] = useState(true)
  const [ownerClaims, setOwnerClaims] = useState<any[]>([])
  
  /* ── Redirect if not logged in ── */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login?redirect=/dashboard')
  }, [authLoading, isAuthenticated, router])

  /* ── Fetch data ── */
  useEffect(() => {
    if (!isAuthenticated) return
    fetchMyItems()
      .then(setMyItems)
      .finally(() => setItemsLoading(false))
    fetchMyClaims()
      .then(setMyClaims)
      .finally(() => setClaimsLoading(false))
  }, [isAuthenticated])
  useEffect(() => {
  if (!isAuthenticated) return

  const fetchOwnerClaims = async () => {
    try {
      const studentId = localStorage.getItem("studentId")

      const res = await fetch(
        `http://localhost:5000/api/claims/owner/${studentId}`
      )

      const data = await res.json()
      setOwnerClaims(data)
        } catch (err) {
          console.error(err)
        }
      }
      fetchOwnerClaims()
    }, [isAuthenticated])
  const handleDeleteItem = (id: string) => {
    setMyItems(prev => prev.filter(i => i._id !== id))
  }

  const handleUpdateClaim = (id: string, status: 'approved' | 'rejected') => {
    setMyClaims(prev => prev.map(c => c._id === id ? { ...c, status } : c))
  }

  /* ── Stats ── */
  const lostCount    = myItems.filter(i => i.type === 'lost').length
  const foundCount   = myItems.filter(i => i.type === 'found').length
  const claimedCount = myItems.filter(i => i.status === 'claimed' || i.status === 'resolved').length
  const pendingCount = myClaims.filter(c => c.status === 'pending').length

  if (authLoading || !isAuthenticated) return (
    <div style={{ minHeight: '60dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
          style={{ animation: 'spin 0.75s linear infinite', color: 'var(--color-brand-amber)' }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Loading dashboard...</p>
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
          background: 'radial-gradient(ellipse 50% 80% at 20% 50%, rgba(245,158,11,0.08) 0%, transparent 60%)',
        }} />
        <div className="qf-container" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Avatar */}
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'var(--color-brand-amber)',
                color: 'var(--color-brand-navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem',
                flexShrink: 0,
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ color: 'white', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', margin: 0 }}>
                  Hey, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.875rem' }}>
                  {user?.email} · ID: {user?.studentId}
                </p>
              </div>
            </div>
            <Link href="/post-item" className="qf-btn qf-btn-primary">
              + Post Item
            </Link>
          </div>
        </div>
      </div>

      <div className="qf-container" style={{ paddingBlock: '2rem' }}>

        {/* ── STATS ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem', marginBottom: '2rem',
        }} className="stagger">
          <StatCard emoji="📦" label="Total Posted"   value={myItems.length}  color="#f59e0b" />
          <StatCard emoji="🔍" label="Lost Items"     value={lostCount}       color="#ef4444" />
          <StatCard emoji="✅" label="Found Items"    value={foundCount}      color="#22c55e" />
          <StatCard emoji="🎉" label="Items Claimed"  value={claimedCount}    color="#8b5cf6" />
          {pendingCount > 0 && (
            <StatCard emoji="⏳" label="Pending Claims" value={pendingCount}  color="#f59e0b" />
          )}
        </div>

        {/* ── TABS ── */}
        <div style={{
          display: 'flex', gap: 4,
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '1.75rem',
        }}>
          {[
            { key: 'items',  label: 'My Items',  icon: <GridIcon />,  count: myItems.length },
            { key: 'claims', label: 'Claims',    icon: <ClaimIcon />, count: pendingCount > 0 ? pendingCount : undefined },
          ].map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0.75rem 1.25rem',
                border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                fontWeight: activeTab === tab.key ? 700 : 500,
                color: activeTab === tab.key ? 'var(--color-brand-amber)' : 'var(--color-text-muted)',
                borderBottom: `2px solid ${activeTab === tab.key ? 'var(--color-brand-amber)' : 'transparent'}`,
                marginBottom: -2,
                transition: 'all var(--transition-base)',
                position: 'relative' as const,
              }}>
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span style={{
                  background: activeTab === tab.key ? 'var(--color-brand-amber)' : 'var(--color-surface-3)',
                  color: activeTab === tab.key ? 'var(--color-brand-navy)' : 'var(--color-text-muted)',
                  fontSize: '0.7rem', fontWeight: 700, 
                  padding: '0.1rem 0.45rem', borderRadius: 99,
                  minWidth: 20, textAlign: 'center' as const,
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        {activeTab === 'items' && (
          <MyItemsTab
            items={myItems}
            loading={itemsLoading}
            onDelete={handleDeleteItem}
          />
        )}
        {activeTab === 'claims' && (
          <MyClaimsTab
            claims={myClaims}
            loading={claimsLoading}
            onUpdate={handleUpdateClaim}
          />
        )}
        {ownerClaims.length > 0 && (
  <div style={{ marginTop: "2rem" }}>
    <h2>Claim Requests For Your Items</h2>

    {ownerClaims.map((claim) => (
      <div
        key={claim.claimId}
        style={{
          border: "1px solid var(--color-border)",
          padding: "0.75rem",
          marginTop: "0.5rem",
          borderRadius: 8
        }}
      >
        <p>Item ID: {claim.itemId}</p>
        <p>Claimed By: {claim.claimerName}</p>
        <p>Student ID: {claim.claimerId}</p>
        <p>Status: {claim.status}</p>
      </div>
    ))}
  </div>
)}

      </div>
    </div>
  )
}