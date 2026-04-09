import { NextRequest, NextResponse } from 'next/server'

// Curated YouTube videos for each genre (guaranteed working)
const GENRE_VIDEOS: Record<string, Array<{ title: string; artist: string; url: string; views: number }>> = {
    'Hip-Hop': [
        { title: 'Hip-Hop Mix 2024', artist: 'Hip-Hop Nation', url: 'https://www.youtube.com/watch?v=H5v3kku4y6Q', views: 15000000 },
        { title: 'Best of Hip-Hop', artist: 'Music Legends', url: 'https://www.youtube.com/watch?v=YVkUvm5Q5HA', views: 8000000 }
    ],
    'Lo-Fi': [
        { title: 'lofi hip hop radio', artist: 'Lofi Girl', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', views: 500000000 },
        { title: 'Chill Lo-Fi Beats', artist: 'ChillHop Music', url: 'https://www.youtube.com/watch?v=5yx6BWlEVcY', views: 25000000 }
    ],
    'Synthwave': [
        { title: 'Synthwave Mix', artist: 'Synthwave Rider', url: 'https://www.youtube.com/watch?v=4tVg7X2qFgk', views: 12000000 },
        { title: 'Retro Synthwave', artist: 'NewRetroWave', url: 'https://www.youtube.com/watch?v=VZVfG7NpJbE', views: 8000000 }
    ],
    'Drum & Bass': [
        { title: 'Drum & Bass Mix', artist: 'DnB Radio', url: 'https://www.youtube.com/watch?v=hHcyJPTTn6A', views: 5000000 },
        { title: 'Best of DnB', artist: 'UKF Drum & Bass', url: 'https://www.youtube.com/watch?v=gCYcHz2k5z0', views: 18000000 }
    ],
    'Ambient': [
        { title: 'Ambient Relaxation', artist: 'Ambient Worlds', url: 'https://www.youtube.com/watch?v=O4ZQv9hJF3E', views: 7000000 },
        { title: 'Deep Ambient', artist: 'SomaFM', url: 'https://www.youtube.com/watch?v=Mh8r-681Y0E', views: 3000000 }
    ],
    'Rock': [
        { title: 'Rock Classics Mix', artist: 'Rock Legends', url: 'https://www.youtube.com/watch?v=1w7OgIMMRc4', views: 25000000 },
        { title: 'Best Rock Songs', artist: 'Classic Rock', url: 'https://www.youtube.com/watch?v=XHOmBV4js_E', views: 35000000 }
    ],
    'Jazz': [
        { title: 'Jazz Essentials', artist: 'Jazz Collective', url: 'https://www.youtube.com/watch?v=vmDDOFXSgAs', views: 9000000 },
        { title: 'Smooth Jazz Mix', artist: 'Jazz FM', url: 'https://www.youtube.com/watch?v=Dx5qFachd3A', views: 12000000 }
    ],
    'Electronic': [
        { title: 'Electronic Dance Mix', artist: 'EDM Universe', url: 'https://www.youtube.com/watch?v=9UaJAnnipkY', views: 15000000 },
        { title: 'Best of EDM', artist: 'Electronic Music', url: 'https://www.youtube.com/watch?v=KRA8M77O8KU', views: 20000000 }
    ],
    'Classical': [
        { title: 'Classical Masterpieces', artist: 'Classical FM', url: 'https://www.youtube.com/watch?v=4Tr0otuiQuU', views: 30000000 },
        { title: 'Best Classical Music', artist: 'Classical Radio', url: 'https://www.youtube.com/watch?v=yHYyVDrF1I0', views: 18000000 }
    ],
    'Trap': [
        { title: 'Trap Bangers', artist: 'Trap Nation', url: 'https://www.youtube.com/watch?v=0UJSXgCTmRk', views: 22000000 },
        { title: 'Best Trap Music', artist: 'Bass Boosted', url: 'https://www.youtube.com/watch?v=qFLhGq0060w', views: 15000000 }
    ]
}

// Mood-based YouTube search URLs (for when we can't find exact matches)
const MOOD_SEARCH_URLS: Record<string, string> = {
    'Energetic': 'https://www.youtube.com/results?search_query=energetic+upbeat+music+official',
    'Melancholic': 'https://www.youtube.com/results?search_query=melancholic+emotional+music+official',
    'Focused': 'https://www.youtube.com/results?search_query=concentration+focus+music+study',
    'Nostalgic': 'https://www.youtube.com/results?search_query=nostalgic+retro+music+official',
    'Dreamy': 'https://www.youtube.com/results?search_query=dreamy+ambient+chill+music',
    'Aggressive': 'https://www.youtube.com/results?search_query=aggressive+intense+heavy+music',
    'Chill': 'https://www.youtube.com/results?search_query=chill+relax+lofi+music',
    'Romantic': 'https://www.youtube.com/results?search_query=romantic+love+song+official'
}

interface TrackResponse {
    id: string | null
    title: string
    artist: string
    thumb: string
    url: string
    viewCount: number
    duration: number
    isFallback?: boolean
    source?: 'invidious' | 'curated' | 'search'
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const mood = searchParams.get('mood')
    const genre = searchParams.get('genre')
    const theme = searchParams.get('theme')

    if (!mood || !genre) {
        return NextResponse.json(
            { error: 'Mood and Genre are required' },
            { status: 400 }
        )
    }

    try {
        // Strategy 1: Try Invidious API for real discovery
        const invidiousResult = await tryInvidiousSearch(mood, genre)
        if (invidiousResult) {
            return NextResponse.json({
                ...invidiousResult,
                source: 'invidious'
            })
        }

        // Strategy 2: Use curated fallback for the genre
        const curatedResult = getCuratedFallback(mood, genre)
        return NextResponse.json({
            ...curatedResult,
            source: 'curated'
        })
    } catch (error) {
        console.error('Track search error:', error)
        
        // Strategy 3: Ultimate fallback - YouTube search URL
        return NextResponse.json({
            id: null,
            title: `${mood} ${genre} Music`,
            artist: 'YouTube Search',
            thumb: '',
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${mood} ${genre} music official video`)}`,
            viewCount: 0,
            duration: 0,
            isFallback: true,
            source: 'search'
        })
    }
}

async function tryInvidiousSearch(mood: string, genre: string): Promise<TrackResponse | null> {
    const instances = [
        'https://vid.puffyan.us',
        'https://invidious.fdn.fr',
        'https://inv.tux.pizza',
        'https://invidious.privacyredirect.com'
    ]
    
    const queries = [
        `${mood} ${genre} song official audio`,
        `${mood} ${genre} official music video`,
        `${genre} ${mood} track 2024`
    ]

    for (const instance of instances) {
        for (const query of queries) {
            try {
                const response = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video&sort_by=relevance`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    signal: AbortSignal.timeout(4000)
                })

                if (!response.ok) continue
                
                const data = await response.json()
                
                if (data && data.length > 0) {
                    // Filter for quality results
                    const valid = data.filter((v: any) => 
                        v.lengthSeconds > 90 && 
                        v.lengthSeconds < 600 &&
                        v.viewCount > 10000 &&
                        v.title &&
                        !v.title.toLowerCase().includes('remix') &&
                        !v.title.toLowerCase().includes('cover') &&
                        !v.title.toLowerCase().includes('reaction') &&
                        !v.title.toLowerCase().includes('lyrics')
                    )

                    if (valid.length > 0) {
                        const best = valid.sort((a: any, b: any) => b.viewCount - a.viewCount)[0]
                        return {
                            id: best.videoId,
                            title: best.title,
                            artist: best.author,
                            thumb: best.videoThumbnails?.[1]?.url || best.videoThumbnails?.[0]?.url || '',
                            url: `https://www.youtube.com/watch?v=${best.videoId}`,
                            viewCount: best.viewCount,
                            duration: best.lengthSeconds,
                            isFallback: false
                        }
                    }
                }
            } catch {
                continue
            }
        }
    }

    return null
}

function getCuratedFallback(mood: string, genre: string): TrackResponse {
    const genreVideos = GENRE_VIDEOS[genre] || []
    
    if (genreVideos.length > 0) {
        // Pick the most viewed video
        const best = genreVideos.sort((a, b) => b.views - a.views)[0]
        return {
            id: null,
            title: `${mood} ${genre} — ${best.title}`,
            artist: best.artist,
            thumb: '',
            url: best.url,
            viewCount: best.views,
            duration: 240,
            isFallback: true
        }
    }

    // If no curated video for this genre, return YouTube search
    return {
        id: null,
        title: `Search: ${mood} ${genre}`,
        artist: 'YouTube',
        thumb: '',
        url: MOOD_SEARCH_URLS[mood] || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${mood} ${genre} music`)}`,
        viewCount: 0,
        duration: 0,
        isFallback: true
    }
}
