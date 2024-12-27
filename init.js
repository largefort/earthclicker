// Greenworks-based Steam integration
const greenworks = require('greenworks');

// Steam App ID (replace with your actual Steam App ID)
const steamAppId = "480"; // Replace with your app's actual Steam App ID

function initializeGreenworks() {
  if (!greenworks) {
    console.error("Greenworks is not available. Steam features will not work.");
    return;
  }

  // Initialize Greenworks
  if (greenworks.init()) {
    console.log("Greenworks initialized successfully!");
    fetchSteamUserInfo();
    synchronizeWithSteamCloud();
  } else {
    console.error("Failed to initialize Greenworks.");
  }
}

function fetchSteamUserInfo() {
  try {
    const steamId = greenworks.getSteamId();
    console.log("Steam User Info:", steamId);

    // Display the player's Steam username in the UI
    const playerNameElement = document.getElementById("player-name");
    if (playerNameElement) {
      playerNameElement.textContent = `Welcome, ${steamId.screen_name}!`;
    }
  } catch (error) {
    console.error("Failed to fetch Steam user info:", error);
  }
}

function synchronizeWithSteamCloud() {
  const localSaveKey = "planetIdleGame"; // LocalStorage key
  const steamCloudFileName = "savefile.json"; // Steam Cloud filename

  try {
    // Read data from Steam Cloud
    if (greenworks.getCloudEnabled()) {
      let cloudData = null;
      if (greenworks.fileExists(steamCloudFileName)) {
        const cloudSaveString = greenworks.readTextFromFile(steamCloudFileName);
        cloudData = JSON.parse(cloudSaveString);
        console.log("Steam Cloud data loaded:", cloudData);
      } else {
        console.warn("No Steam Cloud save found.");
      }

      // Load data from localStorage
      const localSaveString = localStorage.getItem(localSaveKey);
      let localData = null;
      if (localSaveString) {
        localData = JSON.parse(localSaveString);
        console.log("LocalStorage data loaded:", localData);
      }

      // Determine which data to use
      if (cloudData && (!localData || cloudData.lastSavedTime > localData.lastSavedTime)) {
        console.log("Using Steam Cloud data (more recent).");
        localStorage.setItem(localSaveKey, JSON.stringify(cloudData));
      } else if (localData) {
        console.log("Using LocalStorage data (more recent).");
        greenworks.saveTextToFile(steamCloudFileName, JSON.stringify(localData));
      }

      console.log("Synchronization between LocalStorage and Steam Cloud completed!");
    } else {
      console.warn("Steam Cloud is not enabled. Local saves only.");
    }
  } catch (error) {
    console.error("Failed to synchronize with Steam Cloud:", error);
  }
}

function saveGameToSteamCloud() {
  const localSaveKey = "planetIdleGame";
  const steamCloudFileName = "savefile.json";

  try {
    const localSaveString = localStorage.getItem(localSaveKey);
    if (!localSaveString) {
      console.warn("No local save data to sync to Steam Cloud.");
      return;
    }

    // Save to Steam Cloud
    greenworks.saveTextToFile(steamCloudFileName, localSaveString);
    console.log("Game progress saved to Steam Cloud!");
  } catch (error) {
    console.error("Failed to save game to Steam Cloud:", error);
  }
}

// Override saveGame in your game's existing logic to include Steam Cloud saving
document.addEventListener("DOMContentLoaded", () => {
  const originalSaveGame = window.saveGame;

  window.saveGame = function () {
    if (originalSaveGame) originalSaveGame(); // Call the original saveGame
    saveGameToSteamCloud(); // Save to Steam Cloud
  };

  console.log("Greenworks save logic integrated.");
});

// Initialize Greenworks on app launch
document.addEventListener("DOMContentLoaded", initializeGreenworks);
