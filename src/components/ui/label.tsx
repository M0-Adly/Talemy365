import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  error?: string
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, error, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label
          ref={ref}
          className={cn(
            'text-sm font-medium text-gray-700',
            className
          )}
          {...props}
        >
          {children}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    )
  }
)

Label.displayName = 'Label'

export { Label }
