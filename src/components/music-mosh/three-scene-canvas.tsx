'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import * as THREE from 'three'

interface VisualConfig {
    colors: {
        primary: THREE.Color
        secondary: THREE.Color
        bg: THREE.Color
    }
    moodSpeed: number
    bloom: number
    pSize: number
    pCount: number
    geoType: string
    motion: string
    visualWorld: string
    mood: string
    genre: string
    theme: string
}

interface ThreeSceneProps {
    visualConfig: VisualConfig | null
    onReady?: (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => void
}

const MOODS = ['Energetic', 'Melancholic', 'Focused', 'Nostalgic', 'Dreamy', 'Aggressive', 'Chill', 'Romantic']
const GENRES = ['Hip-Hop', 'Lo-Fi', 'Synthwave', 'Drum & Bass', 'Ambient', 'Rock', 'Jazz', 'Electronic', 'Classical', 'Trap']
const THEMES = ['Mathematics', 'Literature', 'Science', 'Philosophy', 'Conspiracy Theories', 'Niche Interests']

function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i) | 0
    }
    return Math.abs(hash)
}

function seededRandom(seed: number): number {
    let x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

function detectGPUTier(): 'low' | 'medium' | 'high' {
    if (typeof window === 'undefined') return 'high'
    try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        if (!gl) return 'low'
        const dbg = gl.getExtension('WEBGL_debug_renderer_info')
        const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)
        if (isMobile || /intel|mali/i.test(renderer)) return 'low'
        if (/adreno|powervr/i.test(renderer)) return 'medium'
        return 'high'
    } catch {
        return 'low'
    }
}

function createParticleTexture(shape: string, colorHex: string): THREE.CanvasTexture {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = colorHex
    ctx.translate(size / 2, size / 2)
    
    if (shape === 'star') {
        let spikes = 5, outer = size * 0.4, inner = size * 0.15, rot = Math.PI / 2 * 3, step = Math.PI / spikes
        ctx.beginPath()
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(Math.cos(rot) * outer, Math.sin(rot) * outer)
            rot += step
            ctx.lineTo(Math.cos(rot) * inner, Math.sin(rot) * inner)
            rot += step
        }
        ctx.closePath()
        ctx.fill()
    } else if (shape === 'diamond') {
        ctx.beginPath()
        ctx.moveTo(0, -size * 0.4)
        ctx.lineTo(size * 0.4, 0)
        ctx.lineTo(0, size * 0.4)
        ctx.lineTo(-size * 0.4, 0)
        ctx.closePath()
        ctx.fill()
    } else {
        ctx.beginPath()
        ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2)
        ctx.fill()
    }
    
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
}

export function generateVisualConfig(mood?: string, genre?: string, theme?: string): VisualConfig {
    const rM = mood || MOODS[Math.floor(Math.random() * MOODS.length)]
    const rG = genre || GENRES[Math.floor(Math.random() * GENRES.length)]
    const rT = theme || THEMES[Math.floor(Math.random() * THEMES.length)]
    const seed = hashString(`${rM}|${rG}|${rT}|${Date.now()}`)
    const rand = (n: number) => seededRandom(seed + n)
    
    const hue1 = rand(1)
    const hue2 = (hue1 + 0.2 + rand(2) * 0.4) % 1
    const sat = 0.7 + rand(3) * 0.3
    const lig = 0.5 + rand(4) * 0.3
    
    const speedMap: Record<string, number> = { 
        Energetic: 1.8, Aggressive: 2.0, Dreamy: 0.6, Chill: 0.5, 
        Melancholic: 0.7, Focused: 1.0, Nostalgic: 0.8, Romantic: 0.9 
    }
    const moodSpeed = speedMap[rM] || 1.0
    let bloom = rM === 'Energetic' ? 1.5 : (rM === 'Chill' ? 0.6 : 1.0)
    
    let pCount = Math.floor(8000 + rand(6) * 12000)
    let pSize = 0.12 + rand(5) * 0.1
    
    const gpuTier = detectGPUTier()
    if (gpuTier === 'low') {
        bloom *= 0.4
        pCount = Math.floor(pCount * 0.2)
        pSize *= 0.8
    } else if (gpuTier === 'medium') {
        pCount = Math.floor(pCount * 0.5)
    }
    
    const genreMap: Record<string, [string, string]> = {
        'Hip-Hop': ['box', 'bounce'],
        'Lo-Fi': ['sphere', 'drift'],
        'Synthwave': ['torusKnot', 'rotate'],
        'Drum & Bass': ['icosahedron', 'pulse'],
        'Ambient': ['sphere', 'float'],
        'Rock': ['dodecahedron', 'shake'],
        'Jazz': ['torus', 'sway'],
        'Electronic': ['torusKnot', 'wave'],
        'Classical': ['sphere', 'orbit'],
        'Trap': ['box', 'spiral']
    }
    
    let [geoType, motion] = genreMap[rG] || ['sphere', 'random']
    let fSeed = rand(100)
    if (rT === 'Mathematics') fSeed = (fSeed + 0.2) % 1
    if (rT === 'Literature') fSeed = (fSeed + 0.5) % 1
    if (rT === 'Science') fSeed = (fSeed + 0.8) % 1
    
    return {
        colors: {
            primary: new THREE.Color().setHSL(hue1, sat, lig),
            secondary: new THREE.Color().setHSL(hue2, sat, lig * 0.8),
            bg: new THREE.Color().setHSL(hue1, sat * 0.5, 0.05)
        },
        moodSpeed,
        bloom,
        pSize,
        pCount,
        geoType,
        motion,
        visualWorld: rT,
        mood: rM,
        genre: rG,
        theme: rT
    }
}

// Vertex shader
const vertexShader = `
    uniform float uTime;
    uniform vec3 uColorA;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
        vUv = uv;
        vNormal = normal;
        vec3 newPos = position;
        float distortion = sin(newPos.x * 2.0 + uTime) * cos(newPos.y * 2.0 + uTime) * 0.2;
        newPos += normal * distortion;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
`

// Fragment shader
const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        vec3 color = mix(uColorA, uColorB, sin(uTime * 0.5) * 0.5 + 0.5);
        color += fresnel * 0.5;
        gl_FragColor = vec4(color, 0.9);
    }
`

export default function ThreeSceneCanvas({ visualConfig, onReady }: ThreeSceneProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sceneRef = useRef<{
        scene: THREE.Scene
        camera: THREE.PerspectiveCamera
        renderer: THREE.WebGLRenderer
        composer: any
        coreMesh: THREE.Mesh
        particleGroup: THREE.Group
        mainLight: THREE.PointLight
        shaderMat: THREE.Material
    } | null>(null)
    const animFrameRef = useRef<number>(0)
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    const buildScene = useCallback((config: VisualConfig) => {
        if (!canvasRef.current) return
        
        try {
            const canvas = canvasRef.current
            const width = window.innerWidth
            const height = window.innerHeight
            
            // Scene
            const scene = new THREE.Scene()
            scene.background = config.colors.bg
            scene.fog = new THREE.FogExp2(config.colors.bg, 0.02)
            
            // Camera
            const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
            camera.position.set(0, 2, 25)
            
            // Renderer
            const renderer = new THREE.WebGLRenderer({ 
                canvas, 
                alpha: false, 
                antialias: true,
                powerPreference: 'high-performance'
            })
            renderer.setSize(width, height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            renderer.toneMapping = THREE.ReinhardToneMapping
            
            // Core geometry
            let geometry: THREE.BufferGeometry
            const size = 1.5
            switch (config.geoType) {
                case 'box':
                    geometry = new THREE.BoxGeometry(size * 1.5, size * 1.5, size * 1.5)
                    break
                case 'sphere':
                    geometry = new THREE.SphereGeometry(size, 64, 64)
                    break
                case 'torusKnot':
                    geometry = new THREE.TorusKnotGeometry(size * 0.8, 0.3, 200, 32)
                    break
                case 'icosahedron':
                    geometry = new THREE.IcosahedronGeometry(size, 1)
                    break
                case 'dodecahedron':
                    geometry = new THREE.DodecahedronGeometry(size)
                    break
                case 'torus':
                    geometry = new THREE.TorusGeometry(size, 0.4, 64, 200)
                    break
                default:
                    geometry = new THREE.SphereGeometry(size, 32, 32)
            }
            
            // Shader material
            let shaderMat: THREE.Material
            if (config.visualWorld === 'Mathematics' && detectGPUTier() === 'low') {
                shaderMat = new THREE.MeshBasicMaterial({ 
                    color: config.colors.primary, 
                    wireframe: true 
                })
            } else {
                shaderMat = new THREE.ShaderMaterial({
                    uniforms: {
                        uTime: { value: 0 },
                        uColorA: { value: config.colors.primary },
                        uColorB: { value: config.colors.secondary }
                    },
                    vertexShader,
                    fragmentShader,
                    transparent: true,
                    wireframe: config.visualWorld === 'Mathematics'
                })
            }
            
            const coreMesh = new THREE.Mesh(geometry, shaderMat)
            scene.add(coreMesh)
            
            // Particles
            const shapes = ['circle', 'star', 'diamond']
            const particleGroup = new THREE.Group()
            const colorHex = `#${config.colors.secondary.getHexString()}`
            const perShape = Math.floor(config.pCount / shapes.length)
            
            shapes.forEach((shape) => {
                const texture = createParticleTexture(shape, colorHex)
                const material = new THREE.PointsMaterial({
                    color: config.colors.secondary,
                    size: config.pSize,
                    map: texture,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                })
                
                const positions = new Float32Array(perShape * 3)
                for (let i = 0; i < perShape; i++) {
                    let x: number, y: number, z: number
                    if (config.motion === 'spiral') {
                        const angle = Math.random() * Math.PI * 2
                        const r = 4 + Math.random() * 6
                        x = Math.cos(angle) * r
                        z = Math.sin(angle) * r
                        y = (Math.random() - 0.5) * 5
                    } else if (config.motion === 'orbit') {
                        const angle = Math.random() * Math.PI * 2
                        const r = 3 + Math.random() * 3
                        x = Math.cos(angle) * r
                        z = Math.sin(angle) * r
                        y = Math.sin(angle * 2) * 2
                    } else {
                        x = (Math.random() - 0.5) * 40
                        y = (Math.random() - 0.5) * 30
                        z = (Math.random() - 0.5) * 40 - 10
                    }
                    positions[i * 3] = x
                    positions[i * 3 + 1] = y
                    positions[i * 3 + 2] = z
                }
                
                const geo = new THREE.BufferGeometry()
                geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
                particleGroup.add(new THREE.Points(geo, material))
            })
            scene.add(particleGroup)
            
            // Theme-specific visuals
            if (config.visualWorld === 'Mathematics') {
                const grid = new THREE.GridHelper(25, 30, config.colors.secondary, 0x444444)
                grid.position.y = -2.5
                scene.add(grid)
            }
            
            if (config.visualWorld === 'Literature') {
                const cvs = document.createElement('canvas')
                cvs.width = 512
                cvs.height = 512
                const ctx = cvs.getContext('2d')!
                ctx.fillStyle = '#f5f0e6'
                ctx.fillRect(0, 0, 512, 512)
                for (let i = 0; i < 1000; i++) {
                    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`
                    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2)
                }
                const plane = new THREE.Mesh(
                    new THREE.PlaneGeometry(15, 12),
                    new THREE.MeshStandardMaterial({ 
                        map: new THREE.CanvasTexture(cvs), 
                        side: THREE.DoubleSide 
                    })
                )
                plane.position.z = -6
                scene.add(plane)
            }
            
            // Lighting
            const amb = new THREE.AmbientLight(0x222222)
            scene.add(amb)
            const main = new THREE.PointLight(config.colors.secondary, 1.2, 50)
            main.position.set(3, 5, 5)
            scene.add(main)
            const fill = new THREE.PointLight(config.colors.primary, 0.8)
            fill.position.set(-3, 2, 4)
            scene.add(fill)
            
            // Post-processing - lazy load to reduce bundle
            import('three/examples/jsm/postprocessing/EffectComposer').then(({ EffectComposer }) => {
                import('three/examples/jsm/postprocessing/RenderPass').then(({ RenderPass }) => {
                    import('three/examples/jsm/postprocessing/UnrealBloomPass').then(({ UnrealBloomPass }) => {
                        const renderScene = new RenderPass(scene, camera)
                        const bloomPass = new UnrealBloomPass(
                            new THREE.Vector2(width, height),
                            config.bloom,
                            0.3,
                            0.85
                        )
                        const composer = new EffectComposer(renderer)
                        composer.addPass(renderScene)
                        composer.addPass(bloomPass)
                        
                        sceneRef.current = {
                            scene,
                            camera,
                            renderer,
                            composer,
                            coreMesh,
                            particleGroup,
                            mainLight: main,
                            shaderMat
                        }
                        
                        if (onReady) {
                            onReady(renderer, scene, camera)
                        }
                        setIsLoaded(true)
                    })
                })
            }).catch(() => {
                // Post-processing failed, continue without it
                sceneRef.current = {
                    scene,
                    camera,
                    renderer,
                    composer: null,
                    coreMesh,
                    particleGroup,
                    mainLight: main,
                    shaderMat
                }
                if (onReady) {
                    onReady(renderer, scene, camera)
                }
                setIsLoaded(true)
            })
        } catch (error) {
            console.error('Failed to build Three.js scene:', error)
            setHasError(true)
        }
    }, [onReady])

    // Animation loop
    useEffect(() => {
        if (!sceneRef.current) return
        
        const { scene, camera, renderer, composer, coreMesh, particleGroup, shaderMat } = sceneRef.current
        let time = 0
        
        const animate = () => {
            animFrameRef.current = requestAnimationFrame(animate)
            const delta = 0.016
            time += delta * (visualConfig?.moodSpeed || 1.0)
            
            if (coreMesh) {
                coreMesh.rotation.x += delta * 0.2
                coreMesh.rotation.y += delta * 0.3
                if (shaderMat && 'uniforms' in shaderMat) {
                    (shaderMat as any).uniforms.uTime = { value: time }
                }
            }
            
            if (particleGroup) {
                particleGroup.rotation.y += delta * 0.05
                particleGroup.children.forEach((ps: any) => {
                    const positions = ps.geometry.attributes.position.array as Float32Array
                    for (let j = 0; j < positions.length; j += 3) {
                        if (visualConfig?.motion === 'spiral') {
                            const angle = delta * 0.5
                            const x = positions[j]
                            const z = positions[j + 2]
                            positions[j] = x * Math.cos(angle) - z * Math.sin(angle)
                            positions[j + 2] = x * Math.sin(angle) + z * Math.cos(angle)
                        } else if (visualConfig?.motion === 'orbit') {
                            positions[j + 1] += Math.sin(time + j) * 0.01
                        } else {
                            positions[j + 1] += delta * 0.5
                            if (positions[j + 1] > 15) positions[j + 1] = -15
                        }
                    }
                    ps.geometry.attributes.position.needsUpdate = true
                })
            }
            
            if (composer) {
                composer.render()
            } else {
                renderer.render(scene, camera)
            }
        }
        
        animate()
        
        return () => {
            cancelAnimationFrame(animFrameRef.current)
        }
    }, [visualConfig])

    // Build/rebuild scene when config changes
    useEffect(() => {
        if (!visualConfig) return
        
        // Cleanup old scene
        if (sceneRef.current) {
            const { scene, renderer } = sceneRef.current
            scene.children.forEach(c => {
                if ((c as THREE.Mesh).geometry) (c as THREE.Mesh).geometry.dispose()
                if ((c as THREE.Mesh).material) {
                    const mat = (c as THREE.Mesh).material as THREE.Material
                    if (Array.isArray(mat)) mat.forEach(m => m.dispose())
                    else mat.dispose()
                }
            })
            renderer.dispose()
            sceneRef.current = null
        }
        
        setIsLoaded(false)
        buildScene(visualConfig)
    }, [visualConfig, buildScene])

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (!sceneRef.current) return
            const { camera, renderer, composer } = sceneRef.current
            const width = window.innerWidth
            const height = window.innerHeight
            
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height)
            if (composer) {
                composer.setSize(width, height)
            }
        }
        
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Show fallback if error
    if (hasError) {
        return null
    }

    return (
        <canvas
            ref={canvasRef}
            id="three-scene-canvas"
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ 
                zIndex: 0,
                opacity: isLoaded ? 0.5 : 0,
                transition: 'opacity 0.5s ease-in-out'
            }}
        />
    )
}
