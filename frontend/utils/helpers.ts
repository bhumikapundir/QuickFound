export const formatDate = (dateStr: string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  }).format(new Date(dateStr))
}

export const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export const truncate = (str: string, n = 80): string =>
  str.length > n ? str.slice(0, n) + '…' : str

export const debounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay = 400
) => {
  let timer: ReturnType<typeof setTimeout>
  return (...args: T) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const CATEGORY_LABELS: Record<string, string> = {
  electronics: 'Electronics',
  clothing: 'Clothing',
  accessories: 'Accessories',
  documents: 'Documents',
  keys: 'Keys',
  bags: 'Bags',
  stationery: 'Stationery',
  sports: 'Sports',
  other: 'Other',
}

export const LOCATION_OPTIONS = [
  'Main Library', 'Block A', 'Block B', 'Block C',
  'Cafeteria', 'Sports Complex', 'Auditorium',
  'Admin Block', 'Hostel Block', 'Parking Area', 'Other',
]