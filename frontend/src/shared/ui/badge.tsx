import React from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

import { cn } from './utils'

const badgeVariants = cva('min-h-5 p-1 mr-1 text-xs font-medium uppercase leading-none rounded-sm text-left', {
    variants: {
        variant: {
            default: 'bg-secondary text-accept-foreground',
            destructive: 'bg-destructive text-destructive-foreground',
            approve: 'bg-green text-white',
            pro: 'bg-purple text-white',
        },
        type: {
            default: '',
            removable: 'flex justify-between items-center',
        },
    },
    defaultVariants: {
        variant: 'default',
        type: 'default',
    },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
    onRemove?: React.MouseEventHandler<HTMLButtonElement>
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ children, className, variant, type, onRemove, ...props }, ref) => {
        return (
            <div className={cn(badgeVariants({ variant, type }), className)} ref={ref} {...props}>
                {children}

                {type === 'removable' && (
                    <button type="button" onClick={onRemove}>
                        <X
                            className="cursor-pointer ml-1 h-4 w-4 text-black font-medium hover:opacity-60"
                            strokeWidth={'4'}
                        />
                    </button>
                )}
            </div>
        )
    },
)
