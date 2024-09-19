import { ErrorInfo, ReactNode } from 'react'
import { withTranslation } from 'react-i18next'
import i18next from 'i18next'

import { Button } from '@/shared/ui/button'

import cls from './error-boundary.module.scss'
import React from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
    t: typeof i18next.t
}

interface ErrorBoundaryState {
    hasError: boolean
}

class ErrorBoundaryPage extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.log(error, errorInfo)
    }

    onClearError() {
        this.state = { hasError: false }
    }

    render() {
        const { hasError } = this.state
        const { children } = this.props
        const { t } = this.props

        if (hasError) {
            return (
                <div className={cls.error}>
                    <h3>{t('error')}</h3>
                    <div className="flex gap-5">
                        <a href="https://gcmos.ru">
                            <Button>{t('main')}</Button>
                        </a>
                        <a href="https://t.me/green_code_moscow">
                            <Button variant="secondary">{t('support')}</Button>
                        </a>
                    </div>
                </div>
            )
        }

        return children
    }
}

export const ErrorBoundary = withTranslation('translation', {
    keyPrefix: 'error_boundary',
})(ErrorBoundaryPage)
