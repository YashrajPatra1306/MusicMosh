# 🎵 Music Mosh MAX - Unified Edition v3.0

## ✨ What Was Integrated

This project successfully merges **two distinct Music Mosh implementations** into one unified, feature-rich application:

### Source Projects
1. **Express.js Version** (`D:\Revival\music-app`) - Lightweight vanilla JS with procedural 3D visuals
2. **Next.js Version** (`D:\Revival\Music Mosh`) - Modern React/TypeScript with storytelling UI

### Best Features Combined

#### From Express.js Version 🎨
- ✅ **Procedural Three.js 3D Scene Engine**
  - Custom GLSL shaders with time-based distortion
  - Dynamic geometry (box, sphere, torus knot, icosahedron, dodecahedron, torus)
  - Particle systems with multiple shapes (circle, star, diamond)
  - Additive blending and bloom post-processing
  
- ✅ **GPU-Aware Performance Scaling**
  - Automatic GPU tier detection (low/medium/high)
  - Adaptive particle count and bloom intensity
  - Wireframe fallback for low-end devices

- ✅ **Dynamic Visual Configuration**
  - HSL color palette generation from mood/genre/theme
  - Motion patterns (spiral, orbit, drift, float, bounce, pulse, shake, wave, sway)
  - Theme-specific visuals (Mathematics grid, Literature parchment)

- ✅ **Chaos Mode**
  - Auto-cycling visual configurations every 8 seconds
  - Smooth transitions between visual worlds

- ✅ **Robust Track Discovery**
  - Multi-instance Invidious API rotation (6 instances)
  - 4 search query variations per attempt
  - Smart filtering (duration 90-600s, >5000 views, no remixes/covers)
  - Genre-specific fallback videos

#### From Next.js Version 🚀
- ✅ **Modern React Architecture**
  - TypeScript for type safety
  - Component-based structure
  - Framer Motion animations

- ✅ **Storytelling Narrative**
  - Hero section with glitch text effects
  - Chapter-based user journey
  - Progressive disclosure of features

- ✅ **Advanced UI Components**
  - Glassmorphism cards with backdrop blur
  - Magnetic buttons with spring physics
  - Cursor glow and ambient orbs
  - Floating particles and notes

- ✅ **Scroll-Based Animations**
  - Framer Motion ScrollTrigger integration
  - Reveal-on-scroll sections
  - Journey progress indicator

- ✅ **Database Integration**
  - Prisma ORM with SQLite
  - User and content models
  - Migration support

#### New Unified Features 🌟
- ✅ **Three.js Canvas Background**
  - Procedural 3D scenes behind the React UI
  - Responsive canvas with proper cleanup
  - Seamless integration with Tailwind CSS

- ✅ **Enhanced Chaos Mode**
  - Visual toggle button in dimension selector
  - Pulsing indicator when active
  - 8-second auto-cycle with smooth transitions

- ✅ **Unified Dependencies**
  - Three.js r134 for 3D graphics
  - Axios for API calls
  - Full TypeScript support

## 📁 Project Structure

```
D:\Revival\Music Mosh\
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── track/
│   │   │       └── route.ts          # Invidious API integration (from Express)
│   │   ├── page.tsx                   # Main page with 3D canvas integration
│   │   ├── layout.tsx                 # Root layout with fonts
│   │   └── globals.css                # Unified styles + animations
│   └── components/
│       └── music-mosh/
│           ├── three-scene-canvas.tsx # NEW: Three.js scene generator
│           ├── glass-card.tsx
│           ├── equalizer-bars.tsx
│           └── ... (other UI components)
├── prisma/
│   └── schema.prisma                  # Database schema
├── package.json                       # Updated with three, axios
└── ... (config files)
```

## 🎮 How It Works

### 1. Visual Generation Pipeline
```
User Selections (Mood + Genre + Theme)
         ↓
  Visual Config Generator
         ↓
  ┌─────────────────────┐
  │  Color Palette      │ → HSL primary/secondary/background
  │  Geometry Type      │ → Box, Sphere, TorusKnot, etc.
  │  Motion Pattern     │ → Spiral, Orbit, Drift, etc.
  │  Particle Count     │ → Scaled by GPU tier
  │  Bloom Intensity    │ → Mood-based (0.6-1.5)
  └─────────────────────┘
         ↓
  Three.js Scene Build
         ↓
  ┌─────────────────────┐
  │  GLSL Shaders       │ → Time-based distortion
  │  Core Mesh          │ → Procedural geometry
  │  Particle System    │ → Multi-shape point clouds
  │  Post-Processing    │ → Unreal bloom
  │  Theme Elements     │ → Grid, parchment, etc.
  └─────────────────────┘
```

### 2. Track Discovery
```
Mood + Genre + Theme
         ↓
  GET /api/track
         ↓
  ┌─────────────────────┐
  │ 4 Query Variations  │
  │ 6 Invidious Instances│
  │ Smart Filtering     │
  │ View Count Ranking  │
  └─────────────────────┘
         ↓
  Track JSON Response
  (title, artist, URL, views, duration)
```

### 3. Chaos Mode
```
Toggle ON
         ↓
  setInterval(8000ms)
         ↓
  Generate New Config
         ↓
  Rebuild 3D Scene
  (smooth transition)
         ↓
  Toggle OFF → clearInterval
```

## 🚀 Running the Unified App

### Prerequisites
- Node.js v16+ or Bun
- npm/bun package manager

### Installation
```bash
cd "D:\Revival\Music Mosh"
bun install  # or npm install
```

### Development
```bash
bun run dev  # Starts on http://localhost:3000
```

### Production
```bash
bun run build
bun run start
```

## 🎨 Key Components

### ThreeSceneCanvas (`three-scene-canvas.tsx`)
- **Purpose**: Renders procedural 3D background
- **Features**:
  - GPU tier detection
  - Dynamic scene building
  - Custom GLSL shaders
  - Particle animation
  - Post-processing bloom
  - Responsive resize

### API Route (`/api/track/route.ts`)
- **Purpose**: Discover YouTube tracks via Invidious
- **Features**:
  - Multi-instance rotation
  - Smart filtering
  - Genre-specific fallbacks
  - Error handling

### Main Page (`page.tsx`)
- **Enhanced with**:
  - Three.js canvas background
  - Chaos mode state management
  - Visual config updates on selection
  - Toggle button in UI

## 🌈 Visual Features

### Shader Effects
- **Time-based distortion**: Vertex shader animates mesh with sine/cosine waves
- **Fresnel effect**: Edge glow based on normal angle
- **Color morphing**: Fragment shader blends between primary/secondary colors
- **Wireframe mode**: Mathematics theme uses wireframe for geometric feel

### Particle Systems
- **Three shapes**: Circle, star, diamond (canvas-generated textures)
- **Motion patterns**: 
  - Spiral: Rotational movement
  - Orbit: Circular paths
  - Drift: Gentle floating
  - Float: Upward drift
  - Bounce, Pulse, Shake, Wave, Sway
- **Additive blending**: Creates luminous clouds
- **GPU scaling**: 20%-100% particle count based on device

### Theme-Specific Elements
- **Mathematics**: GridHelper + wireframe shaders
- **Literature**: Canvas-generated parchment texture
- **Science/Philosophy**: Color palette shifts
- **Conspiracy Theories**: Unusual color combinations
- **Niche Interests**: Unique seed values

## 🎯 User Experience Flow

1. **Landing** → Hero with glitch text + typing animation
2. **Story** → Narrative journey with scroll reveals
3. **Configure** → Select Mood, Genre, Theme
4. **Discover** → "Find My Track" searches for music
5. **Experience** → Result card with adaptive visuals
6. **Explore** → Chaos mode for continuous discovery

## 📊 Performance Optimizations

- **GPU Detection**: WebGL renderer introspection
- **Particle Scaling**: 
  - Low: 20% count, 40% bloom
  - Medium: 50% count
  - High: 100% count, full bloom
- **Canvas Sizing**: Capped at 2x device pixel ratio
- **Memory Management**: Proper geometry/material disposal
- **Animation Loop**: RequestAnimationFrame with cleanup

## 🔧 Customization

### Add New Moods/Genres/Themes
Edit constants in `page.tsx`:
```typescript
const MOODS = ['Energetic', 'Melancholic', ... 'NewMood']
const GENRES = ['Hip-Hop', 'Lo-Fi', ... 'NewGenre']
const THEMES = ['Mathematics', ... 'NewTheme']
```

### Change Fallback Videos
Update `FALLBACK_VIDEOS` object in `/api/track/route.ts`

### Adjust Visual Parameters
Modify `generateVisualConfig()` in `three-scene-canvas.tsx`:
- Particle count range
- Bloom intensity multipliers
- Color saturation/lightness
- Motion patterns

### Add New Geometry
Extend the switch statement in `buildScene()`:
```typescript
case 'octahedron':
  geometry = new THREE.OctahedronGeometry(size, detail)
  break
```

## 🎉 What Makes This Special

This unified version represents the **best of both worlds**:

1. **Visual Depth** - Procedural 3D scenes that never repeat
2. **UX Polish** - Smooth animations and progressive disclosure
3. **Performance** - GPU-aware optimization
4. **Robustness** - Multi-layer fallback systems
5. **Extensibility** - Clean component architecture
6. **Storytelling** - Narrative-driven user journey
7. **Discovery** - Chaos mode for endless exploration

## 📝 License

Apache 2.0 - See original LICENSE files from source projects

---

**Built by merging two incredible implementations** 🚀
*Where procedural generation meets modern web development*
