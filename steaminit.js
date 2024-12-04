// steaminit.js
const SteamAppId = 'your_steam_app_id'; // Replace with your Steam App ID

// Ensure Steamworks.js is loaded
if (typeof Steamworks === 'undefined') {
    console.error("Steamworks.js is not loaded. Ensure the library is included correctly.");
    throw new Error("Steamworks.js not found.");
}

// Initialize Steamworks.js
Steamworks.initialize({ appId: SteamAppId })
    .then(() => {
        console.log("Steamworks initialized successfully!");

        // Display Steam player name in the HUD
        const playerName = Steamworks.getPlayerName();
        const lifeCounter = document.getElementById('life-counter');
        if (lifeCounter) {
            lifeCounter.textContent += ` - Welcome, ${playerName}!`;
        }

        // Check Steam overlay status
        if (Steamworks.isOverlayEnabled()) {
            console.log("Steam Overlay is enabled.");
        } else {
            console.warn("Steam Overlay is not enabled.");
        }

        // Stats to track in Steamworks
        const steamStats = {
            totalLifeProduced: 0,
            totalClicks: 0,
            humansCreated: 0,
            animalsCreated: 0,
            planetsProduced: 0,
            criticalHits: 0,
            criticalChance: 0,
            criticalDamage: 0,
            timePlayed: 0, // In seconds
        };

        // Load stats from Steamworks or Cloud
        function loadStats() {
            const promises = [];
            for (const statName in steamStats) {
                promises.push(
                    Steamworks.getStat(statName)
                        .then(value => {
                            steamStats[statName] = value || 0;
                            console.log(`Loaded stat ${statName}: ${value}`);
                        })
                        .catch(err => console.warn(`Failed to load stat ${statName}:`, err))
                );
            }

            // Synchronize with Steam Cloud
            return Promise.all(promises)
                .then(() => Steamworks.readFile('savegame.json'))
                .then(data => {
                    const cloudData = JSON.parse(data);
                    Object.assign(steamStats, cloudData);
                    console.log("Stats synchronized with Steam Cloud.");
                    updateStatsDisplay();
                })
                .catch(err => console.warn("Failed to synchronize stats with Steam Cloud:", err));
        }

        // Save stats to Steamworks and Cloud
        function saveStats() {
            const promises = [];
            for (const statName in steamStats) {
                promises.push(
                    Steamworks.setStat(statName, steamStats[statName])
                        .then(() => console.log(`Saved stat ${statName}: ${steamStats[statName]}`))
                        .catch(err => console.error(`Failed to save stat ${statName}:`, err))
                );
            }

            // Save to Steam Cloud
            return Promise.all(promises)
                .then(() => Steamworks.writeFile('savegame.json', JSON.stringify(steamStats)))
                .then(() => console.log("Stats saved to Steam Cloud."))
                .catch(err => console.error("Failed to save stats to Steam Cloud:", err));
        }

        // Update stats display in the game UI
        function updateStatsDisplay() {
            document.getElementById('total-life-stat').textContent = steamStats.totalLifeProduced;
            document.getElementById('total-clicks-stat').textContent = steamStats.totalClicks;
            document.getElementById('humans-created-stat').textContent = steamStats.humansCreated;
            document.getElementById('animals-created-stat').textContent = steamStats.animalsCreated;
            document.getElementById('planets-produced-stat').textContent = steamStats.planetsProduced;
            document.getElementById('crit-hits-stat').textContent = steamStats.criticalHits;
            document.getElementById('crit-chance-stat').textContent = `${(steamStats.criticalChance * 100).toFixed(1)}%`;
            document.getElementById('crit-damage-stat').textContent = `${steamStats.criticalDamage.toFixed(1)}x`;
            document.getElementById('time-played-stat').textContent = formatTime(steamStats.timePlayed);
        }

        // Format time played as days, hours, minutes, and seconds
        function formatTime(seconds) {
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${days} days, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // Increment stats on game events
        document.getElementById('planet-upgrade').addEventListener('click', () => {
            steamStats.planetsProduced += 1;
            saveStats();
        });

        document.getElementById('human-upgrade').addEventListener('click', () => {
            steamStats.humansCreated += 10; // Example: Add 10 humans
            saveStats();
        });

        document.getElementById('animal-upgrade').addEventListener('click', () => {
            steamStats.animalsCreated += 5; // Example: Add 5 animals
            saveStats();
        });

        document.getElementById('game-container').addEventListener('click', () => {
            steamStats.totalClicks += 1;
            saveStats();
        });

        // Submit high scores to a Steam leaderboard
        function submitHighScore(score) {
            Steamworks.findOrCreateLeaderboard('HighScores', 'Descending', 'Numeric')
                .then(leaderboard => Steamworks.submitLeaderboardScore(leaderboard, score))
                .then(() => console.log(`High score ${score} submitted to Steam leaderboard.`))
                .catch(err => console.error("Failed to submit high score:", err));
        }

        // Save stats and submit scores on game reset
        document.getElementById('reset-game').addEventListener('click', () => {
            saveStats();
            submitHighScore(steamStats.totalLifeProduced);
        });

        // Track time played
        setInterval(() => {
            steamStats.timePlayed += 1;
            saveStats();
        }, 1000);

        // Load stats on game initialization
        loadStats();

    })
    .catch(err => {
        console.error("Failed to initialize Steamworks:", err);
    });
