import * as THREE from 'three';
import { Utils } from './utils.js';

export class Lighting {
    constructor(scene) {
        this.scene = scene;
        this.lights = [];
        this.ambient = new THREE.AmbientLight(0x222222);
        this.scene.add(this.ambient);
        
        // Player flashlight
        this.flashlight = new THREE.SpotLight(0xffffee, 1);
        this.flashlight.angle = Math.PI / 6;
        this.flashlight.penumbra = 0.5;
        this.flashlight.decay = 2;
        this.flashlight.distance = 20;
        this.flashlight.castShadow = true;
        this.scene.add(this.flashlight);
        this.flashlight.target.position.set(0, 0, -1);
        this.scene.add(this.flashlight.target);

        this.flickerTimer = 0;
        this.isFlickering = false;
    }

    update(dt, playerPos, playerCam) {
        // Update flashlight position
        this.flashlight.position.copy(playerPos);
        
        // Update flashlight direction based on camera
        const dir = new THREE.Vector3();
        playerCam.getWorldDirection(dir);
        this.flashlight.target.position.copy(playerPos).add(dir);

        // Ceiling Light Logic
        this.handleAmbientFlicker(dt);
    }

    handleAmbientFlicker(dt) {
        this.flickerTimer -= dt;
        if (this.flickerTimer <= 0) {
            // Trigger random event
            if (Utils.chance(0.01)) { // 1% chance per frame check to start flicker sequence
                this.isFlickering = true;
                this.flickerTimer = Utils.randomRange(0.2, 2.0);
            } else {
                this.isFlickering = false;
                this.ambient.intensity = 0.5; // Normal
                this.flickerTimer = 0.1;
            }
        }

        if (this.isFlickering) {
            this.ambient.intensity = Math.random() > 0.5 ? 0.0 : 0.8;
        }
    }
}
