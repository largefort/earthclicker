document.addEventListener('DOMContentLoaded', () => {
  // Request fullscreen automatically
  function requestFullscreen() {
    const element = document.documentElement; // Use the whole document as fullscreen

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  }

  // Check if fullscreen API is available
  if (document.fullscreenEnabled || 
      document.mozFullScreenEnabled || 
      document.webkitFullscreenEnabled || 
      document.msFullscreenEnabled) {
    requestFullscreen();
  } else {
    console.warn('Fullscreen API is not supported on this browser.');
  }

  // Optional: Handle exit from fullscreen mode
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      console.log('Fullscreen mode exited.');
    }
  });
});
