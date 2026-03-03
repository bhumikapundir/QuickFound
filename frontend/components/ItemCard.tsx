'use client'
import Link from 'next/link'
import Image from 'next/image'
import type { Item } from '@/types'
import { formatDate, truncate, CATEGORY_LABELS } from '@/utils/helpers'

/* ============================================================
   ICONS
   ============================================================ */
const MapPinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
)

/* ============================================================
   CATEGORY EMOJI MAP
   ============================================================ */
const CATEGORY_EMOJI: Record<string, string> = {
  electronics: '💻',
  clothing: '👕',
  accessories: '⌚',
  documents: '📄',
  keys: '🔑',
  bags: '🎒',
  stationery: '✏️',
  sports: '⚽',
  other: '📦',
}

/* ============================================================
   ITEM CARD
   ============================================================ */
interface ItemCardProps {
  item: Item
  /** compact = smaller card for dashboard lists */
  compact?: boolean
}

export default function ItemCard({ item, compact = false }: ItemCardProps) {
  const isLost   = item.type === 'lost'
  const isClaimed = item.status === 'claimed' || item.status === 'resolved'

  return (
    <Link
      href={`/items/${item._id}`}
      className="qf-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        opacity: isClaimed ? 0.7 : 1,
        textDecoration: 'none',
      }}
    >
      {/* ── IMAGE ── */}
      <div style={{
        position: 'relative',
        height: compact ? 140 : 180,
        background: 'var(--color-surface-3)',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
            sizes="(max-width: 768px) 100vw, 320px"
          />
        ) : (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--color-text-muted)',
          }}>
            <span style={{ fontSize: compact ? '2rem' : '2.5rem' }}>
              {CATEGORY_EMOJI[item.category] ?? '📦'}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>No image</span>
          </div>
        )}

        {/* Status overlay if claimed */}
        {isClaimed && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              background: 'white',
              color: '#8b5cf6',
              fontWeight: 700,
              fontSize: '0.75rem',
              padding: '0.3rem 0.75rem',
              borderRadius: 99,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>Claimed ✓</span>
          </div>
        )}

        {/* Type badge — top left */}
        <span
          className={`qf-badge qf-badge-${item.type}`}
          style={{
            position: 'absolute', top: 10, left: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {isLost ? '🔍 Lost' : '✅ Found'}
        </span>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: compact ? '0.875rem' : '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>

        {/* Category tag */}
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
        }}>
          {CATEGORY_EMOJI[item.category]} {CATEGORY_LABELS[item.category]}
        </span>

        {/* Title */}
        <h3 style={{
          fontSize: compact ? '0.9rem' : '1rem',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text-primary)',
          lineHeight: 1.3,
        }}>
          {truncate(item.title, 55)}
        </h3>

        {/* Description */}
        {!compact && (
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
            flex: 1,
          }}>
            {truncate(item.description, 90)}
          </p>
        )}

        {/* Meta — location + date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: 8,
          borderTop: '1px solid var(--color-border)',
          gap: 8,
          flexWrap: 'wrap',
        }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: '0.78rem', color: 'var(--color-text-muted)',
          }}>
            <MapPinIcon /> {truncate(item.location, 22)}
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: '0.78rem', color: 'var(--color-text-muted)',
          }}>
            <CalendarIcon /> {formatDate(item.date)}
          </span>
        </div>
      </div>
    </Link>
  )
}