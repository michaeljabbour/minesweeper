export function saveState(state) {
  localStorage.setItem('minesweeper-state', JSON.stringify(state)); 
}

export function loadState() {
  const s = localStorage.getItem('minesweeper-state'); 
  return s ? JSON.parse(s) : null;
}

export function saveLeaders(time) {
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

export function loadLeaders() {
  const l = localStorage.getItem('minesweeper-leaders'); 
  return l ? JSON.parse(l) : [];
}

export function saveSettings(settings) {
  const currentSettings = loadSettings();
  localStorage.setItem('minesweeper-settings', JSON.stringify({...currentSettings, ...settings})); 
}

export function loadSettings() {
  const s = localStorage.getItem('minesweeper-settings'); 
  return s ? JSON.parse(s) : {}; 
}