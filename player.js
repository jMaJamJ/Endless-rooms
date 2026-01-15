import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Player {
    constructor(camera, domElement) {
        this.camera = camera;
        this.controls = new PointerLockControls(camera, domElement);
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.speed = 10.0;
        
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.setupInputs();
    }

    setupInputs() {
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp': case 'KeyW': this.moveForward = true; break;
                case 'ArrowLeft': case 'KeyA': this.moveLeft = true; break;
                case 'ArrowDown': case 'KeyS': this.moveBackward = true; break;
                case 'ArrowRight': case 'KeyD': this.moveRight = true; break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp': case 'KeyW': this.moveForward = false; break;
                case 'ArrowLeft': case 'KeyA': this.moveLeft = false; break;
                case 'ArrowDown': case 'KeyS': this.moveBackward = false; break;
                case 'ArrowRight': case 'KeyD': this.moveRight = false; break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        
        document.getElementById('start-btn').addEventListener('click', () => {
            this.controls.lock();
            document.getElementById('intro').style.display = 'none';
        });
    }

    update(dt, walls) {
        if (!this.controls.isLocked) return;

        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();

        if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 100.0 * dt;
        if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 100.0 * dt;

        // Friction
        this.velocity.x -= this.velocity.x * 10.0 * dt;
        this.velocity.z -= this.velocity.z * 10.0 * dt;

        // Apply Movement
        this.controls.moveRight(-this.velocity.x * dt);
        this.controls.moveForward(-this.velocity.z * dt);

        // Simple Wall Collision (Bounding Box check)
        const playerPos = this.camera.position;
        const playerRadius = 1.0; 

        walls.forEach(wall => {
            const wallBox = new THREE.Box3().setFromObject(wall);
            // Expand wallbox slightly for collision buffer
            if (wallBox.distanceToPoint(playerPos) < playerRadius) {
                 // Push back (Very simple collision response)
                 const dir = new THREE.Vector3().subVectors(playerPos, wall.position).normalize();
                 this.controls.getObject().position.add(dir.multiplyScalar(0.2));
                 this.velocity.set(0,0,0);
            }
        });
    }

    getPosition() {
        return this.controls.getObject().position;
    }
}
