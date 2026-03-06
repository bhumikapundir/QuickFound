'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

/* ============================================================
   TYPES & CONSTANTS
   ============================================================ */
type ItemType = 'lost' | 'found'
type ItemCategory =
  | 'electronics' | 'clothing' | 'accessories'
  | 'documents' | 'keys' | 'bags' | 'stationery'
  | 'sports' | 'other'

const CATEGORY_EMOJIS: Record<string, string> = {
  electronics: '💻', clothing: '👕', accessories: '👜',
  documents: '📄', keys: '🔑', bags: '🎒',
  stationery: '✏️', sports: '⚽', other: '📦',
}

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: '💻 Electronics' },
  { value: 'clothing', label: '👕 Clothing' },
  { value: 'accessories', label: '👜 Accessories' },
  { value: 'documents', label: '📄 Documents' },
  { value: 'keys', label: '🔑 Keys' },
  { value: 'bags', label: '🎒 Bags' },
  { value: 'stationery', label: '✏️ Stationery' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'other', label: '📦 Other' },
]

/* ============================================================
   SEARCH ICON
   ============================================================ */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

/* ============================================================
   SKELETON CARD
   ============================================================ */
function SkeletonItemCard() {
  return (
    <div style={{
      borderRadius: 16,
      border: '1px solid var(--color-border)',
      overflow: 'hidden',
      background: 'var(--color-surface)',
    }}>
      <div style={{ height: 160, background: 'var(--color-surface-3)', animation: 'pulse 1.5s infinite' }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[120, 80, 100].map((w, i) => (
          <div key={i} style={{
            height: i === 0 ? 20 : 14,
            width: `${w}px`,
            borderRadius: 6,
            background: 'var(--color-surface-3)',
            animation: 'pulse 1.5s infinite',
          }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}

/* ============================================================
   ITEM CARD
   ============================================================ */
function ItemCard({ item }: { item: any }) {
  const isLost = item.type === 'lost'
  const emoji = CATEGORY_EMOJIS[item.category] ?? '📦'

  return (
    <Link href={`/items/${item._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        borderRadius: 16,
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        background: 'var(--color-surface)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(-3px)'
          el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Image */}
        <div style={{
          position: 'relative', height: 160,
          background: isLost ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.06)',
          flexShrink: 0,
        }}>
          {item.imageUrl ? (
            <Image
              src={item.imageUrl} alt={item.title} fill
              style={{ objectFit: 'cover' }} sizes="320px"
            />
          ) : (
            <div style={{
              height: '100%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem',
            }}>
              {emoji}
            </div>
          )}

          {/* Type badge */}
          <span style={{
            position: 'absolute', top: 10, left: 10,
            padding: '0.2rem 0.6rem',
            borderRadius: 99,
            fontSize: '0.72rem', fontWeight: 700,
            background: isLost ? '#fee2e2' : '#dcfce7',
            color: isLost ? '#dc2626' : '#16a34a',
            border: `1px solid ${isLost ? '#fca5a5' : '#86efac'}`,
          }}>
            {isLost ? '🔍 Lost' : '✅ Found'}
          </span>

          {/* Status badge */}
          {(item.status === 'claimed' || item.status === 'resolved') && (
            <span style={{
              position: 'absolute', top: 10, right: 10,
              padding: '0.2rem 0.6rem',
              borderRadius: 99,
              fontSize: '0.72rem', fontWeight: 700,
              background: '#ede9fe', color: '#7c3aed',
              border: '1px solid #c4b5fd',
            }}>
              ✓ Claimed
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h3 style={{
            fontSize: '0.95rem', fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            lineHeight: 1.4,
          }}>
            {item.title}
          </h3>

          {item.description && (
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              margin: 0, lineHeight: 1.5,
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
            }}>
              {item.description}
            </p>
          )}

          <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {item.location && (
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>
                📍 {item.location}
              </p>
            )}
            {item.date && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                🗓 {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ============================================================
   ITEMS PAGE
   ============================================================ */
export default function ItemsPage() {
  const searchParams = useSearchParams()

  const [allItems, setAllItems]   = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState(searchParams.get('search') ?? '')
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  /* ── Fetch all items ── */
  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5000/api/items')
      .then(res => res.json())
      .then(data => setAllItems(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => setAllItems([]))
      .finally(() => setLoading(false))
  }, [])

  /* ── Client-side filtering ── */
  const filtered = allItems.filter(item => {
    const matchType     = typeFilter === 'all' || item.type === typeFilter
    const matchCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchSearch   = !search.trim() ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase())
    return matchType && matchCategory && matchSearch
  })

  const lostCount  = allItems.filter(i => i.type === 'lost').length
  const foundCount = allItems.filter(i => i.type === 'found').length

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
          background: 'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(245,158,11,0.1) 0%, transparent 70%)',
        }} />
        <div className="qf-container" style={{ position: 'relative' }}>
          <h1 style={{ color: 'white', margin: '0 0 0.5rem', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
            Browse Items
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', margin: 0, fontSize: '0.95rem' }}>
            {loading
              ? 'Loading items...'
              : `${allItems.length} items posted · ${lostCount} lost · ${foundCount} found`}
          </p>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky', top: 64, zIndex: 10,
      }}>
        <div className="qf-container" style={{ paddingBlock: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>

            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 360 }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)', display: 'flex',
              }}>
                <SearchIcon />
              </span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, location..."
                className="qf-input"
                style={{ paddingLeft: '2.25rem', width: '100%' }}
              />
            </div>

            {/* Type tabs */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--color-surface-3)', borderRadius: 10, padding: 4 }}>
              {([
                { key: 'all',   label: `All (${allItems.length})` },
                { key: 'lost',  label: `🔍 Lost (${lostCount})` },
                { key: 'found', label: `✅ Found (${foundCount})` },
              ] as const).map(tab => (
                <button key={tab.key}
                  onClick={() => setTypeFilter(tab.key)}
                  style={{
                    padding: '0.4rem 0.875rem',
                    borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: '0.825rem', fontWeight: typeFilter === tab.key ? 700 : 500,
                    background: typeFilter === tab.key ? 'var(--color-brand-amber)' : 'transparent',
                    color: typeFilter === tab.key ? 'var(--color-brand-navy)' : 'var(--color-text-muted)',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap' as const,
                    fontFamily: 'var(--font-body)',
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Category select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FilterIcon />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="qf-input"
                style={{ paddingBlock: '0.45rem', fontSize: '0.85rem' }}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Clear filters */}
            {(search || typeFilter !== 'all' || categoryFilter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setTypeFilter('all'); setCategoryFilter('all') }}
                style={{
                  padding: '0.4rem 0.75rem', borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: 'transparent', cursor: 'pointer',
                  fontSize: '0.8rem', color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                }}>
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="qf-container" style={{ paddingBlock: '2rem' }}>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}>
            {Array.from({ length: 12 }).map((_, i) => <SkeletonItemCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', paddingBlock: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h2 style={{ marginBottom: 8 }}>No items found</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              {allItems.length === 0
                ? 'No items have been posted yet.'
                : 'Try adjusting your search or filters.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setSearch(''); setTypeFilter('all'); setCategoryFilter('all') }}
                className="qf-btn"
              >
                Clear Filters
              </button>
              <Link href="/post-item" className="qf-btn qf-btn-primary">
                + Post an Item
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Showing {filtered.length} of {allItems.length} items
              {search && <> matching "<strong>{search}</strong>"</>}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}>
              {filtered.map(item => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
