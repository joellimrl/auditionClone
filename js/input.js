// Input Handler Module
const Input = {
    // Input State
    state: {
        pressedKeys: new Set(),
        keyBindings: {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        },
        isEnabled: true
    },

    // Visual Elements
    elements: {
        arrowKeys: {}
    },

    // Initialize Input System
    init() {
        this.cacheElements();
        this.bindEvents();
        console.log('Input system initialized');
    },

    // Cache DOM Elements
    cacheElements() {
        const arrowKeys = document.querySelectorAll('.arrow-key');
        arrowKeys.forEach(key => {
            const keyCode = key.dataset.key;
            this.elements.arrowKeys[keyCode] = key;
        });
    },

    // Bind Event Listeners
    bindEvents() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mouse events for arrow keys
        Object.entries(this.elements.arrowKeys).forEach(([keyCode, element]) => {
            element.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.simulateKeyPress(keyCode);
            });
            
            element.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.simulateKeyRelease(keyCode);
            });
            
            element.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                this.simulateKeyRelease(keyCode);
            });
        });
        
        // Prevent default behavior for arrow keys
        document.addEventListener('keydown', (e) => {
            if (this.isArrowKey(e.key)) {
                e.preventDefault();
            }
        });
        
        // Touch events for mobile support
        this.bindTouchEvents();
    },

    // Handle Key Down
    handleKeyDown(e) {
        if (!this.state.isEnabled) return;
        
        const key = e.key;
        
        // Check if it's an arrow key
        if (this.isArrowKey(key)) {
            // Prevent repeated key presses
            if (this.state.pressedKeys.has(key)) return;
            
            this.state.pressedKeys.add(key);
            this.updateKeyVisual(key, true);
            
            // Send input to game
            if (window.Game) {
                Game.handleInput(key);
            }
            
            console.log(`Key pressed: ${key}`);
        }
    },

    // Handle Key Up
    handleKeyUp(e) {
        if (!this.state.isEnabled) return;
        
        const key = e.key;
        
        if (this.isArrowKey(key)) {
            this.state.pressedKeys.delete(key);
            this.updateKeyVisual(key, false);
            
            console.log(`Key released: ${key}`);
        }
    },

    // Simulate Key Press (for mouse/touch)
    simulateKeyPress(keyCode) {
        if (!this.state.isEnabled) return;
        
        if (this.state.pressedKeys.has(keyCode)) return;
        
        this.state.pressedKeys.add(keyCode);
        this.updateKeyVisual(keyCode, true);
        
        // Send input to game
        if (window.Game) {
            Game.handleInput(keyCode);
        }
        
        console.log(`Simulated key press: ${keyCode}`);
    },

    // Simulate Key Release (for mouse/touch)
    simulateKeyRelease(keyCode) {
        if (!this.state.isEnabled) return;
        
        this.state.pressedKeys.delete(keyCode);
        this.updateKeyVisual(keyCode, false);
        
        console.log(`Simulated key release: ${keyCode}`);
    },

    // Check if key is an arrow key
    isArrowKey(key) {
        return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key);
    },

    // Update Key Visual Feedback
    updateKeyVisual(key, isPressed) {
        const element = this.elements.arrowKeys[key];
        if (element) {
            if (isPressed) {
                element.classList.add('pressed');
            } else {
                element.classList.remove('pressed');
            }
        }
    },

    // Bind Touch Events for Mobile
    bindTouchEvents() {
        Object.entries(this.elements.arrowKeys).forEach(([keyCode, element]) => {
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.simulateKeyPress(keyCode);
            });
            
            element.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.simulateKeyRelease(keyCode);
            });
            
            element.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.simulateKeyRelease(keyCode);
            });
        });
    },

    // Enable/Disable Input
    setEnabled(enabled) {
        this.state.isEnabled = enabled;
        
        if (!enabled) {
            // Clear all pressed keys
            this.state.pressedKeys.clear();
            
            // Remove visual feedback
            Object.values(this.elements.arrowKeys).forEach(element => {
                element.classList.remove('pressed');
            });
        }
        
        console.log(`Input ${enabled ? 'enabled' : 'disabled'}`);
    },

    // Get Current Input State
    getInputState() {
        return {
            pressedKeys: Array.from(this.state.pressedKeys),
            isEnabled: this.state.isEnabled
        };
    },

    // Reset Input State
    reset() {
        this.state.pressedKeys.clear();
        Object.values(this.elements.arrowKeys).forEach(element => {
            element.classList.remove('pressed');
        });
        console.log('Input state reset');
    },

    // Add Input Buffer (for rapid sequences)
    buffer: {
        inputs: [],
        maxSize: 3,
        timeout: 200, // ms
        
        add(key) {
            const now = Date.now();
            this.inputs.push({ key, timestamp: now });
            
            // Remove old inputs
            this.inputs = this.inputs.filter(input => 
                now - input.timestamp <= this.timeout
            );
            
            // Limit buffer size
            if (this.inputs.length > this.maxSize) {
                this.inputs.shift();
            }
        },
        
        get() {
            return this.inputs.slice();
        },
        
        clear() {
            this.inputs = [];
        }
    },

    // Handle Rapid Input Sequences
    handleRapidInput(key) {
        this.buffer.add(key);
        
        // Check for rapid input patterns
        const recentInputs = this.buffer.get();
        if (recentInputs.length >= 2) {
            const timeDiff = recentInputs[recentInputs.length - 1].timestamp - 
                           recentInputs[recentInputs.length - 2].timestamp;
            
            if (timeDiff < 50) { // Very rapid input
                console.log('Rapid input detected');
                // Could implement combo multiplier or special effects here
            }
        }
    },

    // Get Input Statistics
    getStatistics() {
        return {
            pressedKeysCount: this.state.pressedKeys.size,
            bufferSize: this.buffer.inputs.length,
            isEnabled: this.state.isEnabled
        };
    }
};

// Export for use in other modules
window.Input = Input;
