function initializeAudio() {
  clickSound = new Audio('https://example.com/click.mp3');
  backgroundMusic = new Audio('https://example.com/ambient_space.mp3');
  backgroundMusic.loop = true;
}

function playClickSound() {
  if (isSoundEnabled && clickSound) {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Audio play failed:", e));
  }
}

function toggleBackgroundMusic() {
  if (isMusicEnabled && backgroundMusic) {
    backgroundMusic.play().catch(e => console.log("Music play failed:", e));
  } else if (backgroundMusic) {
    backgroundMusic.pause();
  }
}
