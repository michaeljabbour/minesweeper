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
        handler(r, c, e.button); 
      }; 
      container.append(cell);
    }
  }
}

export function updateTimer(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0'); 
  const s = (sec % 60).toString().padStart(2, '0'); 
  document.getElementById('timer').textContent = `${m}:${s}`; 
}

export function updateHints(n) {
  document.getElementById('hints').textContent = n; 
}

export function updateLeaderboard(list) {
  const ul = document.getElementById('leaderboard-list'); 
  ul.innerHTML = list.map(l => `<li>${l.name}: ${l.time}s [${l.date}]</li>`).join(''); 
}

export function applyTheme(theme) {
  const body = document.body;
  const t = theme || (body.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  body.setAttribute('data-theme', t);
  saveSettings({theme: t});
}

export function playSound(type) {
  // Implementation of sound effects would go here
  console.log(`Playing sound: ${type}`);
}

export function shareResults() {
  const time = document.getElementById('timer').textContent;
  prompt('Share this result:', `I completed Minesweeper in ${time}!`); 
}

// Save settings to storage
function saveSettings(settings) {
  localStorage.setItem('minesweeper-settings', JSON.stringify(settings));
}