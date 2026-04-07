import { InputHTMLAttributes, ReactNode, forwardRef } from 'react' //reactnode is used to show anything inside the input and forwardRef is used to pass ref to the input element

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { //defintion
  label?: string
  error?: string //error message
  hint?: string
  leftIcon?: ReactNode //like search icon 
}

export const Input = forwardRef<HTMLInputElement, InputProps>( //component that extracts custom props. forwardRef allows a parent component to get a reference (ref) to a child’s DOM element.
  ({ label, error, hint, leftIcon, style, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')  //id hai toh use kro vrna label se generate kro

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {label && (
          <label htmlFor={inputId} className="qf-label">
            {label}
          </label>
        )}
        
        <div style={{ position: 'relative' }}>    
          {leftIcon && (  //position icon inside input ->relative
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
              borderColor: error ? 'var(--color-lost)' : undefined, //red border if error
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
          </p>//grey helper text
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'