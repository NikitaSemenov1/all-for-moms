import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/ui/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-opacity hover:opacity-80 leading-none',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground',
                destructive: 'bg-destructive text-destructive-foreground',
                secondary: 'bg-secondary text-secondary-foreground',
                border: 'bg-border text-secondary-foreground',
                accept: 'bg-green text-primary-foreground',
                purple: 'bg-purple text-primary-foreground',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                accept_outline: 'bg-input border border-green text-green',
                purple_outline: 'bg-input border border-purple text-purple',
                icon: 'bg-secondary text-secondary-foreground',
                outline: 'bg-white text-secondary-foreground',
                'outline-border': 'bg-white text-secondary-foreground border border-slate-300',
                'green-100': 'bg-green-100',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-8 rounded-md px-4 py-2',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
                no_size: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    },
)

export { Button, buttonVariants }
