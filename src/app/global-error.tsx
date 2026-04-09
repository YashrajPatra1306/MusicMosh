'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Global error:', error)
    }, [error])

    return (
        <html lang="en">
            <body>
                <div className="min-h-screen flex items-center justify-center p-8"
                    style={{ background: '#050508' }}>
                    <div className="max-w-md text-center">
                        <div className="text-6xl mb-6">🎵</div>
                        <h1 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>
                            Something went wrong
                        </h1>
                        <p className="text-gray-400 mb-6">
                            The music stopped unexpectedly. Please try again.
                        </p>
                        <button
                            onClick={reset}
                            className="px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
                            style={{
                                background: '#00ff9d',
                                color: '#050508'
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
