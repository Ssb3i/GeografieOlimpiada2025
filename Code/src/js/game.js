/**
 * Earthquake Preparedness Game - Main Game Controller
 * Manages game state, scene transitions, and core game loop
 */

import { BeforeScene } from './scenes/before.js';
import { DuringScene } from './scenes/during.js';
import { AfterScene } from './scenes/after.js';
import { GameState } from './utils/helpers.js';
// Temporarily disable audio and other features to fix core functionality
// import { gameAudio } from '../assets/audio/sounds.js';
// import { AchievementHelper } from './utils/achievements.js';
// import { TutorialHelper } from './utils/tutorial.js';

class EarthquakeGame {
    constructor() {
        console.log('EarthquakeGame constructor called');
        
        try {
            this.gameState = new GameState();
            console.log('GameState initialized');
        } catch (error) {
            console.error('Failed to initialize GameState:', error);
            throw error;
        }

        try {
            this.scenes = {
                before: new BeforeScene(this.gameState),
                during: new DuringScene(this.gameState),
                after: new AfterScene(this.gameState)
            };
            console.log('Scenes initialized');
        } catch (error) {
            console.error('Failed to initialize scenes:', error);
            throw error;
        }

        this.currentScene = 'before';
        
        try {
            this.elements = this.initializeElements();
            console.log('Elements initialized');
        } catch (error) {
            console.error('Failed to initialize elements:', error);
            throw error;
        }

        try {
            this.init();
            console.log('Game initialization complete');
        } catch (error) {
            console.error('Failed to complete initialization:', error);
            throw error;
        }
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        console.log('Initializing DOM elements...');
        
        const elements = {
            sceneContainer: document.getElementById('scene-container'),
            sceneNavButtons: document.querySelectorAll('.scene-nav__btn'),
            nextButton: document.getElementById('next-button'),
            restartButton: document.getElementById('restart-button'),
            progressFill: document.getElementById('progress-fill'),
            currentScore: document.getElementById('current-score'),
            currentHint: document.getElementById('current-hint'),
            modal: document.getElementById('feedback-modal'),
            modalBody: document.getElementById('modal-body'),
            modalClose: document.getElementById('modal-close')
        };
        
        // Check for missing elements
        Object.entries(elements).forEach(([key, element]) => {
            if (!element || (element.length !== undefined && element.length === 0)) {
                console.warn(`Missing element: ${key}`);
            } else {
                console.log(`Found element: ${key}`);
            }
        });
        
        return elements;
    }

    /**
     * Initialize the game
     */
    init() {
        console.log('Initializing earthquake game...');
        this.setupEventListeners();
        this.loadScene(this.currentScene);
        this.updateUI();
        this.loadGameProgress();
        
        // Start tutorial for new users (disabled for now)
        // setTimeout(() => {
        //     TutorialHelper.start();
        // }, 1000);
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Scene navigation
        this.elements.sceneNavButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scene = e.target.dataset.scene;
                if (this.canAccessScene(scene)) {
                    // this.audio.playClick();
                    this.loadScene(scene);
                } else {
                    // this.audio.playError();
                    console.log('Scene not accessible yet');
                }
            });
        });

        // Game controls
        this.elements.nextButton.addEventListener('click', () => {
            // this.audio.playClick();
            this.nextScene();
        });

        this.elements.restartButton.addEventListener('click', () => {
            // this.audio.playClick();
            this.restartCurrentScene();
        });

        // Modal controls
        this.elements.modalClose.addEventListener('click', () => {
            // this.audio.playClick();
            this.closeModal();
        });

        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Game state updates
        document.addEventListener('gameStateUpdate', () => {
            this.updateUI();
            this.saveGameProgress();
            // Check for new achievements (disabled for now)
            // AchievementHelper.checkAchievements();
        });

        // Resume audio context on first user interaction (disabled for now)
        // document.addEventListener('click', () => {
        //     this.audio.resume();
        // }, { once: true });
    }

    /**
     * Load a specific scene with smooth transition
     */
    loadScene(sceneName) {
        console.log(`Loading scene: ${sceneName}`);
        
        if (!this.scenes[sceneName]) {
            console.error(`Scene ${sceneName} not found`);
            return;
        }

        if (!this.elements.sceneContainer) {
            console.error('Scene container not found');
            return;
        }

        console.log('Starting scene transition...');
        
        // Add transition out effect
        this.elements.sceneContainer.classList.add('scene-transition-out');
        
        setTimeout(() => {
            this.currentScene = sceneName;
            this.updateSceneNavigation();
            
            // Clear previous scene
            this.elements.sceneContainer.innerHTML = '';
            
            // Load new scene
            console.log(`Rendering scene: ${sceneName}`);
            try {
                this.scenes[sceneName].render(this.elements.sceneContainer);
                console.log('Scene rendered successfully');
                
                this.scenes[sceneName].activate();
                console.log('Scene activated successfully');
            } catch (error) {
                console.error('Failed to render/activate scene:', error);
                this.elements.sceneContainer.innerHTML = `
                    <div style="padding: 2rem; text-align: center; color: red;">
                        <h2>❌ Scene Loading Error</h2>
                        <p>Failed to load ${sceneName} scene</p>
                        <p>Error: ${error.message}</p>
                    </div>
                `;
            }
            
            // Remove transition out and add transition in
            this.elements.sceneContainer.classList.remove('scene-transition-out');
            this.elements.sceneContainer.classList.add('scene-transition-in');
            
            // Remove transition in class after animation
            setTimeout(() => {
                this.elements.sceneContainer.classList.remove('scene-transition-in');
            }, 500);
            
            this.updateUI();
        }, 250); // Half the transition duration
    }

    /**
     * Check if user can access a scene (based on progress)
     */
    canAccessScene(sceneName) {
        const sceneOrder = ['before', 'during', 'after'];
        const targetIndex = sceneOrder.indexOf(sceneName);
        const currentIndex = sceneOrder.indexOf(this.currentScene);
        
        // Allow going back or to the next available scene
        return targetIndex <= currentIndex + 1;
    }

    /**
     * Move to the next scene
     */
    nextScene() {
        const sceneOrder = ['before', 'during', 'after'];
        const currentIndex = sceneOrder.indexOf(this.currentScene);
        
        if (currentIndex < sceneOrder.length - 1) {
            const nextScene = sceneOrder[currentIndex + 1];
            this.gameState.completeScene(this.currentScene);
            this.loadScene(nextScene);
        } else {
            this.showGameCompletion();
        }
    }

    /**
     * Restart the current scene
     */
    restartCurrentScene() {
        this.gameState.resetScene(this.currentScene);
        this.loadScene(this.currentScene);
    }

    /**
     * Update scene navigation buttons
     */
    updateSceneNavigation() {
        this.elements.sceneNavButtons.forEach(btn => {
            const scene = btn.dataset.scene;
            btn.classList.remove('scene-nav__btn--active', 'scene-nav__btn--completed');
            
            if (scene === this.currentScene) {
                btn.classList.add('scene-nav__btn--active');
            }
            
            if (this.gameState.isSceneCompleted(scene)) {
                btn.classList.add('scene-nav__btn--completed');
            }
        });
    }

    /**
     * Update UI elements
     */
    updateUI() {
        // Update score
        this.elements.currentScore.textContent = this.gameState.getTotalScore();
        
        // Update progress bar
        const progress = this.gameState.getOverallProgress();
        this.elements.progressFill.style.width = `${progress}%`;
        
        // Update next button state
        const canProceed = this.scenes[this.currentScene].canProceed();
        this.elements.nextButton.disabled = !canProceed;
        
        // Update hint
        const hint = this.scenes[this.currentScene].getCurrentHint();
        this.elements.currentHint.textContent = hint;
        
        // Update achievements (disabled for now)
        // this.updateAchievementsUI();
    }

    /**
     * Update achievements UI display
     */
    updateAchievementsUI() {
        const progress = AchievementHelper.getProgress();
        
        // Update progress display
        document.getElementById('achievements-count').textContent = 
            `${progress.unlocked}/${progress.total}`;
        document.getElementById('achievement-progress-fill').style.width = 
            `${progress.percentage}%`;
        document.getElementById('achievement-points').textContent = 
            `${progress.totalPoints} pts`;
        
        // Update achievements list
        this.renderAchievementsList();
    }

    /**
     * Render achievements list in sidebar
     */
    renderAchievementsList() {
        const achievementsList = document.getElementById('achievements-list');
        const allAchievements = [
            ...AchievementHelper.getByCategory('before'),
            ...AchievementHelper.getByCategory('during'),
            ...AchievementHelper.getByCategory('after'),
            ...AchievementHelper.getByCategory('special')
        ];
        
        achievementsList.innerHTML = allAchievements.slice(0, 6).map(achievement => {
            const isUnlocked = AchievementHelper.isUnlocked(achievement.id);
            return `
                <div class="achievement-badge ${isUnlocked ? 'achievement-badge--unlocked' : ''}" 
                     title="${achievement.description}">
                    <span class="achievement-badge__icon">${achievement.icon}</span>
                    <span class="achievement-badge__name">${achievement.title}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * Show modal with content
     */
    showModal(title, content, type = 'info') {
        this.elements.modalBody.innerHTML = `
            <div class="modal-content ${type}">
                <h3>${title}</h3>
                <div>${content}</div>
            </div>
        `;
        this.elements.modal.setAttribute('aria-hidden', 'false');
    }

    /**
     * Close modal
     */
    closeModal() {
        this.elements.modal.setAttribute('aria-hidden', 'true');
    }

    /**
     * Show game completion
     */
    showGameCompletion() {
        const finalScore = this.gameState.getTotalScore();
        const completionTime = this.gameState.getCompletionTime();
        
        this.showModal(
            '🎉 Congratulations!',
            `
                <p>You've completed the Earthquake Preparedness Game!</p>
                <div class="completion-stats">
                    <p><strong>Final Score:</strong> ${finalScore} points</p>
                    <p><strong>Time:</strong> ${completionTime}</p>
                    <p><strong>Preparedness Level:</strong> ${this.gameState.getPreparednessLevel()}</p>
                </div>
                <div class="completion-actions">
                    <button class="btn btn--primary" onclick="window.location.reload()">Play Again</button>
                    <button class="btn btn--secondary" onclick="game.generateCertificate()">Get Certificate</button>
                </div>
            `,
            'success'
        );
    }

    /**
     * Generate completion certificate
     */
    generateCertificate() {
        // Implementation for certificate generation
        console.log('Certificate generation would happen here');
    }

    /**
     * Save game progress to localStorage
     */
    saveGameProgress() {
        try {
            localStorage.setItem('earthquakeGameProgress', JSON.stringify(this.gameState.serialize()));
        } catch (error) {
            console.error('Failed to save game progress:', error);
        }
    }

    /**
     * Load game progress from localStorage
     */
    loadGameProgress() {
        try {
            const saved = localStorage.getItem('earthquakeGameProgress');
            if (saved) {
                this.gameState.deserialize(JSON.parse(saved));
                this.updateUI();
            }
        } catch (error) {
            console.error('Failed to load game progress:', error);
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    try {
        window.game = new EarthquakeGame();
        console.log('Game initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        const container = document.getElementById('scene-container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: red;">
                    <h2>❌ Game Loading Error</h2>
                    <p>Error: ${error.message}</p>
                    <p>Please check the browser console for more details.</p>
                    <button onclick="location.reload()" style="padding: 0.5rem 1rem; margin-top: 1rem;">Reload Page</button>
                </div>
            `;
        }
    }
});

export default EarthquakeGame;