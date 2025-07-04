/**
 * Before Earthquake Scene - Emergency Preparedness Activities
 */

import { UIHelpers, EducationalContent, audioHelper } from '../utils/helpers.js';

export class BeforeScene {
    constructor(gameState) {
        this.gameState = gameState;
        this.sceneName = 'before';
        this.completedTasks = new Set();
        this.requiredTasks = ['emergency-kit', 'secure-furniture'];
        this.container = null;
    }

    /**
     * Render the scene
     */
    render(container) {
        this.container = container;
        container.innerHTML = `
            <div class="scene-before">
                <div class="scene-header">
                    <h2>🏠 Înainte de cutremur: Pregătește-ți locuința</h2>
                    <p>Află cum să-ți pregătești locuința și familia pentru siguranța în caz de cutremur. Completează toate sarcinile pentru a continua!</p>
                </div>
                <div class="tasks-grid">
                    <div class="task-card" data-task="emergency-kit">
                        <div class="task-header">
                            <h3>🎒 Kit de urgență</h3>
                            <span class="task-status">Incomplet</span>
                        </div>
                        <p>Construiește un kit de urgență cu provizii esențiale.</p>
                        <div class="emergency-kit-builder">
                            <div class="kit-items" id="kit-items"></div>
                            <div class="available-items" id="available-items"></div>
                        </div>
                    </div>
                    <div class="task-card" data-task="secure-furniture">
                        <div class="task-header">
                            <h3>🔧 Fixează mobilierul</h3>
                            <span class="task-status">Incomplet</span>
                        </div>
                        <div class="furniture-room" id="furniture-room"></div>
                    </div>
                </div>
                <div class="educational-panel">
                    <h3>💡 Știai că?</h3>
                    <div class="fact-display" id="fact-display">
                        A fi pregătit înainte de un cutremur poate salva vieți și reduce rănirile cu până la 90%!
                    </div>
                </div>
            </div>
        `;

        this.initializeTasks();
    }

    /**
     * Initialize all preparation tasks
     */
    initializeTasks() {
        this.initEmergencyKit();
        this.initFurnitureSecuring();
        // Removed escape plan and emergency contacts for simplicity
    }

    /**
     * Initialize emergency kit building activity
     */
    initEmergencyKit() {
        const kitItems = document.getElementById('kit-items');
        const availableItems = document.getElementById('available-items');

        // Essential items for emergency kit
        const essentialItems = [
            { id: 'water', name: 'Apă (4 litri de persoană pe zi)', points: 15, essential: true },
            { id: 'food', name: 'Alimente neperisabile (provizii pentru 3 zile)', points: 15, essential: true },
            { id: 'flashlight', name: 'Lanternă', points: 10, essential: true },
            { id: 'radio', name: 'Radio cu baterii', points: 10, essential: true },
            { id: 'batteries', name: 'Baterii de rezervă', points: 10, essential: true },
            { id: 'first-aid', name: 'Trusă de prim ajutor', points: 15, essential: true },
            { id: 'medications', name: 'Medicamente', points: 10, essential: true },
            { id: 'tools', name: 'Unelte și provizii', points: 5, essential: false },
            { id: 'clothing', name: 'Haine de schimb', points: 5, essential: false },
            { id: 'cash', name: 'Bani și carduri', points: 5, essential: false }
        ];

        // Track which items are in the kit
        this.kitState = new Set();
        this.kitScore = 0;
        this.kitMaxItems = 7; // Only allow 7 items (number of essentials)

        // Create kit container (drop zone)
        kitItems.innerHTML = '<div class="kit-container" id="kit-container"><span class="placeholder">Trage aici obiectele esențiale</span></div>';
        availableItems.innerHTML = '';

        // Create available items (draggable)
        essentialItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.id = item.id;
            itemElement.className = `draggable-item ${item.essential ? 'essential-item' : 'optional-item'}`;
            itemElement.draggable = true;
            itemElement.innerHTML = `
                <span class="item-icon">${item.essential ? '⭐' : '📦'}</span>
                <span class="item-name">${item.name}</span>
            `;
            // Drag events
            itemElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.id);
                setTimeout(() => itemElement.classList.add('dragging'), 0);
            });
            itemElement.addEventListener('dragend', () => {
                itemElement.classList.remove('dragging');
            });
            availableItems.appendChild(itemElement);
        });

        // Set up drop zone for kit
        const kitContainer = document.getElementById('kit-container');
        kitContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            kitContainer.classList.add('drag-over');
        });
        kitContainer.addEventListener('dragleave', () => {
            kitContainer.classList.remove('drag-over');
        });
        kitContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            kitContainer.classList.remove('drag-over');
            const itemId = e.dataTransfer.getData('text/plain');
            this.addItemToKit(itemId, essentialItems);
        });
    }

    /**
     * Add item to emergency kit
     */
    addItemToKit(itemId, essentialItems) {
        const item = essentialItems.find(i => i.id === itemId);
        if (!item) return;
        const kitContainer = document.getElementById('kit-container');
        // Prevent duplicate
        if (this.kitState.has(itemId)) return;
        // Limit number of items
        if (this.kitState.size >= this.kitMaxItems) {
            audioHelper.playError && audioHelper.playError();
            return;
        }
        const itemElement = document.getElementById(itemId);
        if (!itemElement) return;
        // Remove placeholder if present
        const placeholder = kitContainer.querySelector('.placeholder');
        if (placeholder) placeholder.remove();
        this.kitState.add(itemId);
        this.kitScore += item.points;
        const kitItem = document.createElement('div');
        kitItem.className = 'kit-item';
        kitItem.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-points">+${item.points} pct</span>
            <button class="remove-item">×</button>
        `;
        kitContainer.appendChild(kitItem);
        itemElement.remove();
        // Remove item from kit and return to available on remove
        kitItem.querySelector('.remove-item').addEventListener('click', () => {
            kitItem.remove();
            this.kitState.delete(itemId);
            this.kitScore -= item.points;
            // Add back to available
            const availableItems = document.getElementById('available-items');
            availableItems.appendChild(itemElement);
            // If kit is empty, show placeholder
            if (kitContainer.querySelectorAll('.kit-item').length === 0) {
                kitContainer.innerHTML = '<span class="placeholder">Trage aici obiectele esențiale</span>';
                kitContainer.appendChild(kitItem); // re-add the removed item for correct DOM order
                kitItem.remove(); // then remove it again
            }
        });
        // Only add score when adding
        this.gameState.addScore(this.sceneName, item.points);
        audioHelper.playSuccess();
        this.checkKitCompletion(essentialItems);
    }

    /**
     * Check if emergency kit is complete
     */
    checkKitCompletion(essentialItems) {
        // Only complete if exactly kitMaxItems are added and all essentials are present
        const kitItems = Array.from(this.kitState);
        const essentials = essentialItems.filter(item => item.essential).map(i => i.id);
        const hasAllEssentials = essentials.every(id => kitItems.includes(id));
        if (kitItems.length === this.kitMaxItems && hasAllEssentials) {
            this.markTaskComplete('emergency-kit');
        }
    }

    /**
     * Initialize furniture securing activity (simplified)
     */
    initFurnitureSecuring() {
        const furnitureRoom = document.getElementById('furniture-room');
        // Add both fixable and non-fixable items
        const furnitureItems = [
            { id: 'bookshelf', name: 'Bibliotecă', fixable: true },
            { id: 'tv', name: 'Televizor', fixable: true },
            { id: 'carpet', name: 'Covor', fixable: false },
            { id: 'cabinet', name: 'Dulap de bucătărie', fixable: true },
            { id: 'sofa', name: 'Canapea', fixable: false },
            
        ];
        const secured = {};
        furnitureRoom.innerHTML = `
            <div class="room-layout room-layout--centered">
                <div class="room-instructions">Apasă pe fiecare obiect de mobilier pentru a vedea dacă trebuie fixat!</div>
                <div class="room-grid room-grid--furniture" id="room-grid"></div>
            </div>
        `;
        const roomGrid = document.getElementById('room-grid');
        furnitureItems.forEach((furniture, idx) => {
            const item = document.createElement('div');
            item.className = 'furniture-item';
            item.id = furniture.id;
            item.style.gridColumn = (idx % 3) + 1;
            item.style.gridRow = Math.floor(idx / 3) + 1;
            item.innerHTML = `
                <div class="furniture-icon">🏠</div>
                <div class="furniture-name">${furniture.name}</div>
                <div class="secure-status">&nbsp;</div>
            `;
            item.addEventListener('click', () => {
                if (!item.classList.contains('secured') && !item.classList.contains('not-fixable')) {
                    if (furniture.fixable) {
                        item.classList.add('secured');
                        item.querySelector('.secure-status').textContent = 'Fixat ✓';
                        secured[furniture.id] = true;
                        this.gameState.addScore(this.sceneName, 10);
                        audioHelper.playSuccess();
                        if (Object.keys(secured).length === furnitureItems.filter(f => f.fixable).length) {
                            this.markTaskComplete('secure-furniture');
                        }
                    } else {
                        item.classList.add('not-fixable');
                        item.querySelector('.secure-status').textContent = 'Nu necesită fixare';
                        audioHelper.playError();
                    }
                }
            });
            roomGrid.appendChild(item);
        });
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
        // Enable continue button if all tasks complete
        const continueBtn = document.getElementById('continue-btn');
        if (this.canProceed() && continueBtn) continueBtn.disabled = false;
        if (typeof this.onComplete === 'function' && this.canProceed()) this.onComplete();
    }

    /**
     * Update educational content panel
     */
    updateEducationalContent() {
        const factDisplay = document.getElementById('fact-display');
        const tip = EducationalContent.getRandomTip('before');
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
     * Check if user can proceed to next scene
     */
    canProceed() {
        return this.completedTasks.size >= this.requiredTasks.length;
    }

    /**
     * Get current hint for the scene
     */
    getCurrentHint() {
        if (this.completedTasks.size === 0) {
            return "Începe prin a construi kitul de urgență cu provizii esențiale!";
        } else if (this.completedTasks.size < 2) {
            return "Progres bun! Continuă cu fixarea mobilierului.";
        } else if (this.completedTasks.size < this.requiredTasks.length) {
            return "Aproape ai terminat! Finalizează restul sarcinilor de pregătire.";
        } else {
            return "Pregătire excelentă! Ești gata pentru următoarea etapă.";
        }
    }
}

// Legacy export for backward compatibility
export function showBeforeScene() {
    console.log("Legacy showBeforeScene called - use BeforeScene class instead");
}