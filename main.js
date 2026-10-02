import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// --- Three.js Setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Camera (Moved closer by default for the scroll experience)
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-2, 1, 3.5);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

// Environment Map for Realistic Car Reflections
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Brighter ambient for light theme
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffa95c, 250);
spotLight.position.set(5, 5, 5);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.5;
scene.add(spotLight);

const rectLight = new THREE.RectAreaLight(0xffffff, 5, 10, 10);
rectLight.position.set(-5, 5, -5);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);

// Load 3D Model
let carModel = null;
const loader = new GLTFLoader();

// Set up Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
loader.setDRACOLoader(dracoLoader);

// Load the Gemera model
loader.load('/Gemera_widebody.glb', (gltf) => {
  carModel = gltf.scene;
  
  // Center and scale the model
  const box = new THREE.Box3().setFromObject(carModel);
  const center = box.getCenter(new THREE.Vector3());
  carModel.position.x -= center.x;
  carModel.position.y -= center.y;
  carModel.position.z -= center.z;
  
  // Auto-scale to ensure it fits well on screen
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const targetSize = 4.5;
  const scale = targetSize / maxDim;
  carModel.scale.set(scale, scale, scale);
  
  // Improve material brightness slightly for light theme
  carModel.traverse((child) => {
    if (child.isMesh) {
      if (child.material) {
        child.material.envMapIntensity = 2.5;
        child.material.needsUpdate = true;
      }
    }
  });

  // Initial Rotation state
  carModel.rotation.y = Math.PI / 4;
  carModel.rotation.x = 0;

  scene.add(carModel);
}, undefined, (error) => {
  console.error('Error loading model:', error);
});


// Handle Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- Scroll Driven Animation Logic ---
let scrollPercent = 0;

document.body.onscroll = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  scrollPercent = maxScroll > 0 ? (window.scrollY / maxScroll) : 0;
};

// Target rotations and camera positions based on scroll percentage
// Y rotation strictly increases to ensure it only rotates in one direction.
const animationKeyframes = [
  // 0.00: Hero - Front Quarter, default zoom
  { percent: 0, rotY: Math.PI / 4, rotX: 0, camX: -2, camY: 1, camZ: 3.5 },
  // 0.25: Powertrain - Back View, slightly zoomed out
  { percent: 0.25, rotY: Math.PI, rotX: Math.PI / 16, camX: 0, camY: 1.5, camZ: 4.5 },
  // 0.50: Interior - Side View, zoomed in close
  { percent: 0.5, rotY: Math.PI * 1.5, rotX: 0, camX: 0, camY: 1, camZ: 2.2 },
  // 0.75: Design - Front-Left Quarter, normal zoom
  { percent: 0.75, rotY: Math.PI * 1.83, rotX: Math.PI / 12, camX: -1, camY: 1.2, camZ: 3.5 },
  // 1.00: CTA - Back to Hero view
  { percent: 1.0, rotY: Math.PI * 2 + Math.PI / 4, rotX: 0, camX: -2, camY: 1, camZ: 3.5 }
];

// Helper function to interpolate between keyframes
function getTargets(p) {
  for (let i = 0; i < animationKeyframes.length - 1; i++) {
    const kf1 = animationKeyframes[i];
    const kf2 = animationKeyframes[i + 1];
    
    if (p >= kf1.percent && p <= kf2.percent) {
      const localPercent = (p - kf1.percent) / (kf2.percent - kf1.percent);
      const rotY = THREE.MathUtils.lerp(kf1.rotY, kf2.rotY, localPercent);
      const rotX = THREE.MathUtils.lerp(kf1.rotX, kf2.rotX, localPercent);
      const camX = THREE.MathUtils.lerp(kf1.camX, kf2.camX, localPercent);
      const camY = THREE.MathUtils.lerp(kf1.camY, kf2.camY, localPercent);
      const camZ = THREE.MathUtils.lerp(kf1.camZ, kf2.camZ, localPercent);
      return { rotY, rotX, camX, camY, camZ };
    }
  }
  // Fallback
  return { rotY: Math.PI / 4, rotX: 0, camX: -2, camY: 1, camZ: 3.5 };
}


// Render Loop
function tick() {
  requestAnimationFrame(tick);
  
  if (carModel) {
    const targets = getTargets(scrollPercent);
    // Smoothly interpolate current rotation/position to target using lerp
    carModel.rotation.y = THREE.MathUtils.lerp(carModel.rotation.y, targets.rotY, 0.05);
    carModel.rotation.x = THREE.MathUtils.lerp(carModel.rotation.x, targets.rotX, 0.05);
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targets.camX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targets.camY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targets.camZ, 0.05);
    
    camera.lookAt(0, 0, 0); // Ensure camera always points at the car
  }
  
  renderer.render(scene, camera);
}
tick();


// --- UI Intersection Observer for scroll animations ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3 // Trigger when 30% of the element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const staggerElements = document.querySelectorAll('.stagger-anim');
  staggerElements.forEach(el => observer.observe(el));
});
