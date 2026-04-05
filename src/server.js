const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// TOON Architecture Data Structure
// TOON (Tree Of Object Notation) allows nested hierarchical data with inheritance
const musicDatabase = {
  type: 'TOON',
  version: '1.0',
  root: {
    id: 'root',
    children: [
      {
        id: 'electronic',
        type: 'genre',
        properties: { name: 'Electronic', vibe: 'energetic' },
        children: [
          {
            id: 'synthwave',
            type: 'subgenre',
            properties: { name: 'Synthwave', mood: 'retro' },
            tracks: [
              { id: 't1', title: 'Nightcall', artist: 'Kavinsky', url: 'https://www.youtube.com/watch?v=MV_3DWD-B5c', source: 'TOON' },
              { id: 't2', title: 'Resonance', artist: 'Home', url: 'https://www.youtube.com/watch?v=6ZwpOKvTJds', source: 'TOON' }
            ]
          },
          {
            id: 'lofi',
            type: 'subgenre',
            properties: { name: 'Lo-Fi', mood: 'chill' },
            tracks: [
              { id: 't3', title: 'Lofi Study', artist: 'ChilledCow', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', source: 'TOON' },
              { id: 't4', title: 'Midnight City', artist: 'M83', url: 'https://www.youtube.com/watch?v=dX3k_QDnzHE', source: 'TOON' }
            ]
          }
        ]
      },
      {
        id: 'rock',
        type: 'genre',
        properties: { name: 'Rock', vibe: 'intense' },
        children: [
          {
            id: 'indie',
            type: 'subgenre',
            properties: { name: 'Indie Rock', mood: 'melancholic' },
            tracks: [
              { id: 't5', title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', url: 'https://www.youtube.com/watch?v=bpOSxM0rNPM', source: 'TOON' },
              { id: 't6', title: 'Fluorescent Adolescent', artist: 'Arctic Monkeys', url: 'https://www.youtube.com/watch?v=ma9I9VBKPiw', source: 'TOON' }
            ]
          }
        ]
      },
      {
        id: 'ambient',
        type: 'genre',
        properties: { name: 'Ambient', vibe: 'cosy' },
        children: [
          {
            id: 'space',
            type: 'subgenre',
            properties: { name: 'Space Ambient', mood: 'ethereal' },
            tracks: [
              { id: 't7', title: 'Arrival of the Birds', artist: 'The Cinematic Orchestra', url: 'https://www.youtube.com/watch?v=KpFOm9nZdOg', source: 'TOON' },
              { id: 't8', title: 'Experience', artist: 'Ludovico Einaudi', url: 'https://www.youtube.com/watch?v=7lq7YTTcdhE', source: 'TOON' }
            ]
          }
        ]
      }
    ]
  }
};

// JSON Fallback Data
const jsonDatabase = [
  { id: 'j1', title: 'Blinding Lights', artist: 'The Weeknd', genre: 'synthpop', mood: 'energetic', url: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ', source: 'JSON' },
  { id: 'j2', title: 'Levitating', artist: 'Dua Lipa', genre: 'disco', mood: 'happy', url: 'https://www.youtube.com/watch?v=TUVcZfQe-Kw', source: 'JSON' },
  { id: 'j3', title: 'Heat Waves', artist: 'Glass Animals', genre: 'indie', mood: 'melancholic', url: 'https://www.youtube.com/watch?v=mRD0-GxqHVo', source: 'JSON' },
  { id: 'j4', title: 'Stay', artist: 'The Kid LAROI', genre: 'pop', mood: 'sad', url: 'https://www.youtube.com/watch?v=kTJczUoc26U', source: 'JSON' }
];

// Helper to traverse TOON and extract tracks
function getTracksFromTOON(node, filters = {}) {
  let tracks = [];
  
  if (node.tracks) {
    const match = node.tracks.filter(track => {
      if (filters.mood && node.properties?.mood !== filters.mood) return false;
      if (filters.genre && node.properties?.name !== filters.genre) return false;
      return true;
    });
    tracks = [...tracks, ...match];
  }
  
  if (node.children) {
    node.children.forEach(child => {
      tracks = [...tracks, ...getTracksFromTOON(child, filters)];
    });
  }
  
  return tracks;
}

app.get('/api/suggest', (req, res) => {
  const { mood, genre, format } = req.query;
  const useToon = format !== 'json'; // Default to TOON
  
  let suggestions = [];
  
  if (useToon) {
    const filters = {};
    if (mood) filters.mood = mood;
    if (genre) filters.genre = genre;
    suggestions = getTracksFromTOON(musicDatabase.root, filters);
  } else {
    suggestions = jsonDatabase.filter(track => {
      if (mood && track.mood !== mood) return false;
      if (genre && track.genre !== genre) return false;
      return true;
    });
  }
  
  // If no matches, return random from respective database
  if (suggestions.length === 0) {
    if (useToon) {
      suggestions = getTracksFromTOON(musicDatabase.root);
    } else {
      suggestions = jsonDatabase;
    }
  }
  
  // Pick random suggestion
  const randomTrack = suggestions[Math.floor(Math.random() * suggestions.length)];
  
  res.json({
    success: true,
    architecture: useToon ? 'TOON' : 'JSON',
    preference: 'TOON',
    track: randomTrack
  });
});

app.get('/api/filters', (req, res) => {
  res.json({
    moods: ['retro', 'chill', 'energetic', 'melancholic', 'ethereal', 'happy', 'sad'],
    genres: ['Synthwave', 'Lo-Fi', 'Indie Rock', 'Space Ambient', 'synthpop', 'disco', 'indie', 'pop'],
    architectures: ['TOON', 'JSON']
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Architecture: TOON (preferred) + JSON fallback');
});
