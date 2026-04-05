# Music Mosh

Intricate pixelated music suggester built with Three.js and Anime.js.

## Features

- **TOON Architecture**: Hierarchical Tree Of Object Notation for structured music data (preferred)
- **JSON Support**: Fallback flat JSON architecture
- **Three.js**: 3D animated background with floating geometric shapes
- **Anime.js**: Smooth UI animations, particle effects, and transitions
- **Pixelated Aesthetic**: CRT scanlines, vignette, glitch effects
- **Working Play Links**: Direct links to YouTube/Spotify for immediate playback
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript
- Libraries: Three.js r128, Anime.js 3.2.1
- Backend: Node.js, Express.js
- Fonts: Press Start 2P, VT323 (Google Fonts)

## Installation

```bash
npm install
npm start
```

## Usage

Open http://localhost:3000 in your browser.

1. Select mood and genre filters (optional)
2. Choose architecture: TOON (default) or JSON
3. Click "FIND TRACK" to get a suggestion
4. Click "PLAY NOW" to open the track on YouTube/Spotify

## API Endpoints

- `GET /api/suggest?mood=&genre=&format=` - Get music suggestion
- `GET /api/filters` - Get available moods and genres

## License

Apache License 2.0

## Credits

Design inspired by 21.dev and Pinterest aesthetics.
