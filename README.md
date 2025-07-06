# Audition Clone - Web Rhythm Game

A web-based rhythm game inspired by Audition SEA, featuring arrow sequence matching with time pressure mechanics.

## Features

- **Line-based gameplay**: Complete arrow sequences within time limits
- **Time pressure mechanics**: Each line has a dynamic time limit (5-15 seconds)
- **Mistake tracking**: Game tracks errors but allows continuation
- **Score-based progression**: Earn points for correct inputs and line completions
- **Visual feedback**: Real-time input feedback with animations
- **Audio system**: Dynamic sound effects using Web Audio API
- **Responsive design**: Works on desktop and mobile devices
- **Game statistics**: Track lines completed, mistakes, and average completion time

## How to Play

1. **Start the game**: Click the "Start Game" button
2. **Follow the sequence**: Arrow symbols will appear showing the sequence to press
3. **Time pressure**: You have a limited time to complete each line (5-15 seconds)
4. **Scoring**: 
   - **Correct Input**: 10 points per correct arrow key press
   - **Line Complete**: 50 bonus points for completing a full line
   - **Mistakes**: Tracked but don't end the game - press the correct key to continue
5. **Game duration**: 60 seconds total - complete as many lines as possible
6. **Statistics**: Game tracks your progress including mistakes and average line completion time

## Controls

- **Arrow Keys**: ⬆ ⬇ ⬅ ➡ (or click/tap the on-screen arrows)
- **Start Game**: Begin a new game
- **Pause**: Pause the current game
- **Reset**: Reset the game to initial state
- **F1**: Toggle debug information (development mode)

## Game Interface

### Header Display
- **Score**: Shows current points earned (green color)
- **Mistakes**: Tracks incorrect inputs (red color)
- **Game Time**: 60-second countdown timer (blue color)  
- **Line Time**: Time remaining for current sequence (orange color)

### Game Area
- **Sequence Display**: Shows arrow sequence to be pressed
- **Input Area**: On-screen arrow buttons (⬆ ⬇ ⬅ ➡)
- **Input Feedback**: Real-time feedback messages (✓, ✗, LINE COMPLETE!, TIME OUT!)

### Game Controls
- **Start Game**: Begin new game or resume paused game
- **Pause**: Pause current game (disabled when not playing)
- **Reset**: Reset game to initial state

### Game Over Screen
- **Final Score**: Total points earned
- **Total Mistakes**: Number of incorrect inputs
- **Lines Completed**: Number of sequences completed
- **Average Line Time**: Average time per completed sequence
- **Play Again**: Start new game immediately

## Technical Details

### Architecture
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Audio**: Web Audio API for dynamic sound generation and effects
- **Animations**: CSS animations with JavaScript-driven particle effects
- **Timing**: High-precision timing using `performance.now()`
- **State Management**: Modular JavaScript architecture with singleton patterns
- **UI Framework**: Vanilla JavaScript with custom animation system
- **Input System**: Multi-modal input handling (keyboard, mouse, touch)
- **Performance**: Optimized rendering loop with frame rate monitoring

### File Structure
```
auditionClone/
├── index.html          # Main game page
├── css/
│   ├── styles.css      # Main stylesheet
│   └── animations.css  # Animation definitions
├── js/
│   ├── game.js         # Main game logic
│   ├── input.js        # Input handling
│   ├── timing.js       # Timing system
│   ├── sequence.js     # Arrow sequence generation
│   ├── ui.js           # UI management
│   └── audio.js        # Audio system
└── README.md          # This file
```

### Game Modules

1. **Game Controller** (`game.js`)
   - Main game state management
   - Score tracking and mistake counting
   - Timer management (game timer and line timer)
   - Sequence generation and input handling

2. **Input Handler** (`input.js`)
   - Keyboard and mouse input processing
   - Touch support for mobile devices
   - Input validation and rapid input detection
   - Input buffering system

3. **Timing System** (`timing.js`)
   - High-precision timing calculations
   - Performance monitoring and frame rate tracking
   - Rhythm timing calculations for future music sync
   - Performance metrics collection

4. **Sequence Generator** (`sequence.js`)
   - Dynamic arrow sequence creation
   - Advanced pattern generation (patterns, rhythm, complexity, mirror)
   - Pattern history tracking and repetition avoidance
   - Customizable difficulty patterns

5. **UI Manager** (`ui.js`)
   - Visual effects and animations
   - Particle systems and score animations
   - Debug information display
   - Game feedback and visual states

6. **Audio Manager** (`audio.js`)
   - Sound effect generation using Web Audio API
   - Dynamic tone generation for different game events
   - Volume control and audio context management
   - Complex sound effects for combos and special events

## Installation

1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. Start playing immediately - no additional setup required!

## Browser Compatibility

- **Recommended**: Chrome, Firefox, Safari, Edge (latest versions)
- **Minimum**: Browsers with ES6 support and Web Audio API
- **Mobile**: iOS Safari, Android Chrome

## Development

### Adding New Features

1. **New Sound Effects**: Add to `AudioManager.sounds` in `audio.js`
2. **New Animations**: Add keyframes to `animations.css` 
3. **New Patterns**: Add to `SequenceGenerator.patterns` in `sequence.js`
4. **New UI Elements**: Add to HTML and style in `styles.css`
5. **Game Mechanics**: Modify scoring, timing, or difficulty in `game.js`
6. **Input Handling**: Extend input processing in `input.js`

### Debugging

- Press **F1** to toggle debug information
- Check browser console for detailed logs
- Use browser dev tools for performance profiling

### Performance Optimization

- Game targets 60 FPS with performance monitoring
- Dynamic sequence generation with pattern optimization
- Efficient DOM manipulation and animation queuing
- Audio uses Web Audio API for low-latency sound
- Particle effects and animations are optimized for smooth performance
- Memory management for long-running game sessions

## Scoring System

- **Base Points**: 10 points per correct arrow input
- **Line Completion Bonus**: 50 points for completing a full sequence
- **Mistake Tracking**: Mistakes are counted but don't prevent continuation
- **Game Statistics**: Final score, total mistakes, lines completed, and average line time
- **Dynamic Difficulty**: Sequence length varies from 4-8 arrows per line
- **Time Pressure**: Each line has 5-15 seconds based on sequence length and difficulty

## Game Mechanics

### Sequence Generation
- **Dynamic Length**: Sequences range from 4-8 arrows based on difficulty
- **Pattern Types**: Simple, advanced patterns including mirror sequences
- **Repetition Avoidance**: System prevents immediate arrow repetition
- **Advanced Techniques**: Pattern-based, rhythm-based, complexity-based, and mirror generation

### Timing System
- **Line Timer**: Each sequence has 5-15 seconds based on length and difficulty
- **Game Timer**: 60-second total game duration
- **Visual Warnings**: Timer changes color when time is low (≤10 seconds for game, ≤3 seconds for line)
- **Dynamic Allocation**: Time varies with sequence complexity and random factors

### Input Processing
- **Mistake Handling**: Incorrect inputs are tracked but don't stop progression
- **Rapid Input Detection**: System detects very fast input sequences (<50ms)
- **Input Buffering**: Maintains input history for analysis
- **Multi-modal Support**: Keyboard, mouse, and touch input

### Visual Feedback
- **Arrow States**: Active, completed, correct, incorrect visual states
- **Feedback Messages**: ✓ (correct), ✗ (incorrect), LINE COMPLETE!, TIME OUT!
- **Color Coding**: Green for correct, red for incorrect, blue for complete, orange for timeout
- **Animation System**: Particle effects, score animations, and visual transitions

## Future Enhancements

- [ ] Music synchronization with beat detection
- [ ] Multiple difficulty levels with different timing windows
- [ ] Custom song support with BPM detection
- [ ] Online leaderboards and score sharing
- [ ] Achievement system and unlockable content
- [ ] Different game modes (endless, challenge, timed)
- [ ] Customizable themes and arrow styles
- [ ] Mobile app version with improved touch controls
- [ ] Combo system with score multipliers
- [ ] Perfect/Good/Miss timing-based scoring
- [ ] Background music integration

## License

This project is for educational purposes. Original Audition game mechanics are property of their respective owners.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Credits

- Inspired by Audition SEA rhythm game
- Built with modern web technologies
- No external dependencies - pure JavaScript implementation

---

**Have fun playing!** 🎵🎮
