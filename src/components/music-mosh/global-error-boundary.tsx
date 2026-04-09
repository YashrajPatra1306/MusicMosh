'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Global Error:', error, errorInfo)
        
        // In production, send to error tracking service
        if (process.env.NODE_ENV === 'production') {
            // TODO: Send to Sentry/LogRocket/etc
            console.error('Production error - send to tracking:', {
                error: error.message,
                stack: errorInfo.componentStack
            })
        }
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-8"
                    style={{ background: '#050508' }}>
                    <div className="max-w-md text-center">
                        <div className="text-6xl mb-6">🎵</div>
                        <h1 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>
                            Something went wrong
                        </h1>
                        <p className="text-gray-400 mb-6">
                            The music stopped unexpectedly. Please try refreshing the page.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
                                style={{
                                    background: '#00ff9d',
                                    color: '#050508'
                                }}
                            >
                                Refresh Page
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#888888'
                                }}
                            >
                                Go Home
                            </button>
                        </div>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 p-4 rounded-lg text-left text-xs font-mono"
                                style={{ background: 'rgba(255,255,255,0.05)', color: '#ff6b6b' }}>
                                <summary className="cursor-pointer mb-2">Error Details (Dev Only)</summary>
                                <p className="mb-2">{this.state.error.message}</p>
                                <pre className="whitespace-pre-wrap opacity-50">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
