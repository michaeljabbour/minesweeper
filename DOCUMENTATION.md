# Minesweeper 95 Technical Documentation

This document provides comprehensive technical documentation for the Minesweeper 95 implementation.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Module Breakdown](#module-breakdown)
3. [Key Algorithms](#key-algorithms)
4. [UI Components](#ui-components)
5. [Feature Implementation Details](#feature-implementation-details)
6. [Development Notes](#development-notes)

## Architecture Overview

The game follows a modular architecture but is bundled into a single HTML file for easy distribution. The JavaScript is organized into logical modules, each with specific responsibilities:

```
index.html
├── CSS (styles)
└── JavaScript
    ├── Sounds Module (lines 556-612)
    ├── Storage Module (lines 614-658)
    ├── UI Module (lines 660-816)
    ├── Game Module (lines 818-1258)
    └── Initialization (lines 1260-1487)
```

## Module Breakdown

### Sounds Module (lines 556-612)

Handles all audio-related functionality:

- **Sound Loading**: Creates Audio elements for all game sounds with external URLs
- **Error Handling**: Robust error handling for failed sound loading
- **Playback Control**: Controls sound playback with volume adjustment
- **Mute Toggle**: Provides functionality to mute/unmute all sounds

Key implementation detail: Uses a fallback mechanism to prevent breaking the game if sounds fail to load.

```javascript
// Sound loading with error handling
function setAudioSource(audio, url) {
  audio.src = url;
  audio.onerror = function() {
    console.log(`Failed to load audio: ${url}`);
    // Mark as handled to prevent UI errors
    audio.error = null;
  };
}
```

### Storage Module (lines 614-658)

Manages all data persistence using localStorage:

- **Game State**: Saves/loads current game state
- **Leaderboard**: Manages player scores and timestamps
- **Settings**: Persists user preferences like theme, sound settings
- **Data Formatting**: Handles proper JSON serialization/deserialization

Example of the storage API:

```javascript
function saveLeaders(time) {
  const leaders = loadLeaders(); 
  const name = prompt('You won! Enter your name:', 'Player');
  if (name) {
    leaders.push({
      name: name,
      time: time,
      date: new Date().toLocaleDateString()
    }); 
    leaders.sort((a, b) => a.time - b.time); 
    localStorage.setItem('minesweeper-leaders', JSON.stringify(leaders.slice(0, 10))); 
  }
}
```

### UI Module (lines 660-816)

Handles all rendering and display logic:

- **Board Rendering**: Creates the game grid with proper styling
- **Template Processing**: Applies board templates (heart, smiley, etc.)
- **Counters**: Updates timer and mines counters
- **Face Button**: Changes face expression based on game state
- **Leaderboard**: Formats and displays the leaderboard
- **Theme**: Applies and persists theme preferences

A notable implementation is the template rendering system that uses mathematical formulas to create different board shapes:

```javascript
function isHiddenInTemplate(r, c, rows, cols, template) {
  // Scale coordinates to [-1, 1] range for calculations
  const x = (c / (cols - 1)) * 2 - 1;
  const y = (r / (rows - 1)) * 2 - 1;
  
  switch (template) {
    case 'heart':
      // Heart shape formula
      const heartX = Math.abs(x);
      return !(Math.pow(heartX - x*x, 2) + Math.pow(y - 0.5*Math.sqrt(Math.max(1-Math.pow(heartX, 2), 0)), 2) <= 0.3);
    
    // ...other templates
  }
}
```

### Game Module (lines 818-1258)

The core game mechanics:

- **Game State**: Tracks game state, timer, mines, etc.
- **Board Generation**: Creates the game board with proper mine placement
- **Click Handling**: Processes left/right clicks and reveals cells
- **Win/Lose Conditions**: Determines game outcomes
- **Auto-flagging**: Provides intelligent assistance
- **Hint System**: Gives players hints with limited usage

The key algorithm here is the recursive cell revelation when clicking on an empty cell:

```javascript
reveal(r, c) { 
  if(this.visible[r][c] || this.flagged[r][c]) return; 
  this.visible[r][c] = true; 
  
  // Update UI
  
  if(this.grid[r][c] === 0) {
    // Recursively reveal adjacent cells for empty cells
    for(let i = -1; i <= 1; i++) {
      for(let j = -1; j <= 1; j++) {
        if(i || j) { 
          let rr = r + i, cc = c + j; 
          if(rr >= 0 && rr < this.rows && cc >= 0 && cc < this.cols) {
            this.reveal(rr, cc); 
          }
        }
      }
    }
  }
}
```

### Initialization (lines 1260-1487)

Sets up the game and event listeners:

- **DOM Ready**: Initializes the game on DOM content loaded
- **Event Listeners**: Sets up all button and UI interaction events
- **Settings Loading**: Loads saved settings
- **Game Creation**: Creates the initial game instance
- **Window Handling**: Sets up responsive behavior

## Key Algorithms

### Mine Placement (lines 876-909)

The mine placement algorithm is critical for generating a fair game:

1. Determines valid cells based on the selected template
2. Excludes the first-clicked cell for "safe first click"
3. Shuffles valid cells randomly
4. Places mines in the shuffled cells up to the mine count
5. Adjusts the mine count if the template doesn't allow enough cells

### Auto-Flagging (lines 1023-1064)

This feature helps players by automatically flagging cells that must contain mines:

1. Iterates through all revealed cells with numbers
2. Counts the number of hidden cells and flags around each
3. If hidden cells equal the number and not all are flagged, flags them all
4. Returns whether any flags were placed

### Template Rendering (lines 717-753)

Creates special board shapes using parametric equations:

- **Heart**: Uses a modified cardioid equation
- **Smiley**: Combines circle equations for face, eyes, and smile
- **Spiral**: Uses polar coordinates to create a spiral pattern

## UI Components

### Windows 95 Styling

The CSS uses custom properties to capture the Windows 95 aesthetic:

```css
:root {
  --win95-bg: #c0c0c0;
  --win95-light: #ffffff;
  --win95-dark: #808080;
  --win95-darker: #404040;
  --win95-blue: #000080;
  --win95-text: #000000;
  --win95-shadow-out: inset -1px -1px #000000, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf;
  --win95-shadow-in: inset -1px -1px #ffffff, inset 1px 1px #000000, inset -2px -2px #dfdfdf, inset 2px 2px #808080;
}
```

### Dark Mode Implementation

The dark mode is implemented by changing the CSS variables:

```css
body[data-theme='dark'] { 
  --win95-bg: #000080;
  --win95-light: #c0c0c0;
  --win95-dark: #000040;
  --win95-darker: #000000;
  --win95-text: #ffffff;
}
```

Additional overrides ensure good contrast for interactive elements in dark mode.

### Modal Dialog

The "How to Play" modal uses a classic Windows 95 dialog style with proper event handling for opening and closing.

### Tab System

The tab system for leaderboard and settings uses CSS classes to manage the active state:

```javascript
tab.addEventListener('click', () => {
  // Remove active class from all tabs and content
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  // Add active class to clicked tab and corresponding content
  tab.classList.add('active');
  document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
});
```

## Feature Implementation Details

### Safe First Click

The safe first click feature ensures the player never hits a mine on their first click:

1. If the first clicked cell contains a mine, the algorithm finds a non-mine cell
2. Moves the mine to that cell
3. Recalculates numbers for all cells

### Game Pause/Resume

Pausing works by:
1. Setting a paused flag
2. Stopping the timer from incrementing
3. Applying a visual indicator (opacity change)
4. Preventing clicks while paused

### Hint System

The hint system helps players by:
1. Finding a safe (non-mine) cell that's not revealed
2. Highlighting it briefly with a yellow background
3. Automatically revealing it after a short delay

## Development Notes

### Mobile Responsiveness

The game adapts to mobile screens by:
1. Reducing cell size on smaller screens
2. Using CSS media queries for layout adjustments
3. Handling touch events appropriately

### Performance Considerations

Several optimizations improve performance:
1. Minimizing DOM manipulation by updating cells in place
2. Using CSS classes for styling changes rather than inline styles
3. Efficient algorithm for revealing cells recursively
4. Debouncing window resize events

### Sound Loading Strategy

Sounds are loaded from external URLs with error handling to prevent UI breakage:
1. Sets up error handlers before attempting to load
2. Nullifies errors to prevent console spam
3. Reduces volume to avoid startling users
4. Uses try-catch blocks around playback attempts

### Local Storage Usage

The game makes efficient use of localStorage:
1. Stores only essential data to avoid exceeding quota
2. Uses JSON for serialization
3. Includes error handling for accessing localStorage
4. Implements data migration for backwards compatibility