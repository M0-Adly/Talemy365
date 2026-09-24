import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]'
    
    const variants = {
      default: 'bg-[#7C3AED] text-white hover:bg-[#6C2BD9] shadow-sm shadow-[#7C3AED]/20',
      secondary: 'bg-[#EDE7FB] text-[#4C1D95] hover:bg-[#EDE7FB]/80',
      outline: 'border border-[#7C3AED]/30 bg-white text-[#4C1D95] hover:bg-[#EDE7FB]',
      ghost: 'text-[#4C1D95] hover:bg-[#EDE7FB]',
      destructive: 'bg-[#4C1D95] text-white hover:bg-[#2D3748]'
    }
    
    const sizes = {
      sm: 'h-9 px-3.5 text-sm min-h-[44px] min-w-[44px]',
      md: 'h-11 px-5 min-w-[44px] min-h-[44px]',
      lg: 'h-12 px-8 text-base min-h-[44px]',
      icon: 'h-11 w-11 min-w-[44px] min-h-[44px]'
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, type ButtonVariant, type ButtonSize }
