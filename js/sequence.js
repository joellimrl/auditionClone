// Sequence Generator Module
const SequenceGenerator = {
    // Available arrow keys
    arrows: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
    
    // Pattern Templates
    patterns: {
        basic: [
            ['ArrowUp', 'ArrowDown'],
            ['ArrowLeft', 'ArrowRight'],
            ['ArrowUp', 'ArrowLeft'],
            ['ArrowDown', 'ArrowRight']
        ],
        intermediate: [
            ['ArrowUp', 'ArrowDown', 'ArrowUp'],
            ['ArrowLeft', 'ArrowRight', 'ArrowLeft'],
            ['ArrowUp', 'ArrowLeft', 'ArrowDown'],
            ['ArrowRight', 'ArrowUp', 'ArrowRight']
        ],
        advanced: [
            ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
            ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'],
            ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'],
            ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']
        ]
    },

    // Generator State
    state: {
        lastSequence: [],
        difficulty: 1,
        patternHistory: [],
        maxHistorySize: 10
    },

    // Configuration
    config: {
        minLength: 3,
        maxLength: 8,
        repeatPrevention: true,
        patternComplexity: 1.0,
        randomnessWeight: 0.7
    },

    // Initialize Generator
    init() {
        this.state.difficulty = 1;
        this.state.patternHistory = [];
        console.log('Sequence generator initialized');
    },

    // Generate New Sequence
    generateSequence(length = 5, difficulty = 1) {
        // Simple random sequence generation
        const sequence = [];
        
        for (let i = 0; i < length; i++) {
            let nextArrow;
            
            if (i === 0) {
                // First arrow is random
                nextArrow = this.getRandomArrow();
            } else {
                // Avoid immediate repetition
                do {
                    nextArrow = this.getRandomArrow();
                } while (nextArrow === sequence[i - 1]);
            }
            
            sequence.push(nextArrow);
        }
        
        console.log(`Generated sequence (length ${length}):`, sequence);
        return sequence;
    },

    // Generate Basic Sequence (Difficulty 1-2)
    generateBasicSequence(length) {
        const sequence = [];
        
        for (let i = 0; i < length; i++) {
            let nextArrow;
            
            if (i === 0) {
                // First arrow is random
                nextArrow = this.getRandomArrow();
            } else {
                // Avoid immediate repetition
                do {
                    nextArrow = this.getRandomArrow();
                } while (nextArrow === sequence[i - 1]);
            }
            
            sequence.push(nextArrow);
        }
        
        return sequence;
    },

    // Generate Intermediate Sequence (Difficulty 3-4)
    generateIntermediateSequence(length) {
        const sequence = [];
        const usePattern = Math.random() < 0.6; // 60% chance to use pattern
        
        if (usePattern && this.patterns.intermediate.length > 0) {
            // Use predefined pattern as base
            const pattern = this.getRandomPattern('intermediate');
            sequence.push(...pattern);
            
            // Fill remaining length with random arrows
            while (sequence.length < length) {
                const nextArrow = this.getSmartNextArrow(sequence);
                sequence.push(nextArrow);
            }
        } else {
            // Generate with more complex rules
            for (let i = 0; i < length; i++) {
                const nextArrow = this.getSmartNextArrow(sequence);
                sequence.push(nextArrow);
            }
        }
        
        return sequence.slice(0, length);
    },

    // Generate Advanced Sequence (Difficulty 5+)
    generateAdvancedSequence(length) {
        const sequence = [];
        const techniques = ['pattern', 'rhythm', 'complexity', 'mirror'];
        const technique = techniques[Math.floor(Math.random() * techniques.length)];
        
        switch (technique) {
            case 'pattern':
                return this.generatePatternSequence(length);
            case 'rhythm':
                return this.generateRhythmSequence(length);
            case 'complexity':
                return this.generateComplexSequence(length);
            case 'mirror':
                return this.generateMirrorSequence(length);
            default:
                return this.generateComplexSequence(length);
        }
    },

    // Generate Pattern-Based Sequence
    generatePatternSequence(length) {
        const sequence = [];
        const patterns = this.patterns.advanced;
        
        while (sequence.length < length) {
            const pattern = patterns[Math.floor(Math.random() * patterns.length)];
            sequence.push(...pattern);
        }
        
        return sequence.slice(0, length);
    },

    // Generate Rhythm-Based Sequence
    generateRhythmSequence(length) {
        const sequence = [];
        const rhythmPatterns = [
            [1, 1, 2, 1], // Quick-quick-slow-quick
            [2, 1, 1, 2], // Slow-quick-quick-slow
            [1, 2, 1, 1], // Quick-slow-quick-quick
        ];
        
        const pattern = rhythmPatterns[Math.floor(Math.random() * rhythmPatterns.length)];
        let patternIndex = 0;
        
        for (let i = 0; i < length; i++) {
            const arrow = this.getRandomArrow();
            sequence.push(arrow);
            
            // Add emphasis arrows for rhythm
            if (pattern[patternIndex % pattern.length] === 2) {
                // This would be a "strong" beat - could add visual emphasis
                // For now, just continue with normal generation
            }
            
            patternIndex++;
        }
        
        return sequence;
    },

    // Generate Complex Sequence
    generateComplexSequence(length) {
        const sequence = [];
        
        for (let i = 0; i < length; i++) {
            let nextArrow;
            
            if (i < 2) {
                nextArrow = this.getRandomArrow();
            } else {
                // Avoid creating simple patterns
                do {
                    nextArrow = this.getRandomArrow();
                } while (
                    nextArrow === sequence[i - 1] ||
                    (sequence[i - 1] === sequence[i - 2] && nextArrow === sequence[i - 1])
                );
            }
            
            sequence.push(nextArrow);
        }
        
        return sequence;
    },

    // Generate Mirror Sequence
    generateMirrorSequence(length) {
        const halfLength = Math.floor(length / 2);
        const firstHalf = [];
        
        // Generate first half
        for (let i = 0; i < halfLength; i++) {
            firstHalf.push(this.getRandomArrow());
        }
        
        // Mirror the first half
        const secondHalf = firstHalf.map(arrow => this.getMirrorArrow(arrow));
        
        const sequence = [...firstHalf, ...secondHalf];
        
        // Add extra arrow if length is odd
        if (length % 2 === 1) {
            sequence.push(this.getRandomArrow());
        }
        
        return sequence;
    },

    // Get Smart Next Arrow (considers previous arrows)
    getSmartNextArrow(sequence) {
        if (sequence.length === 0) {
            return this.getRandomArrow();
        }
        
        const lastArrow = sequence[sequence.length - 1];
        const weights = this.calculateArrowWeights(sequence);
        
        return this.getWeightedRandomArrow(weights);
    },

    // Calculate Arrow Weights Based on Sequence
    calculateArrowWeights(sequence) {
        const weights = {
            'ArrowUp': 1,
            'ArrowDown': 1,
            'ArrowLeft': 1,
            'ArrowRight': 1
        };
        
        if (sequence.length === 0) return weights;
        
        const lastArrow = sequence[sequence.length - 1];
        const lastTwoArrows = sequence.slice(-2);
        
        // Reduce weight for immediate repetition
        weights[lastArrow] *= 0.3;
        
        // Consider opposite arrows
        const opposites = {
            'ArrowUp': 'ArrowDown',
            'ArrowDown': 'ArrowUp',
            'ArrowLeft': 'ArrowRight',
            'ArrowRight': 'ArrowLeft'
        };
        
        const oppositeArrow = opposites[lastArrow];
        if (oppositeArrow) {
            weights[oppositeArrow] *= 1.5; // Favor opposite directions
        }
        
        // Check for patterns in last two arrows
        if (lastTwoArrows.length === 2 && lastTwoArrows[0] === lastTwoArrows[1]) {
            weights[lastTwoArrows[0]] *= 0.1; // Heavily discourage three in a row
        }
        
        return weights;
    },

    // Get Weighted Random Arrow
    getWeightedRandomArrow(weights) {
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const [arrow, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) {
                return arrow;
            }
        }
        
        return this.getRandomArrow(); // Fallback
    },

    // Get Random Arrow
    getRandomArrow() {
        return this.arrows[Math.floor(Math.random() * this.arrows.length)];
    },

    // Get Random Pattern
    getRandomPattern(difficulty) {
        const patterns = this.patterns[difficulty] || this.patterns.basic;
        return patterns[Math.floor(Math.random() * patterns.length)];
    },

    // Get Mirror Arrow
    getMirrorArrow(arrow) {
        const mirrors = {
            'ArrowUp': 'ArrowDown',
            'ArrowDown': 'ArrowUp',
            'ArrowLeft': 'ArrowRight',
            'ArrowRight': 'ArrowLeft'
        };
        return mirrors[arrow] || arrow;
    },

    // Avoid Repetition with Previous Sequences
    avoidRepetition(sequence) {
        const maxAttempts = 10;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            const similarity = this.calculateSimilarity(sequence, this.state.lastSequence);
            
            if (similarity < 0.6) { // Less than 60% similar
                break;
            }
            
            // Regenerate with more randomness
            sequence = this.shuffleSequence(sequence);
            attempts++;
        }
        
        return sequence;
    },

    // Calculate Similarity Between Sequences
    calculateSimilarity(seq1, seq2) {
        if (!seq1 || !seq2 || seq1.length !== seq2.length) {
            return 0;
        }
        
        let matches = 0;
        for (let i = 0; i < seq1.length; i++) {
            if (seq1[i] === seq2[i]) {
                matches++;
            }
        }
        
        return matches / seq1.length;
    },

    // Shuffle Sequence
    shuffleSequence(sequence) {
        const shuffled = [...sequence];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Add to History
    addToHistory(sequence) {
        this.state.patternHistory.push(sequence);
        
        // Keep history size manageable
        if (this.state.patternHistory.length > this.state.maxHistorySize) {
            this.state.patternHistory.shift();
        }
    },

    // Get Generator Statistics
    getStatistics() {
        return {
            difficulty: this.state.difficulty,
            historySize: this.state.patternHistory.length,
            lastSequenceLength: this.state.lastSequence.length,
            patternsAvailable: {
                basic: this.patterns.basic.length,
                intermediate: this.patterns.intermediate.length,
                advanced: this.patterns.advanced.length
            }
        };
    },

    // Reset Generator
    reset() {
        this.state.lastSequence = [];
        this.state.difficulty = 1;
        this.state.patternHistory = [];
        console.log('Sequence generator reset');
    },

    // Add Custom Pattern
    addCustomPattern(difficulty, pattern) {
        if (this.patterns[difficulty]) {
            this.patterns[difficulty].push(pattern);
            console.log(`Added custom pattern to ${difficulty}:`, pattern);
        }
    },

    // Validate Sequence
    validateSequence(sequence) {
        if (!Array.isArray(sequence) || sequence.length === 0) {
            return false;
        }
        
        return sequence.every(arrow => this.arrows.includes(arrow));
    }
};

// Export for use in other modules
window.SequenceGenerator = SequenceGenerator;
