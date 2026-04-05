/**
 * 🎵 COSY MUSIC SUGGESTER - FRONTEND
 * Powered by Three.js + Anime.js
 * Uses Pretext for structured logging
 * TOON Architecture (70% preference) + JSON (30%)
 */

// Initialize Pretext for structured logging
const log = {
  greeting: () => console.log('%c🎵 Welcome to Music Suggester v2.1.dev', 'font-size: 20px; color: #e94560; font-weight: bold;'),
  loading: (msg) => console.log(`%c⏳ ${msg}`, 'color: #00f5ff;'),
  success: (msg) => console.log(`%c✅ ${msg}`, 'color: #4ade80;'),
  error: (msg) => console.log(`%c❌ ${msg}`, 'color: #ef4444;'),
  chibi: (msg) => console.log(`%c✨ ${msg}`, 'color: #f472b6; font-style: italic;')
};

// State management
const state = {
  suggestionCount: 0,
  tracksLoaded: 0,
  isAnimating: false
};

// DOM Elements
const elements = {
  suggestBtn: document.getElementById('suggest-btn'),
  moodFilter: document.getElementById('mood-filter'),
  genreFilter: document.getElementById('genre-filter'),
  loading: document.getElementById('loading'),
  results: document.getElementById('results'),
  cardsContainer: document.getElementById('cards-container'),
  trackCount: document.getElementById('track-count'),
  suggestionCount: document.getElementById('suggestion-count'),
  particlesContainer: document.getElementById('particles-container')
};

// ============================================
// THREE.JS BACKGROUND ANIMATION
// ============================================
function initThreeJS() {
  log.loading('Initializing Three.js background...');
  
  const canvas = document.getElementById('bg-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Create floating musical notes and shapes
  const geometries = [
    new THREE.TorusGeometry(0.5, 0.2, 16, 32),
    new THREE.OctahedronGeometry(0.6),
    new THREE.TetrahedronGeometry(0.5),
    new THREE.IcosahedronGeometry(0.4),
    new THREE.BoxGeometry(0.5, 0.5, 0.5)
  ];
  
  const materials = [
    new THREE.MeshPhongMaterial({ color: 0xe94560, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0x4361ee, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0x00f5ff, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0x9d4edd, shininess: 100 })
  ];
  
  const objects = [];
  for (let i = 0; i < 80; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.x = (Math.random() - 0.5) * 40;
    mesh.position.y = (Math.random() - 0.5) * 40;
    mesh.position.z = (Math.random() - 0.5) * 20 - 10;
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    mesh.userData = {
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02
      },
      floatSpeed: 0.5 + Math.random() * 0.5,
      floatOffset: Math.random() * Math.PI * 2
    };
    
    objects.push(mesh);
    scene.add(mesh);
  }
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const pointLight1 = new THREE.PointLight(0xe94560, 1, 50);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0x4361ee, 1, 50);
  pointLight2.position.set(-10, -10, 10);
  scene.add(pointLight2);
  
  const pointLight3 = new THREE.PointLight(0x00f5ff, 1, 50);
  pointLight3.position.set(0, 10, -10);
  scene.add(pointLight3);
  
  camera.position.z = 15;
  
  // Animation loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    objects.forEach((obj, index) => {
      obj.rotation.x += obj.userData.rotationSpeed.x;
      obj.rotation.y += obj.userData.rotationSpeed.y;
      
      obj.position.y += Math.sin(time * obj.userData.floatSpeed + obj.userData.floatOffset) * 0.02;
    });
    
    // Gentle camera movement
    camera.position.x = Math.sin(time * 0.5) * 2;
    camera.position.y = Math.cos(time * 0.3) * 2;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  log.success('Three.js background initialized');
}

// ============================================
// ANIME.JS UI ANIMATIONS
// ============================================
function initAnimeJS() {
  log.loading('Initializing Anime.js animations...');
  
  // Animate header on load
  anime({
    targets: '.header',
    opacity: [0, 1],
    translateY: [-50, 0],
    duration: 1500,
    easing: 'easeOutElastic(1, .8)'
  });
  
  // Animate stats bar items with stagger
  anime({
    targets: '.stat-item',
    opacity: [0, 1],
    scale: [0.8, 1],
    delay: anime.stagger(200, { start: 500 }),
    easing: 'spring(1, 80, 10, 0)'
  });
  
  // Animate controls section
  anime({
    targets: '.controls-section',
    opacity: [0, 1],
    translateY: [30, 0],
    delay: 1000,
    duration: 1200,
    easing: 'easeOutQuad'
  });
  
  // Continuous icon pulsing
  anime({
    targets: '.pixel-icon',
    scale: [1, 1.2, 1],
    duration: 2000,
    easing: 'easeInOutSine',
    loop: true
  });
  
  // Button hover effect with particles
  elements.suggestBtn.addEventListener('mouseenter', (e) => {
    createParticles(e.clientX, e.clientY, 10);
  });
  
  log.success('Anime.js animations initialized');
}

// ============================================
// PARTICLE SYSTEM
// ============================================
function createParticles(x, y, count = 15) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
    
    elements.particlesContainer.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / count;
    const velocity = 50 + Math.random() * 100;
    
    anime({
      targets: particle,
      translateX: Math.cos(angle) * velocity,
      translateY: Math.sin(angle) * velocity,
      opacity: [1, 0],
      scale: [1, 0],
      duration: 800 + Math.random() * 400,
      easing: 'easeOutExpo',
      complete: () => particle.remove()
    });
  }
}

// ============================================
// API FUNCTIONS
// ============================================
async function fetchSuggestions(mood, genre) {
  try {
    log.loading('Fetching music suggestions...');
    
    const params = new URLSearchParams({ limit: 6 });
    if (mood) params.append('mood', mood);
    if (genre) params.append('genre', genre);
    
    const response = await fetch(`/api/suggest?${params}`);
    const data = await response.json();
    
    if (data.success) {
      log.success(`Received ${data.count} suggestions (${data.preference})`);
      return data;
    } else {
      throw new Error('Failed to get suggestions');
    }
  } catch (error) {
    log.error(error.message);
    return null;
  }
}

// ============================================
// UI RENDERING
// ============================================
function renderCards(suggestions) {
  elements.cardsContainer.innerHTML = '';
  
  suggestions.data.forEach((track, index) => {
    const card = document.createElement('div');
    card.className = 'music-card';
    card.innerHTML = `
      <div class="card-header">
        <div class="card-cover">🎵</div>
        <span class="source-badge ${track.source === 'JSON' ? 'json' : ''}">${track.source}</span>
      </div>
      <h3 class="card-title">${track.title}</h3>
      <p class="card-artist">${track.artist}</p>
      <div class="card-meta">
        <span class="meta-item">🎭 ${track.mood}</span>
        <span class="meta-item">🎸 ${track.genre}</span>
        <span class="meta-item">⏱️ ${track.duration || '3:30'}</span>
      </div>
      ${track.tags ? `
        <div class="card-tags">
          ${track.tags.slice(0, 3).map(tag => `<span class="tag">#${tag}</span>`).join('')}
        </div>
      ` : ''}
      <button class="play-btn" onclick="playTrack('${track.youtubeUrl || track.streamUrl}')">
        ▶ Play on ${track.youtubeUrl ? 'YouTube' : 'Spotify'}
      </button>
    `;
    
    elements.cardsContainer.appendChild(card);
    
    // Animate card entrance with stagger
    anime({
      targets: card,
      opacity: [0, 1],
      translateY: [50, 0],
      scale: [0.9, 1],
      delay: index * 150,
      duration: 800,
      easing: 'easeOutElastic(1, .6)'
    });
  });
  
  // Update stats
  state.tracksLoaded = suggestions.count;
  elements.trackCount.textContent = state.tracksLoaded;
}

// Global function to play track
window.playTrack = function(url) {
  if (url) {
    log.loading(`Opening track in new tab...`);
    window.open(url, '_blank');
    
    // Increment suggestion counter
    state.suggestionCount++;
    elements.suggestionCount.textContent = state.suggestionCount;
  }
};

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================

// ============================================
// EVENT LISTENERS
// ============================================
elements.suggestBtn.addEventListener('click', async (e) => {
  // Create button particles
  const rect = elements.suggestBtn.getBoundingClientRect();
  createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
  
  // Show loading
  elements.loading.classList.remove('hidden');
  elements.results.classList.add('hidden');
  
  // Get filters
  const mood = elements.moodFilter.value;
  const genre = elements.genreFilter.value;
  
  // Fetch suggestions
  const suggestions = await fetchSuggestions(mood, genre);
  
  // Hide loading
  elements.loading.classList.add('hidden');
  
  if (suggestions) {
    // Render cards
    renderCards(suggestions);
    elements.results.classList.remove('hidden');
    
    // Scroll to results
    elements.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Increment suggestion counter
    state.suggestionCount++;
    elements.suggestionCount.textContent = state.suggestionCount;
  }
});

// Filter change animations
[elements.moodFilter, elements.genreFilter].forEach(select => {
  select.addEventListener('change', () => {
    anime({
      targets: select,
      scale: [1, 1.05, 1],
      duration: 400,
      easing: 'easeInOutQuad'
    });
  });
});

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  log.greeting();
  log.loading('Loading cosy music experience...');
  
  initThreeJS();
  initAnimeJS();
  
  log.success('App ready! Start discovering music 🎵');
});

// Console easter egg
console.log('%c🎵 Made with 💖 using Three.js + Anime.js', 'font-size: 16px; color: #e94560; font-weight: bold;');
console.log('%c✨ TOON Architecture v2.1.dev • Pinterest-inspired', 'font-size: 12px; color: #00f5ff;');
