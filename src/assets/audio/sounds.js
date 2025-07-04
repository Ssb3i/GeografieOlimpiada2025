/**
 * Audio System for Earthquake Preparedness Game
 * Provides sound effects and audio feedback using Web Audio API
 */

export class GameAudio {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.1;
        this.sounds = {};
        this.init();
    }

    /**
     * Initialize Web Audio API
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Game audio initialized successfully');
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.enabled = false;
        }
    }

    /**
     * Create a simple tone
     */
    createTone(frequency, duration, type = 'sine', volume = this.volume) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);

        return { oscillator, gainNode };
    }

    /**
     * Play success sound - ascending notes
     */
    playSuccess() {
        if (!this.enabled) return;
        
        this.createTone(523.25, 150); // C5
        setTimeout(() => this.createTone(659.25, 150), 75); // E5
        setTimeout(() => this.createTone(783.99, 200), 150); // G5
    }

    /**
     * Play error sound - descending notes
     */
    playError() {
        if (!this.enabled) return;
        
        this.createTone(415.30, 200, 'sawtooth'); // G#4
        setTimeout(() => this.createTone(349.23, 200, 'sawtooth'), 100); // F4
        setTimeout(() => this.createTone(293.66, 300, 'sawtooth'), 200); // D4
    }

    /**
     * Play click sound - short high tone
     */
    playClick() {
        if (!this.enabled) return;
        this.createTone(800, 50, 'square', 0.05);
    }

    /**
     * Play earthquake rumble - low frequency noise
     */
    playEarthquakeRumble(duration = 3000) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator1.frequency.setValueAtTime(60, this.audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(65, this.audioContext.currentTime);
        oscillator1.type = 'sawtooth';
        oscillator2.type = 'triangle';

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.03, this.audioContext.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.03, this.audioContext.currentTime + duration / 1000 - 0.5);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000);

        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + duration / 1000);
        oscillator2.stop(this.audioContext.currentTime + duration / 1000);
    }

    /**
     * Enable/disable audio
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Resume audio context (needed for some browsers)
     */
    async resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (error) {
                console.warn('Failed to resume audio context:', error);
            }
        }
    }
}

// Create and export singleton instance
export const gameAudio = new GameAudio();

// Legacy function exports for backward compatibility
export const loadSound = (url) => {
    const audio = new Audio(url);
    return audio;
};

export const playSound = (audio) => {
    if (audio && typeof audio.play === 'function') {
        audio.play().catch(error => {
            console.error("Error playing sound:", error);
        });
    }
};

export const stopSound = (audio) => {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
};

export default gameAudio;