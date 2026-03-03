/* ============================================================
   components/ui/Select.tsx
   ============================================================ */
import { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ label, error, options, placeholder, id, ...props }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label htmlFor={inputId} className="qf-label">{label}</label>}
      <select
        id={inputId}
        className="qf-input"
        style={{
          cursor: 'pointer',
          borderColor: error ? 'var(--color-lost)' : undefined,
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p style={{ fontSize: '0.8rem', color: 'var(--color-lost)' }}>{error}</p>}
    </div>
  )
}