'use client'

import { Component, ErrorInfo, ReactNode, useState } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ThreeSceneErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ThreeScene Error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return <>{this.props.fallback}</>
            }
            return (
                <div className="fixed inset-0 flex items-center justify-center z-0"
                    style={{ background: '#050508' }}>
                    <div className="text-center p-8">
                        <div className="text-6xl mb-4">🎵</div>
                        <p className="text-gray-400 text-sm">
                            3D visuals unavailable<br />
                            <span className="text-xs opacity-50">Audio experience still active</span>
                        </p>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export function ThreeSceneFallback() {
    const [dots, setDots] = useState('')

    return (
        <div className="fixed inset-0 z-0" style={{ background: '#050508' }}>
            {/* Animated gradient background when 3D is unavailable */}
            <div className="absolute inset-0 opacity-30">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,157,0.08) 0%, transparent 70%)',
                        animation: 'pulse 4s ease-in-out infinite'
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse at 30% 70%, rgba(0,212,255,0.06) 0%, transparent 60%)',
                        animation: 'pulse 5s ease-in-out infinite 1s'
                    }}
                />
            </div>
        </div>
    )
}
