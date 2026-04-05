# 🎵 Cosy Music Suggester App

A premium music discovery experience with pixelated aesthetics, powered by **Three.js**, **Anime.js**, and **TOON Architecture**.

![Version](https://img.shields.io/badge/version-2.1.dev-pink)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### 🎨 Visual Design
- **Pixelated Interface** - Retro CRT scanlines, vignette overlay, glitch effects
- **3D Animated Background** - Floating geometric shapes with Three.js
- **Cosy Color Palette** - Warm purples, pinks, and cyans
- **21.dev & Pinterest-Inspired** - Modern aesthetic with retro vibes

### 🎭 Chibi Characters
- **3 Unique Characters**: Piko (playful), Mochi (sleepy), Yuki (tsundere)
- **Random Appearances** - Pop out every 30-90 seconds
- **12+ Animations** - Dance, wave, jump, blush, angry, surprised
- **Funny Messages** - Looney Tunes-style blame game ("It's your fault!")

### 🎵 Music Suggestions
- **TOON Architecture** (70% preference) - Optimized for anime/music metadata
- **JSON Fallback** (30%) - Standard format support
- **Smart Filtering** - By mood and genre
- **Direct Playback Links** - Opens Spotify/YouTube in new tab

### ⚡ Animations
- **Anime.js Powered** - Smooth elastic bounces, springs, staggers
- **Particle Effects** - Button hovers, card interactions
- **Glitch Title** - Cyberpunk chromatic aberration
- **Loading Spinner** - Multi-ring animated loader

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd /workspace
npm install
npm start
```

### Access the App
Open **http://localhost:3000** in your browser

## 📁 Project Structure

```
music-suggester-app/
├── src/
│   └── server.js          # Express backend with TOON/JSON APIs
├── public/
│   ├── index.html         # Main HTML structure
│   ├── styles.css         # Pixelated CSS theme
│   └── app.js             # Three.js + Anime.js frontend
├── package.json           # Dependencies
└── README.md              # This file
```

## 🎯 API Endpoints

### GET /api/filters
Returns available moods, genres, and chibi characters.

### GET /api/suggest?mood=cosy&genre=lo-fi&limit=6
Returns music suggestions with TOON preference (70%).

### GET /api/chibi-event
Returns random chibi character with animation and funny message.

## 🎮 How to Use

1. Select mood/genre filters (optional)
2. Click "Get Suggestions" button
3. Click "Play on YouTube/Spotify" to open track
4. Watch for random chibi appearances!

## 🌟 Key Technologies

- **Three.js** - 3D background animations
- **Anime.js** - UI animations and effects
- **Pretext** - Structured console logging
- **Express.js** - Backend server
- **TOON Architecture** - Custom data format (70% preference)

---

Made with 💖 using Three.js + Anime.js + TOON Architecture
