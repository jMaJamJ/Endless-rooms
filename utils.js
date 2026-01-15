export const Utils = {
    // Get random float between min and max
    randomRange: (min, max) => Math.random() * (max - min) + min,

    // Get random integer
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),

    // Chance (0.0 to 1.0)
    chance: (probability) => Math.random() < probability,

    // Simple distance check (ignoring Y axis for room distance)
    distance2D: (v1, v2) => {
        const dx = v1.x - v2.x;
        const dz = v1.z - v2.z;
        return Math.sqrt(dx * dx + dz * dz);
    }
};
