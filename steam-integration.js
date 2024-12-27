(async function initializeSteamworks() {
  try {
    // Initialize Steamworks.js
    await Steamworks.init();
    console.log("Steamworks initialized successfully!");

    // Fetch and display the player's Steam persona name
    const userData = await Steamworks.getUserData();
    console.log("Welcome, Steam User:", userData.personaName);

    const playerNameElement = document.getElementById('player-name');
    if (playerNameElement) {
      playerNameElement.innerText = `Welcome, ${userData.personaName}!`;
    }

    // Check if Steam Cloud is enabled
    const isCloudEnabled = await Steamworks.isCloudEnabled();
    if (isCloudEnabled) {
      console.log("Steam Cloud is enabled!");
      syncWithSteamCloud();
    } else {
      console.warn("Steam Cloud is not enabled. Local save only.");
    }

    // Sync localStorage with Steam Cloud
    async function syncWithSteamCloud() {
      try {
        // Load saved data from Steam Cloud
        let steamCloudData = await Steamworks.fileRead("planetIdleGame.json");

        // Parse the data from Steam Cloud
        steamCloudData = JSON.parse(steamCloudData);
        console.log("Loaded data from Steam Cloud:", steamCloudData);

        // Merge localStorage data with Steam Cloud data
        const localData = JSON.parse(localStorage.getItem("planetIdleGame")) || {};
        const mergedData = { ...steamCloudData, ...localData };

        // Save merged data back to localStorage and Steam Cloud
        localStorage.setItem("planetIdleGame", JSON.stringify(mergedData));
        await Steamworks.fileWrite("planetIdleGame.json", JSON.stringify(mergedData));
        console.log("Data synchronized with Steam Cloud!");
      } catch (error) {
        console.warn("No existing Steam Cloud data. Saving local data to Steam Cloud.");
        const localData = localStorage.getItem("planetIdleGame");
        if (localData) {
          await Steamworks.fileWrite("planetIdleGame.json", localData);
          console.log("Local data saved to Steam Cloud.");
        }
      }
    }

    // Automatically sync data every 30 seconds
    setInterval(async () => {
      const localData = localStorage.getItem("planetIdleGame");
      if (localData) {
        await Steamworks.fileWrite("planetIdleGame.json", localData);
        console.log("Data synchronized to Steam Cloud.");
      }
    }, 30000);

  } catch (err) {
    console.error("Failed to initialize Steamworks.js:", err);
  }
})();
