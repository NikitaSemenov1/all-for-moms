import { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface props {
    alwaysVisibleContent: string | React.ReactNode
    hiddenContent?: Array<string | React.ReactNode>
    className?: string
    disabled?: boolean
}

export const DropdownRow: FC<props> = ({ className, alwaysVisibleContent, hiddenContent, disabled }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [contentHeight, setContentHeight] = useState<number>(0)
    const contentRef = useRef(null)

    useEffect(() => {
        const interval = setInterval(() => {
            if (contentHeight < 100 && isOpen) {
                setContentHeight((prevValue) => prevValue + 5)
            } else if (contentHeight > 0 && !isOpen) {
                setContentHeight((prevValue) => prevValue - 5)
            }
        }, 2)

        return () => clearInterval(interval)
    }, [contentHeight, isOpen])

    return (
        <div className={`bg-muted p-5 rounded-lg mb-[16px] ${className}`}>
            <div className="flex justify-between items-center">
                <div className="flex-1">{alwaysVisibleContent}</div>

                {hiddenContent?.length && !disabled ? (
                    <button className="ml-2 max-[400px]:self-start" onClick={() => setIsOpen(!isOpen)}>
                        <ChevronDown className={`transition-all duration-700 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                ) : (
                    <></>
                )}
            </div>

            <div
                ref={contentRef}
                className={`block overflow-hidden transition-all duration-700 ${isOpen ? 'pt-5' : 'pt-0'}`}
                style={{ maxHeight: `${contentHeight}vh` }}
            >
                {hiddenContent}
            </div>
        </div>
    )
}
