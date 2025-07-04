/**
 * During Earthquake Scene - Drop, Cover, Hold On Actions
 */

import { UIHelpers, EducationalContent, audioHelper } from '../utils/helpers.js';
// import { gameAudio } from '../../assets/audio/sounds.js';
// import { ParticleHelper } from '../utils/particles.js';

export class DuringScene {
    constructor(gameState) {
        this.gameState = gameState;
        this.sceneName = 'during';
        this.currentScenario = null;
        this.reactionTime = 0;
        this.scenarios = this.createScenarios();
        this.timer = null;
        this.earthquakeActive = false;
    }

    /**
     * Play earthquake rumbling sound effect
     */
    playEarthquakeSound() {
        // Only play if audioHelper is available and not disabled
        if (typeof audioHelper !== 'undefined' && audioHelper.playEarthquake) {
            audioHelper.playEarthquake(this.currentScenario.maxTime);
        } else {
            // Fallback: just log
            console.log('Playing earthquake sound effect (audio disabled)');
        }
    }

    /**
     * Create different earthquake scenarios
     */
    createScenarios() {
        return [
            {
                id: 'indoor-office',
                title: 'Office Building - 3rd Floor',
                description: 'You are working at your desk when the ground starts shaking.',
                correctActions: ['drop', 'cover-desk', 'hold-on'],
                wrongActions: ['run-outside', 'doorway', 'elevator'],
                environment: 'indoor',
                maxTime: 10000 // 10 seconds
            },
            {
                id: 'indoor-home',
                title: 'Living Room at Home',
                description: 'You are watching TV when you feel strong shaking.',
                correctActions: ['drop', 'cover-table', 'hold-on'],
                wrongActions: ['run-outside', 'stand-still', 'hide-doorway'],
                environment: 'indoor',
                maxTime: 8000
            },
            {
                id: 'outdoor-street',
                title: 'Walking on a City Street',
                description: 'You are walking when the earthquake begins.',
                correctActions: ['move-away-buildings', 'drop-open-area', 'protect-head'],
                wrongActions: ['run-into-building', 'stand-under-sign', 'panic-run'],
                environment: 'outdoor',
                maxTime: 12000
            },
            {
                id: 'driving-car',
                title: 'Driving on a Highway',
                description: 'You are driving when you feel the car shaking.',
                correctActions: ['pull-over', 'stay-in-car', 'avoid-bridges'],
                wrongActions: ['keep-driving', 'get-out-car', 'stop-under-bridge'],
                environment: 'vehicle',
                maxTime: 15000
            }
        ];
    }

    /**
     * Render the scene
     */
    render(container) {
        this.container = container;
        container.innerHTML = `
            <div class="scene-during">
                <div class="scene-header">
                    <h2>⚡ During an Earthquake: Take Action!</h2>
                    <p>Practice the correct responses during earthquake scenarios. React quickly and choose the right actions!</p>
                </div>

                <div class="scenario-selector" id="scenario-selector">
                    <h3>Choose a Scenario to Practice:</h3>
                    <div class="scenario-grid">
                        ${this.scenarios.map(scenario => `
                            <div class="scenario-card" data-scenario="${scenario.id}">
                                <h4>${scenario.title}</h4>
                                <p>${scenario.description}</p>
                                <div class="scenario-type">${scenario.environment.toUpperCase()}</div>
                                <button class="start-scenario-btn" data-scenario="${scenario.id}">Start Scenario</button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="scenario-player hidden" id="scenario-player">
                    <div class="earthquake-warning" id="earthquake-warning">
                        <div class="warning-text">🚨 EARTHQUAKE DETECTED! 🚨</div>
                        <div class="countdown" id="countdown">3</div>
                    </div>
                    
                    <div class="scenario-environment" id="scenario-environment">
                        <!-- Environment will be dynamically created -->
                    </div>
                    
                    <div class="action-panel" id="action-panel">
                        <div class="timer-display">
                            <span>Time Remaining: </span>
                            <span class="timer" id="timer">10.0s</span>
                        </div>
                        <div class="actions-grid" id="actions-grid">
                            <!-- Action buttons will be dynamically created -->
                        </div>
                    </div>
                    
                    <div class="feedback-panel hidden" id="feedback-panel">
                        <div class="feedback-content">
                            <h3 id="feedback-title">Great Job!</h3>
                            <div id="feedback-message"></div>
                            <div class="scenario-stats">
                                <div>Reaction Time: <span id="reaction-time">0.0s</span></div>
                                <div>Score: <span id="scenario-score">0</span> points</div>
                            </div>
                            <button class="btn btn--primary" id="next-scenario">Try Another Scenario</button>
                            <button class="btn btn--secondary" id="replay-scenario">Replay This Scenario</button>
                        </div>
                    </div>
                </div>

                <div class="educational-panel">
                    <h3>🎯 Remember: Drop, Cover, Hold On</h3>
                    <div class="action-guide">
                        <div class="action-step">
                            <strong>1. DROP:</strong> Get down on hands and knees immediately
                        </div>
                        <div class="action-step">
                            <strong>2. COVER:</strong> Take cover under a sturdy desk or table
                        </div>
                        <div class="action-step">
                            <strong>3. HOLD ON:</strong> Hold on to your shelter and protect your head
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.initializeScenarios();
    }

    /**
     * Initialize scenario selection and gameplay
     */
    initializeScenarios() {
        // Scenario selection
        const scenarioCards = document.querySelectorAll('.start-scenario-btn');
        scenarioCards.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scenarioId = e.target.dataset.scenario;
                // gameAudio.playClick();
                this.startScenario(scenarioId);
            });
        });

        // Feedback panel buttons
        document.getElementById('next-scenario').addEventListener('click', () => {
            // gameAudio.playClick();
            this.returnToScenarioSelection();
        });

        document.getElementById('replay-scenario').addEventListener('click', () => {
            if (this.currentScenario) {
                // gameAudio.playClick();
                this.startScenario(this.currentScenario.id);
            }
        });
    }

    /**
     * Start a specific earthquake scenario
     */
    startScenario(scenarioId) {
        this.currentScenario = this.scenarios.find(s => s.id === scenarioId);
        if (!this.currentScenario) return;

        // Hide scenario selector and show player
        document.getElementById('scenario-selector').classList.add('hidden');
        document.getElementById('scenario-player').classList.remove('hidden');

        // Reset state
        this.earthquakeActive = false;
        this.reactionTime = 0;

        // Show warning countdown
        this.showEarthquakeWarning();
    }

    /**
     * Show earthquake warning with countdown
     */
    showEarthquakeWarning() {
        const warning = document.getElementById('earthquake-warning');
        const countdown = document.getElementById('countdown');
        warning.classList.remove('hidden');
        let count = 3;
        let ticks = 0;
        const countdownInterval = setInterval(() => {
            if (countdown) countdown.textContent = count;
            console.log('Countdown tick:', count);
            count--;
            ticks++;
            if (count < 0 || ticks > 10) { // Failsafe: never more than 10 ticks
                clearInterval(countdownInterval);
                warning.classList.add('hidden');
                this.startEarthquakeSimulation();
            }
        }, 1000);
    }

    /**
     * Start the earthquake simulation
     */
    startEarthquakeSimulation() {
        this.earthquakeActive = true;
        this.reactionTime = Date.now();

        // Create environment
        this.createEnvironment();
        
        // Start shaking animation
        document.body.classList.add('shake');
        
        // Add particle effects for earthquake (disabled for now)
        // const environment = document.getElementById('scenario-environment');
        // ParticleHelper.earthquakeEffect(environment);
        
        // Create action buttons
        this.createActionButtons();
        
        // Start timer
        this.startTimer();
        
        // Play earthquake sound effect
        this.playEarthquakeSound();
    }

    /**
     * Create the environment based on scenario
     */
    createEnvironment() {
        const environment = document.getElementById('scenario-environment');
        const scenario = this.currentScenario;

        let environmentHTML = '';

        switch (scenario.environment) {
            case 'indoor':
                environmentHTML = `
                    <div class="indoor-environment">
                        <div class="room-layout">
                            <div class="furniture desk" id="desk">🏢 Desk</div>
                            <div class="furniture table" id="table">🪑 Table</div>
                            <div class="furniture bookshelf" id="bookshelf">📚 Bookshelf</div>
                            <div class="door" id="door">🚪 Door</div>
                            <div class="window" id="window">🪟 Window</div>
                        </div>
                        <div class="person" id="person">🧑‍💼</div>
                    </div>
                `;
                break;

            case 'outdoor':
                environmentHTML = `
                    <div class="outdoor-environment">
                        <div class="street-layout">
                            <div class="building" id="building1">🏢 Building</div>
                            <div class="building" id="building2">🏬 Store</div>
                            <div class="sign" id="sign">🪧 Sign</div>
                            <div class="open-area" id="open-area">🟩 Open Area</div>
                            <div class="power-line" id="power-line">⚡ Power Line</div>
                        </div>
                        <div class="person" id="person">🚶‍♂️</div>
                    </div>
                `;
                break;

            case 'vehicle':
                environmentHTML = `
                    <div class="vehicle-environment">
                        <div class="road-layout">
                            <div class="road" id="road">🛣️ Highway</div>
                            <div class="bridge" id="bridge">🌉 Bridge</div>
                            <div class="shoulder" id="shoulder">🚗 Shoulder</div>
                            <div class="overpass" id="overpass">🏗️ Overpass</div>
                        </div>
                        <div class="car" id="car">🚗</div>
                    </div>
                `;
                break;
        }

        environment.innerHTML = environmentHTML;
    }

    /**
     * Create action buttons for the scenario
     */
    createActionButtons() {
        const actionsGrid = document.getElementById('actions-grid');
        const scenario = this.currentScenario;
        
        // Combine correct and wrong actions
        const allActions = [...scenario.correctActions, ...scenario.wrongActions];
        
        // Shuffle actions
        const shuffledActions = allActions.sort(() => Math.random() - 0.5);

        actionsGrid.innerHTML = '';
        
        shuffledActions.forEach(actionId => {
            const actionData = this.getActionData(actionId);
            const button = document.createElement('button');
            button.className = 'action-btn';
            button.innerHTML = `
                <div class="action-icon">${actionData.icon}</div>
                <div class="action-text">${actionData.text}</div>
            `;
            
            button.addEventListener('click', () => {
                // gameAudio.playClick();
                this.handleActionClick(actionId);
            });
            
            actionsGrid.appendChild(button);
        });
    }

    /**
     * Get action data for button display
     */
    getActionData(actionId) {
        const actions = {
            'drop': { icon: '⬇️', text: 'Drop to Ground' },
            'cover-desk': { icon: '🏢', text: 'Cover Under Desk' },
            'cover-table': { icon: '🪑', text: 'Cover Under Table' },
            'hold-on': { icon: '🤲', text: 'Hold On' },
            'protect-head': { icon: '🛡️', text: 'Protect Head' },
            'move-away-buildings': { icon: '🏃‍♂️', text: 'Move Away from Buildings' },
            'drop-open-area': { icon: '🟩', text: 'Drop in Open Area' },
            'pull-over': { icon: '🚗', text: 'Pull Over Safely' },
            'stay-in-car': { icon: '🚗', text: 'Stay in Vehicle' },
            'avoid-bridges': { icon: '🚫', text: 'Avoid Overpasses' },
            'run-outside': { icon: '🏃‍♂️', text: 'Run Outside' },
            'doorway': { icon: '🚪', text: 'Stand in Doorway' },
            'elevator': { icon: '🛗', text: 'Use Elevator' },
            'stand-still': { icon: '🧍', text: 'Stand Still' },
            'hide-doorway': { icon: '🚪', text: 'Hide in Doorway' },
            'run-into-building': { icon: '🏢', text: 'Run into Building' },
            'stand-under-sign': { icon: '🪧', text: 'Stand Under Sign' },
            'panic-run': { icon: '😱', text: 'Panic and Run' },
            'keep-driving': { icon: '🚗', text: 'Keep Driving' },
            'get-out-car': { icon: '🚪', text: 'Get Out of Car' },
            'stop-under-bridge': { icon: '🌉', text: 'Stop Under Bridge' }
        };

        return actions[actionId] || { icon: '❓', text: 'Unknown Action' };
    }

    /**
     * Handle action button click
     */
    handleActionClick(actionId) {
        const isCorrect = this.currentScenario.correctActions.includes(actionId);
        this.reactionTime = Date.now() - this.reactionTime;
        
        // Stop earthquake
        this.stopEarthquake();
        
        // Calculate score
        const score = this.calculateScore(isCorrect, this.reactionTime);
        this.gameState.addScore(this.sceneName, score);
        
        // Record action
        this.gameState.recordAction(this.sceneName, {
            type: 'earthquake-response',
            scenario: this.currentScenario.id,
            action: actionId,
            correct: isCorrect,
            reactionTime: this.reactionTime,
            score: score
        });

        // Show feedback
        this.showFeedback(isCorrect, actionId, score);
    }

    /**
     * Start the scenario timer
     */
    startTimer() {
        const timerElement = document.getElementById('timer');
        let timeRemaining = this.currentScenario.maxTime;

        this.timerInterval = setInterval(() => {
            timeRemaining -= 100;
            const seconds = (timeRemaining / 1000).toFixed(1);
            timerElement.textContent = `${seconds}s`;

            if (timeRemaining <= 0) {
                this.handleTimeout();
            }
        }, 100);
    }

    /**
     * Handle scenario timeout
     */
    handleTimeout() {
        this.stopEarthquake();
        this.showFeedback(false, 'timeout', 0);
    }

    /**
     * Stop earthquake simulation
     */
    stopEarthquake() {
        this.earthquakeActive = false;
        document.body.classList.remove('shake');
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Hide action panel
        document.getElementById('action-panel').classList.add('hidden');
    }

    /**
     * Calculate score based on performance
     */
    calculateScore(isCorrect, reactionTime) {
        if (!isCorrect) return 0;

        const baseScore = 50;
        const timeBonus = Math.max(0, 30 - Math.floor(reactionTime / 1000) * 5);
        return baseScore + timeBonus;
    }

    /**
     * Show feedback after action
     */
    showFeedback(isCorrect, actionId, score) {
        const feedbackPanel = document.getElementById('feedback-panel');
        const feedbackTitle = document.getElementById('feedback-title');
        const feedbackMessage = document.getElementById('feedback-message');
        const reactionTimeDisplay = document.getElementById('reaction-time');
        const scoreDisplay = document.getElementById('scenario-score');

        // Update displays
        reactionTimeDisplay.textContent = `${(this.reactionTime / 1000).toFixed(1)}s`;
        scoreDisplay.textContent = score;

        if (isCorrect) {
            feedbackTitle.textContent = '✅ Excellent Response!';
            feedbackTitle.className = 'feedback-success';
            feedbackMessage.innerHTML = `
                <p>You chose the correct action for this earthquake scenario.</p>
                <div class="correct-explanation">
                    ${this.getActionExplanation(actionId, true)}
                </div>
            `;
            audioHelper.playSuccess();
            
            // Add celebration particles for correct answer (disabled for now)
            // ParticleHelper.celebrationEffect(feedbackPanel);
        } else if (actionId === 'timeout') {
            feedbackTitle.textContent = '⏰ Time\'s Up!';
            feedbackTitle.className = 'feedback-warning';
            feedbackMessage.innerHTML = `
                <p>You need to react quickly during an earthquake. Practice to improve your response time.</p>
                <div class="correct-actions">
                    <strong>Correct actions for this scenario:</strong>
                    <ul>
                        ${this.currentScenario.correctActions.map(action => 
                            `<li>${this.getActionData(action).text}</li>`
                        ).join('')}
                    </ul>
                </div>
            `;
        } else {
            feedbackTitle.textContent = '❌ Incorrect Action';
            feedbackTitle.className = 'feedback-error';
            feedbackMessage.innerHTML = `
                <p>That action could be dangerous during an earthquake.</p>
                <div class="wrong-explanation">
                    ${this.getActionExplanation(actionId, false)}
                </div>
                <div class="correct-actions">
                    <strong>Better choices would be:</strong>
                    <ul>
                        ${this.currentScenario.correctActions.map(action => 
                            `<li>${this.getActionData(action).text}</li>`
                        ).join('')}
                    </ul>
                </div>
            `;
            audioHelper.playError();
        }

        feedbackPanel.classList.remove('hidden');
    }

    /**
     * Get explanation for an action
     */
    getActionExplanation(actionId, isCorrect) {
        const explanations = {
            'drop': 'Dropping to hands and knees prevents you from being knocked over and protects you from falling objects.',
            'cover-desk': 'Taking cover under a sturdy desk protects you from falling debris.',
            'cover-table': 'A sturdy table provides excellent protection from falling objects.',
            'hold-on': 'Holding on to your shelter ensures it stays in place and continues protecting you.',
            'run-outside': 'Running during an earthquake increases injury risk from falling objects and being knocked down.',
            'doorway': 'Doorways in modern buildings are not stronger than other parts of the structure.',
            'elevator': 'Elevators can malfunction during earthquakes, trapping you inside.',
            'move-away-buildings': 'Moving away from buildings reduces risk from falling glass and debris.',
            'pull-over': 'Pulling over safely gets you out of traffic and away from potential hazards.',
            'stay-in-car': 'Cars provide good protection; getting out exposes you to more dangers.'
        };

        return explanations[actionId] || 'Learn more about earthquake safety guidelines.';
    }

    /**
     * Return to scenario selection
     */
    returnToScenarioSelection() {
        document.getElementById('scenario-player').classList.add('hidden');
        document.getElementById('scenario-selector').classList.remove('hidden');
        document.getElementById('feedback-panel').classList.add('hidden');
        document.getElementById('action-panel').classList.remove('hidden');
    }

    /**
     * Activate the scene
     */
    activate() {
        audioHelper.init();
    }

    /**
     * Check if user can proceed to next scene
     */
    canProceed() {
        // User can proceed after completing at least 2 scenarios successfully
        const actions = this.gameState.scenes[this.sceneName].actions;
        const successfulActions = actions.filter(action => 
            action.type === 'earthquake-response' && action.correct
        );
        return successfulActions.length >= 2;
    }

    /**
     * Get current hint for the scene
     */
    getCurrentHint() {
        const completedScenarios = this.gameState.scenes[this.sceneName].actions.length;
        
        if (completedScenarios === 0) {
            return "Practice earthquake scenarios to learn proper responses. Start with an indoor scenario!";
        } else if (completedScenarios < 2) {
            return "Great start! Try different scenarios to practice various earthquake situations.";
        } else {
            return "Well done! You've mastered earthquake response. Ready for the next phase!";
        }
    }
}

// Legacy export for backward compatibility
function showDuringScene() {
    const instructions = `
        <h2>During an Earthquake</h2>
        <ul>
            <li>Drop, Cover, and Hold On!</li>
            <li>Stay indoors if you are inside.</li>
            <li>Stay away from windows and heavy furniture.</li>
            <li>If you are outside, move to an open area away from buildings, trees, and utility wires.</li>
            <li>If you are driving, pull over to a safe spot and stay inside the vehicle until the shaking stops.</li>
        </ul>
    `;
    
    document.getElementById('game-container').innerHTML = instructions;
}

export { showDuringScene };