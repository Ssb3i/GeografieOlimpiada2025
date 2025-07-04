/**
 * Tutorial System for Earthquake Preparedness Game
 * Provides onboarding and guided introduction to game mechanics
 */

export class TutorialSystem {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.currentStep = 0;
        this.tutorialSteps = this.initializeTutorialSteps();
        this.isActive = false;
        this.hasSeenTutorial = this.loadTutorialState();
    }

    /**
     * Initialize tutorial steps
     */
    initializeTutorialSteps() {
        return [
            {
                id: 'welcome',
                title: 'Welcome to Earthquake Preparedness Game! 🌍',
                content: `
                    <p>Learn life-saving earthquake safety skills through interactive scenarios.</p>
                    <p>You'll practice what to do <strong>before</strong>, <strong>during</strong>, and <strong>after</strong> earthquakes.</p>
                    <p>Click Continue to start your earthquake preparedness journey!</p>
                `,
                target: null,
                position: 'center'
            },
            {
                id: 'navigation',
                title: 'Scene Navigation 🧭',
                content: `
                    <p>Use these tabs to move between different earthquake phases:</p>
                    <ul>
                        <li><strong>Before:</strong> Prepare your home and family</li>
                        <li><strong>During:</strong> React quickly to earthquake shaking</li>
                        <li><strong>After:</strong> Assess damage and stay safe</li>
                    </ul>
                    <p>Complete each scene to unlock the next one!</p>
                `,
                target: '.scene-nav',
                position: 'bottom'
            },
            {
                id: 'score',
                title: 'Track Your Progress 📊',
                content: `
                    <p>Your score reflects how well you understand earthquake safety.</p>
                    <p>Earn points by making correct choices and completing tasks quickly.</p>
                    <p>Watch the progress bar fill as you advance through scenarios!</p>
                `,
                target: '.score-display',
                position: 'left'
            },
            {
                id: 'achievements',
                title: 'Unlock Achievements 🏆',
                content: `
                    <p>Earn badges by demonstrating earthquake preparedness skills:</p>
                    <ul>
                        <li>Complete emergency kits</li>
                        <li>React quickly to earthquakes</li>
                        <li>Help others after disasters</li>
                    </ul>
                    <p>Collect them all to become a preparedness champion!</p>
                `,
                target: '.achievements-panel',
                position: 'left'
            },
            {
                id: 'hints',
                title: 'Get Helpful Hints 💡',
                content: `
                    <p>Stuck on a task? Check here for helpful tips and guidance.</p>
                    <p>The hints will update based on your current progress in each scene.</p>
                `,
                target: '.hints-panel',
                position: 'left'
            },
            {
                id: 'ready',
                title: "You're Ready to Start! 🚀",
                content: `
                    <p>You now know the basics of using the game.</p>
                    <p>Remember: Earthquake preparedness saves lives!</p>
                    <p>Let's begin with preparing BEFORE an earthquake strikes.</p>
                `,
                target: null,
                position: 'center'
            }
        ];
    }

    /**
     * Load tutorial state from localStorage
     */
    loadTutorialState() {
        try {
            return localStorage.getItem('earthquake-game-tutorial-seen') === 'true';
        } catch (error) {
            return false;
        }
    }

    /**
     * Save tutorial state to localStorage
     */
    saveTutorialState() {
        try {
            localStorage.setItem('earthquake-game-tutorial-seen', 'true');
        } catch (error) {
            console.warn('Failed to save tutorial state');
        }
    }

    /**
     * Start the tutorial
     */
    start() {
        if (this.hasSeenTutorial) {
            return; // Skip tutorial if already seen
        }

        this.isActive = true;
        this.currentStep = 0;
        this.showStep(this.currentStep);
    }

    /**
     * Show specific tutorial step
     */
    showStep(stepIndex) {
        if (stepIndex >= this.tutorialSteps.length) {
            this.complete();
            return;
        }

        const step = this.tutorialSteps[stepIndex];
        this.currentStep = stepIndex;
        
        // Create overlay
        this.createTutorialOverlay(step);
        
        // Highlight target if specified
        if (step.target) {
            this.highlightElement(step.target);
        }
    }

    /**
     * Create tutorial overlay
     */
    createTutorialOverlay(step) {
        // Remove existing overlay
        this.removeTutorialOverlay();

        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.id = 'tutorial-overlay';

        const content = document.createElement('div');
        content.className = 'tutorial-content';
        content.innerHTML = `
            <h3>${step.title}</h3>
            <div class="tutorial-text">${step.content}</div>
            <div class="tutorial-controls">
                <div class="tutorial-progress">
                    Step ${this.currentStep + 1} of ${this.tutorialSteps.length}
                </div>
                <div class="tutorial-buttons">
                    ${this.currentStep > 0 ? '<button class="btn btn--secondary" id="tutorial-prev">Previous</button>' : ''}
                    ${this.currentStep < this.tutorialSteps.length - 1 ? 
                        '<button class="btn btn--primary" id="tutorial-next">Continue</button>' : 
                        '<button class="btn btn--primary" id="tutorial-finish">Start Game!</button>'
                    }
                    <button class="btn btn--secondary" id="tutorial-skip">Skip Tutorial</button>
                </div>
            </div>
        `;

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Position content if target specified
        if (step.target) {
            this.positionTutorialContent(content, step.target, step.position);
        }

        // Add event listeners
        this.addTutorialEventListeners();

        // Show with animation
        setTimeout(() => overlay.classList.add('tutorial-overlay--show'), 100);
    }

    /**
     * Position tutorial content relative to target
     */
    positionTutorialContent(content, targetSelector, position) {
        const target = document.querySelector(targetSelector);
        if (!target) return;

        const targetRect = target.getBoundingClientRect();
        const overlay = content.parentElement;

        overlay.style.justifyContent = 'flex-start';
        overlay.style.alignItems = 'flex-start';

        let top, left;

        switch (position) {
            case 'bottom':
                top = targetRect.bottom + 20;
                left = targetRect.left + (targetRect.width / 2) - 200;
                break;
            case 'top':
                top = targetRect.top - 300;
                left = targetRect.left + (targetRect.width / 2) - 200;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height / 2) - 150;
                left = targetRect.left - 420;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height / 2) - 150;
                left = targetRect.right + 20;
                break;
            default: // center
                overlay.style.justifyContent = 'center';
                overlay.style.alignItems = 'center';
                return;
        }

        // Keep content on screen
        top = Math.max(20, Math.min(top, window.innerHeight - 320));
        left = Math.max(20, Math.min(left, window.innerWidth - 420));

        content.style.position = 'absolute';
        content.style.top = `${top}px`;
        content.style.left = `${left}px`;
    }

    /**
     * Highlight target element
     */
    highlightElement(selector) {
        // Remove existing highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });

        const target = document.querySelector(selector);
        if (target) {
            target.classList.add('tutorial-highlight');
        }
    }

    /**
     * Add event listeners for tutorial controls
     */
    addTutorialEventListeners() {
        const nextBtn = document.getElementById('tutorial-next');
        const prevBtn = document.getElementById('tutorial-prev');
        const finishBtn = document.getElementById('tutorial-finish');
        const skipBtn = document.getElementById('tutorial-skip');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousStep());
        }

        if (finishBtn) {
            finishBtn.addEventListener('click', () => this.complete());
        }

        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skip());
        }
    }

    /**
     * Go to next tutorial step
     */
    nextStep() {
        this.showStep(this.currentStep + 1);
    }

    /**
     * Go to previous tutorial step
     */
    previousStep() {
        this.showStep(this.currentStep - 1);
    }

    /**
     * Complete the tutorial
     */
    complete() {
        this.isActive = false;
        this.hasSeenTutorial = true;
        this.saveTutorialState();
        this.removeTutorialOverlay();
        this.removeHighlights();
    }

    /**
     * Skip the tutorial
     */
    skip() {
        this.complete();
    }

    /**
     * Remove tutorial overlay
     */
    removeTutorialOverlay() {
        const overlay = document.getElementById('tutorial-overlay');
        if (overlay) {
            overlay.classList.remove('tutorial-overlay--show');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }

    /**
     * Remove all highlights
     */
    removeHighlights() {
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
    }

    /**
     * Reset tutorial (for testing)
     */
    reset() {
        localStorage.removeItem('earthquake-game-tutorial-seen');
        this.hasSeenTutorial = false;
        this.complete();
    }

    /**
     * Show tutorial again
     */
    showAgain() {
        this.hasSeenTutorial = false;
        this.start();
    }
}

// Export helper functions
export const TutorialHelper = {
    system: null,

    init(gameInstance) {
        this.system = new TutorialSystem(gameInstance);
        return this.system;
    },

    start() {
        this.system?.start();
    },

    reset() {
        this.system?.reset();
    },

    showAgain() {
        this.system?.showAgain();
    }
};
