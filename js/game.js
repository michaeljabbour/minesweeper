import { renderBoard, updateTimer, updateHints, updateLeaderboard, applyTheme, playSound, shareResults } from './ui.js';
import { saveState, loadState, saveLeaders, loadLeaders, saveSettings, loadSettings } from './storage.js';

class Game {
  constructor(rows, cols, mines) {
    this.rows = rows; 
    this.cols = cols; 
    this.mines = mines; 
    this.firstClick = true; 
    this.flags = 0; 
    this.timer = null; 
    this.time = 0; 
    this.hintsLeft = 3;
    this.setup();
  }
  
  setup() {
    this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    this.visible = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.flagged = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    renderBoard(this.rows, this.cols, (r,c,btn) => this.handleClick(r,c,btn));
    updateHints(this.hintsLeft);
  }
  
  placeMines(excludeR, excludeC) {
    let placed = 0; 
    while(placed < this.mines) {
      let r = Math.floor(Math.random() * this.rows);
      let c = Math.floor(Math.random() * this.cols);
      if(this.grid[r][c] === 'M' || (r === excludeR && c === excludeC)) continue;
      this.grid[r][c] = 'M'; 
      placed++; 
    }
    
    for(let r = 0; r < this.rows; r++) {
      for(let c = 0; c < this.cols; c++) {
        if(this.grid[r][c] === 'M') continue;
        let count = 0; 
        for(let i = -1; i <= 1; i++) {
          for(let j = -1; j <= 1; j++) {
            if(i || j) {
              let rr = r + i, cc = c + j;
              if(rr >= 0 && rr < this.rows && cc >= 0 && cc < this.cols && this.grid[rr][cc] === 'M') count++; 
            }
          }
        }
        this.grid[r][c] = count; 
      }
    }
  }
  
  startTimer() { 
    if(this.timer) return; 
    this.timer = setInterval(() => { 
      this.time++; 
      updateTimer(this.time); 
    }, 1000); 
  }
  
  handleClick(r, c, btn) {
    if(btn === 2) return this.toggleFlag(r, c);
    if(this.firstClick) { 
      this.placeMines(r, c); 
      this.startTimer(); 
      this.firstClick = false; 
    }
    if(this.flagged[r][c] || this.visible[r][c]) return;
    if(this.grid[r][c] === 'M') return this.gameOver(false);
    this.reveal(r, c);
    if(this.checkWin()) this.gameOver(true);
  }
  
  reveal(r, c) { 
    if(this.visible[r][c] || this.flagged[r][c]) return; 
    this.visible[r][c] = true; 
    // Update the UI to show the revealed cell
    const cell = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
    if (cell) {
      cell.classList.add('revealed');
      if (this.grid[r][c] > 0) {
        cell.textContent = this.grid[r][c];
        cell.setAttribute('data-value', this.grid[r][c]); // Set data-value for CSS styling
      } else if (this.grid[r][c] === 'M') {
        cell.classList.add('mine');
        cell.textContent = '💣'; // Add bomb emoji
      }
    }
    if(this.grid[r][c] === 0) {
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
  
  toggleFlag(r, c) { 
    if(this.visible[r][c]) return;
    this.flagged[r][c] = !this.flagged[r][c]; 
    // Update the UI to show the flagged cell
    const cell = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
    if (cell) {
      if (this.flagged[r][c]) {
        cell.classList.add('flagged');
        cell.textContent = 'F';
      } else {
        cell.classList.remove('flagged');
        cell.textContent = '';
      }
    }
  }
  
  checkWin() { 
    for(let r = 0; r < this.rows; r++) {
      for(let c = 0; c < this.cols; c++) {
        if(this.grid[r][c] !== 'M' && !this.visible[r][c]) return false; 
      }
    }
    return true; 
  }
  
  gameOver(win) { 
    clearInterval(this.timer); 
    playSound(win ? 'win' : 'lose'); 
    if(win) saveLeaders(this.time); 
    updateLeaderboard(loadLeaders()); 
  }
  
  giveHint() {
    // Only allow hints after the first click
    if (this.firstClick) {
      alert('Make your first move before using a hint!');
      return;
    }
    
    // Find a safe cell to reveal
    let safeUnrevealedCells = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.visible[r][c] && !this.flagged[r][c] && this.grid[r][c] !== 'M') {
          safeUnrevealedCells.push({r, c});
        }
      }
    }
    
    // If no safe cells left, don't use a hint
    if (safeUnrevealedCells.length === 0) {
      alert('No safe cells left to reveal!');
      return;
    }
    
    // Decrement hint count
    this.hintsLeft--;
    updateHints(this.hintsLeft);
    
    // Pick a random safe cell
    const randomIndex = Math.floor(Math.random() * safeUnrevealedCells.length);
    const {r, c} = safeUnrevealedCells[randomIndex];
    
    // Highlight the cell briefly
    const cell = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
    if (cell) {
      cell.style.backgroundColor = 'yellow';
      cell.style.border = '2px solid orange';
      
      // Play hint sound
      playSound('hint');
      
      // After a delay, reveal the cell
      setTimeout(() => {
        cell.style.backgroundColor = '';
        cell.style.border = '';
        this.reveal(r, c);
        
        // Check for win after hint
        if (this.checkWin()) this.gameOver(true);
      }, 1000);
    }
  }
}

// initialize
window.addEventListener('DOMContentLoaded', () => { 
  const settings = loadSettings(); 
  applyTheme(settings.theme || 'light'); 
  let leaderTimes = loadLeaders(); 
  updateLeaderboard(leaderTimes); 
  
  // Set up theme toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    applyTheme();
  }); 
  
  // Set up mute toggle
  document.getElementById('mute-toggle').addEventListener('click', () => {
    playSound('mute');
  }); 
  
  // Set up hint button
  document.getElementById('hint-button').addEventListener('click', () => {
    if (window.game && window.game.hintsLeft > 0) {
      window.game.giveHint();
    }
  }); 
  
  // Set up share button
  document.getElementById('share-button').addEventListener('click', shareResults); 
  
  // Set up difficulty selection and custom settings
  const difficultySelect = document.getElementById('difficulty');
  const customSettings = document.getElementById('custom-settings');
  
  // Show/hide custom settings based on selection
  difficultySelect.addEventListener('change', () => {
    if (difficultySelect.value === 'custom') {
      customSettings.style.display = 'flex';
    } else {
      customSettings.style.display = 'none';
      startNewGame();
    }
  });
  
  // Start a new game when difficulty changes
  function startNewGame() {
    let rows, cols, mines;
    
    if (difficultySelect.value === 'custom') {
      rows = parseInt(document.getElementById('rows').value);
      cols = parseInt(document.getElementById('cols').value);
      mines = parseInt(document.getElementById('mines').value);
      
      // Validate inputs
      if (isNaN(rows) || rows < 5) rows = 5;
      if (isNaN(cols) || cols < 5) cols = 5;
      if (isNaN(mines) || mines < 1) mines = 1;
      
      // Ensure mines don't exceed cells - 1 (need at least one safe cell)
      const maxMines = rows * cols - 1;
      if (mines > maxMines) mines = maxMines;
      
      // Update inputs with validated values
      document.getElementById('rows').value = rows;
      document.getElementById('cols').value = cols;
      document.getElementById('mines').value = mines;
    } else {
      let config = difficultySelect.value.split('x');
      rows = parseInt(config[0]);
      
      if(config.length > 1) {
        let parts = config[1].split('-');
        cols = parseInt(parts[0]);
        mines = parseInt(parts[1]);
      } else {
        cols = rows;
        mines = Math.floor(rows * cols * 0.15); // Default 15% mines
      }
    }
    
    // Create new game
    window.game = new Game(rows, cols, mines);
  }
  
  // Initialize game with default settings
  startNewGame();
  
  // Set up event listeners for custom settings
  document.getElementById('rows').addEventListener('change', startNewGame);
  document.getElementById('cols').addEventListener('change', startNewGame);
  document.getElementById('mines').addEventListener('change', startNewGame);
  
  // Update new game button to start a new game with current settings
  document.getElementById('new-game').addEventListener('click', startNewGame);
});