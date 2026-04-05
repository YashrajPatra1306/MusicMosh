// Three.js Background Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create floating geometric shapes
const geometries = [
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.OctahedronGeometry(1, 0),
  new THREE.TetrahedronGeometry(1, 0),
  new THREE.TorusGeometry(0.7, 0.3, 8, 16),
  new THREE.BoxGeometry(1, 1, 1)
];

const materials = [
  new THREE.MeshPhongMaterial({ color: 0xff6b9d, wireframe: true }),
  new THREE.MeshPhongMaterial({ color: 0x00f5ff, wireframe: true }),
  new THREE.MeshPhongMaterial({ color: 0xc471ed, wireframe: true })
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
  
  const scale = Math.random() * 0.5 + 0.3;
  mesh.scale.set(scale, scale, scale);
  
  mesh.userData = {
    rotationSpeed: {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02
    },
    floatSpeed: Math.random() * 0.01 + 0.005,
    floatOffset: Math.random() * Math.PI * 2
  };
  
  objects.push(mesh);
  scene.add(mesh);
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xff6b9d, 1, 50);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00f5ff, 1, 50);
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xc471ed, 1, 50);
pointLight3.position.set(0, 10, -10);
scene.add(pointLight3);

camera.position.z = 15;

// Animation loop for Three.js
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.01;
  
  objects.forEach((obj, index) => {
    obj.rotation.x += obj.userData.rotationSpeed.x;
    obj.rotation.y += obj.userData.rotationSpeed.y;
    obj.position.y += Math.sin(time + obj.userData.floatOffset) * obj.userData.floatSpeed;
  });
  
  renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Anime.js UI Animations
document.addEventListener('DOMContentLoaded', () => {
  // Header entrance animation
  anime({
    targets: 'header',
    opacity: [0, 1],
    translateY: [-50, 0],
    duration: 1500,
    easing: 'easeOutElastic(1, .8)'
  });

  // Controls stagger animation
  anime({
    targets: '.filter-group',
    opacity: [0, 1],
    translateX: [-100, 0],
    delay: anime.stagger(200, { start: 500 }),
    easing: 'spring(1, 80, 10, 0)'
  });

  // Button pulse animation
  anime({
    targets: '.pixel-btn',
    scale: [1, 1.05, 1],
    duration: 2000,
    easing: 'easeInOutSine',
    loop: true
  });

  // Stats counter animation
  const counters = {
    tracks: 12,
    toon: 8,
    json: 4
  };

  anime({
    targets: counters,
    tracks: 12,
    toon: 8,
    json: 4,
    round: 1,
    easing: 'linear',
    update: () => {
      document.getElementById('track-count').textContent = counters.tracks;
      document.getElementById('toon-count').textContent = counters.toon;
      document.getElementById('json-count').textContent = counters.json;
    }
  });

  // Card entrance animation
  const cardTimeline = anime.timeline({
    autoplay: false
  });

  cardTimeline
    .add({
      targets: '#track-card',
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 800,
      easing: 'easeOutElastic(1, .6)'
    })
    .add({
      targets: '.track-title',
      opacity: [0, 1],
      translateX: [-50, 0],
      duration: 600,
      easing: 'easeOutCubic'
    }, '-=400')
    .add({
      targets: '.track-artist',
      opacity: [0, 1],
      translateX: [50, 0],
      duration: 600,
      easing: 'easeOutCubic'
    }, '-=400')
    .add({
      targets: '.play-btn',
      opacity: [0, 1],
      scale: [0, 1],
      duration: 500,
      easing: 'easeOutBack'
    }, '-=300');

  // Suggest button click handler
  const suggestBtn = document.getElementById('suggest-btn');
  const moodSelect = document.getElementById('mood');
  const genreSelect = document.getElementById('genre');
  const archSelect = document.getElementById('architecture');

  suggestBtn.addEventListener('click', async () => {
    // Button press animation
    anime({
      targets: '.pixel-btn',
      scale: [1, 0.95, 1],
      duration: 300,
      easing: 'easeInOutQuad'
    });

    // Particle effect
    createParticles(suggestBtn);

    // Get selected filters
    const mood = moodSelect.value;
    const genre = genreSelect.value;
    const format = archSelect.value;

    try {
      // Build query params
      const params = new URLSearchParams();
      if (mood) params.append('mood', mood);
      if (genre) params.append('genre', genre);
      if (format === 'json') params.append('format', 'json');

      const response = await fetch(`/api/suggest?${params}`);
      const data = await response.json();

      if (data.success && data.track) {
        // Update card content
        document.getElementById('track-title').textContent = data.track.title;
        document.getElementById('track-artist').textContent = data.track.artist;
        document.getElementById('source-badge').textContent = data.track.source;
        document.getElementById('arch-badge').textContent = `ARCH: ${data.architecture}`;
        document.getElementById('play-btn').href = data.track.url;

        // Update badge colors based on source
        const badge = document.getElementById('source-badge');
        if (data.track.source === 'TOON') {
          badge.style.background = '#ff6b9d';
        } else {
          badge.style.background = '#c471ed';
        }

        // Play card animation
        cardTimeline.restart();

        // Icon pulse animation
        anime({
          targets: '.play-btn .icon',
          scale: [1, 1.3, 1],
          duration: 1000,
          easing: 'easeInOutSine',
          loop: true
        });

        // Update stats
        const currentToon = parseInt(document.getElementById('toon-count').textContent);
        const currentJson = parseInt(document.getElementById('json-count').textContent);
        
        if (data.architecture === 'TOON') {
          document.getElementById('toon-count').textContent = currentToon + 1;
        } else {
          document.getElementById('json-count').textContent = currentJson + 1;
        }
      }
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      document.getElementById('track-title').textContent = 'ERROR';
      document.getElementById('track-artist').textContent = 'Failed to load track';
    }
  });

  // Particle creation function
  function createParticles(button) {
    const rect = button.getBoundingClientRect();
    const particlesContainer = button.querySelector('.btn-particles');
    
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: ${['#ff6b9d', '#00f5ff', '#c471ed'][Math.floor(Math.random() * 3)]};
        left: 50%;
        top: 50%;
        pointer-events: none;
      `;
      
      particlesContainer.appendChild(particle);

      const angle = (i / 12) * Math.PI * 2;
      const velocity = 60 + Math.random() * 40;

      anime({
        targets: particle,
        translateX: Math.cos(angle) * velocity,
        translateY: Math.sin(angle) * velocity,
        opacity: [1, 0],
        scale: [1, 0],
        duration: 800,
        easing: 'easeOutExpo',
        complete: () => particle.remove()
      });
    }
  }

  // Title hover glitch effect
  const title = document.querySelector('h1.glitch');
  title.addEventListener('mouseenter', () => {
    anime({
      targets: title,
      skewX: [0, 5, -5, 0],
      duration: 400,
      easing: 'easeInOutQuad'
    });
  });

  // Card hover tilt effect
  const card = document.getElementById('track-card');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    anime({
      targets: card,
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 500,
      easing: 'easeOutQuad'
    });
  });

  card.addEventListener('mouseleave', () => {
    anime({
      targets: card,
      rotateX: 0,
      rotateY: 0,
      duration: 800,
      easing: 'easeOutElastic(1, .6)'
    });
  });

  // Console welcome message
  console.log('%c MUSIC MOSH ', 'background: #00f5ff; color: #1a1a2e; font-size: 20px; font-weight: bold; padding: 10px;');
  console.log('%c Built with Three.js + Anime.js | TOON Architecture ', 'color: #ff6b9d; font-size: 12px;');
  console.log('%c Apache License 2.0 ', 'color: #c471ed; font-size: 12px;');
});
