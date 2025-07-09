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
                title: 'Scoala - Etajul 3',
                description: 'Esti la scoala când începe să se zguduie pământul.',
                correctActions: ['drop', 'cover-desk', 'hold-on'],
                wrongActions: ['run-outside', 'doorway', 'elevator'],
                environment: 'inauntru',
                maxTime: 10000 // 10 secunde
            },
            {
                id: 'indoor-home',
                title: 'Sufrageria de acasă',
                description: 'Te uiți la televizor când simți o zguduire puternică.',
                correctActions: ['drop', 'cover-table', 'hold-on'],
                wrongActions: ['run-outside', 'stand-still', 'hide-doorway'],
                environment: 'inauntru',
                maxTime: 8000
            },
            {
                id: 'outdoor-street',
                title: 'Pe stradă în oraș',
                description: 'Mergi pe jos când începe cutremurul.',
                correctActions: ['move-away-buildings', 'drop-open-area', 'protect-head'],
                wrongActions: ['run-into-building', 'stand-under-sign', 'panic-run'],
                environment: 'afara',
                maxTime: 12000
            },
            {
                id: 'driving-car',
                title: 'Esti pe autostradă',
                description: 'Ești in masina când simți că mașina se zguduie.',
                correctActions: ['pull-over', 'stay-in-car', 'avoid-bridges'],
                wrongActions: ['keep-driving', 'get-out-car', 'stop-under-bridge'],
                environment: 'vehicul',
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
                    <h2>⚡ În timpul cutremului: Acționează rapid!</h2>
                    <p>Exersează răspunsurile corecte în scenarii de cutremur. Reacționează rapid și alege acțiunile potrivite!</p>
                </div>

                <div class="scenario-selector" id="scenario-selector">
                    <h3>Alege un scenariu pentru exersare:</h3>
                    <div class="scenario-grid">
                        ${this.scenarios.map(scenario => `
                            <div class="scenario-card" data-scenario="${scenario.id}">
                                <h4>${scenario.title}</h4>
                                <p>${scenario.description}</p>
                                <div class="scenario-type">${scenario.environment.toUpperCase()}</div>
                                <button class="start-scenario-btn" data-scenario="${scenario.id}">Începe scenariul</button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="scenario-player hidden" id="scenario-player">
                    
                    <div class="scenario-environment" id="scenario-environment">
                        <!-- Mediul va fi generat dinamic -->
                    </div>
                    
                    <div class="action-panel" id="action-panel">
                        <!-- Timer removed -->
                        <div class="actions-grid" id="actions-grid">
                            <!-- Butoane de acțiune generate dinamic -->
                        </div>
                    </div>
                    
                    <div class="feedback-panel hidden" id="feedback-panel">
                        <div class="feedback-content">
                            <h3 id="feedback-title">Bravo!</h3>
                            <div id="feedback-message"></div>
                            <div class="scenario-stats">
                                <div>Timp de reacție: <span id="reaction-time">0.0s</span></div>
                                <div>Scor: <span id="scenario-score">0</span> puncte</div>
                            </div>
                            <button class="btn btn--primary" id="next-scenario">Încearcă alt scenariu</button>
                            <button class="btn btn--secondary" id="replay-scenario">Repetă acest scenariu</button>
                        </div>
                    </div>
                </div>

                <div class="educational-panel text-grey">
                    <h3>🎯 Amintește-ți: Culcat, Acoperit, Ține-te!</h3>
                    <div class="action-guide">
                        <div class="action-step">
                            <strong>1. CULCAT:</strong> Pune-te imediat pe mâini și genunchi
                        </div>
                        <div class="action-step">
                            <strong>2. ACOPERIT:</strong> Adăpostește-te sub o masă sau birou solid
                        </div>
                        <div class="action-step">
                            <strong>3. ȚINE-TE:</strong> Ține-te de adăpost și protejează-ți capul
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
        
        // Start the earthquake simulation
        this.startEarthquakeSimulation();
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
        
        // Timer removed
        // this.startTimer();
        
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
            'drop': { icon: '⬇️', text: 'Culcă-te la pământ' },
            'cover-desk': { icon: '🏢', text: 'Adăpostește-te sub birou' },
            'cover-table': { icon: '🪑', text: 'Adăpostește-te sub masă' },
            'hold-on': { icon: '🤲', text: 'Ține-te bine' },
            'protect-head': { icon: '🛡️', text: 'Protejează-ți capul' },
            'move-away-buildings': { icon: '🏃‍♂️', text: 'Îndepărtează-te de clădiri' },
            'drop-open-area': { icon: '🟩', text: 'Culcă-te într-o zonă deschisă' },
            'pull-over': { icon: '🚗', text: 'Trage pe dreapta în siguranță' },
            'stay-in-car': { icon: '🚗', text: 'Rămâi în mașină' },
            'avoid-bridges': { icon: '🚫', text: 'Evită podurile' },
            'run-outside': { icon: '🏃‍♂️', text: 'Aleargă afară' },
            'doorway': { icon: '🚪', text: 'Stai în ușă' },
            'elevator': { icon: '🛗', text: 'Folosește liftul' },
            'stand-still': { icon: '🧍', text: 'Stai nemișcat' },
            'hide-doorway': { icon: '🚪', text: 'Ascunde-te în ușă' },
            'run-into-building': { icon: '🏢', text: 'Intră într-o clădire' },
            'stand-under-sign': { icon: '🪧', text: 'Stai sub un semn' },
            'panic-run': { icon: '😱', text: 'Fugi panicat' },
            'keep-driving': { icon: '🚗', text: 'Continuă să conduci' },
            'get-out-car': { icon: '🚪', text: 'Ieși din mașină' },
            'stop-under-bridge': { icon: '🌉', text: 'Oprește sub pod' }
        };

        return actions[actionId] || { icon: '❓', text: 'Acțiune necunoscută' };
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
     * Stop earthquake simulation
     */
    stopEarthquake() {
        this.earthquakeActive = false;
        document.body.classList.remove('shake');
        // Timer logic removed
        // if (this.timerInterval) {
        //     clearInterval(this.timerInterval);
        // }
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
            feedbackTitle.textContent = '✅ Răspuns corect!';
            feedbackTitle.className = 'feedback-success';
            feedbackMessage.innerHTML = `
                <p>Ai ales acțiunea corectă pentru acest scenariu de cutremur.</p>
                <div class="correct-explanation">
                    ${this.getActionExplanation(actionId, true)}
                </div>
            `;
            if (typeof audioHelper !== 'undefined' && audioHelper.playSuccess) {
                audioHelper.playSuccess();
            }
            
            // Add celebration particles for correct answer (disabled for now)
            // ParticleHelper.celebrationEffect(feedbackPanel);
        } else if (actionId === 'timeout') {
            feedbackTitle.textContent = '⏰ Timpul a expirat!';
            feedbackTitle.className = 'feedback-warning';
            feedbackMessage.innerHTML = `
                <p>Trebuie să reacționezi rapid în timpul unui cutremur. Exersează pentru a-ți îmbunătăți timpul de reacție.</p>
                <div class="correct-actions">
                    <strong>Acțiuni corecte pentru acest scenariu:</strong>
                    <ul>
                        ${this.currentScenario.correctActions.map(action => 
                            `<li>${this.getActionData(action).text}</li>`
                        ).join('')}
                    </ul>
                </div>
            `;
        } else {
            feedbackTitle.textContent = '❌ Acțiune greșită';
            feedbackTitle.className = 'feedback-error';
            feedbackMessage.innerHTML = `
                <p>Această acțiune poate fi periculoasă în timpul unui cutremur.</p>
                <div class="wrong-explanation">
                    ${this.getActionExplanation(actionId, false)}
                </div>
                <div class="correct-actions">
                    <strong>Opțiuni mai bune ar fi:</strong>
                    <ul>
                        ${this.currentScenario.correctActions.map(action => 
                            `<li>${this.getActionData(action).text}</li>`
                        ).join('')}
                    </ul>
                </div>
            `;
            if (typeof audioHelper !== 'undefined' && audioHelper.playError) {
                audioHelper.playError();
            }
        }

        feedbackPanel.classList.remove('hidden');
    }

    /**
     * Get explanation for an action
     */
    getActionExplanation(actionId, isCorrect) {
        const explanations = {
            'drop': 'Culcatul pe mâini și genunchi te protejează de a fi doborât și de obiectele care cad.',
            'cover-desk': 'Adăpostirea sub un birou solid te protejează de resturile care cad.',
            'cover-table': 'O masă solidă oferă protecție excelentă împotriva obiectelor care cad.',
            'hold-on': 'Ținându-te de adăpost, acesta rămâne la locul lui și continuă să te protejeze.',
            'run-outside': 'Alergatul în timpul cutremurului crește riscul de rănire din cauza obiectelor care cad.',
            'doorway': 'Ușile din clădirile moderne nu sunt mai rezistente decât alte părți ale structurii.',
            'elevator': 'Lifturile pot să se blocheze în timpul cutremurelor, riscând să rămâi captiv.',
            'move-away-buildings': 'Îndepărtarea de clădiri reduce riscul de a fi lovit de geamuri sau resturi.',
            'pull-over': 'Tragerea pe dreapta te scoate din trafic și departe de pericole.',
            'stay-in-car': 'Mașina oferă protecție bună; ieșirea te expune la mai multe pericole.'
        };

        return explanations[actionId] || 'Află mai multe despre regulile de siguranță la cutremur.';
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
        if (typeof audioHelper !== 'undefined' && audioHelper.init) {
            audioHelper.init();
        }
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
            return "Exersează scenarii de cutremur pentru a învăța răspunsurile corecte. Începe cu un scenariu de interior!";
        } else if (completedScenarios < 2) {
            return "Bun început! Încearcă scenarii diferite pentru a exersa situații variate de cutremur.";
        } else {
            return "Foarte bine! Ai stăpânit răspunsul la cutremur. Ești pregătit pentru următoarea etapă!";
        }
    }
}

// Legacy export for backward compatibility
function showDuringScene() {
    const instructions = `
        <h2>În timpul cutremului</h2>
        <ul>
            <li>Culcat, Acoperit și Ține-te!</li>
            <li>Rămâi în interior dacă ești înăuntru.</li>
            <li>Stai departe de feronerie și mobilier greu.</li>
            <li>Dacă ești afară, mergi într-o zonă deschisă, departe de clădiri, copaci și fire electrice.</li>
            <li>Dacă ești la volan, trage pe dreapta într-un loc sigur și rămâi în mașină până se oprește zguduirea.</li>
        </ul>
    `;
    
    document.getElementById('game-container').innerHTML = instructions;
}

export { showDuringScene };