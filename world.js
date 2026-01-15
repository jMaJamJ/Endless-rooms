import * as THREE from 'three';
import { RoomGenerator } from './roomGenerator.js';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.generator = new RoomGenerator();
        this.walls = [];
        this.floor = null;
        this.ceiling = null;

        this.initMaterials();
        this.buildInitialWorld();
    }

    initMaterials() {
        // Procedural Texture for walls (Beige/Yellow Wallpaper)
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#d4cdb4'; // Mono-yellow
        ctx.fillRect(0,0,64,64);
        
        // Add noise
        for(let i=0; i<500; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
            ctx.fillRect(Math.random()*64, Math.random()*64, 2, 2);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;

        this.wallMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8 });
        this.floorMat = new THREE.MeshStandardMaterial({ color: #5a5a5a, roughness: 0.5 }); // Carpet-ish
        this.ceilMat = new THREE.MeshStandardMaterial({ color: #dddddd });
    }

    buildInitialWorld() {
        // Floor
        const floorGeo = new THREE.PlaneGeometry(200, 200);
        this.floor = new THREE.Mesh(floorGeo, this.floorMat);
        this.floor.rotation.x = -Math.PI / 2;
        this.scene.add(this.floor);

        // Ceiling
        const ceilGeo = new THREE.PlaneGeometry(200, 200);
        this.ceiling = new THREE.Mesh(ceilGeo, this.ceilMat);
        this.ceiling.rotation.x = Math.PI / 2;
        this.ceiling.position.y = 8; // Height of room
        this.scene.add(this.ceiling);

        // Walls
        const wallData = this.generator.generateChunk(-10, -10, 20);
        const geo = new THREE.BoxGeometry(10, 8, 10);
        
        wallData.forEach(w => {
            const mesh = new THREE.Mesh(geo, this.wallMat);
            mesh.position.set(w.x, 4, w.z); // y is half height
            this.scene.add(mesh);
            this.walls.push(mesh); // Store for collision
        });
    }

    update(playerPos) {
        // Infinite floor illusion: Move floor/ceiling to follow player 
        // to create the sense of endlessness without generating infinite geometry
        this.floor.position.x = playerPos.x;
        this.floor.position.z = playerPos.z;
        this.ceiling.position.x = playerPos.x;
        this.ceiling.position.z = playerPos.z;
    }
}
