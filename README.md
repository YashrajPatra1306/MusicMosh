# 🎵 Cosy Music Suggester

A delightful music suggestion app with a pixelated, cosy interface featuring animated chibi characters that interact with you!

## ✨ Features

- **Pixelated Interface**: Intricate pixel-art inspired design reminiscent of anime.js aesthetics
- **Three.js Background**: Floating musical notes and shapes in a dynamic 3D environment
- **Anime.js Animations**: Smooth, bouncy animations throughout the interface
- **Chibi Characters**: Three adorable characters (Piko, Mochi, Yuki) that:
  - Pop out from the sides randomly
  - Perform various animations (peek, dance, sleep, wave, etc.)
  - Display funny messages blaming you for their mishaps (Looney Tunes style!)
  - Appear at random intervals or when getting suggestions
- **TOON/JSON Music Database**: 
  - TOON format gets 70% preference in suggestions
  - JSON format gets 30% preference
  - Filter by mood and genre

## 🎨 Tech Stack

- **Frontend**:
  - HTML5
  - CSS3 (Pixelated theme with custom animations)
  - JavaScript (Vanilla)
  - Three.js (3D background)
  - Anime.js (UI animations)

- **Backend**:
  - Node.js
  - Express.js
  - CORS enabled

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
cd /workspace
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 🎮 Usage

1. **Filter Music**: Select your preferred mood and/or genre from the dropdowns
2. **Get Suggestions**: Click the "✨ Get Suggestions" button
3. **Interact**: Click on any music card to see more details
4. **Watch for Chibis**: Keep an eye on the sides of the screen for surprise chibi appearances!

## 🎭 Chibi Characters

| Name   | Personality   | Animations                    |
|--------|---------------|-------------------------------|
| Piko   | Mischievous   | peek, dance, sleep, startle   |
| Mochi  | Curious       | wave, bounce, read, point     |
| Yuki   | Shy           | hide, blush, gift, bow        |

## 🎵 Music Database

The app includes a curated list of tracks in two formats:

### TOON Tracks (70% preference)
- Looney Tunes Theme - Carl Stalling
- Tom & Jerry Jazz - Scott Bradley
- Spirited Away - Joe Hisaishi
- My Neighbor Totoro - Joe Hisaishi
- Castle in the Sky - Joe Hisaishi
- Pink Panther Theme - Henry Mancini
- Adventure Time Theme - Casey James Basichis
- Steven Universe OST - Aivi & Erina

### JSON Tracks (30% preference)
- Midnight City - M83
- Weightless - Marconi Union
- Take Five - Dave Brubeck
- Clair de Lune - Debussy
- Electric Feel - MGMT
- Holst: Jupiter - Gustav Holst

## 🔌 API Endpoints

### GET `/api/suggest`
Get music suggestions based on filters.

**Query Parameters:**
- `mood` (optional): Filter by mood
- `genre` (optional): Filter by genre
- `preference` (optional): 'toon' or 'json' (default: 'toon')

**Response:**
```json
{
  "suggestions": [...],
  "chibiCharacter": {...},
  "timestamp": "2026-04-05T12:00:00.000Z"
}
```

### GET `/api/filters`
Get available moods, genres, and chibi characters.

### GET `/api/chibi-event`
Trigger a random chibi character event.

## 🎨 Design Philosophy

The interface is designed to be:
- **Cosy**: Warm colors, soft gradients, and friendly typography
- **Pixelated**: Retro pixel-art aesthetic with grid overlays
- **Dynamic**: Constant subtle animations and interactions
- **Playful**: Chibi characters add humor and personality

## 📝 License

ISC

## 🙏 Acknowledgments

- Inspired by [anime.js](https://animejs.com/) for animation style
- Three.js for 3D graphics
- Classic cartoons (Looney Tunes, Tom & Jerry) for chibi personality

Enjoy your cosy music discovery experience! 🎵✨
