/**
 * Achievement System for Earthquake Preparedness Game
 * Tracks player progress and unlocks badges/achievements
 */

export class AchievementSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.achievements = this.initializeAchievements();
        this.unlockedAchievements = this.loadUnlockedAchievements();
    }

    /**
     * Initialize all available achievements
     */
    initializeAchievements() {
        return {
            // Before Scene Achievements
            'emergency-kit-master': {
                id: 'emergency-kit-master',
                title: 'Emergency Kit Master',
                description: 'Successfully build a complete emergency kit',
                icon: '🎒',
                category: 'before',
                points: 50,
                condition: (gameState) => {
                    const actions = gameState.scenes.before.actions;
                    return actions.some(action => action.type === 'emergency-kit' && action.correct);
                }
            },
            'safety-inspector': {
                id: 'safety-inspector',
                title: 'Safety Inspector',
                description: 'Complete all household safety checks',
                icon: '🔍',
                category: 'before',
                points: 75,
                condition: (gameState) => {
                    const actions = gameState.scenes.before.actions;
                    const safetyChecks = actions.filter(action => action.type === 'safety-check' && action.correct);
                    return safetyChecks.length >= 5;
                }
            },
            'escape-planner': {
                id: 'escape-planner',
                title: 'Escape Route Planner',
                description: 'Create a comprehensive escape plan',
                icon: '🗺️',
                category: 'before',
                points: 60,
                condition: (gameState) => {
                    const actions = gameState.scenes.before.actions;
                    return actions.some(action => action.type === 'escape-plan' && action.correct);
                }
            },

            // During Scene Achievements
            'quick-reflexes': {
                id: 'quick-reflexes',
                title: 'Lightning Fast',
                description: 'React to an earthquake in under 3 seconds',
                icon: '⚡',
                category: 'during',
                points: 100,
                condition: (gameState) => {
                    const actions = gameState.scenes.during.actions;
                    return actions.some(action => 
                        action.type === 'earthquake-response' && 
                        action.correct && 
                        action.reactionTime < 3000
                    );
                }
            },
            'drop-cover-hold': {
                id: 'drop-cover-hold',
                title: 'Drop, Cover, Hold Expert',
                description: 'Successfully complete 3 different earthquake scenarios',
                icon: '🛡️',
                category: 'during',
                points: 150,
                condition: (gameState) => {
                    const actions = gameState.scenes.during.actions;
                    const scenarios = new Set();
                    actions.forEach(action => {
                        if (action.type === 'earthquake-response' && action.correct) {
                            scenarios.add(action.scenario);
                        }
                    });
                    return scenarios.size >= 3;
                }
            },
            'scenario-master': {
                id: 'scenario-master',
                title: 'Scenario Master',
                description: 'Complete all earthquake scenarios perfectly',
                icon: '🏆',
                category: 'during',
                points: 200,
                condition: (gameState) => {
                    const actions = gameState.scenes.during.actions;
                    const scenarios = ['indoor-office', 'indoor-home', 'outdoor-street', 'driving-car'];
                    return scenarios.every(scenario => 
                        actions.some(action => 
                            action.type === 'earthquake-response' && 
                            action.correct && 
                            action.scenario === scenario
                        )
                    );
                }
            },

            // After Scene Achievements
            'first-aid-hero': {
                id: 'first-aid-hero',
                title: 'First Aid Hero',
                description: 'Successfully complete all first aid scenarios',
                icon: '🏥',
                category: 'after',
                points: 100,
                condition: (gameState) => {
                    const actions = gameState.scenes.after.actions;
                    const firstAidActions = actions.filter(action => 
                        action.type === 'first-aid' && action.correct
                    );
                    return firstAidActions.length >= 3;
                }
            },
            'safety-assessor': {
                id: 'safety-assessor',
                title: 'Safety Assessor',
                description: 'Complete a thorough safety assessment',
                icon: '📋',
                category: 'after',
                points: 80,
                condition: (gameState) => {
                    const actions = gameState.scenes.after.actions;
                    return actions.some(action => action.type === 'safety-assessment' && action.correct);
                }
            },
            'communication-expert': {
                id: 'communication-expert',
                title: 'Communication Expert',
                description: 'Successfully establish emergency communication',
                icon: '📞',
                category: 'after',
                points: 75,
                condition: (gameState) => {
                    const actions = gameState.scenes.after.actions;
                    return actions.some(action => action.type === 'emergency-communication' && action.correct);
                }
            },

            // Special Achievements
            'perfectionist': {
                id: 'perfectionist',
                title: 'Perfectionist',
                description: 'Complete all scenes with perfect scores',
                icon: '💫',
                category: 'special',
                points: 500,
                condition: (gameState) => {
                    const totalScore = Object.values(gameState.scenes).reduce((sum, scene) => sum + scene.score, 0);
                    return totalScore >= 1000; // Adjust based on maximum possible score
                }
            },
            'preparedness-champion': {
                id: 'preparedness-champion',
                title: 'Preparedness Champion',
                description: 'Unlock all other achievements',
                icon: '👑',
                category: 'special',
                points: 1000,
                condition: (gameState) => {
                    const system = new AchievementSystem(gameState);
                    const unlocked = system.checkAllAchievements();
                    const nonChampionAchievements = Object.keys(system.achievements).filter(id => id !== 'preparedness-champion');
                    return nonChampionAchievements.every(id => unlocked.includes(id));
                }
            }
        };
    }

    /**
     * Load unlocked achievements from localStorage
     */
    loadUnlockedAchievements() {
        try {
            const saved = localStorage.getItem('earthquake-game-achievements');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Failed to load achievements:', error);
            return [];
        }
    }

    /**
     * Save unlocked achievements to localStorage
     */
    saveUnlockedAchievements() {
        try {
            localStorage.setItem('earthquake-game-achievements', JSON.stringify(this.unlockedAchievements));
        } catch (error) {
            console.warn('Failed to save achievements:', error);
        }
    }

    /**
     * Check and unlock new achievements
     */
    checkAchievements() {
        const newAchievements = [];

        Object.values(this.achievements).forEach(achievement => {
            if (!this.unlockedAchievements.includes(achievement.id)) {
                if (achievement.condition(this.gameState)) {
                    this.unlockedAchievements.push(achievement.id);
                    newAchievements.push(achievement);
                }
            }
        });

        if (newAchievements.length > 0) {
            this.saveUnlockedAchievements();
            this.showAchievementNotifications(newAchievements);
        }

        return newAchievements;
    }

    /**
     * Check all achievements and return unlocked ones
     */
    checkAllAchievements() {
        const unlocked = [];
        
        Object.values(this.achievements).forEach(achievement => {
            if (achievement.condition(this.gameState)) {
                unlocked.push(achievement.id);
            }
        });

        return unlocked;
    }

    /**
     * Show achievement notification popup
     */
    showAchievementNotifications(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showAchievementPopup(achievement);
            }, index * 1000); // Stagger notifications
        });
    }

    /**
     * Show individual achievement popup
     */
    showAchievementPopup(achievement) {
        // Create achievement popup element
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-popup__content">
                <div class="achievement-popup__icon">${achievement.icon}</div>
                <div class="achievement-popup__info">
                    <div class="achievement-popup__title">Achievement Unlocked!</div>
                    <div class="achievement-popup__name">${achievement.title}</div>
                    <div class="achievement-popup__description">${achievement.description}</div>
                    <div class="achievement-popup__points">+${achievement.points} points</div>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(popup);

        // Animate in
        setTimeout(() => popup.classList.add('achievement-popup--show'), 100);

        // Animate out and remove
        setTimeout(() => {
            popup.classList.remove('achievement-popup--show');
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 500);
        }, 4000);

        // Play achievement sound
        this.playAchievementSound();
    }

    /**
     * Play achievement unlock sound
     */
    playAchievementSound() {
        // Import audio dynamically to avoid circular dependencies
        import('../../assets/audio/sounds.js').then(({ gameAudio }) => {
            // Create a special achievement sound
            gameAudio.createTone(523.25, 150); // C5
            setTimeout(() => gameAudio.createTone(659.25, 150), 150); // E5
            setTimeout(() => gameAudio.createTone(783.99, 150), 300); // G5
            setTimeout(() => gameAudio.createTone(1046.50, 200), 450); // C6
        });
    }

    /**
     * Get achievement progress for display
     */
    getAchievementProgress() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.unlockedAchievements.length;
        const totalPoints = this.unlockedAchievements.reduce((sum, id) => {
            return sum + (this.achievements[id]?.points || 0);
        }, 0);

        return {
            total,
            unlocked,
            percentage: Math.round((unlocked / total) * 100),
            totalPoints
        };
    }

    /**
     * Get achievements by category
     */
    getAchievementsByCategory(category) {
        return Object.values(this.achievements).filter(achievement => 
            achievement.category === category
        );
    }

    /**
     * Check if achievement is unlocked
     */
    isUnlocked(achievementId) {
        return this.unlockedAchievements.includes(achievementId);
    }

    /**
     * Get achievement by ID
     */
    getAchievement(achievementId) {
        return this.achievements[achievementId];
    }

    /**
     * Reset all achievements (for testing)
     */
    reset() {
        this.unlockedAchievements = [];
        this.saveUnlockedAchievements();
    }
}

// Export singleton helper
export class AchievementHelper {
    static system = null;

    static init(gameState) {
        this.system = new AchievementSystem(gameState);
        return this.system;
    }

    static checkAchievements() {
        return this.system?.checkAchievements() || [];
    }

    static getProgress() {
        return this.system?.getAchievementProgress() || { total: 0, unlocked: 0, percentage: 0, totalPoints: 0 };
    }

    static getByCategory(category) {
        return this.system?.getAchievementsByCategory(category) || [];
    }

    static isUnlocked(achievementId) {
        return this.system?.isUnlocked(achievementId) || false;
    }
}
