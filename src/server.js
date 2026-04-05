const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Music database with TOON format preference
const musicDatabase = {
  toon: [
    { id: 1, title: "Looney Tunes Theme", artist: "Carl Stalling", mood: "energetic", genre: "cartoon" },
    { id: 2, title: "Tom & Jerry Jazz", artist: "Scott Bradley", mood: "playful", genre: "jazz" },
    { id: 3, title: "Spirited Away", artist: "Joe Hisaishi", mood: "cosy", genre: "orchestral" },
    { id: 4, title: "My Neighbor Totoro", artist: "Joe Hisaishi", mood: "peaceful", genre: "anime" },
    { id: 5, title: "Castle in the Sky", artist: "Joe Hisaishi", mood: "adventurous", genre: "anime" },
    { id: 6, title: "Pink Panther Theme", artist: "Henry Mancini", mood: "sneaky", genre: "jazz" },
    { id: 7, title: "Adventure Time Theme", artist: "Casey James Basichis", mood: "whimsical", genre: "indie" },
    { id: 8, title: "Steven Universe OST", artist: "Aivi & Erina", mood: "emotional", genre: "electronic" }
  ],
  json: [
    { id: 9, title: "Midnight City", artist: "M83", mood: "dreamy", genre: "synthwave" },
    { id: 10, title: "Weightless", artist: "Marconi Union", mood: "relaxing", genre: "ambient" },
    { id: 11, title: "Take Five", artist: "Dave Brubeck", mood: "smooth", genre: "jazz" },
    { id: 12, title: "Clair de Lune", artist: "Debussy", mood: "melancholic", genre: "classical" },
    { id: 13, title: "Electric Feel", artist: "MGMT", mood: "funky", genre: "indie" },
    { id: 14, title: "Holst: Jupiter", artist: "Gustav Holst", mood: "epic", genre: "classical" }
  ]
};

// Chibi character data
const chibiCharacters = [
  { name: "Piko", personality: "mischievous", animations: ["peek", "dance", "sleep", "startle"] },
  { name: "Mochi", personality: "curious", animations: ["wave", "bounce", "read", "point"] },
  { name: "Yuki", personality: "shy", animations: ["hide", "blush", "gift", "bow"] }
];

// API endpoint to get music suggestions
app.get('/api/suggest', (req, res) => {
  const { mood, genre, preference = 'toon' } = req.query;
  
  let suggestions = [];
  const toonTracks = musicDatabase.toon;
  const jsonTracks = musicDatabase.json;
  
  // Filter by mood if provided
  let filteredToon = mood ? toonTracks.filter(t => t.mood === mood) : toonTracks;
  let filteredJson = mood ? jsonTracks.filter(t => t.mood === mood) : jsonTracks;
  
  // Filter by genre if provided
  if (genre) {
    filteredToon = filteredToon.filter(t => t.genre === genre);
    filteredJson = filteredJson.filter(t => t.genre === genre);
  }
  
  // Give TOON more preference (70% TOON, 30% JSON)
  const toonCount = Math.ceil(filteredToon.length * 0.7);
  const jsonCount = Math.floor(filteredJson.length * 0.3);
  
  const selectedToon = filteredToon.slice(0, toonCount || 1);
  const selectedJson = filteredJson.slice(0, jsonCount || 1);
  
  suggestions = [...selectedToon, ...selectedJson];
  
  // Shuffle the results
  suggestions = suggestions.sort(() => Math.random() - 0.5);
  
  res.json({
    suggestions,
    chibiCharacter: chibiCharacters[Math.floor(Math.random() * chibiCharacters.length)],
    timestamp: new Date().toISOString()
  });
});

// Get all available moods and genres
app.get('/api/filters', (req, res) => {
  const allTracks = [...musicDatabase.toon, ...musicDatabase.json];
  const moods = [...new Set(allTracks.map(t => t.mood))];
  const genres = [...new Set(allTracks.map(t => t.genre))];
  
  res.json({ moods, genres, chibiCharacters });
});

// Get random chibi animation event
app.get('/api/chibi-event', (req, res) => {
  const character = chibiCharacters[Math.floor(Math.random() * chibiCharacters.length)];
  const animation = character.animations[Math.floor(Math.random() * character.animations.length)];
  const funnyMessages = [
    "It's your fault I dropped my ice cream! 🍦",
    "You made me blush! How dare you! 😳",
    "I was totally not sleeping! You startled me! 😴",
    "Look what you made me do! 💫",
    "This is all because of you! 🎭",
    "Why are you staring? Now I'm shy! 🙈",
    "You caught me! This is embarrassing! 😅"
  ];
  
  res.json({
    character,
    animation,
    message: funnyMessages[Math.floor(Math.random() * funnyMessages.length)],
    side: Math.random() > 0.5 ? 'left' : 'right'
  });
});

app.listen(PORT, () => {
  console.log(`🎵 Music Suggester running at http://localhost:${PORT}`);
  console.log(`🎨 Pixelated interface with chibi characters ready!`);
});
