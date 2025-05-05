// Sound effects for the Minesweeper game
let soundEnabled = true;

// Create audio elements with fallback mechanism
const sounds = {
  click: new Audio(),
  flag: new Audio(),
  win: new Audio(),
  lose: new Audio(),
  hint: new Audio()
};

// Set source with error handling
function setAudioSource(audio, url) {
  audio.src = url;
  audio.onerror = function() {
    console.log(`Failed to load audio: ${url}`);
    // Mark as handled to prevent UI errors
    audio.error = null;
  };
}

// Try to load sounds
setAudioSource(sounds.click, 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
setAudioSource(sounds.flag, 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');
setAudioSource(sounds.win, 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
setAudioSource(sounds.lose, 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3');
setAudioSource(sounds.hint, 'https://assets.mixkit.co/active_storage/sfx/2205/2205-preview.mp3');

// Initialize sounds with lower volume
Object.values(sounds).forEach(sound => {
  sound.volume = 0.3;
});

// Play a sound if enabled
export function playSound(type) {
  if (!soundEnabled) return;
  
  // For mute toggle, just toggle the state
  if (type === 'mute') {
    soundEnabled = !soundEnabled;
    document.getElementById('mute-toggle').textContent = soundEnabled ? 'Mute Sound' : 'Unmute Sound';
    return;
  }
  
  // For all other sound types, try to play if the sound exists
  if (sounds[type]) {
    try {
      sounds[type].currentTime = 0;
      sounds[type].play().catch(e => {
        console.log(`Sound play error for ${type}:`, e);
      });
    } catch (e) {
      console.log(`Error with sound ${type}:`, e);
    }
  }
}