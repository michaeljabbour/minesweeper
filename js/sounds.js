// Sound effects for the Minesweeper game
let soundEnabled = true;

// Create audio elements
const sounds = {
  click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
  flag: new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3'),
  win: new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'),
  lose: new Audio('https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3'),
  hint: new Audio('https://assets.mixkit.co/active_storage/sfx/2205/2205-preview.mp3')
};

// Initialize sounds with lower volume
Object.values(sounds).forEach(sound => {
  sound.volume = 0.3;
});

// Play a sound if enabled
export function playSound(type) {
  if (!soundEnabled) return;
  
  switch(type) {
    case 'click':
      sounds.click.currentTime = 0;
      sounds.click.play().catch(e => console.log('Sound play error:', e));
      break;
    case 'flag':
      sounds.flag.currentTime = 0;
      sounds.flag.play().catch(e => console.log('Sound play error:', e));
      break;
    case 'win':
      sounds.win.currentTime = 0;
      sounds.win.play().catch(e => console.log('Sound play error:', e));
      break;
    case 'lose':
      sounds.lose.currentTime = 0;
      sounds.lose.play().catch(e => console.log('Sound play error:', e));
      break;
    case 'hint':
      sounds.hint.currentTime = 0;
      sounds.hint.play().catch(e => console.log('Sound play error:', e));
      break;
    case 'mute':
      soundEnabled = !soundEnabled;
      document.getElementById('mute-toggle').textContent = soundEnabled ? 'Mute Sound' : 'Unmute Sound';
      break;
  }
}