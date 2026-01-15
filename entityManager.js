import * as THREE from 'three';
import { Utils } from './utils.js';

export class EntityManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.entities = [];
        this.spawnTimer = 0;
    }

    spawnEntity(playerPos) {
        // Create a "Shadow Figure" (Simple black capsule)
        const geo = new THREE.CapsuleGeometry(1, 4, 4, 8);
        const mat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const mesh = new THREE.Mesh(geo, mat);

        // Spawn somewhere in distance
        const angle = Math.random() * Math.PI * 2;
        const dist = Utils.randomRange(30, 60);
        mesh.position.set(
            playerPos.x + Math.cos(angle) * dist,
            2, 
            playerPos.z + Math.sin(angle) * dist
        );

        this.scene.add(mesh);
        this.entities.push({ mesh: mesh, type: 'watcher' });
    }

    update(dt, playerPos) {
        this.spawnTimer += dt;
        if (this.spawnTimer > 10 && this.entities.length < 3) {
            if (Utils.chance(0.5)) {
                this.spawnEntity(playerPos);
                this.spawnTimer = 0;
            }
        }

        // Logic: If player looks at them, they vanish or freeze
        const frustum = new THREE.Frustum();
        const projScreenMatrix = new THREE.Matrix4();
        projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(projScreenMatrix);

        for (let i = this.entities.length - 1; i >= 0; i--) {
            const ent = this.entities[i];
            
            if (frustum.containsPoint(ent.mesh.position)) {
                // Is seen!
                // Disappear logic:
                this.scene.remove(ent.mesh);
                this.entities.splice(i, 1);
                // Hint: Play a sound here in a full version
            } else {
                // Not seen: Move closer
                const dir = new THREE.Vector3().subVectors(playerPos, ent.mesh.position).normalize();
                ent.mesh.position.add(dir.multiplyScalar(dt * 2.0)); // Creep closer
            }
        }
    }
}
