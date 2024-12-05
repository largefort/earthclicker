function initializeAudio() {
  clickSound = new Audio('audio/beep-space-button_G#_major.wav');
  backgroundMusic = new Audio('audio/ShadowsAndDust-chosic.com_.mp3');
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
