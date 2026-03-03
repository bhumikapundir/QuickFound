import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, style, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {label && (
          <label htmlFor={inputId} className="qf-label">
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {leftIcon && (
            <span style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
              display: 'flex',
            }}>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className="qf-input"
            style={{
              paddingLeft: leftIcon ? '2.5rem' : undefined,
              borderColor: error ? 'var(--color-lost)' : undefined,
              ...style,
            }}
            {...props}
          />
        </div>
        {error && (
          <p style={{ fontSize: '0.8rem', color: 'var(--color-lost)', marginTop: 2 }}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'