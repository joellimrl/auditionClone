// Audio Manager Module
const AudioManager = {
    // Audio Context
    audioContext: null,
    
    // Audio State
    state: {
        isEnabled: true,
        masterVolume: 1.0,
        sfxVolume: 0.8,
        musicVolume: 0.6,
        currentMusic: null,
        isPlaying: false
    },

    // Audio Sources
    sounds: {
        perfect: null,
        good: null,
        miss: null,
        combo: null,
        start: null,
        gameOver: null
    },

    // Initialize Audio System
    init() {
        this.initializeAudioContext();
        this.createAudioSources();
        console.log('Audio system initialized');
    },

    // Initialize Audio Context
    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Audio context created');
        } catch (error) {
            console.warn('Audio context not supported:', error);
            this.state.isEnabled = false;
        }
    },

    // Create Audio Sources
    createAudioSources() {
        if (!this.audioContext) return;
        
        // Create sound effects using Web Audio API
        this.sounds.perfect = this.createTone(800, 0.1, 'sine');
        this.sounds.good = this.createTone(600, 0.1, 'sine');
        this.sounds.miss = this.createTone(200, 0.2, 'sawtooth');
        this.sounds.combo = this.createTone(1000, 0.15, 'triangle');
        this.sounds.start = this.createTone(440, 0.3, 'square');
        this.sounds.gameOver = this.createTone(220, 0.5, 'sine');
    },

    // Create Tone
    createTone(frequency, duration, waveType = 'sine') {
        if (!this.audioContext) return null;
        
        return {
            frequency: frequency,
            duration: duration,
            waveType: waveType,
            play: () => this.playTone(frequency, duration, waveType)
        };
    },

    // Play Tone
    playTone(frequency, duration, waveType = 'sine') {
        if (!this.audioContext || !this.state.isEnabled) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = waveType;
            
            // Set volume
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
                this.state.sfxVolume * this.state.masterVolume, 
                this.audioContext.currentTime + 0.01
            );
            gainNode.gain.exponentialRampToValueAtTime(
                0.01, 
                this.audioContext.currentTime + duration
            );
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
            
        } catch (error) {
            console.warn('Error playing tone:', error);
        }
    },

    // Play Sound Effect
    playSound(soundName) {
        if (!this.state.isEnabled || !this.sounds[soundName]) return;
        
        const sound = this.sounds[soundName];
        if (sound && sound.play) {
            sound.play();
        }
        
        console.log(`Playing sound: ${soundName}`);
    },

    // Play Perfect Hit Sound
    playPerfectHit() {
        this.playSound('perfect');
        
        // Add additional effect for perfect hits
        if (this.audioContext && this.state.isEnabled) {
            // Play a quick ascending tone
            setTimeout(() => {
                this.playTone(800, 0.05, 'sine');
            }, 50);
            setTimeout(() => {
                this.playTone(1000, 0.05, 'sine');
            }, 100);
        }
    },

    // Play Good Hit Sound
    playGoodHit() {
        this.playSound('good');
    },

    // Play Miss Sound
    playMissSound() {
        this.playSound('miss');
    },

    // Play Combo Sound
    playComboSound(comboCount) {
        this.playSound('combo');
        
        // Add special effects for high combos
        if (comboCount > 10) {
            setTimeout(() => {
                this.playTone(1200, 0.1, 'triangle');
            }, 100);
        }
        
        if (comboCount > 20) {
            setTimeout(() => {
                this.playTone(1400, 0.1, 'triangle');
            }, 200);
        }
    },

    // Play Start Game Sound
    playStartSound() {
        this.playSound('start');
    },

    // Play Game Over Sound
    playGameOverSound() {
        this.playSound('gameOver');
        
        // Add dramatic effect
        if (this.audioContext && this.state.isEnabled) {
            setTimeout(() => {
                this.playTone(180, 0.3, 'sine');
            }, 200);
            setTimeout(() => {
                this.playTone(160, 0.4, 'sine');
            }, 500);
        }
    },

    // Create Background Music
    createBackgroundMusic() {
        if (!this.audioContext || !this.state.isEnabled) return;
        
        // Simple background music using multiple oscillators
        const musicNotes = [
            { freq: 261.63, time: 0.5 }, // C4
            { freq: 293.66, time: 0.5 }, // D4
            { freq: 329.63, time: 0.5 }, // E4
            { freq: 349.23, time: 0.5 }, // F4
            { freq: 392.00, time: 0.5 }, // G4
            { freq: 440.00, time: 0.5 }, // A4
            { freq: 493.88, time: 0.5 }, // B4
            { freq: 523.25, time: 0.5 }  // C5
        ];
        
        let currentNote = 0;
        const playNextNote = () => {
            if (!this.state.isPlaying) return;
            
            const note = musicNotes[currentNote];
            this.playTone(note.freq, note.time * 0.8, 'triangle');
            
            currentNote = (currentNote + 1) % musicNotes.length;
            setTimeout(playNextNote, note.time * 1000);
        };
        
        if (this.state.isPlaying) {
            playNextNote();
        }
    },

    // Start Background Music
    startBackgroundMusic() {
        if (!this.state.isEnabled) return;
        
        this.state.isPlaying = true;
        this.createBackgroundMusic();
        console.log('Background music started');
    },

    // Stop Background Music
    stopBackgroundMusic() {
        this.state.isPlaying = false;
        console.log('Background music stopped');
    },

    // Set Master Volume
    setMasterVolume(volume) {
        this.state.masterVolume = Math.max(0, Math.min(1, volume));
        console.log(`Master volume set to: ${this.state.masterVolume}`);
    },

    // Set SFX Volume
    setSFXVolume(volume) {
        this.state.sfxVolume = Math.max(0, Math.min(1, volume));
        console.log(`SFX volume set to: ${this.state.sfxVolume}`);
    },

    // Set Music Volume
    setMusicVolume(volume) {
        this.state.musicVolume = Math.max(0, Math.min(1, volume));
        console.log(`Music volume set to: ${this.state.musicVolume}`);
    },

    // Toggle Audio
    toggleAudio() {
        this.state.isEnabled = !this.state.isEnabled;
        
        if (!this.state.isEnabled) {
            this.stopBackgroundMusic();
        }
        
        console.log(`Audio ${this.state.isEnabled ? 'enabled' : 'disabled'}`);
    },

    // Resume Audio Context (needed for user interaction)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('Audio context resumed');
            });
        }
    },

    // Handle User Interaction (required for audio to work)
    handleUserInteraction() {
        this.resumeAudioContext();
        
        // Remove event listeners after first interaction
        document.removeEventListener('click', this.handleUserInteraction);
        document.removeEventListener('keydown', this.handleUserInteraction);
        document.removeEventListener('touchstart', this.handleUserInteraction);
    },

    // Create Complex Sound Effect
    createComplexSFX(type) {
        if (!this.audioContext || !this.state.isEnabled) return;
        
        const now = this.audioContext.currentTime;
        
        switch (type) {
            case 'perfectCombo':
                // Multiple tones for perfect combo
                [440, 554, 659, 880].forEach((freq, index) => {
                    setTimeout(() => {
                        this.playTone(freq, 0.1, 'sine');
                    }, index * 50);
                });
                break;
                
            case 'streakBreak':
                // Descending tone for streak break
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        this.playTone(400 - i * 50, 0.1, 'sawtooth');
                    }, i * 30);
                }
                break;
                
            case 'levelUp':
                // Ascending arpeggio
                [261, 329, 392, 523].forEach((freq, index) => {
                    setTimeout(() => {
                        this.playTone(freq, 0.15, 'triangle');
                    }, index * 100);
                });
                break;
        }
    },

    // Get Audio Statistics
    getStatistics() {
        return {
            isEnabled: this.state.isEnabled,
            masterVolume: this.state.masterVolume,
            sfxVolume: this.state.sfxVolume,
            musicVolume: this.state.musicVolume,
            isPlaying: this.state.isPlaying,
            audioContextState: this.audioContext ? this.audioContext.state : 'not available'
        };
    },

    // Reset Audio System
    reset() {
        this.stopBackgroundMusic();
        this.state.isPlaying = false;
        console.log('Audio system reset');
    }
};

// Add event listeners for user interaction (required for audio)
document.addEventListener('click', () => AudioManager.handleUserInteraction());
document.addEventListener('keydown', () => AudioManager.handleUserInteraction());
document.addEventListener('touchstart', () => AudioManager.handleUserInteraction());

// Export for use in other modules
window.AudioManager = AudioManager;
