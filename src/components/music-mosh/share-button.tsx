'use client'

import { useState } from 'react'
import { Share2, Copy, Check, Link } from 'lucide-react'

export function ShareButton() {
    const [copied, setCopied] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = 'Music Mosh MAX — Discover Music Through 3D Visuals'
    const description = 'Every song has a story. Discover music through an immersive, procedural 3D visual experience.'

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea')
            textarea.value = url
            textarea.style.position = 'fixed'
            textarea.style.opacity = '0'
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: description,
                    url
                })
            } catch {
                // User cancelled share
            }
        } else {
            setShowMenu(!showMenu)
        }
    }

    const shareLinks = [
        {
            name: 'Twitter/X',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            color: '#1DA1F2'
        },
        {
            name: 'Facebook',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: '#4267B2'
        },
        {
            name: 'Reddit',
            url: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
            color: '#FF4500'
        },
        {
            name: 'WhatsApp',
            url: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
            color: '#25D366'
        }
    ]

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{
                    background: 'rgba(0, 255, 157, 0.1)',
                    border: '1px solid rgba(0, 255, 157, 0.3)',
                    color: '#00ff9d'
                }}
                aria-label="Share this experience"
            >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
            </button>

            {showMenu && !navigator.share && (
                <div
                    className="absolute top-full right-0 mt-2 p-4 rounded-xl shadow-2xl z-50 min-w-[250px]"
                    style={{
                        background: 'rgba(16, 16, 26, 0.98)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <h3 className="text-sm font-semibold mb-3" style={{ color: '#ffffff' }}>
                        Share this experience
                    </h3>

                    {/* Social links */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {shareLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
                                style={{
                                    background: `${link.color}20`,
                                    color: link.color,
                                    border: `1px solid ${link.color}40`
                                }}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Copy link */}
                    <button
                        onClick={handleCopy}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                        style={{
                            background: copied ? 'rgba(0, 255, 157, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            color: copied ? '#00ff9d' : '#888888',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {copied ? (
                            <>
                                <Check className="w-3 h-3" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-3 h-3" />
                                Copy Link
                            </>
                        )}
                    </button>

                    {/* Close button */}
                    <button
                        onClick={() => setShowMenu(false)}
                        className="w-full mt-2 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    )
}
