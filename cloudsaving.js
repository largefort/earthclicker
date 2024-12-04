// Initialize Greenworks (Steam API) 
if (typeof greenworks === 'undefined') {
  console.error('Greenworks not found! Make sure greenworks.js is properly included.');
} else {
  // Check if Steam is running and initialized
  if (greenworks.init()) {
    console.log('Steam API initialized successfully!');
    
    // Cloud save functions  
    const cloudSave = {
      // Save game data to Steam Cloud
      saveToCloud: function(gameData) {
        try {
          const saveData = JSON.stringify(gameData);
          const fileName = 'earthclicker_save.json';
          
          greenworks.saveTextToFile(fileName, saveData, (success) => {
            if (success) {
              console.log('Game saved to Steam Cloud successfully!');
            } else {
              console.error('Failed to save game to Steam Cloud');
            }
          }, (error) => {
            console.error('Error saving to Steam Cloud:', error); 
          });
        } catch (error) {
          console.error('Error preparing save data:', error);
        }
      },

      // Load game data from Steam Cloud
      loadFromCloud: function(callback) {
        try {
          const fileName = 'earthclicker_save.json';
          
          greenworks.readTextFromFile(fileName, (saveData) => {
            try {
              const gameData = JSON.parse(saveData);
              console.log('Game loaded from Steam Cloud successfully!');
              callback(gameData);
            } catch (error) {
              console.error('Error parsing save data:', error);
              callback(null);
            }
          }, (error) => {
            console.error('Error loading from Steam Cloud:', error);
            callback(null);
          });
        } catch (error) {
          console.error('Error reading save file:', error);
          callback(null); 
        }
      },

      // Delete cloud save
      deleteCloudSave: function(callback) {
        try {
          const fileName = 'earthclicker_save.json';
          
          greenworks.deleteFile(fileName, (success) => {
            if (success) {
              console.log('Cloud save deleted successfully!');
              callback(true);
            } else {
              console.error('Failed to delete cloud save');
              callback(false);
            }
          });
        } catch (error) {
          console.error('Error deleting cloud save:', error);
          callback(false);
        }
      }
    };

    // Modify existing save/load functions to use Steam Cloud
    const originalSaveGame = saveGame;
    saveGame = function() {
      // First save locally
      originalSaveGame();
      
      // Then save to Steam Cloud
      const gameState = {
        life,
        humans,
        animals, 
        planetsProduced,
        lifePerSecond,
        lifePerClick,
        planetUpgradeCost,
        humanUpgradeCost,
        animalUpgradeCost,
        clickUpgradeCost,
        educationLevel,
        technologyLevel,
        ecosystemLevel,
        biodiversityLevel,
        educationUpgradeCost,
        technologyUpgradeCost,
        ecosystemUpgradeCost, 
        biodiversityUpgradeCost,
        agricultureUpgradeCost,
        conservationUpgradeCost,
        totalLifeProduced,
        totalClicks,
        humansCreated,
        animalsCreated,
        gameSeconds,
        gameDays,
        gameYears,
        isSoundEnabled,
        isMusicEnabled,
        isShortNotationOn: document.getElementById('toggle-short-notation').textContent === 'Short Numbers: On',
        isSharpnessEnabled,
        isCloseupEnabled,
        isFastNotesEnabled,
        isVignetteEnabled,
        criticalChance,
        criticalDamage,
        criticalHits,
        criticalUpgradeCost,
      };
      
      cloudSave.saveToCloud(gameState);
    };

    const originalLoadGame = loadGame;
    loadGame = function() {
      // First try to load from Steam Cloud
      cloudSave.loadFromCloud((cloudData) => {
        if (cloudData) {
          // Use cloud data
          Object.assign(window, cloudData);
          updateCounters();
          updateStats();
          updateAllUpgradeButtonTexts();
          
          // Update UI elements
          document.getElementById('toggle-vignette').textContent = `Vignette Effect: ${isVignetteEnabled ? 'On' : 'Off'}`;
          document.getElementById('vignette-overlay').classList.toggle('active', isVignetteEnabled);
          document.getElementById('toggle-closeup').textContent = `Planet Close-up: ${isCloseupEnabled ? 'On' : 'Off'}`;
          document.getElementById('toggle-sound').textContent = `Sound Effects: ${isSoundEnabled ? 'On' : 'Off'}`;
          document.getElementById('toggle-music').textContent = `Music: ${isMusicEnabled ? 'On' : 'Off'}`;
          document.getElementById('toggle-sharpness').textContent = `Galaxy Sharpness: ${isSharpnessEnabled ? 'On' : 'Off'}`;
          document.getElementById('toggle-fast-notes').textContent = `Fast Notes: ${isFastNotesEnabled ? 'On' : 'Off'}`;
          
          updateCameraPosition();
          updateSharpness();
        } else {
          // Fall back to local storage
          originalLoadGame();
        }
      });
    };

    // Handle cloud sync button display
    document.getElementById('save-game').style.display = 'block';
    document.getElementById('save-game').textContent = 'Sync with Steam Cloud';
    document.getElementById('save-game').onclick = saveGame;

    // Handle game reset
    const originalResetGame = resetGame;
    resetGame = function() {
      if (confirm('Are you sure you want to reset the game? All progress will be lost from both local storage and Steam Cloud.')) {
        cloudSave.deleteCloudSave(() => {
          localStorage.removeItem('planetIdleGame');
          location.reload();
        });
      }
    };

  } else {
    console.error('Failed to initialize Steam API');
  }
}
