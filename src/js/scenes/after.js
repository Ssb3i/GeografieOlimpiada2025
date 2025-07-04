/**
 * After Earthquake Scene - Recovery and Assessment Activities
 */

import { UIHelpers, EducationalContent, audioHelper } from '../utils/helpers.js';

export class AfterScene {
    constructor(gameState) {
        this.gameState = gameState;
        this.sceneName = 'after';
        this.completedTasks = new Set();
        this.requiredTasks = ['safety-assessment', 'injury-check', 'communication', 'damage-report'];
        this.container = null;
        this.assessmentData = {};
    }

    /**
     * Render the scene
     */
    render(container) {
        this.container = container;
        container.innerHTML = `
            <div class="scene-after">
                <div class="scene-header">
                    <h2>🏥 After an Earthquake: Recovery & Assessment</h2>
                    <p>Learn what to do immediately after an earthquake stops. Complete all assessments to finish the game!</p>
                </div>
                
                <div class="tasks-grid">
                    <div class="task-card" data-task="safety-assessment">
                        <div class="task-header">
                            <h3>🔍 Safety Assessment</h3>
                            <span class="task-status">Incomplete</span>
                        </div>
                        <p>Check your immediate environment for hazards.</p>
                        <div class="safety-checklist" id="safety-checklist"></div>
                    </div>
                    
                    <div class="task-card" data-task="injury-check">
                        <div class="task-header">
                            <h3>🩹 Injury Assessment</h3>
                            <span class="task-status">Incomplete</span>
                        </div>
                        <p>Check yourself and others for injuries and provide first aid.</p>
                        <div class="injury-scenarios" id="injury-scenarios"></div>
                    </div>
                    
                    <div class="task-card" data-task="communication">
                        <div class="task-header">
                            <h3>📡 Emergency Communication</h3>
                            <span class="task-status">Incomplete</span>
                        </div>
                        <p>Contact emergency services and family members.</p>
                        <div class="communication-center" id="communication-center"></div>
                    </div>
                    
                    <div class="task-card" data-task="damage-report">
                        <div class="task-header">
                            <h3>📋 Damage Documentation</h3>
                            <span class="task-status">Incomplete</span>
                        </div>
                        <p>Document damage for insurance and emergency services.</p>
                        <div class="damage-reporter" id="damage-reporter"></div>
                    </div>
                </div>
                
                <div class="recovery-timeline" id="recovery-timeline">
                    <h3>📅 Recovery Timeline</h3>
                    <div class="timeline-steps">
                        <div class="timeline-step" data-step="immediate">
                            <span class="step-time">0-1 hours</span>
                            <span class="step-title">Immediate Safety</span>
                        </div>
                        <div class="timeline-step" data-step="short-term">
                            <span class="step-time">1-24 hours</span>
                            <span class="step-title">Assessment & Communication</span>
                        </div>
                        <div class="timeline-step" data-step="medium-term">
                            <span class="step-time">1-7 days</span>
                            <span class="step-title">Temporary Shelter & Supplies</span>
                        </div>
                        <div class="timeline-step" data-step="long-term">
                            <span class="step-time">Weeks-Months</span>
                            <span class="step-title">Recovery & Rebuilding</span>
                        </div>
                    </div>
                </div>
                
                <div class="educational-panel">
                    <h3>💡 Recovery Tips</h3>
                    <div class="fact-display" id="fact-display">
                        Most injuries after earthquakes happen during cleanup and recovery, not during the shaking itself.
                    </div>
                </div>
            </div>
        `;

        this.initializeTasks();
    }

    /**
     * Initialize all recovery tasks
     */
    initializeTasks() {
        this.initSafetyAssessment();
        this.initInjuryCheck();
        this.initCommunication();
        this.initDamageReport();
        this.initRecoveryTimeline();
    }

    /**
     * Initialize safety assessment checklist
     */
    initSafetyAssessment() {
        const safetyChecklist = document.getElementById('safety-checklist');
        
        const hazards = [
            { id: 'gas-leak', name: 'Check for gas leaks', priority: 'high', points: 20 },
            { id: 'electrical-damage', name: 'Check electrical systems', priority: 'high', points: 20 },
            { id: 'structural-damage', name: 'Assess building structure', priority: 'high', points: 15 },
            { id: 'water-damage', name: 'Check water lines', priority: 'medium', points: 10 },
            { id: 'blocked-exits', name: 'Clear exit routes', priority: 'high', points: 15 },
            { id: 'broken-glass', name: 'Clear broken glass', priority: 'medium', points: 5 },
            { id: 'fallen-objects', name: 'Remove fallen objects from walkways', priority: 'medium', points: 5 }
        ];

        safetyChecklist.innerHTML = `
            <div class="checklist-container">
                <div class="checklist-instructions">
                    <p>Click on each safety check as you complete it. Prioritize high-priority items first!</p>
                </div>
                <div class="hazard-checklist">
                    ${hazards.map(hazard => `
                        <div class="hazard-item ${hazard.priority}-priority" data-hazard="${hazard.id}">
                            <div class="hazard-checkbox" id="check-${hazard.id}">
                                <span class="checkbox">☐</span>
                            </div>
                            <div class="hazard-info">
                                <span class="hazard-name">${hazard.name}</span>
                                <span class="hazard-priority">${hazard.priority.toUpperCase()}</span>
                                <span class="hazard-points">+${hazard.points} pts</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="safety-score">
                    <span>Safety Score: <span id="safety-score">0</span> / 90</span>
                </div>
            </div>
        `;

        // Add click handlers for hazard checks
        hazards.forEach(hazard => {
            const hazardElement = document.querySelector(`[data-hazard="${hazard.id}"]`);
            hazardElement.addEventListener('click', () => {
                this.toggleHazardCheck(hazard.id, hazard.points, hazards);
            });
        });
    }

    /**
     * Toggle hazard check completion
     */
    toggleHazardCheck(hazardId, points, allHazards) {
        const hazardElement = document.querySelector(`[data-hazard="${hazardId}"]`);
        const checkbox = document.getElementById(`check-${hazardId}`);
        
        if (hazardElement.classList.contains('completed')) {
            // Uncheck
            hazardElement.classList.remove('completed');
            checkbox.querySelector('.checkbox').textContent = '☐';
            this.gameState.addScore(this.sceneName, -points);
        } else {
            // Check
            hazardElement.classList.add('completed');
            checkbox.querySelector('.checkbox').textContent = '☑';
            this.gameState.addScore(this.sceneName, points);
            audioHelper.playSuccess();
        }

        // Update safety score display
        const completedHazards = document.querySelectorAll('.hazard-item.completed').length;
        const totalScore = Array.from(document.querySelectorAll('.hazard-item.completed'))
            .reduce((total, item) => {
                const hazardId = item.dataset.hazard;
                const hazard = allHazards.find(h => h.id === hazardId);
                return total + (hazard ? hazard.points : 0);
            }, 0);
        
        document.getElementById('safety-score').textContent = totalScore;

        // Check if task is complete (at least 5 items checked including all high priority)
        const highPriorityCompleted = document.querySelectorAll('.high-priority.completed').length;
        const highPriorityTotal = document.querySelectorAll('.high-priority').length;
        
        if (completedHazards >= 5 && highPriorityCompleted === highPriorityTotal) {
            this.markTaskComplete('safety-assessment');
        }
    }

    /**
     * Initialize injury check scenarios
     */
    initInjuryCheck() {
        const injuryScenarios = document.getElementById('injury-scenarios');
        
        const scenarios = [
            {
                id: 'self-check',
                title: 'Check Yourself',
                description: 'Assess your own condition first',
                actions: ['Check for bleeding', 'Test mobility', 'Assess pain levels'],
                completed: false
            },
            {
                id: 'conscious-victim',
                title: 'Conscious Person with Cut',
                description: 'Someone has a bleeding cut on their arm',
                actions: ['Apply direct pressure', 'Elevate if possible', 'Cover with clean cloth'],
                completed: false
            },
            {
                id: 'unconscious-victim',
                title: 'Unconscious Person',
                description: 'Someone is unconscious but breathing',
                actions: ['Check airway', 'Monitor breathing', 'Place in recovery position'],
                completed: false
            },
            {
                id: 'trapped-victim',
                title: 'Person Trapped Under Debris',
                description: 'Someone is trapped but conscious',
                actions: ['Talk to them calmly', 'Do not move heavy debris alone', 'Call for professional help'],
                completed: false
            }
        ];

        injuryScenarios.innerHTML = `
            <div class="injury-scenarios-container">
                <div class="scenario-selector">
                    ${scenarios.map(scenario => `
                        <div class="injury-scenario-card" data-scenario="${scenario.id}">
                            <h4>${scenario.title}</h4>
                            <p>${scenario.description}</p>
                            <button class="start-scenario-btn">Start Assessment</button>
                            <div class="scenario-status">Not Started</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="first-aid-guide">
                    <h4>🚑 First Aid Priorities</h4>
                    <ol>
                        <li><strong>Check yourself first</strong> - You can't help others if you're injured</li>
                        <li><strong>Ensure scene safety</strong> - Don't become another victim</li>
                        <li><strong>Call for help</strong> - Professional medical assistance</li>
                        <li><strong>Control bleeding</strong> - Direct pressure on wounds</li>
                        <li><strong>Treat for shock</strong> - Keep victims warm and calm</li>
                    </ol>
                </div>
            </div>
        `;

        // Add scenario handlers
        scenarios.forEach(scenario => {
            const card = document.querySelector(`[data-scenario="${scenario.id}"]`);
            const button = card.querySelector('.start-scenario-btn');
            
            button.addEventListener('click', () => {
                this.startInjuryScenario(scenario);
            });
        });
    }

    /**
     * Start an injury assessment scenario
     */
    startInjuryScenario(scenario) {
        const modal = document.getElementById('feedback-modal');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <div class="injury-scenario-modal">
                <h3>${scenario.title}</h3>
                <p><strong>Situation:</strong> ${scenario.description}</p>
                
                <div class="first-aid-actions">
                    <h4>Select the correct actions (in order):</h4>
                    <div class="action-options">
                        ${scenario.actions.map((action, index) => `
                            <div class="action-option" data-action="${index}">
                                <span class="action-number">${index + 1}</span>
                                <span class="action-text">${action}</span>
                                <button class="select-action-btn">Select</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="scenario-progress">
                    <span>Progress: <span class="selected-count">0</span> / ${scenario.actions.length}</span>
                </div>
                
                <button class="btn btn--primary complete-scenario-btn" disabled>Complete Assessment</button>
            </div>
        `;

        // Show modal
        modal.setAttribute('aria-hidden', 'false');

        // Handle action selection
        let selectedActions = 0;
        const actionButtons = modalBody.querySelectorAll('.select-action-btn');
        
        actionButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (!btn.classList.contains('selected')) {
                    btn.classList.add('selected');
                    btn.textContent = 'Selected ✓';
                    selectedActions++;
                    
                    modalBody.querySelector('.selected-count').textContent = selectedActions;
                    
                    if (selectedActions === scenario.actions.length) {
                        modalBody.querySelector('.complete-scenario-btn').disabled = false;
                    }
                }
            });
        });

        // Handle scenario completion
        modalBody.querySelector('.complete-scenario-btn').addEventListener('click', () => {
            this.completeInjuryScenario(scenario.id);
            this.closeModal();
        });
    }

    /**
     * Complete an injury scenario
     */
    completeInjuryScenario(scenarioId) {
        const card = document.querySelector(`[data-scenario="${scenarioId}"]`);
        card.classList.add('completed');
        card.querySelector('.scenario-status').textContent = 'Completed ✓';
        card.querySelector('.start-scenario-btn').disabled = true;
        
        this.gameState.addScore(this.sceneName, 25);
        this.assessmentData[scenarioId] = true;
        
        // Check if all scenarios completed
        const completedScenarios = Object.keys(this.assessmentData).length;
        if (completedScenarios >= 3) { // Need at least 3 out of 4
            this.markTaskComplete('injury-check');
        }
    }

    /**
     * Initialize communication center
     */
    initCommunication() {
        const communicationCenter = document.getElementById('communication-center');
        
        communicationCenter.innerHTML = `
            <div class="communication-container">
                <div class="communication-options">
                    <div class="comm-option emergency-services" data-comm="emergency">
                        <div class="comm-icon">🚨</div>
                        <div class="comm-title">Emergency Services</div>
                        <div class="comm-subtitle">911 / Local Emergency</div>
                        <button class="contact-btn">Call Now</button>
                    </div>
                    
                    <div class="comm-option family-contacts" data-comm="family">
                        <div class="comm-icon">👨‍👩‍👧‍👦</div>
                        <div class="comm-title">Family & Friends</div>
                        <div class="comm-subtitle">Let them know you're safe</div>
                        <button class="contact-btn">Send Messages</button>
                    </div>
                    
                    <div class="comm-option emergency-radio" data-comm="radio">
                        <div class="comm-icon">📻</div>
                        <div class="comm-title">Emergency Radio</div>
                        <div class="comm-subtitle">Get official updates</div>
                        <button class="contact-btn">Tune In</button>
                    </div>
                    
                    <div class="comm-option social-media" data-comm="social">
                        <div class="comm-icon">📱</div>
                        <div class="comm-title">Social Media</div>
                        <div class="comm-subtitle">Check local emergency pages</div>
                        <button class="contact-btn">Check Updates</button>
                    </div>
                </div>
                
                <div class="communication-log">
                    <h4>Communication Log</h4>
                    <div class="log-entries" id="comm-log"></div>
                </div>
            </div>
        `;

        // Add communication handlers
        const commButtons = communicationCenter.querySelectorAll('.contact-btn');
        commButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commType = e.target.closest('.comm-option').dataset.comm;
                this.handleCommunication(commType);
            });
        });
    }

    /**
     * Handle communication actions
     */
    handleCommunication(commType) {
        const commLog = document.getElementById('comm-log');
        const timestamp = new Date().toLocaleTimeString();
        let logEntry = '';
        let points = 0;

        switch (commType) {
            case 'emergency':
                logEntry = `${timestamp} - Called emergency services (911)`;
                points = 30;
                break;
            case 'family':
                logEntry = `${timestamp} - Contacted family members via text`;
                points = 20;
                break;
            case 'radio':
                logEntry = `${timestamp} - Tuned to emergency radio broadcasts`;
                points = 15;
                break;
            case 'social':
                logEntry = `${timestamp} - Checked local emergency social media`;
                points = 10;
                break;
        }

        // Add to log
        const logDiv = document.createElement('div');
        logDiv.className = 'log-entry';
        logDiv.textContent = logEntry;
        commLog.appendChild(logDiv);

        // Mark communication option as used
        const commOption = document.querySelector(`[data-comm="${commType}"]`);
        commOption.classList.add('used');
        commOption.querySelector('.contact-btn').disabled = true;

        this.gameState.addScore(this.sceneName, points);
        audioHelper.playSuccess();

        // Check if task complete (at least 3 communications)
        const usedComms = document.querySelectorAll('.comm-option.used').length;
        if (usedComms >= 3) {
            this.markTaskComplete('communication');
        }
    }

    /**
     * Initialize damage reporting
     */
    initDamageReport() {
        const damageReporter = document.getElementById('damage-reporter');
        
        damageReporter.innerHTML = `
            <div class="damage-report-container">
                <div class="report-form">
                    <h4>📋 Damage Assessment Form</h4>
                    
                    <div class="damage-categories">
                        <div class="damage-category">
                            <h5>Structural Damage</h5>
                            <label><input type="checkbox" name="damage" value="foundation"> Foundation cracks</label>
                            <label><input type="checkbox" name="damage" value="walls"> Wall damage</label>
                            <label><input type="checkbox" name="damage" value="roof"> Roof damage</label>
                            <label><input type="checkbox" name="damage" value="windows"> Broken windows</label>
                        </div>
                        
                        <div class="damage-category">
                            <h5>Utilities</h5>
                            <label><input type="checkbox" name="damage" value="electricity"> Electrical issues</label>
                            <label><input type="checkbox" name="damage" value="water"> Water line damage</label>
                            <label><input type="checkbox" name="damage" value="gas"> Gas line issues</label>
                            <label><input type="checkbox" name="damage" value="sewer"> Sewer problems</label>
                        </div>
                        
                        <div class="damage-category">
                            <h5>Personal Property</h5>
                            <label><input type="checkbox" name="damage" value="furniture"> Furniture damage</label>
                            <label><input type="checkbox" name="damage" value="appliances"> Appliance damage</label>
                            <label><input type="checkbox" name="damage" value="electronics"> Electronics damage</label>
                            <label><input type="checkbox" name="damage" value="valuables"> Valuable items</label>
                        </div>
                    </div>
                    
                    <div class="report-photos">
                        <h5>📷 Photo Documentation</h5>
                        <div class="photo-instructions">
                            <p>Take photos of damage for insurance claims:</p>
                            <button class="photo-btn" data-photo="overview">📸 Overall damage</button>
                            <button class="photo-btn" data-photo="details">📸 Detail shots</button>
                            <button class="photo-btn" data-photo="receipts">📸 Receipts/documents</button>
                        </div>
                        <div class="photo-gallery" id="photo-gallery"></div>
                    </div>
                    
                    <div class="report-actions">
                        <button class="btn btn--primary" id="submit-damage-report">Submit Damage Report</button>
                        <button class="btn btn--secondary" id="save-draft-report">Save as Draft</button>
                    </div>
                </div>
            </div>
        `;

        // Handle photo documentation
        const photoButtons = damageReporter.querySelectorAll('.photo-btn');
        photoButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.takePhoto(btn.dataset.photo);
            });
        });

        // Handle form submission
        document.getElementById('submit-damage-report').addEventListener('click', () => {
            this.submitDamageReport();
        });

        document.getElementById('save-draft-report').addEventListener('click', () => {
            this.saveDraftReport();
        });
    }

    /**
     * Simulate taking a photo
     */
    takePhoto(photoType) {
        const photoGallery = document.getElementById('photo-gallery');
        const photoElement = document.createElement('div');
        photoElement.className = 'photo-item';
        photoElement.innerHTML = `
            <div class="photo-thumbnail">📷</div>
            <div class="photo-label">${photoType.replace('-', ' ')}</div>
        `;
        photoGallery.appendChild(photoElement);
        
        this.gameState.addScore(this.sceneName, 5);
        audioHelper.playClick();
    }

    /**
     * Submit damage report
     */
    submitDamageReport() {
        const checkedDamage = document.querySelectorAll('input[name="damage"]:checked');
        const photos = document.querySelectorAll('.photo-item');
        
        if (checkedDamage.length >= 3 && photos.length >= 2) {
            this.gameState.addScore(this.sceneName, 40);
            this.markTaskComplete('damage-report');
            
            alert('Damage report submitted successfully! This information has been sent to emergency services and your insurance company.');
            audioHelper.playSuccess();
        } else {
            alert('Please document at least 3 types of damage and take at least 2 photos before submitting.');
            audioHelper.playError();
        }
    }

    /**
     * Save draft report
     */
    saveDraftReport() {
        const checkedDamage = document.querySelectorAll('input[name="damage"]:checked');
        this.gameState.addScore(this.sceneName, 10);
        alert(`Draft saved with ${checkedDamage.length} damage items documented.`);
        audioHelper.playClick();
    }

    /**
     * Initialize recovery timeline
     */
    initRecoveryTimeline() {
        const timelineSteps = document.querySelectorAll('.timeline-step');
        
        timelineSteps.forEach(step => {
            step.addEventListener('click', () => {
                this.showTimelineInfo(step.dataset.step);
            });
        });
    }

    /**
     * Show timeline step information
     */
    showTimelineInfo(step) {
        const stepInfo = {
            'immediate': {
                title: 'Immediate Safety (0-1 hours)',
                content: `
                    <ul>
                        <li>Check for injuries and provide first aid</li>
                        <li>Check for hazards (gas leaks, electrical damage)</li>
                        <li>Turn off utilities if damaged</li>
                        <li>Exit building if structurally unsafe</li>
                        <li>Contact emergency services if needed</li>
                    </ul>
                `
            },
            'short-term': {
                title: 'Assessment & Communication (1-24 hours)',
                content: `
                    <ul>
                        <li>Contact family and friends</li>
                        <li>Listen to emergency broadcasts</li>
                        <li>Document damage with photos</li>
                        <li>Contact insurance company</li>
                        <li>Stay away from damaged buildings</li>
                    </ul>
                `
            },
            'medium-term': {
                title: 'Temporary Shelter & Supplies (1-7 days)',
                content: `
                    <ul>
                        <li>Find temporary shelter if needed</li>
                        <li>Use emergency supplies</li>
                        <li>Continue monitoring emergency broadcasts</li>
                        <li>Begin cleanup when safe</li>
                        <li>Apply for disaster assistance</li>
                    </ul>
                `
            },
            'long-term': {
                title: 'Recovery & Rebuilding (Weeks-Months)',
                content: `
                    <ul>
                        <li>Work with insurance adjusters</li>
                        <li>Hire contractors for repairs</li>
                        <li>Replace damaged belongings</li>
                        <li>Update emergency plans based on experience</li>
                        <li>Support community recovery efforts</li>
                    </ul>
                `
            }
        };

        const info = stepInfo[step];
        this.showModal(info.title, info.content);
    }

    /**
     * Show modal with content
     */
    showModal(title, content) {
        const modal = document.getElementById('feedback-modal');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <div class="timeline-info">
                <h3>${title}</h3>
                <div>${content}</div>
            </div>
        `;
        
        modal.setAttribute('aria-hidden', 'false');
    }

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.getElementById('feedback-modal');
        modal.setAttribute('aria-hidden', 'true');
    }

    /**
     * Mark a task as complete
     */
    markTaskComplete(taskId) {
        this.completedTasks.add(taskId);
        
        const taskCard = document.querySelector(`[data-task="${taskId}"]`);
        if (taskCard) {
            taskCard.classList.add('task-completed');
            const status = taskCard.querySelector('.task-status');
            status.textContent = 'Complete ✓';
            status.classList.add('completed');
        }

        // Update educational content
        this.updateEducationalContent();
    }

    /**
     * Update educational content panel
     */
    updateEducationalContent() {
        const factDisplay = document.getElementById('fact-display');
        const tip = EducationalContent.getRandomTip('after');
        factDisplay.textContent = tip;
    }

    /**
     * Activate the scene
     */
    activate() {
        audioHelper.init();
        this.updateEducationalContent();
    }

    /**
     * Check if user can proceed (game completion)
     */
    canProceed() {
        return this.completedTasks.size >= this.requiredTasks.length;
    }

    /**
     * Get current hint for the scene
     */
    getCurrentHint() {
        if (this.completedTasks.size === 0) {
            return "Start with safety assessment - check for immediate hazards first!";
        } else if (this.completedTasks.size < 2) {
            return "Good progress! Continue with injury assessment and communication.";
        } else if (this.completedTasks.size < this.requiredTasks.length) {
            return "Almost finished! Complete the remaining recovery tasks.";
        } else {
            return "Congratulations! You've completed all earthquake preparedness training!";
        }
    }
}

// Legacy export for backward compatibility
export function showAfterScene() {
    const afterScene = document.createElement('div');
    afterScene.className = 'scene';
    
    const title = document.createElement('h1');
    title.textContent = 'After the Earthquake';
    afterScene.appendChild(title);
    
    const instructions = document.createElement('p');
    instructions.textContent = '1. Check yourself and others for injuries. \n' +
                               '2. If you are in a damaged building, exit carefully. \n' +
                               '3. Avoid using matches, candles, or flames. \n' +
                               '4. Stay away from damaged areas. \n' +
                               '5. Listen to the radio or TV for updates. \n' +
                               '6. Be prepared for aftershocks.';
    afterScene.appendChild(instructions);
    
    document.body.innerHTML = ''; // Clear previous content
    document.body.appendChild(afterScene);
}