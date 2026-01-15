import { Utils } from './utils.js';

export class SanitySystem {
    constructor(camera) {
        this.camera = camera;
        this.sanity = 100;
        this.tension = 0; // 0 to 1
        this.baseFov = camera.fov;
        this.overlay = document.getElementById('sanity-overlay');
    }

    update(dt, playerVelocity, isLightFlickering) {
        // Being still drains sanity slowly (paranoia)
        const isMoving = playerVelocity.length() > 0.1;
        
        if (!isMoving) {
            this.sanity -= dt * 0.5;
        } else {
            this.sanity += dt * 0.2; // Movement restores confidence slightly
        }

        // Dark/Flickering hurts sanity
        if (isLightFlickering) {
            this.sanity -= dt * 2.0;
        }

        this.sanity = Math.max(0, Math.min(100, this.sanity));
        this.tension = 1 - (this.sanity / 100);

        this.applyEffects(dt);
    }

    applyEffects(dt) {
        // FOV Breathing (Panic)
        const breathSpeed = 1 + (this.tension * 5);
        const breathAmount = this.tension * 5;
        this.camera.fov = this.baseFov + Math.sin(Date.now() * 0.002 * breathSpeed) * breathAmount;
        this.camera.updateProjectionMatrix();

        // Red vignette
        this.overlay.style.background = `radial-gradient(circle, transparent 60%, rgba(${Math.floor(this.tension * 100)}, 0, 0, ${this.tension * 0.5}) 100%)`;
    }
}
