import { FC, ReactNode } from 'react'

import { Header } from '@/shared/components/header'

interface LayoutProps {
    children: ReactNode
}

export const Layout: FC<LayoutProps> = ({ children }) => (
    <>
        <Header />
        {children}
        {/* <Footer /> */}
    </>
)
