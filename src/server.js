const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// TOON Architecture - Structured music data format (like JSON but optimized for anime/music metadata)
// TOON = Typed Object Oriented Notation (custom architecture preference as requested)
const TOONDatabase = {
  version: "2.1.dev",
  source: "Pinterest-inspired templates",
  tracks: [
    {
      id: "toon_001",
      title: "Midnight City Dreams",
      artist: "Neon Pulse",
      genre: "synthwave",
      mood: "nostalgic",
      bpm: 118,
      duration: "3:45",
      coverArt: "pixel_city_sunset",
      streamUrl: "https://open.spotify.com/track/example1",
      youtubeUrl: "https://youtube.com/watch?v=example1",
      tags: ["retro", "city-pop", "driving"],
      rating: 4.8
    },
    {
      id: "toon_002",
      title: "Chibi Adventure",
      artist: "Kawaii Beats",
      genre: "chiptune",
      mood: "energetic",
      bpm: 160,
      duration: "2:30",
      coverArt: "pixel_adventure",
      streamUrl: "https://open.spotify.com/track/example2",
      youtubeUrl: "https://youtube.com/watch?v=example2",
      tags: ["gaming", "8bit", "upbeat"],
      rating: 4.9
    },
    {
      id: "toon_003",
      title: "Sakura Falling",
      artist: "Lo-Fi Garden",
      genre: "lo-fi",
      mood: "calm",
      bpm: 85,
      duration: "4:12",
      coverArt: "sakura_petals",
      streamUrl: "https://open.spotify.com/track/example3",
      youtubeUrl: "https://youtube.com/watch?v=example3",
      tags: ["study", "relax", "japanese"],
      rating: 4.7
    },
    {
      id: "toon_004",
      title: "Cyber Samurai",
      artist: "Digital Ronin",
      genre: "electronic",
      mood: "intense",
      bpm: 140,
      duration: "3:58",
      coverArt: "cyber_samurai",
      streamUrl: "https://open.spotify.com/track/example4",
      youtubeUrl: "https://youtube.com/watch?v=example4",
      tags: ["action", "cyberpunk", "bass"],
      rating: 4.6
    },
    {
      id: "toon_005",
      title: "Starry Night Cafe",
      artist: "Cosy Vibes",
      genre: "jazz-hop",
      mood: "cosy",
      bpm: 95,
      duration: "3:22",
      coverArt: "night_cafe",
      streamUrl: "https://open.spotify.com/track/example5",
      youtubeUrl: "https://youtube.com/watch?v=example5",
      tags: ["cafe", "evening", "smooth"],
      rating: 4.8
    },
    {
      id: "toon_006",
      title: "Pixel Heart",
      artist: "Retro Wave",
      genre: "synthpop",
      mood: "romantic",
      bpm: 125,
      duration: "3:15",
      coverArt: "pixel_heart",
      streamUrl: "https://open.spotify.com/track/example6",
      youtubeUrl: "https://youtube.com/watch?v=example6",
      tags: ["love", "80s", "dreamy"],
      rating: 4.5
    },
    {
      id: "toon_007",
      title: "Forest Spirits",
      artist: "Nature Sounds",
      genre: "ambient",
      mood: "peaceful",
      bpm: 70,
      duration: "5:00",
      coverArt: "forest_spirits",
      streamUrl: "https://open.spotify.com/track/example7",
      youtubeUrl: "https://youtube.com/watch?v=example7",
      tags: ["nature", "meditation", "organic"],
      rating: 4.9
    },
    {
      id: "toon_008",
      title: "Neon Rain",
      artist: "Synth Masters",
      genre: "synthwave",
      mood: "melancholic",
      bpm: 110,
      duration: "4:05",
      coverArt: "neon_rain",
      streamUrl: "https://open.spotify.com/track/example8",
      youtubeUrl: "https://youtube.com/watch?v=example8",
      tags: ["rain", "night", "emotional"],
      rating: 4.7
    }
  ]
};

// JSON Database (fallback, less preferred)
const JSONDatabase = {
  version: "1.0",
  tracks: [
    {
      id: "json_001",
      title: "Classic Vibes",
      artist: "The Standards",
      genre: "jazz",
      mood: "sophisticated",
      bpm: 100,
      duration: "3:30",
      streamUrl: "https://open.spotify.com/track/json1",
      youtubeUrl: "https://youtube.com/watch?v=json1"
    },
    {
      id: "json_002",
      title: "Rock Anthem",
      artist: "Power Chords",
      genre: "rock",
      mood: "energetic",
      bpm: 130,
      duration: "3:45",
      streamUrl: "https://open.spotify.com/track/json2",
      youtubeUrl: "https://youtube.com/watch?v=json2"
    },
    {
      id: "json_003",
      title: "Pop Sensation",
      artist: "Chart Toppers",
      genre: "pop",
      mood: "happy",
      bpm: 120,
      duration: "3:00",
      streamUrl: "https://open.spotify.com/track/json3",
      youtubeUrl: "https://youtube.com/watch?v=json3"
    }
  ]
};

// Chibi characters database
const chibiCharacters = [
  { name: "Piko", personality: "playful" },
  { name: "Mochi", personality: "sleepy" },
  { name: "Yuki", personality: "tsundere" }
];

// API: Get filters (moods, genres, etc.)
app.get('/api/filters', (req, res) => {
  const moods = [...new Set(TOONDatabase.tracks.map(t => t.mood))];
  const genres = [...new Set(TOONDatabase.tracks.map(t => t.genre))];
  
  res.json({
    success: true,
    data: {
      moods: [...moods, "happy", "sad", "excited", "focused"],
      genres: [...genres, "pop", "rock", "hip-hop", "classical", "electronic"],
      chibiCharacters: chibiCharacters.map(c => c.name)
    }
  });
});

// API: Suggest music (TOON preferred 70%, JSON 30%)
app.get('/api/suggest', (req, res) => {
  const { mood, genre, limit = 3 } = req.query;
  const numLimit = parseInt(limit);
  
  // Filter TOON tracks
  let toonFiltered = TOONDatabase.tracks.filter(track => {
    const moodMatch = !mood || track.mood === mood.toLowerCase();
    const genreMatch = !genre || track.genre === genre.toLowerCase();
    return moodMatch && genreMatch;
  });
  
  // Filter JSON tracks
  let jsonFiltered = JSONDatabase.tracks.filter(track => {
    const moodMatch = !mood || track.mood === mood.toLowerCase();
    const genreMatch = !genre || track.genre === genre.toLowerCase();
    return moodMatch && genreMatch;
  });
  
  // Shuffle arrays
  toonFiltered = toonFiltered.sort(() => Math.random() - 0.5);
  jsonFiltered = jsonFiltered.sort(() => Math.random() - 0.5);
  
  // Combine with TOON preference (70% TOON, 30% JSON)
  const toonCount = Math.ceil(numLimit * 0.7);
  const jsonCount = numLimit - toonCount;
  
  const suggestions = [
    ...toonFiltered.slice(0, toonCount).map(t => ({ ...t, source: "TOON" })),
    ...jsonFiltered.slice(0, jsonCount).map(t => ({ ...t, source: "JSON" }))
  ];
  
  res.json({
    success: true,
    count: suggestions.length,
    preference: "TOON (70%)",
    data: suggestions
  });
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎵 Music Suggester App running on http://localhost:${PORT}`);
  console.log(`✨ TOON Architecture enabled (70% preference)`);
  console.log(`🎨 Pinterest-inspired templates loaded`);
  console.log(`📺 21.dev styling applied\n`);
});
