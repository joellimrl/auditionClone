# Audition Clone - Web Rhythm Game

A web-based rhythm game inspired by Audition SEA, featuring arrow sequence matching with time pressure mechanics.

## Features

- **Rhythm-based gameplay**: Press arrow keys in sequence within time limits
- **Dynamic difficulty**: Game gets progressively harder
- **Scoring system**: Points based on timing accuracy (Perfect, Good, Miss)
- **Combo system**: Build combos for higher scores
- **Visual effects**: Particle effects and animations
- **Audio feedback**: Sound effects and background music using Web Audio API
- **Responsive design**: Works on desktop and mobile devices

## How to Play

1. **Start the game**: Click the "Start Game" button
2. **Follow the sequence**: Arrow symbols will appear showing the sequence to press
3. **Time pressure**: You have a limited time to press each arrow in the correct order
4. **Scoring**: 
   - **Perfect**: Hit within 50ms of optimal timing (100 points)
   - **Good**: Hit within 100ms of optimal timing (50 points)
   - **Miss**: Hit outside timing window or wrong key (0 points)
5. **Combos**: Consecutive correct hits build combos for score multipliers
6. **Game duration**: 30 seconds per game

## Controls

- **Arrow Keys**: ↑ ↓ ← → (or click/tap the on-screen arrows)
- **Start Game**: Begin a new game
- **Pause**: Pause the current game
- **Reset**: Reset the game to initial state
- **F1**: Toggle debug information (development mode)

## Technical Details

### Architecture
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Audio**: Web Audio API for dynamic sound generation
- **Animations**: CSS animations with JavaScript-driven particle effects
- **Timing**: High-precision timing using `performance.now()`

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
   - Score tracking and game flow
   - Timer and sequence management

2. **Input Handler** (`input.js`)
   - Keyboard and mouse input processing
   - Touch support for mobile devices
   - Input validation and feedback

3. **Timing System** (`timing.js`)
   - High-precision timing calculations
   - Performance monitoring
   - Frame rate tracking

4. **Sequence Generator** (`sequence.js`)
   - Dynamic arrow sequence creation
   - Difficulty-based pattern generation
   - Pattern history and repetition avoidance

5. **UI Manager** (`ui.js`)
   - Visual effects and animations
   - Particle systems
   - Debug information display

6. **Audio Manager** (`audio.js`)
   - Sound effect generation
   - Background music
   - Volume control

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

### Debugging

- Press **F1** to toggle debug information
- Check browser console for detailed logs
- Use browser dev tools for performance profiling

### Performance Optimization

- Game targets 60 FPS
- Particle effects are optimized for smooth performance
- Audio uses Web Audio API for low-latency sound

## Scoring System

- **Base Points**: Perfect (100), Good (50), Miss (0)
- **Combo Multiplier**: 1.5x for combos > 1
- **Difficulty Scaling**: Higher difficulties increase potential scores
- **Time Bonus**: Completing sequences quickly may provide bonus points

## Future Enhancements

- [ ] Music synchronization with beat detection
- [ ] Multiple difficulty levels
- [ ] Custom song support
- [ ] Online leaderboards
- [ ] Achievement system
- [ ] Different game modes (endless, challenge)
- [ ] Customizable themes
- [ ] Mobile app version

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
