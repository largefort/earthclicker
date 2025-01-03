
let totalLifeProduced = 0;
let totalClicks = 0;
let humansCreated = 0;
let animalsCreated = 0;
function isLocalStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
let life = 0;
let humans = 0;
let animals = 0;
let planetsProduced = 0;
let lifePerSecond = 0;
let lifePerClick = 1;
let planetUpgradeCost = 10;
let humanUpgradeCost = 100;
let animalUpgradeCost = 50;
let clickUpgradeCost = 50;
let educationLevel = 0;
let technologyLevel = 0;
let ecosystemLevel = 0;
let biodiversityLevel = 0;
let educationUpgradeCost = 200;
let technologyUpgradeCost = 500;
let ecosystemUpgradeCost = 150;
let biodiversityUpgradeCost = 300;
let agricultureUpgradeCost = 250;
let conservationUpgradeCost = 350;
let isCloseupEnabled = true;
let moon;
let moonOrbit;
const moonRotationSpeed = 0.001;
const moonRevolutionSpeed = 0.001;
const moonDistance = 2.5;
let gameSeconds = 0;
let gameDays = 0;
let gameYears = 0;
let isSoundEnabled = true;
let isMusicEnabled = true;
let isSharpnessEnabled = true;
let rotationSpeed = 0.001;
let lastActiveTime = Date.now();
let offlineProgressNotification = null;
let isFastNotesEnabled = true;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
function formatNumber(num) {
  const shortNotation = document.getElementById('toggle-short-notation').textContent === 'Short Numbers: On';
  if (!shortNotation || num < 1000) return num.toFixed(0);
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg'];
  const order = Math.floor(Math.log10(num) / 3);
  return (num / Math.pow(10, order * 3)).toFixed(1) + suffixes[order];
}
function calculateOfflineProgress(lastActiveTime) {
  const currentTime = Date.now();
  const timeDiff = (currentTime - lastActiveTime) / 1000;
  if (timeDiff > 60) {
    const offlineLife = lifePerSecond * timeDiff;
    life += offlineLife;
    return {
      lifeGained: offlineLife,
      timePassed: timeDiff
    };
  }
  return null;
}
function showOfflineProgressNotification(lifeGained, timePassed) {
  const notification = document.createElement('div');
  notification.id = 'offline-progress-notification';
  notification.innerHTML = `
        <p>Welcome back!</p>
        <p>You were away for ${formatTime(timePassed)}</p>
        <p>You gained ${formatNumber(lifeGained)} life while offline</p>
      `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 1000);
  }, isFastNotesEnabled ? 2000 : 4000);
}
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  if (hours > 0) {
    return `${hours} hours and ${minutes} minutes`;
  } else if (minutes > 0) {
    return `${minutes} minutes`;
  } else {
    return `${Math.floor(seconds)} seconds`;
  }
}
function loadGame() {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available. Unable to load saved game.");
    return;
  }
  try {
    const savedState = localStorage.getItem('planetIdleGame');
    if (savedState) {
      const gameState = JSON.parse(savedState);
      life = gameState.life;
      humans = gameState.humans;
      animals = gameState.animals;
      planetsProduced = gameState.planetsProduced;
      lifePerSecond = gameState.lifePerSecond;
      lifePerClick = gameState.lifePerClick;
      planetUpgradeCost = gameState.planetUpgradeCost;
      humanUpgradeCost = gameState.humanUpgradeCost;
      animalUpgradeCost = gameState.animalUpgradeCost;
      clickUpgradeCost = gameState.clickUpgradeCost || 50;
      educationLevel = gameState.educationLevel || 0;
      technologyLevel = gameState.technologyLevel || 0;
      ecosystemLevel = gameState.ecosystemLevel || 0;
      biodiversityLevel = gameState.biodiversityLevel || 0;
      educationUpgradeCost = gameState.educationUpgradeCost || 200;
      technologyUpgradeCost = gameState.technologyUpgradeCost || 500;
      ecosystemUpgradeCost = gameState.ecosystemUpgradeCost || 150;
      biodiversityUpgradeCost = gameState.biodiversityUpgradeCost || 300;
      agricultureUpgradeCost = gameState.agricultureUpgradeCost || 250;
      conservationUpgradeCost = gameState.conservationUpgradeCost || 350;
      totalLifeProduced = gameState.totalLifeProduced || 0;
      totalClicks = gameState.totalClicks || 0;
      humansCreated = gameState.humansCreated || 0;
      animalsCreated = gameState.animalsCreated || 0;
      gameSeconds = gameState.gameSeconds || 0;
      gameDays = gameState.gameDays || 0;
      gameYears = gameState.gameYears || 0;
      isSoundEnabled = gameState.isSoundEnabled !== undefined ? gameState.isSoundEnabled : true;
      isMusicEnabled = gameState.isMusicEnabled !== undefined ? gameState.isMusicEnabled : true;
      isSharpnessEnabled = gameState.isSharpnessEnabled || true;
      isFastNotesEnabled = gameState.isFastNotesEnabled !== undefined ? gameState.isFastNotesEnabled : true;
      isCloseupEnabled = gameState.isCloseupEnabled || true;
      document.getElementById('toggle-sound').textContent = `Sound Effects: ${isSoundEnabled ? 'On' : 'Off'}`;
      document.getElementById('toggle-music').textContent = `Music: ${isMusicEnabled ? 'On' : 'Off'}`;
      document.getElementById('toggle-short-notation').textContent = `Short Numbers: ${gameState.isShortNotationOn ? 'On' : 'Off'}`;
      document.getElementById('toggle-sharpness').textContent = `Galaxy Sharpness: ${isSharpnessEnabled ? 'On' : 'Off'}`;
      document.getElementById('toggle-closeup').textContent = `Planet Close-up: ${isCloseupEnabled ? 'On' : 'Off'}`;
      document.getElementById('toggle-fast-notes').textContent = `Fast Notes: ${isFastNotesEnabled ? 'On' : 'Off'}`;
      const lastActiveTime = parseInt(localStorage.getItem('lastSaveTime') || Date.now().toString(), 10);
      const currentTime = Date.now();
      const timeDiff = (currentTime - lastActiveTime) / 1000;
      Object.assign(window, gameState);
      if (timeDiff > 60) {
        const offlineLife = lifePerSecond * timeDiff;
        life += offlineLife;
        totalLifeProduced += offlineLife;
        showOfflineProgressNotification(offlineLife, timeDiff);
      }
      updateUISettings();
      updateCounters();
      updateTimeCounter();
      updateStats();
      updateAllUpgradeButtonTexts();
      console.log('Game loaded successfully');
      return true;
    }
  } catch (error) {
    console.error("Failed to load game state:", error);
    return false;
  }
  return false;
}
function saveGame() {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available. Game progress will not be saved.");
    return;
  }
  try {
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
      isFastNotesEnabled
    };
    localStorage.setItem('planetIdleGame', JSON.stringify(gameState));
    localStorage.setItem('lastSaveTime', Date.now().toString());
    return true;
  } catch (error) {
    console.error("Failed to save game state:", error);
    return false;
  }
}
function autosave() {
  if (isLocalStorageAvailable()) {
    saveGame();
  }
}
function autoload() {
  if (isLocalStorageAvailable()) {
    loadGame();
    console.log('Game autoloaded successfully');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  autoload();
  document.getElementById('copy-export').addEventListener('click', () => {
    const exportText = document.getElementById('export-text');
    exportText.select();
    document.execCommand('copy');
    alert('Progress code copied to clipboard!');
  });
  document.getElementById('import-button').addEventListener('click', processImport);
  document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    });
  });
  window.addEventListener('click', event => {
    document.querySelectorAll('.modal').forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
  initMobileTabs();
});
setInterval(autosave, 15000);
window.addEventListener('blur', autosave);
window.addEventListener('beforeunload', autosave);
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    autosave();
  }
});
document.getElementById('toggle-music').addEventListener('click', () => {
  isMusicEnabled = !isMusicEnabled;
  document.getElementById('toggle-music').textContent = `Music: ${isMusicEnabled ? 'On' : 'Off'}`;
  toggleBackgroundMusic();
  saveGame();
});
document.getElementById('toggle-sound').addEventListener('click', () => {
  isSoundEnabled = !isSoundEnabled;
  document.getElementById('toggle-sound').textContent = `Sound Effects: ${isSoundEnabled ? 'On' : 'Off'}`;
  saveGame();
});
document.getElementById('toggle-short-notation').addEventListener('click', () => {
  const button = document.getElementById('toggle-short-notation');
  const isShortNotationOn = button.textContent.includes('On');
  button.textContent = `Short Numbers: ${isShortNotationOn ? 'Off' : 'On'}`;
  updateCounters();
  updateAllUpgradeButtonTexts();
  saveGame();
});
document.getElementById('toggle-sharpness').addEventListener('click', () => {
  isSharpnessEnabled = !isSharpnessEnabled;
  document.getElementById('toggle-sharpness').textContent = `Galaxy Sharpness: ${isSharpnessEnabled ? 'On' : 'Off'}`;
  updateSharpness();
  saveGame();
});
function toggleCloseup() {
  isCloseupEnabled = !isCloseupEnabled;
  document.getElementById('toggle-closeup').textContent = `Planet Close-up: ${isCloseupEnabled ? 'On' : 'Off'}`;
  updateCameraPosition();
  saveGame();
}
document.getElementById('toggle-closeup').addEventListener('click', toggleCloseup);
function toggleFastNotes() {
  isFastNotesEnabled = !isFastNotesEnabled;
  document.getElementById('toggle-fast-notes').textContent = `Fast Notes: ${isFastNotesEnabled ? 'On' : 'Off'}`;
  saveGame();
}
document.getElementById('toggle-fast-notes').addEventListener('click', toggleFastNotes);
function updateCameraPosition() {
  const time = Date.now() * 0.0005;
  if (isCloseupEnabled) {
    camera.position.set(0, 0, 3);
  } else {
    camera.position.x = Math.cos(time) * 8;
    camera.position.z = Math.sin(time) * 8;
    camera.position.y = Math.sin(time * 0.5) * 2;
  }
  camera.lookAt(earth.position);
}
function updateSharpness() {
  const pixelRatio = isSharpnessEnabled ? window.devicePixelRatio : 1;
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function updateAllUpgradeButtonTexts() {
  updateUpgradeButtonText('planet-upgrade', 'Upgrade Planet', planetUpgradeCost);
  updateUpgradeButtonText('human-upgrade', 'Create Humans', humanUpgradeCost);
  updateUpgradeButtonText('animal-upgrade', 'Create Animals', animalUpgradeCost);
  updateUpgradeButtonText('click-upgrade', 'Upgrade Click', clickUpgradeCost);
  updateUpgradeButtonText('education-upgrade', 'Education System', educationUpgradeCost);
  updateUpgradeButtonText('technology-upgrade', 'Technological Advancement', technologyUpgradeCost);
  updateUpgradeButtonText('ecosystem-upgrade', 'Enhance Ecosystem', ecosystemUpgradeCost);
  updateUpgradeButtonText('biodiversity-upgrade', 'Increase Biodiversity', biodiversityUpgradeCost);
  updateUpgradeButtonText('agriculture-upgrade', 'Develop Agriculture', agricultureUpgradeCost);
  updateUpgradeButtonText('conservation-upgrade', 'Wildlife Conservation', conservationUpgradeCost);
}
function updateUpgradeButtonText(id, text, cost) {
  document.getElementById(id).textContent = `${text} (Cost: ${formatNumber(cost)} Life)`;
}
function updateStats() {
  document.getElementById('total-life-stat').textContent = formatNumber(totalLifeProduced);
  document.getElementById('total-clicks-stat').textContent = formatNumber(totalClicks);
  document.getElementById('planets-produced-stat').textContent = formatNumber(planetsProduced);
  document.getElementById('humans-created-stat').textContent = formatNumber(humansCreated);
  document.getElementById('animals-created-stat').textContent = formatNumber(animalsCreated);
  document.getElementById('time-played-stat').textContent = formatTimePlayed();
}
function formatTimePlayed() {
  const totalSeconds = gameYears * 365 * 86400 + gameDays * 86400 + gameSeconds;
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor(totalSeconds % 86400 / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;
  return `${days} days, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('game-container').appendChild(renderer.domElement);
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
  color: 0xFFFFFF,
  size: 0.1
});
const starsVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  starsVertices.push(x, y, z);
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const starField = new THREE.Points(starsGeometry, starsMaterial);
const starFieldGroup = new THREE.Group();
starFieldGroup.add(starField);
scene.add(starFieldGroup);
const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
  bumpMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'),
  bumpScale: 0.05,
  specularMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'),
  specular: new THREE.Color('grey')
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);
const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png'),
  transparent: true,
  opacity: 0.8
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
earth.add(clouds);
function createMoon() {
  const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
  const moonMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/moon_1024.jpg'),
    bumpMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/moon_bump.jpg'),
    bumpScale: 0.002
  });
  moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moonOrbit = new THREE.Object3D();
  moonOrbit.add(moon);
  moon.position.x = moonDistance;
  scene.add(moonOrbit);
}
createMoon();
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);
function updateTimeCounter() {
  gameSeconds++;
  if (gameSeconds >= 86400) {
    gameSeconds = 0;
    gameDays++;
    if (gameDays >= 365) {
      gameDays = 0;
      gameYears++;
    }
  }
  const hours = Math.floor(gameSeconds / 3600);
  const minutes = Math.floor(gameSeconds % 3600 / 60);
  const seconds = gameSeconds % 60;
  const timeString = `Year ${gameYears}, Day ${gameDays}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('time-counter').textContent = timeString;
}
function animate() {
  requestAnimationFrame(animate);
  starFieldGroup.rotation.y += rotationSpeed;
  earth.rotation.y += rotationSpeed;
  clouds.rotation.y += rotationSpeed * 1.1;
  moon.rotation.y += moonRotationSpeed;
  moonOrbit.rotation.y += moonRevolutionSpeed;
  updateCameraPosition();
  updateTimeCounter();
  renderer.render(scene, camera);
}
animate();
function updateCounters() {
  document.getElementById('life-counter').textContent = `Life: ${formatNumber(life)}`;
  document.getElementById('humans-counter').textContent = `Humans: ${formatNumber(humans)}`;
  document.getElementById('animals-counter').textContent = `Animals: ${formatNumber(animals)}`;
  document.getElementById('lps-counter').textContent = `Life per second: ${formatNumber(lifePerSecond)}`;
}
function upgradePlanet() {
  if (life >= planetUpgradeCost) {
    life -= planetUpgradeCost;
    planetsProduced++;
    totalLifeProduced += lifePerClick;
    lifePerSecond += 0.1;
    planetUpgradeCost = Math.floor(planetUpgradeCost * 1.5);
    updateUpgradeButtonText('planet-upgrade', 'Upgrade Planet', planetUpgradeCost);
    updateCounters();
    updateStats();
  }
}
function createHumans() {
  if (life >= humanUpgradeCost) {
    life -= humanUpgradeCost;
    humans += 10;
    humansCreated += 10;
    lifePerSecond += 1;
    humanUpgradeCost = Math.floor(humanUpgradeCost * 1.5);
    updateUpgradeButtonText('human-upgrade', 'Create Humans', humanUpgradeCost);
    updateCounters();
    updateStats();
  }
}
function createAnimals() {
  if (life >= animalUpgradeCost) {
    life -= animalUpgradeCost;
    animals += 5;
    animalsCreated += 5;
    lifePerSecond += 0.5;
    animalUpgradeCost = Math.floor(animalUpgradeCost * 1.3);
    updateUpgradeButtonText('animal-upgrade', 'Create Animals', animalUpgradeCost);
    updateCounters();
    updateStats();
  }
}
function upgradeClick() {
  if (life >= clickUpgradeCost) {
    life -= clickUpgradeCost;
    lifePerClick += 1;
    clickUpgradeCost = Math.floor(clickUpgradeCost * 1.5);
    updateUpgradeButtonText('click-upgrade', 'Upgrade Click', clickUpgradeCost);
    updateCounters();
  }
}
function upgradeEducation() {
  if (life >= educationUpgradeCost) {
    life -= educationUpgradeCost;
    educationLevel++;
    lifePerSecond += 2;
    educationUpgradeCost = Math.floor(educationUpgradeCost * 1.5);
    updateUpgradeButtonText('education-upgrade', 'Education System', educationUpgradeCost);
    updateCounters();
  }
}
function upgradeTechnology() {
  if (life >= technologyUpgradeCost) {
    life -= technologyUpgradeCost;
    technologyLevel++;
    lifePerSecond += 5;
    technologyUpgradeCost = Math.floor(technologyUpgradeCost * 1.6);
    updateUpgradeButtonText('technology-upgrade', 'Technological Advancement', technologyUpgradeCost);
    updateCounters();
  }
}
function upgradeEcosystem() {
  if (life >= ecosystemUpgradeCost) {
    life -= ecosystemUpgradeCost;
    ecosystemLevel++;
    lifePerSecond += 1.5;
    ecosystemUpgradeCost = Math.floor(ecosystemUpgradeCost * 1.4);
    updateUpgradeButtonText('ecosystem-upgrade', 'Enhance Ecosystem', ecosystemUpgradeCost);
    updateCounters();
  }
}
function upgradeBiodiversity() {
  if (life >= biodiversityUpgradeCost) {
    life -= biodiversityUpgradeCost;
    biodiversityLevel++;
    lifePerSecond += 3;
    biodiversityUpgradeCost = Math.floor(biodiversityUpgradeCost * 1.5);
    updateUpgradeButtonText('biodiversity-upgrade', 'Increase Biodiversity', biodiversityUpgradeCost);
    updateCounters();
  }
}
function upgradeAgriculture() {
  if (life >= agricultureUpgradeCost) {
    life -= agricultureUpgradeCost;
    lifePerSecond += 2;
    agricultureUpgradeCost = Math.floor(agricultureUpgradeCost * 1.5);
    updateUpgradeButtonText('agriculture-upgrade', 'Develop Agriculture', agricultureUpgradeCost);
    updateCounters();
  }
}
function upgradeConservation() {
  if (life >= conservationUpgradeCost) {
    life -= conservationUpgradeCost;
    lifePerSecond += 3;
    conservationUpgradeCost = Math.floor(conservationUpgradeCost * 1.5);
    updateUpgradeButtonText('conservation-upgrade', 'Wildlife Conservation', conservationUpgradeCost);
    updateCounters();
  }
}
document.getElementById('planet-upgrade').addEventListener('click', upgradePlanet);
document.getElementById('human-upgrade').addEventListener('click', createHumans);
document.getElementById('animal-upgrade').addEventListener('click', createAnimals);
document.getElementById('click-upgrade').addEventListener('click', upgradeClick);
document.getElementById('education-upgrade').addEventListener('click', upgradeEducation);
document.getElementById('technology-upgrade').addEventListener('click', upgradeTechnology);
document.getElementById('ecosystem-upgrade').addEventListener('click', upgradeEcosystem);
document.getElementById('biodiversity-upgrade').addEventListener('click', upgradeBiodiversity);
document.getElementById('agriculture-upgrade').addEventListener('click', upgradeAgriculture);
document.getElementById('conservation-upgrade').addEventListener('click', upgradeConservation);
document.getElementById('game-container').addEventListener('click', handleClick);
document.getElementById('game-container').addEventListener('touchstart', handleClick);
function handleClick(event) {
  event.preventDefault();
  const x = event.clientX || (event.touches && event.touches[0]?.clientX);
  const y = event.clientY || (event.touches && event.touches[0]?.clientY);
  if (x === undefined || y === undefined) return;

  // Increment life stats
  life += lifePerClick;
  totalClicks++;
  totalLifeProduced += lifePerClick;
  updateCounters();
  updateStats();

  // Play click sound
  if (!audioContext) {
    initializeAudio();
  }
  playClickSound(0.1, 0.1); // Volume: 0.1 (10%), Duration: 0.1 seconds

  // Show floating text effect for clicks
  const clickText = document.createElement('div');
  clickText.textContent = `+${lifePerClick}`;
  clickText.classList.add('click-text');
  clickText.style.left = `${x}px`;
  clickText.style.top = `${y}px`;
  document.body.appendChild(clickText);
  gsap.to(clickText, {
    opacity: 0,
    y: -50,
    duration: 1,
    onComplete: () => clickText.remove()
  });

  // Create particle effect
  const particle = document.createElement('div');
  particle.classList.add('life-particle');
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  document.body.appendChild(particle);

  // Move particle to life counter
  const lifeCounter = document.getElementById('life-counter');
  const lifeCounterRect = lifeCounter.getBoundingClientRect();
  const targetX = lifeCounterRect.left + lifeCounterRect.width / 2;
  const targetY = lifeCounterRect.top + lifeCounterRect.height / 2;

  gsap.to(particle, {
    x: targetX - x,
    y: targetY - y,
    opacity: 0,
    duration: 1.5,
    ease: 'power2.in',
    onComplete: () => particle.remove()
  });

  // Additional particle animations
  gsap.to(particle, {
    scale: 1.5,
    duration: 0.5,
    repeat: 1,
    yoyo: true,
    ease: 'power1.inOut'
  });
  gsap.to(particle, {
    rotation: 360,
    duration: 1.5,
    ease: 'none'
  });
}

// Update life stats periodically
setInterval(() => {
  life += lifePerSecond;
  totalLifeProduced += lifePerSecond;
  updateCounters();
  updateStats();
}, 1000);
document.getElementById('reset-game').addEventListener('click', resetGame);
function resetGame() {
  if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
    localStorage.removeItem('planetIdleGame');
    location.reload();
  }
}
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  updateSharpness();
});
function initMobileTabs() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  function switchTab(tabName) {
    navButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    const selectedBtn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
    const selectedPane = document.getElementById(`${tabName}-tab`);
    if (selectedBtn && selectedPane) {
      selectedBtn.classList.add('active');
      selectedPane.classList.add('active');
    }
  }
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      if (tabName) {
        switchTab(tabName);
      }
    });
  });
  const initialTab = document.querySelector('.nav-btn.active');
  if (initialTab) {
    const tabName = initialTab.getAttribute('data-tab');
    if (tabName) {
      switchTab(tabName);
    }
  }
}
function closeGame() {
  hideModal('exit-modal');
  if (window.electron) {
    window.electron.close();
  } else if (navigator.app && navigator.app.exitApp) {
    navigator.app.exitApp();
  } else if (window.close) {
    window.close();
  } else {
    window.location.href = 'about:blank';
  }
}
document.getElementById('close-game').addEventListener('click', () => {
  showModal('exit-modal');
});
document.getElementById('confirm-exit').addEventListener('click', closeGame);
document.getElementById('cancel-exit').addEventListener('click', () => {
  hideModal('exit-modal');
});
function showModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}
function hideModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}
function exportProgress() {
  showModal('export-modal');
  document.getElementById('export-text').value = '';
  document.getElementById('generate-export').onclick = function () {
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
      isFastNotesEnabled
    };
    const base64Progress = btoa(JSON.stringify(gameState));
    document.getElementById('export-text').value = base64Progress;
  };
}
function importProgress() {
  showModal('import-modal');
}
function processImport() {
  try {
    const importText = document.getElementById('import-text');
    const base64Progress = importText.value.trim();
    const gameState = JSON.parse(atob(base64Progress));
    life = gameState.life;
    humans = gameState.humans;
    animals = gameState.animals;
    planetsProduced = gameState.planetsProduced;
    lifePerSecond = gameState.lifePerSecond;
    lifePerClick = gameState.lifePerClick;
    planetUpgradeCost = gameState.planetUpgradeCost;
    humanUpgradeCost = gameState.humanUpgradeCost;
    animalUpgradeCost = gameState.animalUpgradeCost;
    clickUpgradeCost = gameState.clickUpgradeCost;
    educationLevel = gameState.educationLevel;
    technologyLevel = gameState.technologyLevel;
    ecosystemLevel = gameState.ecosystemLevel;
    biodiversityLevel = gameState.biodiversityLevel;
    educationUpgradeCost = gameState.educationUpgradeCost;
    technologyUpgradeCost = gameState.technologyUpgradeCost;
    ecosystemUpgradeCost = gameState.ecosystemUpgradeCost;
    biodiversityUpgradeCost = gameState.biodiversityUpgradeCost;
    agricultureUpgradeCost = gameState.agricultureUpgradeCost;
    conservationUpgradeCost = gameState.conservationUpgradeCost;
    totalLifeProduced = gameState.totalLifeProduced;
    totalClicks = gameState.totalClicks;
    humansCreated = gameState.humansCreated;
    animalsCreated = gameState.animalsCreated;
    gameSeconds = gameState.gameSeconds;
    gameDays = gameState.gameDays;
    gameYears = gameState.gameYears;
    isSoundEnabled = gameState.isSoundEnabled;
    isMusicEnabled = gameState.isMusicEnabled;
    isSharpnessEnabled = gameState.isSharpnessEnabled;
    isCloseupEnabled = gameState.isCloseupEnabled;
    isFastNotesEnabled = gameState.isFastNotesEnabled;
    document.getElementById('toggle-sound').textContent = `Sound Effects: ${isSoundEnabled ? 'On' : 'Off'}`;
    document.getElementById('toggle-music').textContent = `Music: ${isMusicEnabled ? 'On' : 'Off'}`;
    document.getElementById('toggle-short-notation').textContent = `Short Numbers: ${gameState.isShortNotationOn ? 'On' : 'Off'}`;
    document.getElementById('toggle-sharpness').textContent = `Galaxy Sharpness: ${isSharpnessEnabled ? 'On' : 'Off'}`;
    document.getElementById('toggle-closeup').textContent = `Planet Close-up: ${isCloseupEnabled ? 'On' : 'Off'}`;
    document.getElementById('toggle-fast-notes').textContent = `Fast Notes: ${isFastNotesEnabled ? 'On' : 'Off'}`;
    updateCounters();
    updateTimeCounter();
    updateStats();
    updateAllUpgradeButtonTexts();
    hideModal('import-modal');
    alert('Progress imported successfully!');
  } catch (error) {
    alert('Invalid progress code. Please check and try again.');
  }
}
document.getElementById('export-progress').addEventListener('click', exportProgress);
document.getElementById('import-progress').addEventListener('click', importProgress);
document.getElementById('import-button').addEventListener('click', processImport);
