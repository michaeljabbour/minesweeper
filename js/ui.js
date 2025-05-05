import { saveSettings } from './storage.js';
import { playSound } from './sounds.js';

export function renderBoard(rows, cols, handler) { 
  const container = document.getElementById('game'); 
  container.style.gridTemplate = `repeat(${rows}, 30px) / repeat(${cols}, 30px)`; 
  container.innerHTML = ''; 
  for(let r = 0; r < rows; r++) {
    for(let c = 0; c < cols; c++) {
      const cell = document.createElement('div'); 
      cell.classList.add('cell'); 
      cell.dataset.r = r; 
      cell.dataset.c = c; 
      cell.onmousedown = e => { 
        e.preventDefault(); 
        if (e.button === 0) {
          playSound('click');
        } else if (e.button === 2) {
          playSound('flag');
        }
        handler(r, c, e.button); 
      }; 
      container.append(cell);
    }
  }
  
  // Prevent context menu on right-click
  container.addEventListener('contextmenu', e => {
    e.preventDefault();
    return false;
  });
}

export function updateTimer(sec) {
  // Max time display is 999 seconds
  const displayTime = Math.min(sec, 999).toString().padStart(3, '0');
  document.getElementById('timer').textContent = displayTime; 
}

// Update the mines counter
export function updateMinesCounter(count) {
  // Ensure the counter doesn't go negative and max is 999
  const displayCount = Math.max(0, Math.min(count, 999)).toString().padStart(3, '0');
  document.getElementById('mines-counter').textContent = displayCount;
}

// Update face based on game state
export function updateFace(state) {
  const faceButton = document.getElementById('face-button');
  switch(state) {
    case 'default':
      faceButton.textContent = '🙂';
      break;
    case 'wow':
      faceButton.textContent = '😮';
      break;
    case 'win':
      faceButton.textContent = '😎';
      break;
    case 'lose':
      faceButton.textContent = '😵';
      break;
  }
}

export function updateHints(n) {
  document.getElementById('hints').textContent = n; 
}

export function updateLeaderboard(list) {
  const ul = document.getElementById('leaderboard-list'); 
  if (!list || list.length === 0) {
    ul.innerHTML = '<li>No records yet</li>';
    return;
  }
  ul.innerHTML = list
    .sort((a, b) => a.time - b.time)
    .slice(0, 10)
    .map((l, i) => `<li>${i+1}. ${l.name}: ${l.time}s [${l.date}]</li>`)
    .join(''); 
}

export function applyTheme(theme) {
  const body = document.body;
  const t = theme || (body.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  body.setAttribute('data-theme', t);
  document.getElementById('theme-toggle').textContent = t === 'dark' ? 'Light Theme' : 'Dark Theme';
  saveSettings({theme: t});
}

export { playSound };  // Re-export playSound

export function shareResults() {
  const time = document.getElementById('timer').textContent;
  prompt('Share this result:', `I completed Minesweeper in ${time}!`); 
}