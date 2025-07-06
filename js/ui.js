// UI Manager Module
const UI = {
    // UI State
    state: {
        currentTheme: 'default',
        animationsEnabled: true,
        showDebugInfo: false,
        particles: []
    },

    // UI Elements
    elements: {
        gameContainer: null,
        scoreDisplay: null,
        mistakesDisplay: null,
        timerDisplay: null,
        lineTimerDisplay: null,
        sequenceDisplay: null,
        inputFeedback: null,
        gameOverScreen: null
    },

    // Animation Queue
    animationQueue: [],

    // Initialize UI
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initializeAnimations();
        console.log('UI system initialized');
    },

    // Cache DOM Elements
    cacheElements() {
        this.elements.gameContainer = document.querySelector('.game-container');
        this.elements.scoreDisplay = document.getElementById('score');
        this.elements.mistakesDisplay = document.getElementById('mistakes');
        this.elements.timerDisplay = document.getElementById('timer');
        this.elements.lineTimerDisplay = document.getElementById('lineTimer');
        this.elements.sequenceDisplay = document.getElementById('sequenceDisplay');
        this.elements.inputFeedback = document.getElementById('inputFeedback');
        this.elements.gameOverScreen = document.getElementById('gameOverScreen');
    },

    // Bind Event Listeners
    bindEvents() {
        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Theme toggle (could be added to UI)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                this.toggleDebugInfo();
            }
        });
    },

    // Initialize Animations
    initializeAnimations() {
        // Start animation loop
        this.startAnimationLoop();
    },

    // Start Animation Loop
    startAnimationLoop() {
        const animate = () => {
            this.updateAnimations();
            this.updateParticles();
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    },

    // Update Animations
    updateAnimations() {
        // Process animation queue
        this.animationQueue = this.animationQueue.filter(animation => {
            const isComplete = animation.update();
            return !isComplete;
        });
    },

    // Update Particles
    updateParticles() {
        this.state.particles = this.state.particles.filter(particle => {
            particle.update();
            return particle.life > 0;
        });
    },

    // Create Particle Effect
    createParticleEffect(x, y, type = 'success') {
        const particleCount = type === 'perfect' ? 15 : 8;
        const colors = {
            success: '#4CAF50',
            perfect: '#FFD700',
            miss: '#f44336'
        };
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new Particle(x, y, colors[type]);
            this.state.particles.push(particle);
        }
    },

    // Show Score Animation
    showScoreAnimation(points, multiplier = 1) {
        if (!this.state.animationsEnabled) return;
        
        const scoreElement = this.elements.scoreDisplay;
        const finalPoints = Math.floor(points * multiplier);
        
        // Create floating score text
        const floatingScore = document.createElement('div');
        floatingScore.className = 'floating-score';
        floatingScore.textContent = `+${finalPoints}`;
        floatingScore.style.position = 'absolute';
        floatingScore.style.left = scoreElement.offsetLeft + 'px';
        floatingScore.style.top = scoreElement.offsetTop + 'px';
        floatingScore.style.color = multiplier > 1 ? '#FFD700' : '#4CAF50';
        floatingScore.style.fontSize = '24px';
        floatingScore.style.fontWeight = 'bold';
        floatingScore.style.pointerEvents = 'none';
        floatingScore.style.zIndex = '1000';
        
        document.body.appendChild(floatingScore);
        
        // Animate floating score
        const animation = {
            element: floatingScore,
            startTime: performance.now(),
            duration: 1000,
            update: function() {
                const elapsed = performance.now() - this.startTime;
                const progress = Math.min(elapsed / this.duration, 1);
                
                this.element.style.transform = `translateY(${-progress * 50}px)`;
                this.element.style.opacity = 1 - progress;
                
                if (progress >= 1) {
                    this.element.remove();
                    return true; // Animation complete
                }
                return false;
            }
        };
        
        this.animationQueue.push(animation);
    },

    // Show Combo Effect
    showComboEffect(combo) {
        if (!this.state.animationsEnabled) return;
        
        const comboElement = this.elements.comboDisplay;
        
        // Add glow effect
        comboElement.classList.add('combo-glow');
        
        // Remove glow after animation
        setTimeout(() => {
            comboElement.classList.remove('combo-glow');
        }, 500);
        
        // Show combo milestone effects
        if (combo > 0 && combo % 10 === 0) {
            this.showComboMilestone(combo);
        }
    },

    // Show Combo Milestone
    showComboMilestone(combo) {
        const milestoneText = document.createElement('div');
        milestoneText.className = 'combo-milestone';
        milestoneText.textContent = `${combo} COMBO!`;
        milestoneText.style.position = 'fixed';
        milestoneText.style.left = '50%';
        milestoneText.style.top = '30%';
        milestoneText.style.transform = 'translate(-50%, -50%)';
        milestoneText.style.fontSize = '48px';
        milestoneText.style.fontWeight = 'bold';
        milestoneText.style.color = '#FFD700';
        milestoneText.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        milestoneText.style.pointerEvents = 'none';
        milestoneText.style.zIndex = '1000';
        
        document.body.appendChild(milestoneText);
        
        // Animate milestone
        const animation = {
            element: milestoneText,
            startTime: performance.now(),
            duration: 2000,
            update: function() {
                const elapsed = performance.now() - this.startTime;
                const progress = Math.min(elapsed / this.duration, 1);
                
                if (progress < 0.5) {
                    // Scale up
                    const scale = 1 + (progress * 2) * 0.5;
                    this.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
                } else {
                    // Scale down and fade out
                    const fadeProgress = (progress - 0.5) * 2;
                    const scale = 1.5 - fadeProgress * 0.5;
                    this.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    this.element.style.opacity = 1 - fadeProgress;
                }
                
                if (progress >= 1) {
                    this.element.remove();
                    return true;
                }
                return false;
            }
        };
        
        this.animationQueue.push(animation);
    },

    // Show Feedback Animation
    showFeedbackAnimation(feedback, type) {
        if (!this.state.animationsEnabled) return;
        
        const feedbackElement = this.elements.inputFeedback;
        feedbackElement.textContent = feedback;
        feedbackElement.className = `feedback-${type}`;
        
        // Add pulse animation
        feedbackElement.style.animation = 'feedbackPulse 0.5s ease-out';
        
        // Clear animation after completion
        setTimeout(() => {
            feedbackElement.style.animation = '';
        }, 500);
    },

    // Update Timer Display
    updateTimerDisplay(timeLeft) {
        const timerElement = this.elements.timerDisplay;
        timerElement.textContent = timeLeft;
        
        // Add warning effects
        if (timeLeft <= 10) {
            timerElement.classList.add('timer-warning');
        } else {
            timerElement.classList.remove('timer-warning');
        }
        
        // Flash effect when time is very low
        if (timeLeft <= 5) {
            timerElement.style.animation = 'timerWarning 0.5s infinite';
        } else {
            timerElement.style.animation = '';
        }
    },

    // Show Screen Shake
    showScreenShake(intensity = 1) {
        if (!this.state.animationsEnabled) return;
        
        const gameContainer = this.elements.gameContainer;
        gameContainer.style.animation = `shake 0.5s ease-in-out`;
        
        setTimeout(() => {
            gameContainer.style.animation = '';
        }, 500);
    },

    // Show Game Over Animation
    showGameOverAnimation() {
        const gameOverScreen = this.elements.gameOverScreen;
        gameOverScreen.style.display = 'flex';
        gameOverScreen.style.animation = 'fadeIn 0.5s ease-in-out';
    },

    // Hide Game Over Screen
    hideGameOverScreen() {
        const gameOverScreen = this.elements.gameOverScreen;
        gameOverScreen.style.animation = 'fadeOut 0.5s ease-in-out';
        
        setTimeout(() => {
            gameOverScreen.style.display = 'none';
            gameOverScreen.style.animation = '';
        }, 500);
    },

    // Toggle Debug Info
    toggleDebugInfo() {
        this.state.showDebugInfo = !this.state.showDebugInfo;
        
        if (this.state.showDebugInfo) {
            this.showDebugInfo();
        } else {
            this.hideDebugInfo();
        }
    },

    // Show Debug Info
    showDebugInfo() {
        let debugPanel = document.getElementById('debugPanel');
        
        if (!debugPanel) {
            debugPanel = document.createElement('div');
            debugPanel.id = 'debugPanel';
            debugPanel.style.position = 'fixed';
            debugPanel.style.top = '10px';
            debugPanel.style.right = '10px';
            debugPanel.style.background = 'rgba(0, 0, 0, 0.8)';
            debugPanel.style.color = 'white';
            debugPanel.style.padding = '10px';
            debugPanel.style.borderRadius = '5px';
            debugPanel.style.fontSize = '12px';
            debugPanel.style.fontFamily = 'monospace';
            debugPanel.style.zIndex = '9999';
            
            document.body.appendChild(debugPanel);
        }
        
        // Update debug info
        const updateDebugInfo = () => {
            if (!this.state.showDebugInfo) return;
            
            const gameStats = window.Game ? Game.getStatistics() : {};
            const timingStats = window.Timing ? Timing.getStatistics() : {};
            const inputStats = window.Input ? Input.getStatistics() : {};
            
            debugPanel.innerHTML = `
                <div><strong>Game Stats:</strong></div>
                <div>Score: ${gameStats.score || 0}</div>
                <div>Combo: ${gameStats.combo || 0}</div>
                <div>Accuracy: ${gameStats.accuracy || 0}%</div>
                <div><strong>Performance:</strong></div>
                <div>FPS: ${(timingStats.fps || 0).toFixed(1)}</div>
                <div>Frame Time: ${(timingStats.averageFrameTime || 0).toFixed(2)}ms</div>
                <div>Particles: ${this.state.particles.length}</div>
                <div>Animations: ${this.animationQueue.length}</div>
                <div><strong>Input:</strong></div>
                <div>Pressed Keys: ${inputStats.pressedKeysCount || 0}</div>
                <div>Enabled: ${inputStats.isEnabled ? 'Yes' : 'No'}</div>
            `;
            
            setTimeout(updateDebugInfo, 100);
        };
        
        updateDebugInfo();
    },

    // Hide Debug Info
    hideDebugInfo() {
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            debugPanel.remove();
        }
    },

    // Handle Window Resize
    handleResize() {
        // Adjust UI elements for different screen sizes
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update responsive classes
        if (width < 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
        
        console.log(`Window resized: ${width}x${height}`);
    },

    // Set Theme
    setTheme(theme) {
        this.state.currentTheme = theme;
        document.body.className = `theme-${theme}`;
        console.log(`Theme changed to: ${theme}`);
    },

    // Toggle Animations
    toggleAnimations() {
        this.state.animationsEnabled = !this.state.animationsEnabled;
        
        if (!this.state.animationsEnabled) {
            // Clear all animations
            this.animationQueue = [];
            this.state.particles = [];
        }
        
        console.log(`Animations ${this.state.animationsEnabled ? 'enabled' : 'disabled'}`);
    },

    // Get UI Statistics
    getStatistics() {
        return {
            theme: this.state.currentTheme,
            animationsEnabled: this.state.animationsEnabled,
            showDebugInfo: this.state.showDebugInfo,
            activeParticles: this.state.particles.length,
            activeAnimations: this.animationQueue.length
        };
    }
};

// Particle Class
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.life = 1.0;
        this.decay = 0.02;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5 - 2;
        this.gravity = 0.1;
        this.size = Math.random() * 4 + 2;
        
        this.createElement();
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'particle';
        this.element.style.position = 'absolute';
        this.element.style.width = this.size + 'px';
        this.element.style.height = this.size + 'px';
        this.element.style.backgroundColor = this.color;
        this.element.style.borderRadius = '50%';
        this.element.style.pointerEvents = 'none';
        this.element.style.zIndex = '999';
        
        document.body.appendChild(this.element);
        this.updatePosition();
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= this.decay;
        
        this.updatePosition();
        
        if (this.life <= 0) {
            this.element.remove();
        }
    }
    
    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.opacity = this.life;
    }
}

// Export for use in other modules
window.UI = UI;
