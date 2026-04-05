// ============================================
// 🎵 COSY MUSIC SUGGESTER - A++ EDITION
// Powered by Three.js + Anime.js + Pretext
// ============================================

// Global State
const state = {
  moods: [],
  genres: [],
  chibiTimer: null,
  chibiSightings: 0,
  preference: 'toon',
  toonCount: 8,
  jsonCount: 6
};

// Pretext Configuration (https://github.com/chenglou/pretext)
const PretextConfig = {
  messages: {
    greeting: [
      "Hey there! Ready for some cosy tunes? 🎵",
      "Welcome! Let's find your perfect vibe! ✨",
      "Hello! Music time is the best time! 🎶"
    ],
    loading: [
      "Digging through the musical vault... 🔍",
      "Asking the chibi overlords for suggestions... 👑",
      "Spinning the musical roulette... 🎡"
    ],
    success: [
      "Found some absolute bangers! 🔥",
      "These tracks are purrfect! 😻",
      "Your ears are in for a treat! 👂✨"
    ],
    chibi: [
      "It's your fault I dropped my ice cream! 🍦",
      "You made me blush! How dare you! 😳",
      "I was totally not sleeping! You startled me! 😴",
      "Look what you made me do! 💫",
      "This is all because of you! 🎭",
      "Why are you staring? Now I'm shy! 🙈",
      "You caught me! This is embarrassing! 😅",
      "I'm watching you... 👀",
      "*judgemental stare* 😒",
      "Wanna see me do a backflip? *falls over* 🤸‍♀️💥",
      "I heard you like music! *nods aggressively* 🎵",
      "POV: You're being watched by a chibi 👁️👄👁️"
    ]
  }
};

// Initialize Pretext if available
let pretext = null;
if (typeof window.Pretext !== 'undefined') {
  pretext = new window.Pretext({
    debug: true,
    prefix: '[MusicApp]'
  });
  pretext.log('Pretext initialized!');
}

// ============================================
// THREE.JS BACKGROUND ANIMATION
// ============================================
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Enhanced floating objects with more variety
const notes = [];
const noteGeometries = [
  new THREE.TorusGeometry(0.3, 0.1, 8, 16),
  new THREE.SphereGeometry(0.4, 8, 8),
  new THREE.OctahedronGeometry(0.4),
  new THREE.IcosahedronGeometry(0.3),
  new THREE.TetrahedronGeometry(0.35)
];

const noteMaterials = [
  new THREE.MeshPhongMaterial({ 
    color: 0xff6b9d, 
    emissive: 0x220011,
    shininess: 100
  }),
  new THREE.MeshPhongMaterial({ 
    color: 0xf8b500, 
    emissive: 0x332200,
    shininess: 100
  }),
  new THREE.MeshPhongMaterial({ 
    color: 0x667eea, 
    emissive: 0x110033,
    shininess: 100
  }),
  new THREE.MeshPhongMaterial({ 
    color: 0xf093fb, 
    emissive: 0x220033,
    shininess: 100
  })
];

// Create 80 floating objects
for (let i = 0; i < 80; i++) {
  const geometry = noteGeometries[Math.floor(Math.random() * noteGeometries.length)];
  const material = noteMaterials[Math.floor(Math.random() * noteMaterials.length)];
  const note = new THREE.Mesh(geometry, material);
  
  note.position.x = (Math.random() - 0.5) * 50;
  note.position.y = (Math.random() - 0.5) * 50;
  note.position.z = (Math.random() - 0.5) * 30 - 15;
  
  note.rotation.x = Math.random() * Math.PI;
  note.rotation.y = Math.random() * Math.PI;
  
  note.userData = {
    rotationSpeed: {
      x: (Math.random() - 0.5) * 0.03,
      y: (Math.random() - 0.5) * 0.03,
      z: (Math.random() - 0.5) * 0.02
    },
    floatSpeed: Math.random() * 0.5 + 0.2,
    floatOffset: Math.random() * Math.PI * 2,
    originalScale: 0.8 + Math.random() * 0.4
  };
  
  notes.push(note);
  scene.add(note);
}

// Add multiple lights for depth
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xff6b9d, 1.5);
pointLight1.position.set(15, 15, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x667eea, 1.2);
pointLight2.position.set(-15, -10, 5);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xf8b500, 1);
pointLight3.position.set(0, 20, -5);
scene.add(pointLight3);

camera.position.z = 20;

// Animation loop with enhanced movement
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.008;
  
  notes.forEach((note, index) => {
    note.rotation.x += note.userData.rotationSpeed.x;
    note.rotation.y += note.userData.rotationSpeed.y;
    note.rotation.z += note.userData.rotationSpeed.z;
    
    note.position.y += Math.sin(time * 2 + note.userData.floatOffset) * 0.015;
    note.position.x += Math.cos(time + note.userData.floatOffset) * 0.008;
    
    // Gentle pulsing with individual timing
    const scale = note.userData.originalScale + Math.sin(time * 3 + index * 0.5) * 0.15;
    note.scale.set(scale, scale, scale);
  });
  
  // Slowly rotate entire scene
  scene.rotation.y = Math.sin(time * 0.3) * 0.1;
  
  renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// ANIME.JS ADVANCED ANIMATIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Update stats display
  updateStats();
  
  // Animate header on load with stagger
  anime({
    targets: '.header',
    opacity: [0, 1],
    translateY: [-50, 0],
    duration: 2000,
    easing: 'easeOutElastic(1, .8)'
  });
  
  // Animate logo elements
  anime({
    targets: '.music-note',
    scale: [0, 1],
    rotate: [180, 0],
    delay: anime.stagger(200),
    duration: 1500,
    easing: 'spring(1, 80, 10, 0)'
  });
  
  // Animate controls
  anime({
    targets: '.controls',
    opacity: [0, 1],
    translateY: [30, 0],
    scale: [0.95, 1],
    delay: 400,
    duration: 1500,
    easing: 'easeOutCubic'
  });
  
  // Animate stats bar
  anime({
    targets: '.stats-bar',
    opacity: [0, 1],
    translateY: [20, 0],
    delay: 800,
    duration: 1200,
    easing: 'easeOutQuad'
  });
  
  // Animate results container
  anime({
    targets: '.results-container',
    opacity: [0, 1],
    scale: [0.9, 1],
    delay: 1000,
    duration: 1200,
    easing: 'easeOutCubic'
  });
  
  // Animate stat icons continuously
  anime({
    targets: '.stat-icon',
    scale: [1, 1.2, 1],
    duration: 2000,
    easing: 'easeInOutSine',
    loop: true,
    delay: anime.stagger(200)
  });
  
  // Button hover animation with particles
  const button = document.getElementById('suggest-btn');
  button.addEventListener('mouseenter', () => {
    createButtonParticles(button);
    anime({
      targets: button,
      scale: 1.08,
      rotate: '-1deg',
      duration: 400,
      easing: 'easeOutQuad'
    });
  });
  
  button.addEventListener('mouseleave', () => {
    anime({
      targets: button,
      scale: 1,
      rotate: '0deg',
      duration: 400,
      easing: 'easeOutQuad'
    });
  });
  
  // Glitch effect on title hover
  const title = document.querySelector('.glitch-text');
  title.addEventListener('mouseenter', () => {
    anime({
      targets: title,
      skewX: [0, 5, -5, 3, -3, 0],
      duration: 500,
      easing: 'steps(5)'
    });
  });
});

// Create particle effect on button hover
function createButtonParticles(button) {
  const rect = button.getBoundingClientRect();
  const particlesContainer = document.getElementById('particles-container');
  
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.width = `${6 + Math.random() * 8}px`;
    particle.style.height = particle.style.width;
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    
    particlesContainer.appendChild(particle);
    
    const angle = (Math.PI * 2 / 8) * i;
    const velocity = 50 + Math.random() * 50;
    
    anime({
      targets: particle,
      translateX: Math.cos(angle) * velocity,
      translateY: Math.sin(angle) * velocity,
      opacity: [1, 0],
      scale: [1, 0],
      duration: 600 + Math.random() * 200,
      easing: 'easeOutQuad',
      complete: () => particle.remove()
    });
  }
}

// ============================================
// DOM ELEMENTS
// ============================================
const moodSelect = document.getElementById('mood-select');
const genreSelect = document.getElementById('genre-select');
const suggestBtn = document.getElementById('suggest-btn');
const suggestionsList = document.getElementById('suggestions-list');
const loading = document.getElementById('loading');
const chibiLeft = document.getElementById('chibi-left');
const chibiRight = document.getElementById('chibi-right');
const chibiMessageLeft = document.getElementById('chibi-message-left');
const chibiMessageRight = document.getElementById('chibi-message-right');
const prefToggles = document.querySelectorAll('.pref-toggle');

// ============================================
// API FUNCTIONS
// ============================================
async function fetchFilters() {
  try {
    const response = await fetch('/api/filters');
    const data = await response.json();
    
    state.moods = data.moods;
    state.genres = data.genres;
    
    // Populate dropdowns with anime animation
    data.moods.forEach((mood, index) => {
      const option = document.createElement('option');
      option.value = mood;
      option.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
      moodSelect.appendChild(option);
      
      anime({
        targets: option,
        opacity: [0, 1],
        delay: index * 50,
        duration: 300
      });
    });
    
    data.genres.forEach((genre, index) => {
      const option = document.createElement('option');
      option.value = genre;
      option.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);
      genreSelect.appendChild(option);
    });
    
    // Log with pretext
    if (pretext) {
      pretext.log(`Loaded ${state.moods.length} moods and ${state.genres.length} genres`);
    }
    
  } catch (error) {
    console.error('Error fetching filters:', error);
    if (pretext) {
      pretext.error('Failed to load filters');
    }
  }
}

async function fetchSuggestions() {
  const mood = moodSelect.value;
  const genre = genreSelect.value;
  
  let url = `/api/suggest?preference=${state.preference}`;
  if (mood) url += `&mood=${mood}&`;
  if (genre) url += `&genre=${genre}&`;
  
  try {
    // Show loading with random message
    loading.classList.remove('hidden');
    suggestionsList.innerHTML = '';
    
    const loadingText = loading.querySelector('.loading-text');
    const randomLoadingMsg = PretextConfig.messages.loading[
      Math.floor(Math.random() * PretextConfig.messages.loading.length)
    ];
    loadingText.textContent = randomLoadingMsg;
    
    // Enhanced loading animation
    anime({
      targets: '.pixel-spinner',
      rotate: '1turn',
      duration: 1000,
      easing: 'linear',
      loop: true
    });
    
    anime({
      targets: '.spinner-ring',
      rotate: '-1turn',
      duration: 2000,
      easing: 'linear',
      loop: true
    });
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Hide loading
    loading.classList.add('hidden');
    
    // Display suggestions with staggered animation
    displaySuggestions(data.suggestions);
    
    // Update stats
    updateStats(data.suggestions);
    
    // Trigger chibi event occasionally
    if (Math.random() > 0.5) {
      setTimeout(() => triggerChibiEvent(), 1000);
    }
    
    // Success message with pretext
    if (pretext) {
      const successMsg = PretextConfig.messages.success[
        Math.floor(Math.random() * PretextConfig.messages.success.length)
      ];
      pretext.success(successMsg);
    }
    
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    loading.classList.add('hidden');
    if (pretext) {
      pretext.error('Failed to fetch suggestions');
    }
  }
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================
function displaySuggestions(suggestions) {
  if (suggestions.length === 0) {
    suggestionsList.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.5rem;">No suggestions found. Try different filters! 🎵</p>';
    return;
  }
  
  suggestions.forEach((track, index) => {
    const card = document.createElement('div');
    card.className = 'music-card';
    
    // Determine if track is from TOON or JSON
    const sourceBadge = track.id <= 8 ? 
      '<span class="genre-tag" style="background: linear-gradient(135deg, #ff9a9e, #fecfef);">TOON</span>' : 
      '<span class="genre-tag" style="background: linear-gradient(135deg, #a8edea, #fed6e3);">JSON</span>';
    
    card.innerHTML = `
      <h3>${track.title}</h3>
      <p><strong>Artist:</strong> ${track.artist}</p>
      <p><strong>Genre:</strong> ${track.genre.charAt(0).toUpperCase() + track.genre.slice(1)}</p>
      <span class="mood">${track.mood.charAt(0).toUpperCase() + track.mood.slice(1)}</span>
      ${sourceBadge}
    `;
    
    // Initial state for animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px) scale(0.9)';
    suggestionsList.appendChild(card);
    
    // Staggered entrance animation
    setTimeout(() => {
      anime({
        targets: card,
        opacity: 1,
        translateY: 0,
        scale: 1,
        duration: 800,
        easing: 'cubicBezier(0.68, -0.55, 0.265, 1.55)'
      });
    }, index * 150);
    
    // Click animation with feedback
    card.addEventListener('click', () => {
      // Squash and stretch effect
      anime({
        targets: card,
        scale: [1, 0.95, 1.05, 1],
        duration: 500,
        easing: 'easeInOutQuad'
      });
      
      // Rotate slightly
      anime({
        targets: card,
        rotate: [-2, 2, 0],
        duration: 400,
        easing: 'easeInOutSine'
      });
      
      // Show playful feedback
      const feedback = `🎵 Now imagining: "${track.title}" by ${track.artist}\n\nMood: ${track.mood}\nGenre: ${track.genre}`;
      alert(feedback);
      
      // Create sparkle effect
      createCardSparkles(card);
    });
    
    // Hover effect enhancement
    card.addEventListener('mouseenter', () => {
      anime({
        targets: card,
        boxShadow: [
          '4px 4px 0px rgba(0, 0, 0, 0.3)',
          '12px 12px 0px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 107, 157, 0.6)'
        ],
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
  });
}

function createCardSparkles(card) {
  const rect = card.getBoundingClientRect();
  const particlesContainer = document.getElementById('particles-container');
  
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
    particle.style.width = `${8 + Math.random() * 10}px`;
    particle.style.height = particle.style.width;
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    
    particlesContainer.appendChild(particle);
    
    const angle = (Math.PI * 2 / 12) * i;
    const velocity = 80 + Math.random() * 60;
    
    anime({
      targets: particle,
      translateX: Math.cos(angle) * velocity,
      translateY: Math.sin(angle) * velocity,
      opacity: [1, 0],
      scale: [1, 0],
      rotate: Math.random() * 720,
      duration: 800 + Math.random() * 400,
      easing: 'easeOutQuad',
      complete: () => particle.remove()
    });
  }
}

// ============================================
// CHIBI CHARACTER SYSTEM
// ============================================
const chibiAnimations = {
  peek: { expression: '(◕‿◕)', emotion: '✨' },
  dance: { expression: '(≧◡≦)', emotion: '🎵' },
  sleep: { expression: '(￣o￣) zzZ', emotion: '💤' },
  startle: { expression: '(°ロ°) !', emotion: '⚡' },
  wave: { expression: '(^_^)/', emotion: '👋' },
  bounce: { expression: '(^o^)', emotion: '💫' },
  read: { expression: '(ー_ー)', emotion: '📖' },
  point: { expression: '(☞ﾟヮﾟ)☞', emotion: '👉' },
  hide: { expression: '(⊙_⊙;)', emotion: '😳' },
  blush: { expression: '(⁄ ⁄•⁄ω⁄•⁄ ⁄)', emotion: '💕' },
  gift: { expression: '(⊃｡•́‿•̀｡)⊃', emotion: '🎁' },
  bow: { expression: '(m._.)m', emotion: '🙇' }
};

async function triggerChibiEvent() {
  try {
    const response = await fetch('/api/chibi-event');
    const data = await response.json();
    
    state.chibiSightings++;
    updateStats();
    
    const chibiElement = data.side === 'left' ? chibiLeft : chibiRight;
    const messageElement = data.side === 'left' ? chibiMessageLeft : chibiMessageRight;
    const emotionElement = chibiElement.querySelector('.emotion-effect');
    
    // Set message from pretext config
    const funnyMessage = PretextConfig.messages.chibi[
      Math.floor(Math.random() * PretextConfig.messages.chibi.length)
    ];
    messageElement.textContent = funnyMessage;
    
    // Get animation data
    const animData = chibiAnimations[data.animation] || chibiAnimations.peek;
    
    // Update facial expression
    const eyes = chibiElement.querySelectorAll('.eye');
    const mouth = chibiElement.querySelector('.mouth');
    
    // Animate eyes based on emotion
    anime({
      targets: eyes,
      scaleY: [1, 0.3, 1],
      duration: 300,
      delay: 200,
      easing: 'easeInOutQuad'
    });
    
    // Set emotion effect
    emotionElement.textContent = animData.emotion;
    
    // Show chibi
    chibiElement.classList.remove('hidden');
    
    // Entrance animation with elastic bounce
    setTimeout(() => {
      chibiElement.classList.add('visible');
      
      // Bounce animation
      anime({
        targets: chibiElement.querySelector('.chibi-body'),
        translateY: [-30, 0],
        scaleY: [0.8, 1.1, 0.95, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
      });
      
      // Wiggle animation
      anime({
        targets: chibiElement.querySelector('.chibi-head'),
        rotate: [-5, 5, -3, 3, 0],
        duration: 600,
        delay: 400,
        easing: 'easeInOutSine'
      });
      
      // Arm wave animation
      anime({
        targets: chibiElement.querySelector('.arm.right'),
        rotate: [-20, 20, -15, 15, 0],
        duration: 500,
        delay: 600,
        easing: 'easeInOutSine'
      });
      
    }, 100);
    
    // Make chibi look at user then show judgemental face
    setTimeout(() => {
      if (Math.random() > 0.6) {
        // Judgemental stare
        anime({
          targets: chibiElement.querySelectorAll('.eye'),
          height: ['18px', '12px'],
          duration: 300,
          easing: 'easeInOutQuad'
        });
      }
    }, 2000);
    
    // Hide after delay
    setTimeout(() => {
      chibiElement.classList.remove('visible');
      
      // Exit animation
      anime({
        targets: chibiElement.querySelector('.chibi-body'),
        translateY: [0, 30],
        scaleY: [1, 0.8],
        duration: 600,
        easing: 'easeInBack'
      });
      
      setTimeout(() => {
        chibiElement.classList.add('hidden');
        // Reset expressions
        anime({
          targets: chibiElement.querySelectorAll('.eye'),
          height: '18px',
          duration: 200
        });
      }, 600);
    }, 5000);
    
  } catch (error) {
    console.error('Error triggering chibi event:', error);
  }
}

// Random chibi appearances
function scheduleRandomChibi() {
  const randomTime = Math.random() * 60000 + 30000; // 30-90 seconds
  state.chibiTimer = setTimeout(() => {
    triggerChibiEvent();
    scheduleRandomChibi();
  }, randomTime);
}

// ============================================
// PREFERENCE TOGGLE
// ============================================
prefToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    prefToggles.forEach(t => t.classList.remove('active'));
    toggle.classList.add('active');
    state.preference = toggle.dataset.pref;
    
    // Animate toggle
    anime({
      targets: toggle,
      scale: [1, 1.1, 1],
      duration: 300,
      easing: 'easeInOutQuad'
    });
    
    // Update badge display
    const toonBadge = document.querySelector('.toon-badge');
    const jsonBadge = document.querySelector('.json-badge');
    
    if (state.preference === 'toon') {
      toonBadge.classList.add('active');
      jsonBadge.classList.remove('active');
    } else {
      jsonBadge.classList.add('active');
      toonBadge.classList.remove('active');
    }
  });
});

// ============================================
// STATS UPDATE
// ============================================
function updateStats(suggestions = null) {
  const totalEl = document.getElementById('total-tracks');
  const toonEl = document.getElementById('toon-count');
  const jsonEl = document.getElementById('json-count');
  const chibiEl = document.getElementById('chibi-sightings');
  
  if (suggestions) {
    const toonCount = suggestions.filter(s => s.id <= 8).length;
    const jsonCount = suggestions.filter(s => s.id > 8).length;
    
    // Animate numbers
    anime({
      targets: [totalEl, toonEl, jsonEl],
      innerHTML: [0, suggestions.length],
      round: 1,
      duration: 1500,
      easing: 'easeOutExpo'
    });
    
    setTimeout(() => {
      toonEl.innerHTML = toonCount;
      jsonEl.innerHTML = jsonCount;
    }, 500);
  }
  
  chibiEl.innerHTML = state.chibiSightings;
}

// ============================================
// EVENT LISTENERS
// ============================================
suggestBtn.addEventListener('click', fetchSuggestions);

// Keyboard shortcut (Enter key when focused on selects)
moodSelect.addEventListener('change', () => {
  if (moodSelect.value && genreSelect.value) {
    fetchSuggestions();
  }
});

genreSelect.addEventListener('change', () => {
  if (moodSelect.value && genreSelect.value) {
    fetchSuggestions();
  }
});

// ============================================
// INITIALIZATION
// ============================================
fetchFilters();
scheduleRandomChibi();

// Initial chibi greeting with pretext message
setTimeout(() => {
  const greetingMsg = PretextConfig.messages.greeting[
    Math.floor(Math.random() * PretextConfig.messages.greeting.length)
  ];
  
  if (pretext) {
    pretext.info(greetingMsg);
  }
  
  triggerChibiEvent();
}, 1500);

// Console easter egg
console.log('%c🎵 Welcome to Cosy Music Suggester! 🎵', 'font-size: 20px; color: #ff6b9d; text-shadow: 2px 2px 0 #f8b500;');
console.log('%cMade with ❤️ using Three.js + Anime.js + Pretext', 'font-size: 12px; color: #667eea;');
console.log('%cPsst... The chibis are watching you! 👀', 'font-size: 14px; color: #f093fb;');
