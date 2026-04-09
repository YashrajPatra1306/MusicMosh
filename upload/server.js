const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

const INSTANCES = [
    'https://inv.nadeko.net',
    'https://invidious.jing.rocks',
    'https://yewtu.be',
    'https://inv.vern.cc',
    'https://invidious.slipfox.xyz',
    'https://iv.ggtyler.dev'
];

// Expanded fallback videos per genre (so we always have something)
const FALLBACK_VIDEOS = {
    'Hip-Hop': 'https://www.youtube.com/watch?v=H5v3kku4y6Q',
    'Lo-Fi': 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    'Synthwave': 'https://www.youtube.com/watch?v=4tVg7X2qFgk',
    'Drum & Bass': 'https://www.youtube.com/watch?v=hHcyJPTTn6A',
    'Ambient': 'https://www.youtube.com/watch?v=O4ZQv9hJF3E',
    'Rock': 'https://www.youtube.com/watch?v=1w7OgIMMRc4',
    'Jazz': 'https://www.youtube.com/watch?v=vmDDOFXSgAs',
    'Electronic': 'https://www.youtube.com/watch?v=9UaJAnnipkY',
    'Classical': 'https://www.youtube.com/watch?v=4Tr0otuiQuU',
    'Trap': 'https://www.youtube.com/watch?v=0UJSXgCTmRk'
};

async function findSongByMoodGenre(mood, genre) {
    const queries = [
        `${mood} ${genre} song official audio`,
        `${mood} ${genre} official music video`,
        `"${genre}" ${mood} track`,
        `${genre} ${mood} song -remix -cover`
    ];
    const shuffledInstances = [...INSTANCES].sort(() => Math.random() - 0.5);

    for (const query of queries) {
        for (const instance of shuffledInstances) {
            try {
                const response = await axios.get(`${instance}/api/v1/search`, {
                    params: { q: query, type: 'video', sort_by: 'relevance' },
                    timeout: 5000
                });
                if (response.data && response.data.length) {
                    const valid = response.data.filter(v =>
                        v.lengthSeconds > 90 && v.lengthSeconds < 600 &&
                        v.viewCount > 5000 &&
                        v.title &&
                        !v.title.toLowerCase().includes('remix') &&
                        !v.title.toLowerCase().includes('cover')
                    );
                    if (valid.length) {
                        const best = valid.sort((a, b) => b.viewCount - a.viewCount)[0];
                        return {
                            id: best.videoId,
                            title: best.title,
                            artist: best.author,
                            thumb: best.videoThumbnails?.[0]?.url || '',
                            url: `https://www.youtube.com/watch?v=${best.videoId}`,
                            viewCount: best.viewCount,
                            duration: best.lengthSeconds
                        };
                    }
                }
            } catch (e) { continue; }
        }
    }

    // Ultimate fallback: use a genre-specific real video (never a search page)
    const fallbackUrl = FALLBACK_VIDEOS[genre] || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    return {
        id: null,
        title: `${mood} ${genre} — Recommended Track`,
        artist: 'Music Mosh Selection',
        url: fallbackUrl,
        viewCount: 100000,
        duration: 240,
        isFallback: true
    };
}

app.get('/api/track', async (req, res) => {
    const { mood, genre, theme } = req.query;
    if (!mood || !genre) return res.status(400).json({ error: 'Mood and Genre required' });
    const track = await findSongByMoodGenre(mood, genre);
    res.json(track);
});

app.listen(PORT, () => console.log(`🚀 Music Mosh MAX running on http://localhost:${PORT}`));