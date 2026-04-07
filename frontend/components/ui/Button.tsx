import { ButtonHTMLAttributes, ReactNode } from 'react' //button ke feature jese onclick and we can show anything inside  btn
import { Spinner } from './Spinner'  //ye spinner loading ke time show hoga
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'  //types of btn main,secondary,transparent and warning
type Size    = 'sm' | 'md' | 'lg'  //sizes-> small,medium and large

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant //Button type
  size?: Size
  loading?: boolean
  children: ReactNode //content inside the button
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  style,
  ...props  //pass other props like onClick
}: ButtonProps) {  //Ensures btn follow the defined types
  return (
    <button
      className={`qf-btn qf-btn-${variant}`}
      disabled={disabled || loading}
      style={{ ...style } as React.CSSProperties}  //applies custom style
      {...props}
    >
      {loading ? <Spinner size={16} /> : children}  
    </button> //agr loading true show spinner otherwise show button with content(children)
  )
}