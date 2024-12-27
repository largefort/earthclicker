function calculateOfflineProgress(lastActiveTime) {
  const now = Date.now();
  const timePassed = (now - lastActiveTime) / 1000; // Time passed in seconds

  const lifeGained = lifePerSecond * timePassed; // Calculate life gained during offline time
  life += lifeGained; // Add life gained to current life

  // Update statistics if needed
  totalLifeProduced += lifeGained;

  // Return the progress details for displaying offline progress notification
  return {
    lifeGained: Math.floor(lifeGained),
    timePassed: formatTimeDuration(timePassed),
  };
}

function formatTimeDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
}
