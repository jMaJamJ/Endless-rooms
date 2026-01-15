import { Utils } from './utils.js';

export class RoomGenerator {
    constructor() {
        this.tileSize = 10;
    }

    // Generates a chunk of the map
    generateChunk(offsetX, offsetZ, size) {
        const walls = [];
        
        for (let x = 0; x < size; x++) {
            for (let z = 0; z < size; z++) {
                // Perlin-ish noise simulation or simple random maze
                // 1 is wall, 0 is empty
                let isWall = Utils.chance(0.3);

                // Ensure open spaces
                if (x % 2 !== 0 && z % 2 !== 0) isWall = false; 

                if (isWall) {
                    walls.push({
                        x: (x + offsetX) * this.tileSize,
                        z: (z + offsetZ) * this.tileSize,
                        w: this.tileSize,
                        h: this.tileSize
                    });
                }
            }
        }
        return walls;
    }
}
