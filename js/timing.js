// Timing System Module
const Timing = {
    // Timing State
    state: {
        sequenceStartTime: 0,
        inputStartTime: 0,
        isActive: false,
        frameRate: 60,
        lastFrameTime: 0
    },

    // Timing Configuration
    config: {
        perfectWindow: 50,   // ms
        goodWindow: 100,     // ms
        maxWindow: 200,      // ms
        tickRate: 16.67      // ms (60 FPS)
    },

    // Performance Tracking
    performance: {
        frameCount: 0,
        lastSecond: 0,
        currentFPS: 0,
        averageFrameTime: 0,
        frameTimeHistory: []
    },

    // Initialize Timing System
    init() {
        this.bindEvents();
        this.startPerformanceTracking();
        console.log('Timing system initialized');
    },

    // Bind Event Listeners
    bindEvents() {
        // Track frame rate
        this.trackFrameRate();
        
        // Handle visibility change (pause when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseTiming();
            } else {
                this.resumeTiming();
            }
        });
    },

    // Start Sequence Timing
    startSequence() {
        this.state.sequenceStartTime = performance.now();
        this.state.isActive = true;
        console.log('Sequence timing started');
    },

    // Record Input Time
    recordInput() {
        this.state.inputStartTime = performance.now();
        return this.state.inputStartTime;
    },

    // Calculate Input Timing
    calculateTiming() {
        if (!this.state.isActive) return 0;
        
        const currentTime = performance.now();
        const timeSinceSequenceStart = currentTime - this.state.sequenceStartTime;
        
        // Calculate how close the input was to the expected time
        // This is a simplified version - in a real rhythm game, 
        // you'd sync with the music beat
        const expectedTime = 1000; // 1 second window for simplicity
        const timing = Math.abs(timeSinceSequenceStart - expectedTime);
        
        console.log(`Input timing: ${timing.toFixed(2)}ms`);
        return timing;
    },

    // Get Timing Grade
    getTimingGrade(timing) {
        if (timing <= this.config.perfectWindow) {
            return 'perfect';
        } else if (timing <= this.config.goodWindow) {
            return 'good';
        } else if (timing <= this.config.maxWindow) {
            return 'late';
        } else {
            return 'miss';
        }
    },

    // Calculate Score Multiplier
    getScoreMultiplier(timing) {
        const grade = this.getTimingGrade(timing);
        
        switch (grade) {
            case 'perfect':
                return 1.0;
            case 'good':
                return 0.8;
            case 'late':
                return 0.5;
            default:
                return 0.0;
        }
    },

    // Stop Sequence Timing
    stopSequence() {
        this.state.isActive = false;
        this.state.sequenceStartTime = 0;
        console.log('Sequence timing stopped');
    },

    // Pause Timing
    pauseTiming() {
        this.state.isActive = false;
        console.log('Timing paused');
    },

    // Resume Timing
    resumeTiming() {
        if (this.state.sequenceStartTime > 0) {
            this.state.isActive = true;
            console.log('Timing resumed');
        }
    },

    // Track Frame Rate
    trackFrameRate() {
        const trackFPS = (timestamp) => {
            if (this.state.lastFrameTime === 0) {
                this.state.lastFrameTime = timestamp;
            }
            
            const deltaTime = timestamp - this.state.lastFrameTime;
            this.state.lastFrameTime = timestamp;
            
            // Update performance metrics
            this.updatePerformanceMetrics(deltaTime);
            
            // Continue tracking
            requestAnimationFrame(trackFPS);
        };
        
        requestAnimationFrame(trackFPS);
    },

    // Update Performance Metrics
    updatePerformanceMetrics(deltaTime) {
        this.performance.frameCount++;
        this.performance.frameTimeHistory.push(deltaTime);
        
        // Keep only last 60 frames
        if (this.performance.frameTimeHistory.length > 60) {
            this.performance.frameTimeHistory.shift();
        }
        
        // Calculate average frame time
        const sum = this.performance.frameTimeHistory.reduce((a, b) => a + b, 0);
        this.performance.averageFrameTime = sum / this.performance.frameTimeHistory.length;
        
        // Calculate FPS
        this.performance.currentFPS = 1000 / this.performance.averageFrameTime;
        
        // Log performance every second
        const now = Date.now();
        if (now - this.performance.lastSecond >= 1000) {
            this.performance.lastSecond = now;
            if (this.performance.currentFPS < 30) {
                console.warn(`Low FPS detected: ${this.performance.currentFPS.toFixed(1)}`);
            }
        }
    },

    // Start Performance Tracking
    startPerformanceTracking() {
        setInterval(() => {
            this.logPerformanceMetrics();
        }, 5000); // Log every 5 seconds
    },

    // Log Performance Metrics
    logPerformanceMetrics() {
        console.log(`Performance: ${this.performance.currentFPS.toFixed(1)} FPS, ` +
                   `${this.performance.averageFrameTime.toFixed(2)}ms avg frame time`);
    },

    // Get High-Resolution Timestamp
    getHighResTimestamp() {
        return performance.now();
    },

    // Create Precise Timer
    createPreciseTimer(callback, interval) {
        let start = performance.now();
        
        function frame(timestamp) {
            if (timestamp - start >= interval) {
                callback();
                start = timestamp;
            }
            requestAnimationFrame(frame);
        }
        
        requestAnimationFrame(frame);
    },

    // Calculate Rhythm Timing (for music sync)
    calculateRhythmTiming(bpm, beatOffset = 0) {
        const beatDuration = 60000 / bpm; // ms per beat
        const currentTime = performance.now();
        const timeSinceStart = currentTime - this.state.sequenceStartTime;
        
        // Calculate which beat we should be on
        const expectedBeat = Math.floor((timeSinceStart + beatOffset) / beatDuration);
        const expectedTime = expectedBeat * beatDuration - beatOffset;
        
        // Calculate timing difference
        const timing = Math.abs(timeSinceStart - expectedTime);
        
        return {
            timing: timing,
            beat: expectedBeat,
            expectedTime: expectedTime,
            actualTime: timeSinceStart
        };
    },

    // Synchronize with Audio
    syncWithAudio(audioContext, audioBuffer) {
        if (!audioContext || !audioBuffer) return;
        
        const currentTime = audioContext.currentTime;
        const bufferTime = audioBuffer.duration;
        
        // Calculate sync offset
        const syncOffset = currentTime % bufferTime;
        
        return {
            audioTime: currentTime,
            syncOffset: syncOffset,
            isInSync: syncOffset < 0.1 // 100ms tolerance
        };
    },

    // Get Timing Statistics
    getStatistics() {
        return {
            fps: this.performance.currentFPS,
            averageFrameTime: this.performance.averageFrameTime,
            frameCount: this.performance.frameCount,
            isActive: this.state.isActive,
            sequenceStartTime: this.state.sequenceStartTime,
            config: this.config
        };
    },

    // Reset Timing System
    reset() {
        this.state.sequenceStartTime = 0;
        this.state.inputStartTime = 0;
        this.state.isActive = false;
        this.performance.frameCount = 0;
        this.performance.frameTimeHistory = [];
        console.log('Timing system reset');
    },

    // Calibrate Timing (for different devices)
    calibrateTiming() {
        const calibrationResults = [];
        const testCount = 10;
        
        for (let i = 0; i < testCount; i++) {
            const start = performance.now();
            setTimeout(() => {
                const end = performance.now();
                calibrationResults.push(end - start);
            }, 100);
        }
        
        // Calculate average calibration offset
        setTimeout(() => {
            const average = calibrationResults.reduce((a, b) => a + b, 0) / testCount;
            const offset = average - 100; // Expected 100ms
            
            console.log(`Timing calibration: ${offset.toFixed(2)}ms offset`);
            
            // Apply calibration offset
            this.config.perfectWindow += offset;
            this.config.goodWindow += offset;
            this.config.maxWindow += offset;
        }, 1500);
    }
};

// Export for use in other modules
window.Timing = Timing;
