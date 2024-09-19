import * as React from 'react'

import { cn } from '@/shared/ui/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, accept, type, ...props }, ref) => {
    return (
        <input
            type={type}
            accept={accept}
            className={cn(
                'flex h-10 w-full outline-none transition duration-300 rounded-md border border-border bg-background px-3 py-2 text-sm   file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            ref={ref}
            {...props}
        />
    )
})

export { Input }
