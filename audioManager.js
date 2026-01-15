export class AudioManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.humOscillators = [];
    }

    async init() {
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        this.startFluorescentHum();
    }

    startFluorescentHum() {
        // Creates that annoying 60hz hum
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.value = 60; // The mains hum
        
        // Low pass filter to muffle it
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 120;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.value = 0.05; // Quiet volume
        osc.start();
        this.humOscillators.push({ osc, gain });
    }

    setTension(amount) {
        // Pitch shift slightly based on sanity/tension
        this.humOscillators.forEach(h => {
            h.osc.frequency.setTargetAtTime(60 + (amount * 10), this.ctx.currentTime, 1);
            h.gain.gain.setTargetAtTime(0.05 + (amount * 0.05), this.ctx.currentTime, 1);
        });
    }
}
