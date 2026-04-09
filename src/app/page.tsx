'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import {
  Music, Sparkles, Zap, Volume2, Play, Copy, RefreshCw, Shuffle, ChevronDown,
  Heart, Eye, Clock, Check, Info, Star, Waves, BookOpen, Cpu, Brain,
  Lightbulb, Compass, ArrowRight, ExternalLink
} from 'lucide-react'

// ═══════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════
const MOODS = ['Energetic', 'Melancholic', 'Focused', 'Nostalgic', 'Dreamy', 'Aggressive', 'Chill', 'Romantic']
const GENRES = ['Hip-Hop', 'Lo-Fi', 'Synthwave', 'Drum & Bass', 'Ambient', 'Rock', 'Jazz', 'Electronic', 'Classical', 'Trap']
const THEMES = ['Mathematics', 'Literature', 'Science', 'Philosophy', 'Conspiracy Theories', 'Niche Interests']

const STORY_LINES = [
  { text: "Close your eyes...", delay: 0, icon: <Eye className="w-5 h-5" /> },
  { text: "Feel the beat echoing through the void...", delay: 1, icon: <Waves className="w-5 h-5" /> },
  { text: "Every melody carries a universe within.", delay: 2, icon: <Music className="w-5 h-5" /> },
  { text: "Choose your dimensions. Shape your sound.", delay: 3, icon: <Compass className="w-5 h-5" /> },
  { text: "Let the music find you.", delay: 4, icon: <Sparkles className="w-5 h-5" /> },
]

const CATEGORY_META: Record<string, { icon: React.ReactNode; description: string; color: string }> = {
  mood: { icon: <Heart className="w-5 h-5" />, description: "The emotional energy of your track", color: '#ff6b6b' },
  genre: { icon: <Music className="w-5 h-5" />, description: "The sonic style & rhythm", color: '#00d4ff' },
  theme: { icon: <Lightbulb className="w-5 h-5" />, description: "The conceptual world to explore", color: '#ffd93d' },
}

const THEME_ICONS: Record<string, React.ReactNode> = {
  'Mathematics': <Cpu className="w-4 h-4" />,
  'Literature': <BookOpen className="w-4 h-4" />,
  'Science': <Brain className="w-4 h-4" />,
  'Philosophy': <Lightbulb className="w-4 h-4" />,
  'Conspiracy Theories': <Zap className="w-4 h-4" />,
  'Niche Interests': <Star className="w-4 h-4" />,
}

interface TrackData {
  id: string | null
  title: string
  artist: string
  thumb: string
  url: string
  viewCount: number
  duration: number
  isFallback?: boolean
}

// ═══════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════
function formatViews(n: number) {
  if (!n || n < 0) return '—'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return n.toString()
}

function formatDuration(secs: number) {
  if (!secs || secs <= 0) return '—'
  const m = Math.floor(secs / 60)
  const s = String(secs % 60).padStart(2, '0')
  return `${m}:${s}`
}

// ═══════════════════════════════════════════════════
// CURSOR GLOW COMPONENT
// ═══════════════════════════════════════════════════
function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px'
        glowRef.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return <div ref={glowRef} className="cursor-glow" />
}

// ═══════════════════════════════════════════════════
// FLOATING PARTICLES
// ═══════════════════════════════════════════════════
function FloatingParticles({ count = 30 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 100,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#00ff9d' : '#00d4ff',
    }))
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            left: `${p.left}%`,
            bottom: '-10px',
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════
// AMBIENT ORBS (BLURRED BACKGROUND BLOBS)
// ═══════════════════════════════════════════════════
function AmbientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="orb-1 absolute rounded-full"
        style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(0,255,157,0.08) 0%, transparent 70%)',
          top: '10%', left: '-10%',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="orb-2 absolute rounded-full"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
          bottom: '10%', right: '-5%',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="orb-3 absolute rounded-full"
        style={{
          width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(255,107,107,0.05) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(55px)',
        }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════
// SECTION 1: HERO
// ═══════════════════════════════════════════════════
function HeroSection() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50])

  const title = "MUSIC MOSH"
  const subtitle = "Every sound tells a story. What's yours?"

  const letterVariants = {
    hidden: { y: 80, opacity: 0, rotateX: -90 },
    visible: (i: number) => ({
      y: 0, opacity: 1, rotateX: 0,
      transition: { delay: 0.5 + i * 0.04, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }
    }),
  }

  return (
    <motion.section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
    >
      {/* Equalizer visualization behind title */}
      <div className="absolute inset-0 flex items-end justify-center gap-[3px] pb-[20vh] opacity-20 pointer-events-none">
        {Array.from({ length: 60 }, (_, i) => (
          <motion.div
            key={i}
            className="w-[2px] bg-gradient-to-t from-[#00ff9d] to-[#00d4ff] rounded-full"
            initial={{ height: 0 }}
            animate={{
              height: [10, Math.random() * 80 + 20, 10],
            }}
            transition={{
              duration: Math.random() * 1.5 + 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.05,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="relative z-10 text-center">
        <h1 className="glitch-text" data-text={title} style={{
          fontFamily: 'var(--font-syne)',
          fontSize: 'clamp(3rem, 10vw, 7rem)',
          fontWeight: 800,
          letterSpacing: '-2px',
          lineHeight: 1,
          textTransform: 'uppercase',
        }}>
          {title.split('').map((letter, i) => (
            <motion.span
              key={i}
              className="inline-block"
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              style={letter === ' ' ? { width: '0.3em' } : {}}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </h1>

        {/* Typing subtitle */}
        <motion.div
          className="mt-6 text-lg md:text-xl"
          style={{ color: '#888888', fontFamily: 'var(--font-space-grotesk)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <TypingText text={subtitle} speed={50} />
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <MagneticButton
            onClick={() => {
              document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="cta-glow px-8 py-4 rounded-xl font-bold text-base tracking-wider uppercase shimmer-effect"
            style={{
              fontFamily: 'var(--font-syne)',
              background: 'linear-gradient(135deg, #00ff9d 0%, #00d4ff 100%)',
              color: '#050508',
              border: 'none',
            }}
          >
            <span className="flex items-center gap-3 relative z-10">
              <Sparkles className="w-5 h-5" />
              Begin Your Journey
              <ArrowRight className="w-5 h-5" />
            </span>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 4, duration: 1 }}
      >
        <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: '#444444' }}>
          Scroll to explore
        </span>
        <ChevronDown className="w-5 h-5 scroll-indicator-anim" style={{ color: '#00ff9d' }} />
      </motion.div>
    </motion.section>
  )
}

// ═══════════════════════════════════════════════════
// TYPING TEXT COMPONENT
// ═══════════════════════════════════════════════════
function TypingText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setShowCursor(false), 2000)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span>
      {displayed}
      {showCursor && <span className="typing-cursor text-[#00ff9d]">|</span>}
    </span>
  )
}

// ═══════════════════════════════════════════════════
// MAGNETIC BUTTON COMPONENT
// ═══════════════════════════════════════════════════
function MagneticButton({
  children, className = '', style = {}, onClick,
}: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.25)
    y.set((e.clientY - cy) * 0.25)
  }, [x, y])

  const handleLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.button
      ref={ref}
      className={`magnetic-btn ${className}`}
      style={{ x: springX, y: springY, ...style }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}

// ═══════════════════════════════════════════════════
// SECTION 2: STORYTELLING NARRATIVE
// ═══════════════════════════════════════════════════
function StorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="story-section"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-4 py-32"
    >
      {/* Connecting line at top */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#00ff9d]/30 to-transparent"
        initial={{ height: 0 }}
        animate={isInView ? { height: 120 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      />

      <div className="max-w-2xl mx-auto text-center space-y-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
            style={{
              background: 'rgba(0, 255, 157, 0.08)',
              border: '1px solid rgba(0, 255, 157, 0.2)',
              color: '#00ff9d',
              fontFamily: 'var(--font-space-grotesk)',
            }}
          >
            <Volume2 className="w-3 h-3" />
            Chapter I — The Journey
          </span>
        </motion.div>

        {/* Story lines */}
        <div className="space-y-6">
          {STORY_LINES.map((line, i) => (
            <StoryLine key={i} line={line} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Transition arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 3.5, duration: 1 }}
          className="pt-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowRight className="w-5 h-5 mx-auto rotate-90" style={{ color: '#444444' }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function StoryLine({ line, index, isInView }: { line: typeof STORY_LINES[0]; index: number; isInView: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const lineInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-4 justify-center"
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, filter: 'blur(8px)' }}
      animate={isInView && lineInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
      transition={{
        duration: 1.2,
        delay: 0.3 + index * 0.6,
        ease: [0.215, 0.61, 0.355, 1],
      }}
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(0, 255, 157, 0.1)',
          border: '1px solid rgba(0, 255, 157, 0.2)',
          color: '#00ff9d',
        }}
      >
        {line.icon}
      </div>
      <p
        className="text-lg md:text-xl font-light tracking-wide"
        style={{
          fontFamily: 'var(--font-space-grotesk)',
          color: index === STORY_LINES.length - 1 ? '#ffffff' : '#aaaaaa',
          fontWeight: index === STORY_LINES.length - 1 ? 500 : 300,
        }}
      >
        {line.text}
      </p>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════
// SECTION 3: DIMENSION SELECTOR
// ═══════════════════════════════════════════════════
function DimensionSelector({
  selections,
  onSelect,
  onShuffle,
  isLoading,
}: {
  selections: { mood: string | null; genre: string | null; theme: string | null }
  onSelect: (type: 'mood' | 'genre' | 'theme', value: string) => void
  onShuffle: () => void
  isLoading: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const allSelected = selections.mood && selections.genre && selections.theme

  return (
    <section id="mixer-section" ref={sectionRef} className="relative min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
            style={{
              background: 'rgba(0, 212, 255, 0.08)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              color: '#00d4ff',
              fontFamily: 'var(--font-space-grotesk)',
            }}
          >
            <Compass className="w-3 h-3" />
            Chapter II — Configure Dimensions
          </span>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Shape Your <span className="bg-gradient-to-r from-[#00ff9d] to-[#00d4ff] bg-clip-text text-transparent">Sound</span>
          </h2>
          <p className="mt-4 text-[#888888] max-w-md mx-auto" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Select one from each dimension to craft your unique musical fingerprint
          </p>
        </motion.div>

        {/* Selection progress */}
        <motion.div
          className="flex justify-center gap-2 mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {(['mood', 'genre', 'theme'] as const).map((type) => (
            <div key={type} className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: selections[type] ? 'rgba(0,255,157,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selections[type] ? 'rgba(0,255,157,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  color: selections[type] ? '#00ff9d' : '#444444',
                }}
                animate={selections[type] ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {selections[type] ? <Check className="w-4 h-4" /> : (type === 'mood' ? '1' : type === 'genre' ? '2' : '3')}
              </motion.div>
              {type !== 'theme' && (
                <div
                  className="w-8 h-px mb-1"
                  style={{ background: selections[type] ? 'rgba(0,255,157,0.3)' : 'rgba(255,255,255,0.08)' }}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Three dimension cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <DimensionCard
            title="Mood"
            type="mood"
            items={MOODS}
            selected={selections.mood}
            onSelect={onSelect}
            isInView={isInView}
            index={0}
          />
          <DimensionCard
            title="Genre"
            type="genre"
            items={GENRES}
            selected={selections.genre}
            onSelect={onSelect}
            isInView={isInView}
            index={1}
          />
          <DimensionCard
            title="Theme"
            type="theme"
            items={THEMES}
            selected={selections.theme}
            onSelect={onSelect}
            isInView={isInView}
            index={2}
          />
        </div>

        {/* Validation hint */}
        <AnimatePresence>
          {!allSelected && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div
                className="flex items-center justify-center gap-2 text-sm"
                style={{ color: '#ff8080' }}
              >
                <Info className="w-4 h-4" />
                {`Select: ${!selections.mood ? 'Mood' : ''}${!selections.mood && !selections.genre ? ', ' : ''}${!selections.genre && selections.mood ? 'Genre' : ''}${!selections.genre && !selections.theme ? ', ' : ''}${!selections.theme ? 'Theme' : ''}`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <MagneticButton
            onClick={onShuffle}
            className="glow-pulse px-8 py-4 rounded-xl font-bold text-base tracking-wider uppercase shimmer-effect relative overflow-hidden"
            style={{
              fontFamily: 'var(--font-syne)',
              background: allSelected
                ? 'linear-gradient(135deg, #00ff9d 0%, #00d4ff 100%)'
                : 'rgba(255,255,255,0.05)',
              color: allSelected ? '#050508' : '#666666',
              border: allSelected ? 'none' : '1px solid rgba(255,255,255,0.1)',
              cursor: isLoading ? 'wait' : 'pointer',
            }}
          >
            <span className="flex items-center gap-3 relative z-10">
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                  Finding Your Sound...
                </>
              ) : (
                <>
                  <Shuffle className="w-5 h-5" />
                  Find My Track
                </>
              )}
            </span>
          </MagneticButton>

          <MagneticButton
            onClick={() => {
              const rM = MOODS[Math.floor(Math.random() * MOODS.length)]
              const rG = GENRES[Math.floor(Math.random() * GENRES.length)]
              const rT = THEMES[Math.floor(Math.random() * THEMES.length)]
              setTimeout(() => onSelect('mood', rM), 0)
              setTimeout(() => onSelect('genre', rG), 150)
              setTimeout(() => onSelect('theme', rT), 300)
              setTimeout(() => onShuffle(), 600)
            }}
            className="px-6 py-4 rounded-xl font-medium text-sm tracking-wide"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              background: 'transparent',
              color: '#888888',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4 }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              Surprise Me
            </span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════
// DIMENSION CARD
// ═══════════════════════════════════════════════════
function DimensionCard({
  title, type, items, selected, onSelect, isInView, index,
}: {
  title: string
  type: 'mood' | 'genre' | 'theme'
  items: string[]
  selected: string | null
  onSelect: (type: 'mood' | 'genre' | 'theme', value: string) => void
  isInView: boolean
  index: number
}) {
  const meta = CATEGORY_META[type]

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 relative overflow-hidden group"
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: 0.3 + index * 0.2,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
    >
      {/* Card accent line at top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${meta.color}40, transparent)` }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: `${meta.color}15`,
              border: `1px solid ${meta.color}30`,
              color: meta.color,
            }}
          >
            {meta.icon}
          </div>
          <div>
            <h3
              className="text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-space-grotesk)', color: '#ffffff' }}
            >
              {title}
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: '#666666' }}>
              {meta.description}
            </p>
          </div>
        </div>
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,255,157,0.15)', color: '#00ff9d' }}
            >
              <Check className="w-3.5 h-3.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <motion.button
            key={item}
            className="relative px-3 py-1.5 rounded-full text-xs font-medium tracking-wide cursor-pointer transition-all duration-200"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              background: selected === item ? 'rgba(0,255,157,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selected === item ? 'rgba(0,255,157,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: selected === item ? '#00ff9d' : '#aaaaaa',
            }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(type, item)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5 + index * 0.15 + i * 0.04, duration: 0.4 }}
          >
            {type === 'theme' && THEME_ICONS[item] && (
              <span className="mr-1 opacity-70 inline-flex">{THEME_ICONS[item]}</span>
            )}
            {item}
            {selected === item && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '1px solid rgba(0,255,157,0.3)' }}
                layoutId={`selected-${type}`}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════
// SECTION 4: RESULT
// ═══════════════════════════════════════════════════
function ResultSection({
  track,
  selections,
  isLoading,
  onFindAnother,
}: {
  track: TrackData | null
  selections: { mood: string | null; genre: string | null; theme: string | null }
  isLoading: boolean
  onFindAnother: () => void
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    if (!track?.url) return
    navigator.clipboard.writeText(track.url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      const ta = document.createElement('textarea')
      ta.value = track.url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [track])

  return (
    <section id="result-section" ref={sectionRef} className="relative min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-2xl mx-auto">
        {/* Section label */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={(track || isLoading) ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
            style={{
              background: 'rgba(255, 107, 107, 0.08)',
              border: '1px solid rgba(255, 107, 107, 0.2)',
              color: '#ff6b6b',
              fontFamily: 'var(--font-space-grotesk)',
            }}
          >
            <Music className="w-3 h-3" />
            Chapter III — Your Sound
          </span>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              {/* Skeleton thumbnail */}
              <div className="skeleton-shimmer h-48 md:h-56" />
              {/* Skeleton body */}
              <div className="p-8 space-y-4">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton-shimmer h-6 w-16 rounded-full" />
                  ))}
                </div>
                <div className="skeleton-shimmer h-7 w-3/4 mx-auto rounded-lg" />
                <div className="skeleton-shimmer h-5 w-1/2 mx-auto rounded-lg" />
                <div className="flex justify-center gap-4 mt-6">
                  <div className="skeleton-shimmer h-11 w-44 rounded-full" />
                  <div className="skeleton-shimmer h-11 w-24 rounded-full" />
                </div>
              </div>
            </motion.div>
          )}

          {!isLoading && track && (
            <motion.div
              key={track.title}
              initial={{
                opacity: 0,
                scale: 0.85,
                rotateY: -12,
                rotateX: 8,
                filter: 'blur(8px)',
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateY: 0,
                rotateX: 0,
                filter: 'blur(0px)',
              }}
              transition={{
                duration: 0.9,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="glass-card rounded-2xl overflow-hidden"
              style={{ perspective: '1000px' }}
            >
              {/* Thumbnail / Visual area */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#0a0a12] to-[#111118]">
                {track.thumb ? (
                  <img
                    src={track.thumb}
                    alt={track.title}
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Music className="w-16 h-16" style={{ color: '#222222' }} />
                    </motion.div>
                  </div>
                )}

                {/* Equalizer overlay at bottom of thumbnail */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0a0a12] to-transparent flex items-end justify-center gap-[2px] pb-2 px-4">
                  {Array.from({ length: 24 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="w-[2px] rounded-full"
                      style={{ background: '#00ff9d' }}
                      animate={{
                        height: [4, Math.random() * 20 + 4, 4],
                      }}
                      transition={{
                        duration: Math.random() * 0.8 + 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.03,
                      }}
                    />
                  ))}
                </div>

                {/* Play overlay button */}
                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center group/play"
                >
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(0,255,157,0.9)',
                      color: '#050508',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-7 h-7 ml-1" fill="currentColor" />
                  </motion.div>
                </a>
              </div>

              {/* Content */}
              <div className="p-8 text-center">
                {/* Tags */}
                <motion.div
                  className="flex justify-center gap-2 mb-6 flex-wrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {[
                    { label: selections.mood || 'Mood', color: '#ff6b6b' },
                    { label: selections.genre || 'Genre', color: '#00d4ff' },
                    { label: selections.theme || 'Theme', color: '#ffd93d' },
                  ].map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase"
                      style={{
                        background: `${tag.color}15`,
                        border: `1px solid ${tag.color}30`,
                        color: tag.color,
                        fontFamily: 'var(--font-space-grotesk)',
                      }}
                    >
                      {tag.label}
                    </span>
                  ))}
                </motion.div>

                {/* Title */}
                <motion.h2
                  className="text-2xl md:text-3xl font-bold tracking-tight mb-2"
                  style={{ fontFamily: 'var(--font-syne)' }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {track.title}
                </motion.h2>

                {/* Artist */}
                <motion.p
                  className="text-[#00ff9d] text-base mb-4"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {track.artist}
                </motion.p>

                {/* Meta */}
                {(track.viewCount > 0 || track.duration > 0) && (
                  <motion.div
                    className="flex items-center justify-center gap-4 mb-8 text-xs"
                    style={{ color: '#666666', fontFamily: 'var(--font-space-grotesk)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    {track.viewCount > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        {formatViews(track.viewCount)} views
                      </span>
                    )}
                    {track.viewCount > 0 && track.duration > 0 && (
                      <span className="w-1 h-1 rounded-full bg-[#333333]" />
                    )}
                    {track.duration > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(track.duration)}
                      </span>
                    )}
                  </motion.div>
                )}

                {/* Action buttons */}
                <motion.div
                  className="flex justify-center gap-3 flex-wrap"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm tracking-wide"
                    style={{
                      fontFamily: 'var(--font-syne)',
                      background: '#ffffff',
                      color: '#000000',
                    }}
                  >
                    <Play className="w-4 h-4" fill="currentColor" />
                    Play on YouTube
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <motion.button
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium"
                    style={{
                      fontFamily: 'var(--font-space-grotesk)',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: copied ? '#00ff9d' : '#888888',
                    }}
                    whileHover={{ scale: 1.03, borderColor: 'rgba(0,255,157,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCopy}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy Link'}
                  </motion.button>
                </motion.div>

                {/* Find another */}
                <motion.button
                  className="mt-6 text-xs tracking-wide cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    color: '#555555',
                    background: 'none',
                    border: 'none',
                  }}
                  whileHover={{ color: '#aaaaaa' }}
                  onClick={onFindAnother}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="flex items-center gap-1.5 mx-auto">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Find Another Track
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════
// SECTION 5: IMMERSIVE FOOTER
// ═══════════════════════════════════════════════════
function FooterSection() {
  return (
    <footer className="relative py-20 px-4 text-center">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,255,157,0.2)] to-transparent" />

      {/* Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,157,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <Music className="w-6 h-6" style={{ color: '#00ff9d' }} />
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            MUSIC MOSH
          </span>
        </div>

        <p
          className="text-sm max-w-sm mx-auto"
          style={{ color: '#555555', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Every sound tells a story. Discover yours through dimensions of mood, genre, and theme.
        </p>

        <div className="mt-6 flex items-center justify-center gap-1 text-[11px]" style={{ color: '#333333' }}>
          <span>Crafted with</span>
          <Heart className="w-3 h-3 inline" style={{ color: '#ff6b6b' }} fill="#ff6b6b" />
          <span>& sound waves</span>
        </div>
      </motion.div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════
// JOURNEY PROGRESS INDICATOR
// ═══════════════════════════════════════════════════
function JourneyProgress() {
  const { scrollYProgress } = useScroll()
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{
        scaleX: scaleY,
        background: 'linear-gradient(90deg, #00ff9d 0%, #00d4ff 50%, #ff6b6b 100%)',
      }}
    />
  )
}

// ═══════════════════════════════════════════════════
// FLOATING MUSIC NOTES (AMBIENT)
// ═══════════════════════════════════════════════════
function FloatingNotes() {
  const notes = useMemo(() => ['♪', '♫', '♬', '♩', '🎵', '🎶'], [])
  const elements = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      note: notes[Math.floor(Math.random() * notes.length)],
      left: Math.random() * 100,
      size: Math.random() * 14 + 10,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 15,
    })),
    [notes]
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="floating-note absolute bottom-[-20px]"
          style={{
            left: `${el.left}%`,
            fontSize: el.size,
            opacity: 0.15,
            animationDuration: `${el.duration}s`,
            animationDelay: `${el.delay}s`,
            color: Math.random() > 0.5 ? '#00ff9d' : '#00d4ff',
          }}
        >
          {el.note}
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════
export default function Home() {
  const [selections, setSelections] = useState<{
    mood: string | null
    genre: string | null
    theme: string | null
  }>({ mood: null, genre: null, theme: null })

  const [track, setTrack] = useState<TrackData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelect = useCallback((type: 'mood' | 'genre' | 'theme', value: string) => {
    setSelections(prev => ({ ...prev, [type]: value }))
  }, [])

  const handleShuffle = useCallback(async () => {
    if (!selections.mood || !selections.genre) return

    setIsLoading(true)
    setTrack(null)

    // Scroll to result section
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 200)

    try {
      const res = await fetch(
        `/api/track?mood=${encodeURIComponent(selections.mood)}&genre=${encodeURIComponent(selections.genre)}&theme=${encodeURIComponent(selections.theme || '')}`
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: TrackData = await res.json()
      setTrack(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setTrack({
        id: null,
        title: 'Could not find a track',
        artist: 'Please try again',
        thumb: '',
        url: '#',
        viewCount: 0,
        duration: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }, [selections])

  const handleFindAnother = useCallback(() => {
    if (selections.mood && selections.genre) {
      handleShuffle()
    }
  }, [selections, handleShuffle])

  return (
    <main className="relative min-h-screen">
      {/* Ambient layers */}
      <AmbientOrbs />
      <FloatingParticles count={25} />
      <FloatingNotes />
      <CursorGlow />

      {/* Journey progress bar */}
      <JourneyProgress />

      {/* Sections */}
      <HeroSection />
      <StorySection />
      <DimensionSelector
        selections={selections}
        onSelect={handleSelect}
        onShuffle={handleShuffle}
        isLoading={isLoading}
      />
      <ResultSection
        track={track}
        selections={selections}
        isLoading={isLoading}
        onFindAnother={handleFindAnother}
      />
      <FooterSection />
    </main>
  )
}
