import * as React from 'react'

import { cn } from '@/shared/ui/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                'flex min-h-[86px] outline-none transition duration-300 resize-none w-full rounded-md border border-border bg-background px-3 py-2 text-sm   placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            ref={ref}
            {...props}
        />
    )
})

export { Textarea }
