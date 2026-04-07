import type { ItemType, ItemStatus } from '@/types'         //Item Type -> tells if item is lost or found, Item Status -> tells if item is claimed or not

interface BadgeProps {  //Typechecking  ? means optional
  type?: ItemType
  status?: ItemStatus
  label?: string
}

export function Badge({ type, status, label }: BadgeProps) { //Creates React component named Badge
  let cls = 'qf-badge'    //CSS class name for styling the badge 
  let text = label ?? ''  //if label is given use it otherwise use empty string
  if (type === 'lost')   { cls += ' qf-badge-lost';    text = text || '🔍 Lost'  }
  if (type === 'found')  { cls += ' qf-badge-found';   text = text || '✅ Found' }
  if (status === 'claimed' || status === 'resolved') {
    cls += ' qf-badge-claimed'
    text = text || '✓ Claimed' 
  }

  return <span className={cls}>{text}</span>  //Returns a span element with Css class and text inside
}
