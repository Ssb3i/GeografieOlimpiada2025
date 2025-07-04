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
                    <h2>🏥 După cutremur: Recuperare & Evaluare</h2>
                    <p>Află ce trebuie să faci imediat după ce cutremurul s-a oprit. Completează toate evaluările pentru a termina jocul!</p>
                </div>
                
                <div class="tasks-grid">
                    <div class="task-card" data-task="safety-assessment">
                        <div class="task-header">
                            <h3>🔍 Evaluare de siguranță</h3>
                            <span class="task-status">Incomplet</span>
                        </div>
                        <p>Verifică mediul imediat pentru pericole.</p>
                        <div class="safety-checklist" id="safety-checklist"></div>
                    </div>
                    
                    <div class="task-card" data-task="injury-check">
                        <div class="task-header">
                            <h3>🩹 Evaluare răni</h3>
                            <span class="task-status">Incomplet</span>
                        </div>
                        <p>Verifică-te pe tine și pe ceilalți pentru răni și acordă primul ajutor.</p>
                        <div class="injury-scenarios" id="injury-scenarios"></div>
                    </div>
                    
                    <div class="task-card" data-task="communication">
                        <div class="task-header">
                            <h3>📡 Comunicare de urgență</h3>
                            <span class="task-status">Incomplet</span>
                        </div>
                        <p>Contactează serviciile de urgență și familia.</p>
                        <div class="communication-center" id="communication-center"></div>
                    </div>
                    
                    <div class="task-card" data-task="damage-report">
                        <div class="task-header">
                            <h3>📋 Documentare daune</h3>
                            <span class="task-status">Incomplet</span>
                        </div>
                        <p>Documentează daunele pentru asigurare și servicii de urgență.</p>
                        <div class="damage-reporter" id="damage-reporter"></div>
                    </div>
                </div>
                
                <div class="recovery-timeline" id="recovery-timeline">
                    <h3>📅 Cronologia recuperării</h3>
                    <div class="timeline-steps">
                        <div class="timeline-step" data-step="immediate">
                            <span class="step-time">0-1 ore</span>
                            <span class="step-title">Siguranță imediată</span>
                        </div>
                        <div class="timeline-step" data-step="short-term">
                            <span class="step-time">1-24 ore</span>
                            <span class="step-title">Evaluare & Comunicare</span>
                        </div>
                        <div class="timeline-step" data-step="medium-term">
                            <span class="step-time">1-7 zile</span>
                            <span class="step-title">Adăpost temporar & Provizii</span>
                        </div>
                        <div class="timeline-step" data-step="long-term">
                            <span class="step-time">Săptămâni-Luni</span>
                            <span class="step-title">Recuperare & Reconstrucție</span>
                        </div>
                    </div>
                </div>
                
                <div class="educational-panel">
                    <h3>💡 Sfaturi pentru recuperare</h3>
                    <div class="fact-display" id="fact-display">
                        Cele mai multe răni după cutremur apar în timpul curățeniei și recuperării, nu în timpul cutremurului propriu-zis.
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
            { id: 'gas-leak', name: 'Verifică scurgerile de gaz', priority: 'high', points: 20 },
            { id: 'electrical-damage', name: 'Verifică instalația electrică', priority: 'high', points: 20 },
            { id: 'structural-damage', name: 'Evaluează structura clădirii', priority: 'high', points: 15 },
            { id: 'water-damage', name: 'Verifică conductele de apă', priority: 'medium', points: 10 },
            { id: 'blocked-exits', name: 'Eliberează căile de evacuare', priority: 'high', points: 15 },
            { id: 'broken-glass', name: 'Curăță cioburile de sticlă', priority: 'medium', points: 5 },
            { id: 'fallen-objects', name: 'Îndepărtează obiectele căzute de pe trasee', priority: 'medium', points: 5 }
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
                            <h4>${scenario.title === 'Check Yourself' ? 'Verifică-te pe tine' : scenario.title === 'Conscious Person with Cut' ? 'Persoană conștientă cu tăietură' : scenario.title === 'Unconscious Person' ? 'Persoană inconștientă' : 'Persoană prinsă sub dărâmături'}</h4>
                            <p>${scenario.description === 'Assess your own condition first' ? 'Evaluează-ți propria stare mai întâi' : scenario.description === 'Someone has a bleeding cut on their arm' ? 'Cineva are o tăietură sângerândă pe braț' : scenario.description === 'Someone is unconscious but breathing' ? 'Cineva este inconștient dar respiră' : 'Cineva este prins sub dărâmături dar este conștient'}</p>
                            <button class="start-scenario-btn">Începe evaluarea</button>
                            <div class="scenario-status">Neînceput</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="first-aid-guide">
                    <h4>🚑 Priorități de prim ajutor</h4>
                    <ol>
                        <li><strong>Verifică-te pe tine întâi</strong> - Nu poți ajuta pe alții dacă ești rănit</li>
                        <li><strong>Asigură siguranța locului</strong> - Nu deveni o altă victimă</li>
                        <li><strong>Sună după ajutor</strong> - Asistență medicală profesională</li>
                        <li><strong>Controlează sângerarea</strong> - Presiune directă pe răni</li>
                        <li><strong>Tratează pentru șoc</strong> - Ține victimele la cald și calmează-le</li>
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
                <h3>${scenario.title === 'Check Yourself' ? 'Verifică-te pe tine' : scenario.title === 'Conscious Person with Cut' ? 'Persoană conștientă cu tăietură' : scenario.title === 'Unconscious Person' ? 'Persoană inconștientă' : 'Persoană prinsă sub dărâmături'}</h3>
                <p><strong>Situație:</strong> ${scenario.description === 'Assess your own condition first' ? 'Evaluează-ți propria stare mai întâi' : scenario.description === 'Someone has a bleeding cut on their arm' ? 'Cineva are o tăietură sângerândă pe braț' : scenario.description === 'Someone is unconscious but breathing' ? 'Cineva este inconștient dar respiră' : 'Cineva este prins sub dărâmături dar este conștient'}</p>
                
                <div class="first-aid-actions">
                    <h4>Selectează acțiunile corecte (în ordine):</h4>
                    <div class="action-options">
                        ${scenario.actions.map((action, index) => `
                            <div class="action-option" data-action="${index}">
                                <span class="action-number">${index + 1}</span>
                                <span class="action-text">${action === 'Check for bleeding' ? 'Verifică dacă sângerezi' : action === 'Test mobility' ? 'Testează mobilitatea' : action === 'Assess pain levels' ? 'Evaluează nivelul durerii' : action === 'Apply direct pressure' ? 'Aplică presiune directă' : action === 'Elevate if possible' ? 'Ridică dacă este posibil' : action === 'Cover with clean cloth' ? 'Acoperă cu o cârpă curată' : action === 'Check airway' ? 'Verifică căile respiratorii' : action === 'Monitor breathing' ? 'Monitorizează respirația' : action === 'Place in recovery position' ? 'Așază în poziție de siguranță' : action === 'Talk to them calmly' ? 'Vorbește calm cu persoana' : action === 'Do not move heavy debris alone' ? 'Nu muta singur dărâmăturile grele' : action === 'Call for professional help' ? 'Sună după ajutor specializat' : action}</span>
                                <button class="select-action-btn">Selectează</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="scenario-progress">
                    <span>Progres: <span class="selected-count">0</span> / ${scenario.actions.length}</span>
                </div>
                
                <button class="btn btn--primary complete-scenario-btn" disabled>Completează evaluarea</button>
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
                        <div class="comm-title">Servicii de urgență</div>
                        <div class="comm-subtitle">911 / Urgență locală</div>
                        <button class="contact-btn">Sună acum</button>
                    </div>
                    
                    <div class="comm-option family-contacts" data-comm="family">
                        <div class="comm-icon">👨‍👩‍👧‍👦</div>
                        <div class="comm-title">Familie & Prieteni</div>
                        <div class="comm-subtitle">Informează-i că ești în siguranță</div>
                        <button class="contact-btn">Trimite mesaje</button>
                    </div>
                    
                    <div class="comm-option emergency-radio" data-comm="radio">
                        <div class="comm-icon">📻</div>
                        <div class="comm-title">Radio de urgență</div>
                        <div class="comm-subtitle">Primește actualizări oficiale</div>
                        <button class="contact-btn">Ajustează</button>
                    </div>
                    
                    <div class="comm-option social-media" data-comm="social">
                        <div class="comm-icon">📱</div>
                        <div class="comm-title">Rețele sociale</div>
                        <div class="comm-subtitle">Verifică paginile locale de urgență</div>
                        <button class="contact-btn">Verifică actualizările</button>
                    </div>
                </div>
                
                <div class="communication-log">
                    <h4>Jurnal de comunicare</h4>
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
                logEntry = `${timestamp} - Ai sunat la serviciile de urgență (112)`;
                points = 30;
                break;
            case 'family':
                logEntry = `${timestamp} - Ai contactat familia prin mesaj`;
                points = 20;
                break;
            case 'radio':
                logEntry = `${timestamp} - Ai ascultat radioul de urgență`;
                points = 15;
                break;
            case 'social':
                logEntry = `${timestamp} - Ai verificat rețelele sociale pentru informații de urgență`;
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
                    <h4>📋 Formular de evaluare a daunelor</h4>
                    
                    <div class="damage-categories">
                        <div class="damage-category">
                            <h5>Daune structurale</h5>
                            <label><input type="checkbox" name="damage" value="foundation"> Crăpături fundație</label>
                            <label><input type="checkbox" name="damage" value="walls"> Daune pereți</label>
                            <label><input type="checkbox" name="damage" value="roof"> Daune acoperiș</label>
                            <label><input type="checkbox" name="damage" value="windows"> Geamuri sparte</label>
                        </div>
                        
                        <div class="damage-category">
                            <h5>Utilități</h5>
                            <label><input type="checkbox" name="damage" value="electricity"> Probleme electrice</label>
                            <label><input type="checkbox" name="damage" value="water"> Daune la conductele de apă</label>
                            <label><input type="checkbox" name="damage" value="gas"> Probleme la conductele de gaz</label>
                            <label><input type="checkbox" name="damage" value="sewer"> Probleme cu canalizarea</label>
                        </div>
                        
                        <div class="damage-category">
                            <h5>Proprietate personală</h5>
                            <label><input type="checkbox" name="damage" value="furniture"> Daune mobilier</label>
                            <label><input type="checkbox" name="damage" value="appliances"> Daune electrocasnice</label>
                            <label><input type="checkbox" name="damage" value="electronics"> Daune electronice</label>
                            <label><input type="checkbox" name="damage" value="valuables"> Daune bunuri de valoare</label>
                        </div>
                    </div>
                    
                    <div class="report-photos">
                        <h5>📷 Documentație foto</h5>
                        <div class="photo-instructions">
                            <p>Fă fotografii cu daunele pentru cererile de despăgubire:</p>
                            <button class="photo-btn" data-photo="overview">📸 Daune generale</button>
                            <button class="photo-btn" data-photo="details">📸 Fotografii detaliate</button>
                            <button class="photo-btn" data-photo="receipts">📸 Chitanțe/documente</button>
                        </div>
                        <div class="photo-gallery" id="photo-gallery"></div>
                    </div>
                    
                    <div class="report-actions">
                        <button class="btn btn--primary" id="submit-damage-report">Trimite raport daune</button>
                        <button class="btn btn--secondary" id="save-draft-report">Salvează ca schiță</button>
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
            
            alert('Raportul de daune a fost trimis cu succes! Informațiile au fost transmise către serviciile de urgență și compania de asigurări.');
            audioHelper.playSuccess();
        } else {
            alert('Te rugăm să bifezi cel puțin 3 tipuri de daune și să faci cel puțin 2 fotografii înainte de a trimite raportul.');
            audioHelper.playError();
        }
    }

    /**
     * Save draft report
     */
    saveDraftReport() {
        const checkedDamage = document.querySelectorAll('input[name="damage"]:checked');
        this.gameState.addScore(this.sceneName, 10);
        alert(`Schița a fost salvată cu ${checkedDamage.length} tipuri de daune documentate.`);
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
                title: 'Siguranță imediată (0-1 ore)',
                content: `
                    <ul>
                        <li>Verifică dacă există răniți și acordă primul ajutor</li>
                        <li>Verifică pericolele (scurgeri de gaz, probleme electrice)</li>
                        <li>Oprește utilitățile dacă sunt avariate</li>
                        <li>Părăsește clădirea dacă nu este sigură structural</li>
                        <li>Contactează serviciile de urgență dacă este necesar</li>
                    </ul>
                `
            },
            'short-term': {
                title: 'Evaluare & Comunicare (1-24 ore)',
                content: `
                    <ul>
                        <li>Contactează familia și prietenii</li>
                        <li>Ascultă transmisiunile de urgență</li>
                        <li>Documentează daunele cu fotografii</li>
                        <li>Contactează compania de asigurări</li>
                        <li>Evită clădirile avariate</li>
                    </ul>
                `
            },
            'medium-term': {
                title: 'Adăpost temporar & Provizii (1-7 zile)',
                content: `
                    <ul>
                        <li>Caută adăpost temporar dacă este nevoie</li>
                        <li>Folosește proviziile de urgență</li>
                        <li>Continuă să asculți transmisiunile de urgență</li>
                        <li>Începe curățenia când este sigur</li>
                        <li>Aplică pentru ajutor în caz de dezastru</li>
                    </ul>
                `
            },
            'long-term': {
                title: 'Recuperare & Reconstrucție (Săptămâni-Luni)',
                content: `
                    <ul>
                        <li>Colaborează cu evaluatorii de asigurări</li>
                        <li>Angajează firme pentru reparații</li>
                        <li>Înlocuiește bunurile deteriorate</li>
                        <li>Actualizează planurile de urgență pe baza experienței</li>
                        <li>Sprijină eforturile de recuperare ale comunității</li>
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
            status.textContent = 'Complet ✓';
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
            return "Începe cu evaluarea de siguranță - verifică pericolele imediate!";
        } else if (this.completedTasks.size < 2) {
            return "Progres bun! Continuă cu evaluarea rănilor și comunicarea.";
        } else if (this.completedTasks.size < this.requiredTasks.length) {
            return "Aproape ai terminat! Completează restul sarcinilor de recuperare.";
        } else {
            return "Felicitări! Ai finalizat toate etapele de pregătire pentru cutremur!";
        }
    }
}

// Legacy export for backward compatibility
export function showAfterScene() {
    const afterScene = document.createElement('div');
    afterScene.className = 'scene';
    
    const title = document.createElement('h1');
    title.textContent = 'După cutremur';
    afterScene.appendChild(title);
    
    const instructions = document.createElement('p');
    instructions.textContent = '1. Verifică-te pe tine și pe ceilalți pentru răni. \n' +
                               '2. Dacă ești într-o clădire avariată, ieși cu grijă. \n' +
                               '3. Evită folosirea chibriturilor, lumânărilor sau flăcărilor. \n' +
                               '4. Stai departe de zonele avariate. \n' +
                               '5. Ascultă radioul sau televizorul pentru actualizări. \n' +
                               '6. Fii pregătit pentru replici.';
    afterScene.appendChild(instructions);
    
    document.body.innerHTML = ''; // Clear previous content
    document.body.appendChild(afterScene);
}