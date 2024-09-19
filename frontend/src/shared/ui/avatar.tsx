import { FC } from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
interface AvatarProps {
    className: string
    fallback: string | React.ReactNode
    src: string
    alt: string
    width?: number
    height?: number
}
export const Avatar: FC<AvatarProps> = ({ src, alt, className, fallback, width, height }) => (
    <div>
        <AvatarPrimitive.Root className={className} style={{ width: `${width}px`, height: `${height}px` }}>
            <AvatarPrimitive.Image className={className} src={src} alt={alt} />
            <AvatarPrimitive.Fallback>{fallback}</AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
    </div>
)
