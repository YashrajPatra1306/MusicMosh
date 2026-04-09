# 🎵 Music Mosh MAX

**Every song has a story. What's yours?**

> Discover music through an immersive, procedural 3D visual experience. Pick your mood, genre, and theme — we'll find your track and paint the universe around it.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYashrajPatra1306%2FMusicMosh&branch=production%2Fv3.0-unified)

---

## ✨ Features

### 🎭 Three-Dimensional Selection
- **Mood** — Energetic, Melancholic, Focused, Nostalgic, Dreamy, Aggressive, Chill, Romantic
- **Genre** — Hip-Hop, Lo-Fi, Synthwave, Drum & Bass, Ambient, Rock, Jazz, Electronic, Classical, Trap
- **Theme** — Mathematics, Literature, Science, Philosophy, Conspiracy Theories, Niche Interests

### 🌌 Procedural 3D Visuals
- Custom GLSL shaders with time-based distortion
- Dynamic geometry (box, sphere, torus knot, icosahedron, dodecahedron, torus)
- Multi-shape particle systems (circle, star, diamond) with additive blending
- Unreal bloom post-processing
- GPU-aware performance scaling (auto-adjusts for mobile/low-end devices)
- Theme-specific elements (Mathematics grid, Literature parchment)

### 🔊 Real YouTube Discovery
- Searches Invidious instances for actual tracks
- Smart filtering (duration 90-600s, >10k views, no remixes/covers)
- Curated fallback videos for every genre
- Always returns a working YouTube link

### ⚡ Chaos Mode
- Auto-cycling visual configurations every 8 seconds
- Smooth transitions between visual worlds
- Toggle on/off anytime

### 📱 Share & Social
- One-click sharing to Twitter/X, Facebook, Reddit, WhatsApp
- Native Web Share API support on mobile
- Copy link to clipboard

### 🎨 Polished UI
- Framer Motion scroll-based animations
- Glassmorphism cards with backdrop blur
- Storytelling narrative journey
- Cursor glow and ambient effects
- Responsive design (desktop + mobile)
- Accessibility (ARIA labels, keyboard navigation, reduced motion support)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ or [Bun](https://bun.sh/)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/YashrajPatra1306/MusicMosh.git
cd MusicMosh

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **3D Graphics** | Three.js r134 + Custom GLSL Shaders |
| **Post-Processing** | Unreal Bloom Pass |
| **Animations** | Framer Motion |
| **Styling** | Tailwind CSS v4 + CSS Custom Properties |
| **API** | Next.js Route Handlers + Invidious API |
| **Fonts** | Syne + Space Grotesk (Google Fonts) |

---

## 📁 Project Structure

```
MusicMosh/
├── src/
│   ├── app/
│   │   ├── api/track/route.ts      # YouTube discovery API
│   │   ├── page.tsx                 # Main app page
│   │   ├── layout.tsx               # Root layout + metadata
│   │   └── global-error.tsx         # Global error boundary
│   └── components/
│       └── music-mosh/
│           ├── three-scene-canvas.tsx        # 3D visual engine
│           ├── three-scene-error-boundary.tsx
│           ├── share-button.tsx              # Social sharing
│           └── ...                           # UI components
├── prisma/
│   └── schema.prisma               # Database schema (track history)
├── public/                         # Static assets
└── package.json
```

---

## 🎮 How It Works

### 1. Visual Generation Pipeline
```
User Selections → Visual Config Generator → Three.js Scene Build
     (Mood/Genre/Theme)         ↓                    ↓
                          • Color Palette      • Core Mesh (GLSL)
                          • Geometry Type      • Particles
                          • Motion Pattern     • Bloom Effect
                          • Particle Count     • Theme Elements
```

### 2. Track Discovery
```
Mood + Genre → Invidious API Search → Filter & Rank → YouTube URL
                    ↓ (if fails)
              Curated Fallback Videos
                    ↓ (if fails)
              YouTube Search URL
```

### 3. Chaos Mode
```
Toggle ON → setInterval(8s) → New Visual Config → Smooth Transition
```

---

## 🎨 Customization

### Add New Moods/Genres/Themes
Edit the constants in `src/app/page.tsx`:
```typescript
const MOODS = ['Energetic', 'Melancholic', ... 'NewMood']
const GENRES = ['Hip-Hop', 'Lo-Fi', ... 'NewGenre']
const THEMES = ['Mathematics', ... 'NewTheme']
```

### Add Curated Fallback Videos
Update `GENRE_VIDEOS` in `src/app/api/track/route.ts`:
```typescript
'NewGenre': [
  { title: 'Song Name', artist: 'Artist', url: 'https://youtube.com/...', views: 1000000 }
]
```

### Adjust Visual Parameters
Modify `generateVisualConfig()` in `src/components/music-mosh/three-scene-canvas.tsx`:
- Particle count range
- Bloom intensity multipliers
- Color saturation/lightness
- Motion patterns

---

## 🌐 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your fork
4. Select the `production/v3.0-unified` branch
5. Click **Deploy**

No environment variables required — works out of the box!

### Other Platforms

| Platform | Notes |
|----------|-------|
| **Netlify** | Works with Next.js adapter |
| **Railway** | Deploy as Node.js app |
| **Self-hosted** | `npm run build && npm run start` |

---

## 📊 Performance

- **Desktop (High GPU):** Full particle count (8k-20k), max bloom intensity
- **Desktop (Low GPU):** 50% particle count, reduced bloom
- **Mobile:** 20% particle count, 40% bloom, wireframe fallback for Mathematics theme
- **WebGL Disabled:** Graceful fallback to CSS ambient effects

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests
- Share your favorite mood/genre combinations

---

## 📄 License

Apache 2.0 — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- [Three.js](https://threejs.org/) — 3D graphics library
- [Invidious](https://invidious.io/) — Privacy-friendly YouTube API
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Next.js](https://nextjs.org/) — React framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS

---

**Built with ❤️ by Yashraj Patra**

*Music Mosh MAX — where every track is a new visual universe.* 🎧✨
