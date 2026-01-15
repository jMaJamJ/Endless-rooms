import * as THREE from 'three';
import { Player } from './player.js';
import { World } from './world.js';
import { Lighting } from './lighting.js';
import { EntityManager } from './entityManager.js';
import { SanitySystem } from './sanitySystem.js';
import { AudioManager } from './audioManager.js';

// Setup Basic Three.js
const scene = new THREE.Scene();
// Fog adds the "Liminal" feeling - hides the end of the world
scene.fog = new THREE.FogExp2(0x000000, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 4; // Eye level

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // Enable shadows
document.body.appendChild(renderer.domElement);

// Initialize Modules
const world = new World(scene);
const lighting = new Lighting(scene);
const player = new Player(camera, document.body);
const entityManager = new EntityManager(scene, camera);
const sanity = new SanitySystem(camera);
const audio = new AudioManager();

// Resize Handle
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start Audio on click
document.getElementById('start-btn').addEventListener('click', () => {
    audio.init();
});

// Game Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const dt = clock.getDelta();
    const playerPos = player.getPosition();

    // Updates
    player.update(dt, world.walls);
    world.update(playerPos);
    lighting.update(dt, playerPos, camera);
    entityManager.update(dt, playerPos);
    sanity.update(dt, player.velocity, lighting.isFlickering);
    
    // Audio tension update
    audio.setTension(sanity.tension);

    renderer.render(scene, camera);
}

animate();
