/**
 * Utility functions and classes for the Earthquake Preparedness Game
 */

// import { gameAudio } from '../../assets/audio/sounds.js';

/**
 * Game State Management Class
 */
export class GameState {
    constructor() {
        this.scenes = {
            before: { completed: false, score: 0, actions: [] },
            during: { completed: false, score: 0, actions: [] },
            after: { completed: false, score: 0, actions: [] }
        };
        this.startTime = Date.now();
        this.totalScore = 0;
    }

    /**
     * Mark a scene as completed
     */
    completeScene(sceneName) {
        if (this.scenes[sceneName]) {
            this.scenes[sceneName].completed = true;
            this.dispatchUpdateEvent();
        }
    }

    /**
     * Check if a scene is completed
     */
    isSceneCompleted(sceneName) {
        return this.scenes[sceneName]?.completed || false;
    }

    /**
     * Add score to a scene
     */
    addScore(sceneName, points) {
        if (this.scenes[sceneName]) {
            this.scenes[sceneName].score += points;
            this.totalScore += points;
            this.dispatchUpdateEvent();
        }
    }

    /**
     * Get total score across all scenes
     */
    getTotalScore() {
        return Object.values(this.scenes).reduce((total, scene) => total + scene.score, 0);
    }

    /**
     * Get scene score
     */
    getSceneScore(sceneName) {
        return this.scenes[sceneName]?.score || 0;
    }

    /**
     * Record an action in a scene
     */
    recordAction(sceneName, action) {
        if (this.scenes[sceneName]) {
            this.scenes[sceneName].actions.push({
                ...action,
                timestamp: Date.now()
            });
            this.dispatchUpdateEvent();
        }
    }

    /**
     * Get overall progress percentage
     */
    getOverallProgress() {
        const completedScenes = Object.values(this.scenes).filter(scene => scene.completed).length;
        return (completedScenes / Object.keys(this.scenes).length) * 100;
    }

    /**
     * Reset a specific scene
     */
    resetScene(sceneName) {
        if (this.scenes[sceneName]) {
            this.scenes[sceneName] = { completed: false, score: 0, actions: [] };
            this.dispatchUpdateEvent();
        }
    }

    /**
     * Get completion time
     */
    getCompletionTime() {
        const elapsed = Date.now() - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }

    /**
     * Get preparedness level based on score
     */
    getPreparednessLevel() {
        const totalScore = this.getTotalScore();
        if (totalScore >= 240) return 'Expert';
        if (totalScore >= 180) return 'Advanced';
        if (totalScore >= 120) return 'Intermediate';
        if (totalScore >= 60) return 'Beginner';
        return 'Novice';
    }

    /**
     * Dispatch update event
     */
    dispatchUpdateEvent() {
        document.dispatchEvent(new CustomEvent('gameStateUpdate', {
            detail: this.serialize()
        }));
    }

    /**
     * Serialize state for saving
     */
    serialize() {
        return {
            scenes: this.scenes,
            startTime: this.startTime,
            totalScore: this.totalScore
        };
    }

    /**
     * Deserialize state from saved data
     */
    deserialize(data) {
        this.scenes = data.scenes || this.scenes;
        this.startTime = data.startTime || this.startTime;
        this.totalScore = data.totalScore || this.totalScore;
    }
}

/**
 * UI Helper Functions
 */
export class UIHelpers {
    /**
     * Create a draggable item element
     */
    static createDraggableItem(id, content, className = '') {
        const item = document.createElement('div');
        item.id = id;
        item.className = `draggable-item ${className}`;
        item.draggable = true;
        item.innerHTML = content;
        
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', id);
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
        
        return item;
    }

    /**
     * Create a drop zone element
     */
    static createDropZone(id, placeholder, onDrop) {
        const zone = document.createElement('div');
        zone.id = id;
        zone.className = 'drop-zone';
        zone.innerHTML = `<span class="drop-zone__placeholder">${placeholder}</span>`;
        
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drop-zone--active');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drop-zone--active');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drop-zone--active');
            const itemId = e.dataTransfer.getData('text/plain');
            onDrop(itemId, zone);
        });
        
        return zone;
    }

    /**
     * Create an interactive button with feedback
     */
    static createInteractiveButton(text, onClick, className = '') {
        const button = document.createElement('button');
        button.className = `interactive-btn ${className}`;
        button.textContent = text;
        
        button.addEventListener('click', (e) => {
            button.classList.add('btn-clicked');
            setTimeout(() => button.classList.remove('btn-clicked'), 200);
            onClick(e);
        });
        
        return button;
    }

    /**
     * Show feedback animation
     */
    static showFeedback(element, type = 'success') {
        element.classList.add(`feedback-${type}`);
        
        // Play appropriate audio feedback (disabled for now)
        // if (type === 'success') {
        //     gameAudio.playSuccess();
        // } else if (type === 'error') {
        //     gameAudio.playError();
        // }
        
        setTimeout(() => {
            element.classList.remove(`feedback-${type}`);
        }, 1000);
    }

    /**
     * Animate element entrance
     */
    static animateEntrance(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }
}

/**
 * Educational Content Helper
 */
export class EducationalContent {
    static tips = {
        before: [
            "Create an emergency kit with 3 days of supplies for each person",
            "Secure heavy furniture and appliances to walls",
            "Practice 'Drop, Cover, and Hold On' with your family",
            "Know the safe spots in each room of your home",
            "Keep important documents in a waterproof container"
        ],
        during: [
            "Drop to hands and knees immediately",
            "Take cover under a sturdy desk or table",
            "Hold on to your shelter and protect your head",
            "If outdoors, move away from buildings and power lines",
            "If driving, pull over and stay in the car"
        ],
        after: [
            "Check yourself and others for injuries",
            "Look for hazards like gas leaks or electrical damage",
            "Use battery-powered radio for emergency information",
            "Stay out of damaged buildings",
            "Help others if you are able and it is safe"
        ]
    };

    static myths = [
        {
            myth: "Doorways are the safest place during an earthquake",
            fact: "Modern buildings are designed to be stronger than doorways. 'Drop, Cover, and Hold On' under a sturdy table is safer."
        },
        {
            myth: "You should run outside during an earthquake",
            fact: "Most injuries occur when people try to move during shaking. Stay where you are and take cover."
        },
        {
            myth: "Small earthquakes prevent big ones",
            fact: "Small earthquakes don't reduce the risk of larger ones. They're actually signs of ongoing tectonic activity."
        }
    ];

    /**
     * Get random tip for a scene
     */
    static getRandomTip(scene) {
        const tips = this.tips[scene] || [];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    /**
     * Get random myth/fact
     */
    static getRandomMyth() {
        const myths = this.myths;
        return myths[Math.floor(Math.random() * myths.length)];
    }
}

/**
 * Audio Helper for sound effects
 */
export class AudioHelper {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
    }

    /**
     * Initialize audio context
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    /**
     * Play a sound effect
     */
    playSound(frequency, duration = 200, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    /**
     * Play success sound
     */
    playSuccess() {
        this.playSound(523.25, 200); // C5
        setTimeout(() => this.playSound(659.25, 200), 100); // E5
    }

    /**
     * Play error sound
     */
    playError() {
        this.playSound(207.65, 300); // G#3
    }

    /**
     * Play click sound
     */
    playClick() {
        this.playSound(800, 100, 'square');
    }

    /**
     * Toggle sound effects
     */
    toggle() {
        this.enabled = !this.enabled;
    }
}

/**
 * Utility functions
 */
export const Utils = {
    /**
     * Debounce function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Format score display
     */
    formatScore(score) {
        return score.toString().padStart(3, '0');
    },

    /**
     * Check if device is mobile
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
};

// Legacy functions for backward compatibility
export function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image at ${url}`));
    });
}

export function playSound(audioContext, buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
}

export function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Initialize audio helper
export const audioHelper = new AudioHelper();