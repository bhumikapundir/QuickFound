'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { fetchItemById, claimItem } from '@/services/itemService'
import { useAuth } from '@/context/AuthContext'
import { Modal } from '@/components/Modal'
import { SkeletonCard } from '@/components/Skeleton'
import type { Item } from '@/types'
import { formatDate, timeAgo, CATEGORY_LABELS } from '@/utils/helpers'

/* ============================================================
   ICONS
   ============================================================ */
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
)
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const CATEGORY_EMOJIS: Record<string, string> = {
  electronics: '💻', clothing: '👕', accessories: '⌚',
  documents: '📄', keys: '🔑', bags: '🎒',
  stationery: '✏️', sports: '⚽', other: '📦',
}

/* ============================================================
   CLAIM MODAL
   ============================================================ */
function ClaimModal({
  isOpen, onClose, item, onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  item: Item
  onSuccess: () => void
}) {
  const [answer, setAnswer] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClaim = async () => {
    if (!answer.trim()) { setError('Please provide an answer.'); return }
    setLoading(true)
    setError('')
    try {
      await claimItem({ itemId: item._id, securityAnswer: answer, message })
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to submit claim. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim This Item" maxWidth={480}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Info */}
        <div style={{
          padding: '0.875rem 1rem', borderRadius: 10,
          background: 'var(--color-found-bg)',
          border: '1px solid rgba(34,197,94,0.2)',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🔒</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
            To prove ownership, answer the security question set by the finder.
            Your answer will be reviewed before the item is released.
          </p>
        </div>

        {/* Security question */}
        {item.securityQuestion && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{
              fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' as const,
              letterSpacing: '0.06em', color: 'var(--color-text-muted)',
            }}>
              Security Question
            </label>
            <div style={{
              padding: '0.875rem 1rem', borderRadius: 10,
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              fontSize: '0.9rem', fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}>
              {item.securityQuestion}
            </div>
          </div>
        )}

        {/* Answer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="qf-label" htmlFor="answer">Your Answer</label>
          <input
            id="answer"
            value={answer}
            onChange={e => { setAnswer(e.target.value); setError('') }}
            placeholder="Enter your answer..."
            className="qf-input"
          />
        </div>

        {/* Optional message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="qf-label" htmlFor="claimMessage">
            Additional Message <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(optional)</span>
          </label>
          <textarea
            id="claimMessage"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Any additional details to help verify your claim..."
            className="qf-input"
            style={{ resize: 'vertical', minHeight: 80 }}
          />
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontSize: '0.85rem', color: 'var(--color-lost)' }}>⚠️ {error}</p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} className="qf-btn qf-btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
          <button
            onClick={handleClaim}
            disabled={loading}
            className="qf-btn qf-btn-primary"
            style={{ flex: 2, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Submitting...' : 'Submit Claim'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

/* ============================================================
   ITEM DETAIL PAGE
   ============================================================ */
export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  const [item, setItem]           = useState<Item | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState('')
  const [claimOpen, setClaimOpen] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    fetchItemById(id)
      .then(setItem)
      .catch(() => setError('Item not found or has been removed.'))
      .finally(() => setIsLoading(false))
  }, [id])

  const isOwner = user && item &&
    (typeof item.postedBy === 'string'
      ? item.postedBy === user._id
      : (item.postedBy as any)?._id === user._id)

  const isClaimed = item?.status === 'claimed' || item?.status === 'resolved'

  /* ── Loading ── */
  if (isLoading) return (
    <div className="qf-container qf-section">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <SkeletonCard />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[200, 120, 80, 80, 120].map((w, i) => (
              <div key={i} className="qf-skeleton" style={{ height: i === 0 ? 32 : 16, width: `${w}px`, maxWidth: '100%' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  /* ── Error ── */
  if (error || !item) return (
    <div className="qf-container qf-section" style={{ textAlign: 'center' as const }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
      <h2 style={{ marginBottom: 8 }}>Item not found</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        {error || 'This item may have been removed or claimed.'}
      </p>
      <Link href="/items" className="qf-btn qf-btn-primary">Browse All Items</Link>
    </div>
  )

  const posterName = typeof item.postedBy === 'string'
    ? 'A student'
    : (item.postedBy as any)?.name ?? 'A student'

  return (
    <>
      <div style={{ background: 'var(--color-surface)', minHeight: '100dvh' }}>

        {/* ── BREADCRUMB ── */}
        <div style={{
          background: 'var(--color-surface-2)',
          borderBottom: '1px solid var(--color-border)',
          padding: '0.875rem 0',
        }}>
          <div className="qf-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <Link href="/" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
              <span>/</span>
              <Link href="/items" style={{ color: 'var(--color-text-muted)' }}>Items</Link>
              <span>/</span>
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                {item.title}
              </span>
            </div>
          </div>
        </div>

        <div className="qf-container qf-section" style={{ paddingTop: '2rem' }}>

          {/* Back button */}
          <button onClick={() => router.back()} className="qf-btn qf-btn-ghost"
            style={{ marginBottom: '1.5rem', gap: 6, paddingLeft: 0 }}>
            <ArrowLeftIcon /> Back to items
          </button>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}>

            {/* ── LEFT: IMAGE ── */}
            <div>
              <div style={{
                borderRadius: 16, overflow: 'hidden',
                background: 'var(--color-surface-3)',
                border: '1px solid var(--color-border)',
                aspectRatio: '4/3',
                position: 'relative',
              }}>
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                ) : (
                  <div style={{
                    height: '100%', display: 'flex',
                    flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: 12,
                    color: 'var(--color-text-muted)',
                  }}>
                    <span style={{ fontSize: '5rem' }}>{CATEGORY_EMOJIS[item.category] ?? '📦'}</span>
                    <span style={{ fontSize: '0.875rem' }}>No image provided</span>
                  </div>
                )}

                {/* Status overlay */}
                {isClaimed && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      background: 'white', color: '#8b5cf6',
                      fontWeight: 700, fontSize: '1rem',
                      padding: '0.5rem 1.5rem', borderRadius: 99,
                      textTransform: 'uppercase' as const, letterSpacing: '0.06em',
                    }}>
                      ✓ Claimed
                    </span>
                  </div>
                )}
              </div>

              {/* Extra attributes */}
              {item.extraAttributes && Object.keys(item.extraAttributes).length > 0 && (
                <div style={{
                  marginTop: '1.25rem', padding: '1rem',
                  borderRadius: 12, background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                }}>
                  <p style={{
                    fontSize: '0.75rem', fontWeight: 700,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                    marginBottom: 10,
                  }}>
                    Item Details
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Object.entries(item.extraAttributes).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' as const }}>
                          {key}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: DETAILS ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Type + category badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                <span className={`qf-badge qf-badge-${item.type}`}>
                  {item.type === 'lost' ? '🔍 Lost' : '✅ Found'}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '0.2rem 0.65rem', borderRadius: 99,
                  background: 'var(--color-surface-3)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.75rem', fontWeight: 600,
                }}>
                  {CATEGORY_EMOJIS[item.category]} {CATEGORY_LABELS[item.category]}
                </span>
                {isClaimed && (
                  <span className="qf-badge qf-badge-claimed">✓ Claimed</span>
                )}
              </div>

              {/* Title */}
              <div>
                <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 8 }}>
                  {item.title}
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {item.description}
                </p>
              </div>

              {/* Meta grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem',
              }}>
                {[
                  { icon: <MapPinIcon />, label: 'Location', value: item.location },
                  { icon: <CalendarIcon />, label: 'Date', value: formatDate(item.date) },
                  { icon: <UserIcon />, label: 'Posted by', value: posterName },
                  { icon: <CalendarIcon />, label: 'Posted', value: timeAgo(item.createdAt) },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{
                    padding: '0.875rem',
                    borderRadius: 10,
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, color: 'var(--color-text-muted)' }}>
                      {icon}
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                        {label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Security question hint */}
              {item.type === 'found' && item.securityQuestion && !isClaimed && (
                <div style={{
                  padding: '0.875rem 1rem', borderRadius: 10,
                  background: 'var(--color-brand-amber-dim)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <ShieldIcon />
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-brand-navy)', margin: '0 0 2px' }}>
                      Ownership Verification Required
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      You'll need to answer a security question to claim this item.
                    </p>
                  </div>
                </div>
              )}

              {/* Claim success */}
              {claimSuccess && (
                <div style={{
                  padding: '1rem', borderRadius: 10,
                  background: 'var(--color-found-bg)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  display: 'flex', gap: 10, alignItems: 'center',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>🎉</span>
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-found)', margin: '0 0 2px' }}>
                      Claim submitted!
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      The finder will review your claim and get back to you.
                    </p>
                  </div>
                </div>
              )}

              {/* ── ACTION BUTTONS ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {isOwner ? (
                  <div style={{
                    padding: '0.875rem 1rem', borderRadius: 10,
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem', color: 'var(--color-text-muted)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <LockIcon /> This is your posted item.{' '}
                    <Link href="/dashboard" style={{ color: 'var(--color-brand-amber)', fontWeight: 600 }}>
                      Manage in Dashboard →
                    </Link>
                  </div>
                ) : isClaimed ? (
                  <div style={{
                    padding: '0.875rem 1rem', borderRadius: 10,
                    background: 'var(--color-claimed-bg)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    fontSize: '0.875rem', color: 'var(--color-claimed)',
                    fontWeight: 600, textAlign: 'center' as const,
                  }}>
                    ✓ This item has already been claimed
                  </div>
                ) : !isAuthenticated ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center' as const }}>
                      Sign in to claim this item
                    </p>
                    <Link href={`/login?redirect=/items/${item._id}`}
                      className="qf-btn qf-btn-primary"
                      style={{ width: '100%', textAlign: 'center' as const }}>
                      Sign In to Claim
                    </Link>
                  </div>
                ) : item.type === 'found' && !claimSuccess ? (
                  <button
                    onClick={() => setClaimOpen(true)}
                    className="qf-btn qf-btn-primary"
                    style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}
                  >
                    🙋 Claim This Item
                  </button>
                ) : item.type === 'lost' ? (
                  <div style={{
                    padding: '0.875rem 1rem', borderRadius: 10,
                    background: 'var(--color-lost-bg)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    fontSize: '0.875rem', color: 'var(--color-lost)',
                    display: 'flex', gap: 8, alignItems: 'center',
                  }}>
                    🔍 Someone lost this item. Found it? {' '}
                    <Link href="/post-item" style={{ color: 'var(--color-lost)', fontWeight: 700 }}>
                      Post it here →
                    </Link>
                  </div>
                ) : null}

                <Link href="/items" className="qf-btn qf-btn-secondary"
                  style={{ width: '100%', textAlign: 'center' as const }}>
                  ← Browse More Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claim modal */}
      {item && (
        <ClaimModal
          isOpen={claimOpen}
          onClose={() => setClaimOpen(false)}
          item={item}
          onSuccess={() => setClaimSuccess(true)}
        />
      )}
    </>
  )
}