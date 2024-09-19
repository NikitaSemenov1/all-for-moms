import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { LayoutLoading } from '@/shared/components/layout-loading'
import { StoreProvider } from '@/shared/providers/store-provider/index.ts'

import { ErrorBoundary } from './features/error-boundary/error-boundary.tsx'
import { App } from './app.tsx'

import '@/shared/styles/globals.css'
import '@/shared/styles/index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <StoreProvider>
            <ErrorBoundary>
                <Suspense fallback={<LayoutLoading />}>
                    <App />
                </Suspense>
            </ErrorBoundary>
        </StoreProvider>
    </BrowserRouter>,
)
