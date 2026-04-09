// ═══════════════════════════════════════════════════
//  MUSIC MOSH MAX — Clean UI/UX Logic
// ═══════════════════════════════════════════════════

// --- CONFIGURATION & STATE ---
const MOODS = ['Energetic', 'Melancholic', 'Focused', 'Nostalgic', 'Dreamy', 'Aggressive', 'Chill', 'Romantic'];
const GENRES = ['Hip-Hop', 'Lo-Fi', 'Synthwave', 'Drum & Bass', 'Ambient', 'Rock', 'Jazz', 'Electronic', 'Classical', 'Trap'];
const THEMES = ['Mathematics', 'Literature', 'Science', 'Philosophy', 'Conspiracy Theories', 'Niche Interests'];

const DISPLAY_FONTS = [
    "'Syne', sans-serif", "'Abril Fatface', cursive", "'Orbitron', sans-serif",
    "'Syncopate', sans-serif", "'Bebas Neue', sans-serif", "'Playfair Display', serif",
    "'Cinzel', serif", "'Monoton', cursive", "'Raleway', sans-serif", "'Space Mono', monospace"
];
const BODY_FONTS = [
    "'Space Grotesk', sans-serif", "'Inter', sans-serif", "'JetBrains Mono', monospace",
    "'Lato', sans-serif", "'Merriweather', serif", "'Roboto', sans-serif",
    "'Fira Code', monospace", "'Poppins', sans-serif", "'Cormorant Garamond', serif"
];

let state = {
    mood: null, genre: null, theme: null,
    scene: null, camera: null, renderer: null, composer: null,
    coreMesh: null, shaderMat: null, particleGroup: null, mainLight: null,
    mouseX: 0, mouseY: 0, visualConfig: null, renderPass: null,
    chaosMode: false, chaosInterval: null, gpuTier: 'high',
    clock: new THREE.Clock(), isHovering: false,
    currentTrackUrl: null
};

// --- UTILS ---
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i) | 0;
    return Math.abs(hash);
}
function seededRandom(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }

function formatViews(n) {
    if (!n || n < 0) return '—';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toString();
}
function formatDuration(secs) {
    if (!secs || secs <= 0) return '—';
    const m = Math.floor(secs / 60);
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
}

function detectGPUTier() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) return 'low';
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile || /intel|mali/i.test(renderer)) return 'low';
    if (/adreno|powervr/i.test(renderer)) return 'medium';
    return 'high';
}

// --- TEXTURE GENERATOR ---
function createParticleTexture(shape, colorHex) {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = colorHex;
    ctx.translate(size / 2, size / 2);
    if (shape === 'star') {
        let spikes = 5, outer = size * 0.4, inner = size * 0.15, rot = Math.PI / 2 * 3, step = Math.PI / spikes;
        ctx.beginPath();
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(Math.cos(rot) * outer, Math.sin(rot) * outer); rot += step;
            ctx.lineTo(Math.cos(rot) * inner, Math.sin(rot) * inner); rot += step;
        }
        ctx.closePath(); ctx.fill();
    } else if (shape === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.4); ctx.lineTo(size * 0.4, 0);
        ctx.lineTo(0, size * 0.4); ctx.lineTo(-size * 0.4, 0);
        ctx.closePath(); ctx.fill();
    } else {
        ctx.beginPath(); ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2); ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
}

// --- VISUAL CONFIG GENERATOR ---
function generateRandomVisualConfig() {
    const rM = MOODS[Math.floor(Math.random() * MOODS.length)];
    const rG = GENRES[Math.floor(Math.random() * GENRES.length)];
    const rT = THEMES[Math.floor(Math.random() * THEMES.length)];
    const seed = hashString(`${rM}|${rG}|${rT}|${Date.now()}`);
    const rand = (n) => seededRandom(seed + n);
    const hue1 = rand(1), hue2 = (hue1 + 0.2 + rand(2) * 0.4) % 1;
    const sat = 0.7 + rand(3) * 0.3, lig = 0.5 + rand(4) * 0.3;
    const speedMap = { Energetic: 1.8, Aggressive: 2.0, Dreamy: 0.6, Chill: 0.5, Melancholic: 0.7, Focused: 1.0, Nostalgic: 0.8, Romantic: 0.9 };
    const moodSpeed = speedMap[rM] || 1.0;
    let bloom = rM === 'Energetic' ? 1.5 : (rM === 'Chill' ? 0.6 : 1.0);
    let pCount = Math.floor(8000 + rand(6) * 12000), pSize = 0.12 + rand(5) * 0.1;
    if (state.gpuTier === 'low') { bloom *= 0.4; pCount = Math.floor(pCount * 0.2); pSize *= 0.8; }
    else if (state.gpuTier === 'medium') { pCount = Math.floor(pCount * 0.5); }
    const genreMap = {
        'Hip-Hop': ['box', 'bounce'], 'Lo-Fi': ['sphere', 'drift'], 'Synthwave': ['torusKnot', 'rotate'],
        'Drum & Bass': ['icosahedron', 'pulse'], 'Ambient': ['sphere', 'float'], 'Rock': ['dodecahedron', 'shake'],
        'Jazz': ['torus', 'sway'], 'Electronic': ['torusKnot', 'wave'], 'Classical': ['sphere', 'orbit'], 'Trap': ['box', 'spiral']
    };
    let [geoType, motion] = genreMap[rG] || ['sphere', 'random'];
    let fSeed = rand(100);
    if (rT === 'Mathematics') fSeed = (fSeed + 0.2) % 1;
    if (rT === 'Literature') fSeed = (fSeed + 0.5) % 1;
    if (rT === 'Science') fSeed = (fSeed + 0.8) % 1;
    return {
        colors: {
            primary: new THREE.Color().setHSL(hue1, sat, lig),
            secondary: new THREE.Color().setHSL(hue2, sat, lig * 0.8),
            bg: new THREE.Color().setHSL(hue1, sat * 0.5, 0.05)
        },
        moodSpeed, bloom, pSize, pCount, geoType, motion, visualWorld: rT,
        fonts: {
            display: DISPLAY_FONTS[Math.floor(fSeed * DISPLAY_FONTS.length)],
            body: BODY_FONTS[Math.floor(rand(101) * BODY_FONTS.length)]
        },
        mood: rM, genre: rG, theme: rT
    };
}

// --- SCENE BUILDER ---
function buildSceneFromConfig(config) {
    const scene = new THREE.Scene();
    scene.background = config.colors.bg;
    scene.fog = new THREE.FogExp2(config.colors.bg, 0.02);
    let geometry;
    const size = 1.5;
    switch (config.geoType) {
        case 'box': geometry = new THREE.BoxGeometry(size * 1.5, size * 1.5, size * 1.5); break;
        case 'sphere': geometry = new THREE.SphereGeometry(size, 64, 64); break;
        case 'torusKnot': geometry = new THREE.TorusKnotGeometry(size * 0.8, 0.3, 200, 32); break;
        case 'icosahedron': geometry = new THREE.IcosahedronGeometry(size, 1); break;
        case 'dodecahedron': geometry = new THREE.DodecahedronGeometry(size); break;
        case 'torus': geometry = new THREE.TorusGeometry(size, 0.4, 64, 200); break;
        default: geometry = new THREE.SphereGeometry(size, 32, 32);
    }
    const vertexShader = `
    uniform float uTime; uniform vec3 uColorA;
    varying vec2 vUv; varying vec3 vNormal;
    void main() {
      vUv = uv; vNormal = normal;
      vec3 newPos = position;
      float distortion = sin(newPos.x * 2.0 + uTime) * cos(newPos.y * 2.0 + uTime) * 0.2;
      newPos += normal * distortion;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }`;
    const fragmentShader = `
    uniform float uTime; uniform vec3 uColorA; uniform vec3 uColorB;
    varying vec2 vUv; varying vec3 vNormal;
    void main() {
      float fresnel = pow(1.0 - dot(vNormal, vec3(0,0,1)), 2.0);
      vec3 color = mix(uColorA, uColorB, sin(uTime * 0.5) * 0.5 + 0.5);
      color += fresnel * 0.5;
      gl_FragColor = vec4(color, 0.9);
    }`;
    let shaderMat;
    if (config.visualWorld === 'Mathematics' && state.gpuTier === 'low') {
        shaderMat = new THREE.MeshBasicMaterial({ color: config.colors.primary, wireframe: true });
    } else {
        shaderMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, uColorA: { value: config.colors.primary }, uColorB: { value: config.colors.secondary } },
            vertexShader, fragmentShader, transparent: true, wireframe: (config.visualWorld === 'Mathematics')
        });
    }
    const coreMesh = new THREE.Mesh(geometry, shaderMat);
    scene.add(coreMesh);
    const shapes = ['circle', 'star', 'diamond'];
    const particleGroup = new THREE.Group();
    const colorHex = `#${config.colors.secondary.getHexString()}`;
    const perShape = Math.floor(config.pCount / shapes.length);
    shapes.forEach((shape) => {
        const texture = createParticleTexture(shape, colorHex);
        const material = new THREE.PointsMaterial({
            color: config.colors.secondary, size: config.pSize, map: texture,
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
        });
        const positions = new Float32Array(perShape * 3);
        for (let i = 0; i < perShape; i++) {
            let x, y, z;
            if (config.motion === 'spiral') {
                const angle = Math.random() * Math.PI * 2, r = 4 + Math.random() * 6;
                x = Math.cos(angle) * r; z = Math.sin(angle) * r; y = (Math.random() - 0.5) * 5;
            } else if (config.motion === 'orbit') {
                const angle = Math.random() * Math.PI * 2, r = 3 + Math.random() * 3;
                x = Math.cos(angle) * r; z = Math.sin(angle) * r; y = Math.sin(angle * 2) * 2;
            } else {
                x = (Math.random() - 0.5) * 40; y = (Math.random() - 0.5) * 30; z = (Math.random() - 0.5) * 40 - 10;
            }
            positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGroup.add(new THREE.Points(geo, material));
    });
    scene.add(particleGroup);
    if (config.visualWorld === 'Mathematics') {
        const grid = new THREE.GridHelper(25, 30, config.colors.secondary, 0x444444);
        grid.position.y = -2.5; scene.add(grid);
    }
    if (config.visualWorld === 'Literature') {
        const cvs = document.createElement('canvas');
        cvs.width = 512; cvs.height = 512;
        const ctx = cvs.getContext('2d');
        ctx.fillStyle = '#f5f0e6'; ctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 1000; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
        }
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(15, 12),
            new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(cvs), side: THREE.DoubleSide })
        );
        plane.position.z = -6; scene.add(plane);
    }
    const amb = new THREE.AmbientLight(0x222222); scene.add(amb);
    const main = new THREE.PointLight(config.colors.secondary, 1.2, 50); main.position.set(3, 5, 5); scene.add(main);
    const fill = new THREE.PointLight(config.colors.primary, 0.8); fill.position.set(-3, 2, 4); scene.add(fill);
    return { scene, coreMesh, shaderMat, particleGroup, mainLight: main };
}

// --- APPLY VISUALS ---
function applyFixedVisualSmooth(config) {
    if (state.coreMesh && state.coreMesh.material) {
        gsap.to(state.coreMesh.material, {
            opacity: 0, duration: 0.3,
            onComplete: () => { applyFixedVisual(config); gsap.to(state.coreMesh.material, { opacity: 1, duration: 0.3 }); }
        });
    } else { applyFixedVisual(config); }
}
function applyFixedVisual(config) {
    const root = document.documentElement;
    root.style.setProperty('--font-display', config.fonts.display);
    root.style.setProperty('--font-body', config.fonts.body);
    root.style.setProperty('--bg-color', `#${config.colors.bg.getHexString()}`);
    root.style.setProperty('--color-primary', `#${config.colors.primary.getHexString()}`);
    root.style.setProperty('--color-secondary', `#${config.colors.secondary.getHexString()}`);
    const badge = document.getElementById('current-style');
    if (badge) badge.textContent = `${config.visualWorld.toUpperCase()} · ${config.mood}/${config.genre}`;
    const { scene, coreMesh, shaderMat, particleGroup, mainLight } = buildSceneFromConfig(config);
    if (state.scene) {
        state.scene.children.forEach(c => {
            if (c.isMesh || c.isPoints) {
                if (c.geometry) c.geometry.dispose();
                if (c.material) c.material.dispose();
            }
        });
    }
    state.scene = scene; state.coreMesh = coreMesh; state.shaderMat = shaderMat;
    state.particleGroup = particleGroup; state.mainLight = mainLight; state.visualConfig = config;
    if (state.composer) {
        const bloom = state.composer.passes.find(p => p instanceof THREE.UnrealBloomPass);
        if (bloom) bloom.strength = config.bloom;
    }
}

// --- THREE.JS CORE INIT ---
function initThreeJSCore() {
    const canvas = document.getElementById('art-canvas');
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 25);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    const renderScene = new THREE.RenderPass(new THREE.Scene(), camera);
    const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.3, 0.85);
    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene); composer.addPass(bloomPass);
    state.camera = camera; state.renderer = renderer;
    state.composer = composer; state.renderPass = renderScene;
}

// --- ADAPTIVE VISUALS FROM SONG DATA ---
function applySongAdaptiveVisuals(data) {
    if (!state.mainLight) return;
    const intensity = Math.min(1.5, (data.viewCount || 50000) / 500000);
    gsap.to(state.mainLight, { intensity: 0.8 + intensity * 0.7, duration: 1 });
    if (state.particleGroup) {
        state.particleGroup.children.forEach(ps => {
            gsap.to(ps.material, { size: 0.12 + intensity * 0.08, duration: 1 });
        });
    }
    const line = document.getElementById('vis-line-anim');
    if (line && data.title) {
        const speed = 0.5 + ((hashString(data.title) % 100) / 100);
        line.style.animationDuration = `${speed}s`;
    }
}

// --- MICRO INTERACTIONS ---
function initMicroInteractions() {
    document.querySelectorAll('.option-chip').forEach(chip => {
        chip.addEventListener('mouseenter', () => {
            if (state.particleGroup) gsap.to(state.particleGroup.rotation, { duration: 0.3, y: state.particleGroup.rotation.y + 0.1 });
        });
    });
    const btn = document.getElementById('shuffle-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            if (state.coreMesh) gsap.to(state.coreMesh.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
        });
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3 });
        });
        btn.addEventListener('mouseleave', () => { gsap.to(btn, { x: 0, y: 0, duration: 0.3 }); });
    }
}

function initEasterEggs() {
    window.addEventListener('keydown', (e) => {
        if ((e.key === 'm' || e.key === 'M') && state.theme === 'Mathematics' && state.scene) {
            const pts = [];
            for (let x = -3; x <= 3; x += 0.2) for (let z = -3; z <= 3; z += 0.2)
                pts.push(new THREE.Vector3(x, Math.sin(x) * Math.cos(z), z));
            const graph = new THREE.Points(
                new THREE.BufferGeometry().setFromPoints(pts),
                new THREE.PointsMaterial({ color: 0xff00ff, size: 0.1 })
            );
            graph.position.y = 2; state.scene.add(graph);
            gsap.to(graph.position, { y: 0, duration: 1, yoyo: true, repeat: 1, onComplete: () => state.scene.remove(graph) });
        }
    });
}

// --- CHAOS MODE ---
function toggleChaosMode() {
    state.chaosMode = !state.chaosMode;
    const btn = document.getElementById('chaos-toggle');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(state.chaosMode));
    if (state.chaosMode) {
        document.body.classList.add('chaos-active');
        state.chaosInterval = setInterval(() => { applyFixedVisualSmooth(generateRandomVisualConfig()); }, 8000);
    } else {
        document.body.classList.remove('chaos-active');
        if (state.chaosInterval) { clearInterval(state.chaosInterval); state.chaosInterval = null; }
    }
}

// --- TOOLTIP ---
function initTooltips() {
    const tt = document.getElementById('tooltip');
    if (!tt) return;
    document.querySelectorAll('.info-icon').forEach(icon => {
        icon.addEventListener('mouseenter', (e) => {
            const tip = e.currentTarget.getAttribute('data-tip');
            if (!tip) return;
            tt.textContent = tip;
            tt.setAttribute('aria-hidden', 'false');
            const rect = e.currentTarget.getBoundingClientRect();
            const ttW = 260;
            let left = rect.left + rect.width / 2 - ttW / 2;
            left = Math.max(12, Math.min(left, window.innerWidth - ttW - 12));
            tt.style.left = left + 'px';
            tt.style.top = (rect.top - 10 + window.scrollY) + 'px';
            tt.style.width = ttW + 'px';
            tt.classList.add('visible');
        });
        icon.addEventListener('mouseleave', () => {
            tt.classList.remove('visible');
            tt.setAttribute('aria-hidden', 'true');
        });
        icon.addEventListener('focus', (e) => e.currentTarget.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true })));
        icon.addEventListener('blur', () => tt.classList.remove('visible'));
    });
}

// --- COPY BUTTON ---
function initCopyButton() {
    const btn = document.getElementById('copy-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const url = state.currentTrackUrl;
        if (!url) return;
        navigator.clipboard.writeText(url).then(() => {
            btn.classList.add('copied');
            btn.setAttribute('aria-label', 'Link copied!');
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.setAttribute('aria-label', 'Copy track link to clipboard');
            }, 2000);
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
            document.body.appendChild(ta); ta.select();
            document.execCommand('copy'); document.body.removeChild(ta);
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 2000);
        });
    });
}

// --- FIND ANOTHER ---
function initFindAnother() {
    const btn = document.getElementById('find-another-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        if (state.mood && state.genre && state.theme) { handleShuffle(); }
    });
}


// --- MAIN UI INIT ---
function initUI() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const moodDiv = document.getElementById('mood-options');
    const genreDiv = document.getElementById('genre-options');
    const themeDiv = document.getElementById('theme-options');

    MOODS.forEach(m => createChip(m, moodDiv, 'mood'));
    GENRES.forEach(g => createChip(g, genreDiv, 'genre'));
    THEMES.forEach(t => createChip(t, themeDiv, 'theme'));

    anime({
        targets: '.option-chip',
        translateY: [30, 0], opacity: [0, 1],
        delay: anime.stagger(25), easing: 'spring(1, 80, 10, 0)'
    });

    document.getElementById('shuffle-btn')?.addEventListener('click', handleShuffle);
    document.getElementById('surprise-btn')?.addEventListener('click', surpriseMe);
    document.getElementById('refresh-visuals-btn')?.addEventListener('click', () => applyFixedVisualSmooth(generateRandomVisualConfig()));
    document.getElementById('chaos-toggle')?.addEventListener('click', toggleChaosMode);

    initTooltips();
    initCopyButton();
    initFindAnother();
}

function createChip(text, container, type) {
    const chip = document.createElement('div');
    chip.className = 'option-chip';
    chip.textContent = text;
    chip.setAttribute('role', 'option');
    chip.setAttribute('aria-selected', 'false');
    chip.setAttribute('tabindex', '0');

    const select = () => {
        container.querySelectorAll('.option-chip').forEach(c => {
            c.classList.remove('active');
            c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-selected', 'true');
        state[type] = text;

        // Update checkmark
        const check = document.getElementById(`${type}-check`);
        if (check) { check.hidden = false; }

        // Animate chip
        anime({ targets: chip, scale: [0.85, 1.12, 1], duration: 450, easing: 'easeOutElastic(1, .5)' });

        updateURL();

        // Hide hint if now all selected
        if (state.mood && state.genre && state.theme) {
            const hint = document.getElementById('selection-hint');
            if (hint) hint.hidden = true;
        }
    };

    chip.addEventListener('click', select);
    chip.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
    container.appendChild(chip);
}

function surpriseMe() {
    const rM = MOODS[Math.floor(Math.random() * MOODS.length)];
    const rG = GENRES[Math.floor(Math.random() * GENRES.length)];
    const rT = THEMES[Math.floor(Math.random() * THEMES.length)];
    const click = (containerId, val) =>
        document.querySelectorAll(`#${containerId} .option-chip`).forEach(c => { if (c.textContent === val) c.click(); });
    click('mood-options', rM);
    setTimeout(() => click('genre-options', rG), 120);
    setTimeout(() => click('theme-options', rT), 240);
    setTimeout(() => document.getElementById('shuffle-btn')?.click(), 500);
}

function updateURL() {
    if (state.mood && state.genre && state.theme) {
        history.replaceState(null, null, `#m=${encodeURIComponent(state.mood)}&g=${encodeURIComponent(state.genre)}&t=${encodeURIComponent(state.theme)}`);
    }
}

function loadFromURL() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const m = params.get('m'), g = params.get('g'), t = params.get('t');
    if (m && MOODS.includes(m)) document.querySelectorAll('#mood-options .option-chip').forEach(c => { if (c.textContent === m) c.click(); });
    if (g && GENRES.includes(g)) document.querySelectorAll('#genre-options .option-chip').forEach(c => { if (c.textContent === g) c.click(); });
    if (t && THEMES.includes(t)) document.querySelectorAll('#theme-options .option-chip').forEach(c => { if (c.textContent === t) c.click(); });
}

// --- HANDLE SHUFFLE ---
async function handleShuffle() {
    const missing = [];
    if (!state.mood) missing.push('Mood');
    if (!state.genre) missing.push('Genre');
    if (!state.theme) missing.push('Theme');

    if (missing.length > 0) {
        const hint = document.getElementById('selection-hint');
        const hintText = document.getElementById('selection-hint-text');
        if (hint && hintText) {
            hintText.textContent = `Please select: ${missing.join(', ')}`;
            hint.hidden = false;
        }
        anime({ targets: '.glass-container', translateX: [-8, 8, -5, 5, 0], duration: 400 });
        return;
    }

    const btn = document.getElementById('shuffle-btn');
    const skeleton = document.getElementById('card-skeleton');
    const card = document.getElementById('result-card');

    // Loading state
    btn?.classList.add('loading');
    btn.style.pointerEvents = 'none';
    if (card) { card.classList.add('hidden'); }
    if (skeleton) { skeleton.hidden = false; }

    // Scroll to result panel
    gsap.to(window, { scrollTo: '#result-panel', duration: 1.0, ease: 'power3.inOut', offsetY: 60 });

    try {
        const res = await fetch(`/api/track?mood=${encodeURIComponent(state.mood)}&genre=${encodeURIComponent(state.genre)}&theme=${encodeURIComponent(state.theme)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (skeleton) skeleton.hidden = true;
        displayResult(data);
        applySongAdaptiveVisuals(data);
    } catch (err) {
        console.error('Fetch error:', err);
        if (skeleton) skeleton.hidden = true;
        const hint = document.getElementById('selection-hint');
        const hintText = document.getElementById('selection-hint-text');
        if (hint && hintText) {
            hintText.textContent = 'Could not reach the server. Make sure it\'s running and try again.';
            hint.hidden = false;
        }
        anime({ targets: '.glass-container', translateX: [-8, 8, -5, 5, 0], duration: 400 });
    } finally {
        btn?.classList.remove('loading');
        btn.style.pointerEvents = 'all';
    }
}

// --- DISPLAY RESULT ---
function displayResult(data) {
    state.currentTrackUrl = data.url;

    const card = document.getElementById('result-card');
    document.getElementById('res-mood').textContent = state.mood;
    document.getElementById('res-genre').textContent = state.genre;
    document.getElementById('res-theme').textContent = state.theme;

    const titleEl = document.getElementById('res-title');
    const artistEl = document.getElementById('res-artist');
    const playLink = document.getElementById('play-link');
    if (titleEl) titleEl.textContent = data.title || 'Unknown Track';
    if (artistEl) artistEl.textContent = data.artist || 'Unknown Artist';
    if (playLink) { playLink.href = data.url; playLink.setAttribute('aria-label', `Play "${data.title}" on YouTube`); }

    // Thumbnail
    const thumbImg = document.getElementById('track-thumb');
    const thumbFallback = document.getElementById('thumb-fallback');
    if (data.thumb && thumbImg) {
        thumbImg.src = data.thumb;
        thumbImg.alt = `Thumbnail for ${data.title}`;
        thumbImg.hidden = false;
        if (thumbFallback) thumbFallback.style.display = 'none';
        thumbImg.onerror = () => { thumbImg.hidden = true; if (thumbFallback) thumbFallback.style.display = 'flex'; };
    } else {
        if (thumbImg) thumbImg.hidden = true;
        if (thumbFallback) thumbFallback.style.display = 'flex';
    }

    // Meta: views + duration
    const metaEl = document.getElementById('track-meta');
    const viewsEl = document.getElementById('res-views-val');
    const durEl = document.getElementById('res-dur-val');
    if (data.viewCount || data.duration) {
        if (viewsEl) viewsEl.textContent = formatViews(data.viewCount) + ' views';
        if (durEl) durEl.textContent = formatDuration(data.duration);
        if (metaEl) metaEl.hidden = false;
    } else {
        if (metaEl) metaEl.hidden = true;
    }

    card.classList.remove('hidden');
    anime({
        targets: '#result-card',
        keyframes: [
            { scale: 0.35, rotateY: -90, opacity: 0, duration: 0 },
            { scale: 1.05, rotateY: 0, opacity: 1, duration: 420, easing: 'easeOutQuad' },
            { scale: 1, duration: 200 }
        ],
        easing: 'easeOutElastic(1, .6)'
    });
    anime({
        targets: '.tag, .track-title, .track-artist, .track-meta, .play-action-row, .find-another-btn',
        translateY: [24, 0], opacity: [0, 1],
        delay: anime.stagger(70, { start: 400 }),
        easing: 'spring(1, 80, 10, 0)'
    });
}

// --- GSAP SCROLL SETUP ---
function initGSAPScroll() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    gsap.fromTo('.hero-content', { y: 180, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.7)' });
    gsap.fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.6 });

    ScrollTrigger.create({
        trigger: '.mixer-panel', start: 'top top', end: 'bottom bottom', pin: true, pinSpacing: true,
        onEnter: () => gsap.to('.glass-container', { scale: 1, rotationX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }),
        onLeaveBack: () => gsap.to('.glass-container', { scale: 0.94, duration: 0.5 })
    });
    gsap.fromTo('.glass-container', { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, delay: 0.5, ease: 'back.out(1.2)' });

    if (state.camera) {
        gsap.to(state.camera.position, {
            scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
            z: 15, y: -3, onUpdate: () => state.camera.lookAt(0, 0, 0)
        });
    }
}

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    if (document.hidden) return;
    const delta = state.clock.getDelta();
    const time = state.clock.getElapsedTime();
    if (state.shaderMat?.uniforms) state.shaderMat.uniforms.uTime.value = time * (state.visualConfig?.moodSpeed || 1);
    if (state.coreMesh) {
        state.coreMesh.rotation.y += delta * 0.5 * (state.visualConfig?.moodSpeed || 1);
        state.coreMesh.rotation.x += delta * 0.2 * (state.visualConfig?.moodSpeed || 1);
    }
    if (state.particleGroup) {
        state.particleGroup.rotation.y += delta * 0.05 + state.mouseX * 0.002;
        state.particleGroup.rotation.x += state.mouseY * 0.001;
        state.particleGroup.children.forEach((ps, idx) => {
            ps.scale.setScalar(1 + Math.sin(time * 2 + idx) * 0.1);
        });
    }
    if (state.mainLight && state.visualConfig) {
        state.mainLight.intensity = (0.8 + Math.sin(time * 2) * 0.3) * state.visualConfig.moodSpeed;
    }
    if (state.composer && state.scene) {
        state.renderPass.scene = state.scene;
        state.composer.render();
    }
}

// --- EVENTS ---
window.addEventListener('resize', () => {
    if (state.camera) {
        state.camera.aspect = window.innerWidth / window.innerHeight;
        state.camera.updateProjectionMatrix();
        if (state.renderer) state.renderer.setSize(window.innerWidth, window.innerHeight);
        if (state.composer) state.composer.setSize(window.innerWidth, window.innerHeight);
    }
});
window.addEventListener('mousemove', (e) => {
    state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    state.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

// --- BOOT ---
document.addEventListener('DOMContentLoaded', () => {
    state.gpuTier = detectGPUTier();
    initThreeJSCore();
    const initConfig = generateRandomVisualConfig();
    applyFixedVisual(initConfig);
    initUI();
    initMicroInteractions();
    initEasterEggs();
    initGSAPScroll();
    loadFromURL();
    animate();
});