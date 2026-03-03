/* ============================================================
   components/ui/Textarea.tsx
   ============================================================ */
import { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label htmlFor={inputId} className="qf-label">{label}</label>}
      <textarea
        id={inputId}
        className="qf-input"
        style={{
          resize: 'vertical',
          minHeight: 100,
          borderColor: error ? 'var(--color-lost)' : undefined,
        }}
        {...props}
      />
      {error && <p style={{ fontSize: '0.8rem', color: 'var(--color-lost)' }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{hint}</p>}
    </div>
  )
}