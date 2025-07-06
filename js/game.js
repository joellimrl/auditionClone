// Main Game Controller
const Game = {
    // Game State
    state: {
        initialized: false,
        isPlaying: false,
        isPaused: false,
        score: 0,
        mistakes: 0,
        gameTimeLeft: 60,
        lineTimeLeft: 0,
        currentSequence: [],
        currentInputIndex: 0,
        linesCompleted: 0,
        lineTimes: [],
        lineStartTime: 0,
        totalGameTime: 60
    },

    // Game Configuration
    config: {
        totalGameTime: 60,
        minLineTime: 5,
        maxLineTime: 15,
        minSequenceLength: 4,
        maxSequenceLength: 8,
        points: {
            correct: 10,
            lineComplete: 50
        }
    },

    // Game Elements
    elements: {
        score: null,
        mistakes: null,
        timer: null,
        lineTimer: null,
        sequenceDisplay: null,
        inputFeedback: null,
        startBtn: null,
        pauseBtn: null,
        resetBtn: null,
        gameOverScreen: null,
        gameOverCloseBtn: null,
        finalScore: null,
        totalMistakes: null,
        linesCompleted: null,
        avgLineTime: null,
        restartBtn: null
    },

    // Game Timers
    timers: {
        gameTimer: null,
        lineTimer: null,
        feedbackTimer: null
    },

    // Initialize Game
    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateDisplay();
        
        // Initialize input feedback with non-breaking space
        if (this.elements.inputFeedback) {
            this.elements.inputFeedback.textContent = '\u00a0'; // Non-breaking space
            this.elements.inputFeedback.className = '';
        }
        
        this.state.initialized = true;
        console.log('Game initialized');
    },

    // Cache DOM Elements
    cacheElements() {
        console.log('Caching elements...');
        
        this.elements.score = document.getElementById('score');
        this.elements.mistakes = document.getElementById('mistakes');
        this.elements.timer = document.getElementById('timer');
        this.elements.lineTimer = document.getElementById('lineTimer');
        this.elements.sequenceDisplay = document.getElementById('sequenceDisplay');
        this.elements.inputFeedback = document.getElementById('inputFeedback');
        this.elements.startBtn = document.getElementById('startBtn');
        this.elements.pauseBtn = document.getElementById('pauseBtn');
        this.elements.resetBtn = document.getElementById('resetBtn');
        this.elements.gameOverScreen = document.getElementById('gameOverScreen');
        this.elements.gameOverCloseBtn = document.getElementById('gameOverCloseBtn');
        this.elements.finalScore = document.getElementById('finalScore');
        this.elements.totalMistakes = document.getElementById('totalMistakes');
        this.elements.linesCompleted = document.getElementById('linesCompleted');
        this.elements.avgLineTime = document.getElementById('avgLineTime');
        this.elements.restartBtn = document.getElementById('restartBtn');
        
        // Check if critical elements are found
        if (!this.elements.startBtn) {
            console.error('Start button not found!');
        }
        if (!this.elements.sequenceDisplay) {
            console.error('Sequence display not found!');
        }
        if (!this.elements.inputFeedback) {
            console.error('Input feedback not found!');
        }
        
        console.log('Elements cached successfully');
    },

    // Bind Event Listeners
    bindEvents() {
        console.log('Binding events...');
        
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => {
                console.log('Start button clicked');
                this.startGame();
            });
        } else {
            console.error('Start button not found');
        }
        
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.addEventListener('click', () => {
                console.log('Pause button clicked');
                this.pauseGame();
            });
        }
        
        if (this.elements.resetBtn) {
            this.elements.resetBtn.addEventListener('click', () => {
                console.log('Reset button clicked');
                this.resetGame();
            });
        }
        
        if (this.elements.restartBtn) {
            this.elements.restartBtn.addEventListener('click', () => {
                console.log('Restart button clicked');
                this.restartGame();
            });
        }
        
        if (this.elements.gameOverCloseBtn) {
            this.elements.gameOverCloseBtn.addEventListener('click', () => {
                console.log('Game over close button clicked');
                this.hideGameOver();
            });
        }
        
        // Initialize other modules if they exist
        if (typeof Input !== 'undefined') {
            console.log('Initializing Input module');
            Input.init();
        }
        if (typeof SequenceGenerator !== 'undefined') {
            console.log('Initializing SequenceGenerator module');
            SequenceGenerator.init();
        }
        if (typeof UI !== 'undefined') {
            console.log('Initializing UI module');
            UI.init();
        }
        if (typeof AudioManager !== 'undefined') {
            console.log('Initializing AudioManager module');
            AudioManager.init();
        }
    },

    // Start Game
    startGame() {
        if (this.state.isPaused) {
            this.resumeGame();
            return;
        }

        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.elements.startBtn.disabled = true;
        this.elements.pauseBtn.disabled = false;
        
        // Start game timer
        this.startGameTimer();
        
        // Generate first sequence
        this.generateNewLine();
        
        // Update UI
        this.updateDisplay();
        
        console.log('Game started');
    },

    // Pause Game
    pauseGame() {
        if (!this.state.isPlaying) return;
        
        this.state.isPaused = true;
        this.clearTimers();
        
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.elements.startBtn.textContent = 'Resume';
        
        console.log('Game paused');
    },

    // Resume Game
    resumeGame() {
        if (!this.state.isPaused) return;
        
        this.state.isPaused = false;
        this.elements.startBtn.disabled = true;
        this.elements.pauseBtn.disabled = false;
        this.elements.startBtn.textContent = 'Start Game';
        
        this.startGameTimer();
        this.startLineTimer();
        
        console.log('Game resumed');
    },

    // Reset Game
    resetGame() {
        this.clearTimers();
        this.resetState();
        this.updateDisplay();
        this.clearSequenceDisplay();
        this.hideGameOver();
        
        // Reset input feedback
        this.elements.inputFeedback.textContent = '\u00a0'; // Non-breaking space
        this.elements.inputFeedback.className = '';
        
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.elements.startBtn.textContent = 'Start Game';
        
        console.log('Game reset');
    },

    // Restart Game (from game over)
    restartGame() {
        this.resetGame();
        this.hideGameOver();
        this.startGame();
    },

    // Reset Game State
    resetState() {
        this.state.isPlaying = false;
        this.state.isPaused = false;
        this.state.score = 0;
        this.state.mistakes = 0;
        this.state.gameTimeLeft = this.config.totalGameTime;
        this.state.lineTimeLeft = 0;
        this.state.currentSequence = [];
        this.state.currentInputIndex = 0;
        this.state.linesCompleted = 0;
        this.state.lineTimes = [];
        this.state.lineStartTime = 0;
    },

    // Start Game Timer
    startGameTimer() {
        this.timers.gameTimer = setInterval(() => {
            this.state.gameTimeLeft--;
            this.updateDisplay();
            
            if (this.state.gameTimeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    },

    // Start Line Timer
    startLineTimer() {
        this.timers.lineTimer = setInterval(() => {
            this.state.lineTimeLeft--;
            this.updateDisplay();
            
            if (this.state.lineTimeLeft <= 0) {
                this.handleLineTimeout();
            }
        }, 1000);
    },

    // Simple fallback sequence generation
    generateSimpleSequence(length) {
        const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        const sequence = [];
        
        for (let i = 0; i < length; i++) {
            let nextArrow;
            
            if (i === 0) {
                nextArrow = arrows[Math.floor(Math.random() * arrows.length)];
            } else {
                // Avoid immediate repetition
                do {
                    nextArrow = arrows[Math.floor(Math.random() * arrows.length)];
                } while (nextArrow === sequence[i - 1]);
            }
            
            sequence.push(nextArrow);
        }
        
        return sequence;
    },

    // Generate New Line
    generateNewLine() {
        // Generate a random sequence length
        const sequenceLength = Math.floor(Math.random() * 
            (this.config.maxSequenceLength - this.config.minSequenceLength + 1)) + 
            this.config.minSequenceLength;
        
        // Generate the sequence
        if (typeof SequenceGenerator !== 'undefined') {
            this.state.currentSequence = SequenceGenerator.generateSequence(sequenceLength);
        } else {
            // Fallback simple sequence generation
            this.state.currentSequence = this.generateSimpleSequence(sequenceLength);
        }
        this.state.currentInputIndex = 0;
        
        // Calculate dynamic time for this line (based on length and difficulty)
        const baseTime = Math.max(this.config.minLineTime, 
            Math.min(this.config.maxLineTime, sequenceLength * 2));
        
        // Add some randomness to time allocation
        const timeVariation = Math.random() * 4 - 2; // -2 to +2 seconds
        this.state.lineTimeLeft = Math.max(3, Math.floor(baseTime + timeVariation));
        
        // Record line start time
        this.state.lineStartTime = Date.now();
        
        // Display the sequence
        this.displaySequence();
        
        // Start line timer
        this.clearLineTimer();
        this.startLineTimer();
        
        console.log('New line generated:', this.state.currentSequence, 'Time:', this.state.lineTimeLeft);
    },

    // Display Current Sequence
    displaySequence() {
        // Only recreate if sequence has changed
        if (this.elements.sequenceDisplay.children.length !== this.state.currentSequence.length) {
            this.elements.sequenceDisplay.innerHTML = '';
            
            this.state.currentSequence.forEach((arrow, index) => {
                const arrowElement = document.createElement('div');
                arrowElement.className = 'arrow';
                arrowElement.textContent = this.getArrowSymbol(arrow);
                arrowElement.dataset.index = index;
                arrowElement.dataset.key = arrow; // Add data-key attribute for styling
                
                this.elements.sequenceDisplay.appendChild(arrowElement);
            });
        }
        
        // Update classes of existing elements
        Array.from(this.elements.sequenceDisplay.children).forEach((arrowElement, index) => {
            // Preserve correct/incorrect classes, but reset others
            const hasCorrect = arrowElement.classList.contains('correct');
            const hasIncorrect = arrowElement.classList.contains('incorrect');
            
            // Reset all classes
            arrowElement.className = 'arrow';
            arrowElement.dataset.key = this.state.currentSequence[index];
            
            // Restore correct/incorrect classes
            if (hasCorrect) {
                arrowElement.classList.add('correct');
            } else if (hasIncorrect) {
                arrowElement.classList.add('incorrect');
            }
            
            // Apply state-specific classes
            if (index === this.state.currentInputIndex) {
                arrowElement.classList.add('active');
            } else if (index < this.state.currentInputIndex && !hasCorrect && !hasIncorrect) {
                arrowElement.classList.add('completed');
            }
        });
    },

    // Handle Player Input
    handleInput(key) {
        if (!this.state.isPlaying || this.state.isPaused) return;
        
        const expectedKey = this.state.currentSequence[this.state.currentInputIndex];
        
        if (key === expectedKey) {
            this.handleCorrectInput();
        } else {
            this.handleIncorrectInput();
        }
    },

    // Handle Correct Input
    handleCorrectInput() {
        // Award points
        this.state.score += this.config.points.correct;
        
        // Move to next arrow
        this.state.currentInputIndex++;
        
        // Update visual feedback
        this.updateArrowVisual(this.state.currentInputIndex - 1, 'correct');
        this.showInputFeedback('✓', 'feedback-correct');
        
        // Check if line is complete
        if (this.state.currentInputIndex >= this.state.currentSequence.length) {
            this.handleLineComplete();
        } else {
            // Update display for next arrow
            this.displaySequence();
        }
        
        this.updateDisplay();
    },

    // Handle Incorrect Input
    handleIncorrectInput() {
        this.state.mistakes++;
        this.showInputFeedback('✗', 'feedback-incorrect');
        
        // Don't advance - let them try again
        this.updateDisplay();
    },

    // Handle Line Complete
    handleLineComplete() {
        // Calculate time taken for this line
        const lineTime = (Date.now() - this.state.lineStartTime) / 1000;
        this.state.lineTimes.push(lineTime);
        
        // Award bonus points
        this.state.score += this.config.points.lineComplete;
        
        // Increment lines completed
        this.state.linesCompleted++;
        
        // Clear line timer
        this.clearLineTimer();
        
        // Show completion feedback
        this.showInputFeedback('LINE COMPLETE!', 'feedback-complete');
        
        // Generate next line after 1 second
        setTimeout(() => {
            if (this.state.isPlaying && !this.state.isPaused) {
                this.generateNewLine();
            }
        }, 1000);
        
        this.updateDisplay();
    },

    // Handle Line Timeout
    handleLineTimeout() {
        this.state.mistakes++;
        this.showInputFeedback('TIME OUT!', 'feedback-timeout');
        
        // Generate new line after 1 second
        setTimeout(() => {
            if (this.state.isPlaying && !this.state.isPaused) {
                this.generateNewLine();
            }
        }, 1000);
        
        this.updateDisplay();
    },

    // Update Arrow Visual Feedback
    updateArrowVisual(index, type) {
        const arrow = this.elements.sequenceDisplay.querySelector(`[data-index="${index}"]`);
        if (arrow) {
            arrow.classList.add(type);
        }
    },

    // Show Input Feedback
    showInputFeedback(text, className) {
        this.elements.inputFeedback.textContent = text;
        this.elements.inputFeedback.className = className;
        
        // Clear feedback after delay
        clearTimeout(this.timers.feedbackTimer);
        this.timers.feedbackTimer = setTimeout(() => {
            this.elements.inputFeedback.textContent = '\u00a0'; // Non-breaking space to maintain height
            this.elements.inputFeedback.className = '';
        }, 1000);
    },

    // Get Arrow Symbol
    getArrowSymbol(key) {
        const symbols = {
            'ArrowUp': '⬆',
            'ArrowDown': '⬇',
            'ArrowLeft': '⬅',
            'ArrowRight': '➡'
        };
        return symbols[key] || '?';
    },

    // Clear Sequence Display
    clearSequenceDisplay() {
        this.elements.sequenceDisplay.innerHTML = '';
    },

    // Clear Line Timer
    clearLineTimer() {
        if (this.timers.lineTimer) {
            clearInterval(this.timers.lineTimer);
            this.timers.lineTimer = null;
        }
    },

    // Update Display
    updateDisplay() {
        this.elements.score.textContent = this.state.score.toLocaleString();
        this.elements.mistakes.textContent = this.state.mistakes;
        this.elements.timer.textContent = this.state.gameTimeLeft;
        this.elements.lineTimer.textContent = this.state.lineTimeLeft;
        
        // Add warning animation if time is low
        if (this.state.gameTimeLeft <= 10) {
            this.elements.timer.classList.add('timer-warning');
        } else {
            this.elements.timer.classList.remove('timer-warning');
        }
        
        // Add warning for line timer
        if (this.state.lineTimeLeft <= 3) {
            this.elements.lineTimer.classList.add('timer-warning');
        } else {
            this.elements.lineTimer.classList.remove('timer-warning');
        }
    },

    // End Game
    endGame() {
        this.state.isPlaying = false;
        this.clearTimers();
        this.showGameOver();
        
        console.log('Game ended');
    },

    // Show Game Over Screen
    showGameOver() {
        this.elements.finalScore.textContent = this.state.score.toLocaleString();
        this.elements.totalMistakes.textContent = this.state.mistakes;
        this.elements.linesCompleted.textContent = this.state.linesCompleted;
        
        // Calculate average line time
        const avgTime = this.state.lineTimes.length > 0 ? 
            (this.state.lineTimes.reduce((sum, time) => sum + time, 0) / this.state.lineTimes.length).toFixed(2) : 0;
        this.elements.avgLineTime.textContent = avgTime;
        
        this.elements.gameOverScreen.style.display = 'flex';
    },

    // Hide Game Over Screen
    hideGameOver() {
        this.elements.gameOverScreen.style.display = 'none';
    },

    // Clear All Timers
    clearTimers() {
        if (this.timers.gameTimer) {
            clearInterval(this.timers.gameTimer);
            this.timers.gameTimer = null;
        }
        this.clearLineTimer();
        if (this.timers.feedbackTimer) {
            clearTimeout(this.timers.feedbackTimer);
            this.timers.feedbackTimer = null;
        }
    }
};

// Export for use in other modules
window.Game = Game;
