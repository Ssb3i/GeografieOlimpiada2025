/**
 * Particle System for Enhanced Visual Effects
 * Creates debris, dust, and other particle effects for the earthquake game
 */

export class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.animationId = null;
        this.isActive = false;
    }

    /**
     * Create earthquake debris particles
     */
    createEarthquakeDebris(count = 20) {
        const containerRect = this.container.getBoundingClientRect();
        
        for (let i = 0; i < count; i++) {
            const particle = {
                x: Math.random() * containerRect.width,
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                size: Math.random() * 6 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01,
                type: Math.random() > 0.7 ? 'rock' : 'dust',
                element: this.createParticleElement()
            };
            
            this.particles.push(particle);
            this.container.appendChild(particle.element);
        }
    }

    /**
     * Create dust particles for earthquake effect
     */
    createDustParticles(count = 30) {
        const containerRect = this.container.getBoundingClientRect();
        
        for (let i = 0; i < count; i++) {
            const particle = {
                x: Math.random() * containerRect.width,
                y: Math.random() * containerRect.height,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 2 - 1,
                size: Math.random() * 4 + 1,
                rotation: 0,
                rotationSpeed: 0,
                life: 1.0,
                decay: Math.random() * 0.015 + 0.005,
                type: 'dust',
                element: this.createParticleElement()
            };
            
            this.particles.push(particle);
            this.container.appendChild(particle.element);
        }
    }

    /**
     * Create success celebration particles
     */
    createSuccessParticles(count = 15) {
        const containerRect = this.container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const particle = {
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * (Math.random() * 3 + 2),
                vy: Math.sin(angle) * (Math.random() * 3 + 2),
                size: Math.random() * 8 + 4,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 15,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.015,
                type: 'star',
                element: this.createParticleElement()
            };
            
            this.particles.push(particle);
            this.container.appendChild(particle.element);
        }
    }

    /**
     * Create a particle DOM element
     */
    createParticleElement() {
        const element = document.createElement('div');
        element.className = 'particle';
        element.style.cssText = `
            position: absolute;
            pointer-events: none;
            z-index: 1000;
            border-radius: 50%;
            transition: none;
        `;
        return element;
    }

    /**
     * Update particle positions and properties
     */
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            particle.life -= particle.decay;

            // Apply gravity to falling particles
            if (particle.type === 'rock' || particle.type === 'dust') {
                particle.vy += 0.1;
            }

            // Update visual properties
            this.updateParticleVisual(particle);

            // Remove dead particles
            if (particle.life <= 0 || particle.y > this.container.clientHeight + 50) {
                if (particle.element.parentNode) {
                    particle.element.parentNode.removeChild(particle.element);
                }
                return false;
            }

            return true;
        });
    }

    /**
     * Update particle visual appearance
     */
    updateParticleVisual(particle) {
        const element = particle.element;
        const opacity = Math.max(0, particle.life);
        
        element.style.left = particle.x + 'px';
        element.style.top = particle.y + 'px';
        element.style.width = particle.size + 'px';
        element.style.height = particle.size + 'px';
        element.style.opacity = opacity;
        element.style.transform = `rotate(${particle.rotation}deg)`;

        // Set particle appearance based on type
        switch (particle.type) {
            case 'rock':
                element.style.background = `rgba(${100 + Math.random() * 50}, ${80 + Math.random() * 40}, ${60 + Math.random() * 30}, ${opacity})`;
                break;
            case 'dust':
                element.style.background = `rgba(${200 + Math.random() * 55}, ${190 + Math.random() * 45}, ${180 + Math.random() * 40}, ${opacity * 0.6})`;
                break;
            case 'star':
                element.style.background = `radial-gradient(circle, rgba(255, 215, 0, ${opacity}) 0%, rgba(255, 165, 0, ${opacity * 0.8}) 50%, transparent 70%)`;
                element.style.borderRadius = '50%';
                break;
        }
    }

    /**
     * Start the particle animation loop
     */
    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        const animate = () => {
            if (!this.isActive) return;
            
            this.updateParticles();
            
            if (this.particles.length > 0) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.stop();
            }
        };
        
        animate();
    }

    /**
     * Stop the particle system
     */
    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Clear all particles
     */
    clear() {
        this.stop();
        this.particles.forEach(particle => {
            if (particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        });
        this.particles = [];
    }

    /**
     * Create earthquake effect with debris and dust
     */
    earthquakeEffect() {
        this.clear();
        this.createEarthquakeDebris(15);
        this.createDustParticles(25);
        this.start();
    }

    /**
     * Create success celebration effect
     */
    celebrationEffect() {
        this.clear();
        this.createSuccessParticles(12);
        this.start();
    }
}

/**
 * Global particle system helper
 */
export class ParticleHelper {
    static systems = new Map();

    /**
     * Get or create particle system for container
     */
    static getSystem(container) {
        if (!this.systems.has(container)) {
            this.systems.set(container, new ParticleSystem(container));
        }
        return this.systems.get(container);
    }

    /**
     * Create earthquake effect on container
     */
    static earthquakeEffect(container) {
        const system = this.getSystem(container);
        system.earthquakeEffect();
    }

    /**
     * Create celebration effect on container
     */
    static celebrationEffect(container) {
        const system = this.getSystem(container);
        system.celebrationEffect();
    }

    /**
     * Clear all particle systems
     */
    static clearAll() {
        this.systems.forEach(system => system.clear());
        this.systems.clear();
    }
}
