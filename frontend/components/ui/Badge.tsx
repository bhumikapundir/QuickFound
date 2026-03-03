import type { ItemType, ItemStatus } from '@/types'

interface BadgeProps {
  type?: ItemType
  status?: ItemStatus
  label?: string
}

export function Badge({ type, status, label }: BadgeProps) {
  let cls = 'qf-badge'
  let text = label ?? ''

  if (type === 'lost')   { cls += ' qf-badge-lost';    text = text || '🔍 Lost'  }
  if (type === 'found')  { cls += ' qf-badge-found';   text = text || '✅ Found' }
  if (status === 'claimed' || status === 'resolved') {
    cls += ' qf-badge-claimed'
    text = text || '✓ Claimed'
  }

  return <span className={cls}>{text}</span>
}
