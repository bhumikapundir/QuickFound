'use client'
import { ReactNode } from 'react'

/* ============================================================
   components/SkeletonCard.tsx
   — Placeholder while items are loading
   ============================================================ */
export function SkeletonCard() {
  return (
    <div className="qf-card" style={{ overflow: 'hidden' }}>
      {/* Image placeholder */}
      <div className="qf-skeleton" style={{ height: 180, borderRadius: 0 }} />

      {/* Content */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="qf-skeleton" style={{ height: 12, width: '45%' }} />
        <div className="qf-skeleton" style={{ height: 18, width: '85%' }} />
        <div className="qf-skeleton" style={{ height: 14, width: '70%' }} />
        <div className="qf-skeleton" style={{ height: 14, width: '60%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <div className="qf-skeleton" style={{ height: 12, width: '35%' }} />
          <div className="qf-skeleton" style={{ height: 12, width: '30%' }} />
        </div>
      </div>
    </div>
  )
}
