 function isLocalStorageAvailable() {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
  }
  let audioContext;
  let clickBuffer;
  let bgmAudioElement = null;
  let isShortNotationEnabled = true; // Default value

  function updateUISettings() {
  // Update toggle button states based on current settings
  document.getElementById('toggle-sound').textContent = `Sound Effects: ${isSoundEnabled ? 'On' : 'Off'}`;
  document.getElementById('toggle-music').textContent = `Music: ${isMusicEnabled ? 'On' : 'Off'}`;
  document.getElementById('toggle-short-notation').textContent = `Short Numbers: ${isShortNotationEnabled ? 'On' : 'Off'}`;
  document.getElementById('toggle-sharpness').textContent = `Galaxy Sharpness: ${isSharpnessEnabled ? 'On' : 'Off'}`;
  document.getElementById('toggle-closeup').textContent = `Planet Close-up: ${isCloseupEnabled ? 'On' : 'Off'}`;
  document.getElementById('toggle-fast-notes').textContent = `Fast Notes: ${isFastNotesEnabled ? 'On' : 'Off'}`;
  }

  function onDeviceReady() {
  console.log('Device is ready');

  // Initialize background music 
  bgmAudioElement = new Audio('/space-ambience-56265.mp3');
  bgmAudioElement.loop = true;
  bgmAudioElement.volume = 0.3;

  // Start playing if music is enabled
  if (isMusicEnabled) {
    bgmAudioElement.play().catch(error => {
      console.log("Audio autoplay failed:", error);
    });
  }
  }

  if (window.cordova) {
  document.addEventListener('deviceready', onDeviceReady, false);
  }

  function initializeAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  fetch('/clicking_sound,_magi.mp3')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      clickBuffer = audioBuffer;
    })
    .catch(error => console.error('Error loading audio:', error));
  }

  function formatNumber(num) {
  if (!isShortNotationEnabled || num < 1000) {
    return num.toFixed(0);
  }

  const suffixes = ['', 'K', 'M', 'B', 'T', 'Q'];
  const magnitude = Math.floor(Math.log10(num) / 3);
  const scaledNum = num / Math.pow(1000, magnitude);

  return scaledNum.toFixed(1) + suffixes[magnitude];
  }

  function playClickSound() {
  if (audioContext && clickBuffer && isSoundEnabled) {
    const source = audioContext.createBufferSource();
    source.buffer = clickBuffer;
    source.connect(audioContext.destination);
    source.start();
  }
  }

  function toggleBackgroundMusic() {
  if (isMusicEnabled) {
    // Start or resume background music if enabled
    if (bgmAudioElement && bgmAudioElement.paused) {
      bgmAudioElement.play();
    }
  } else {
    // Pause background music if disabled  
    if (bgmAudioElement && !bgmAudioElement.paused) {
      bgmAudioElement.pause();
    }
  }
  saveGame(); // Save music preference
  }

  let totalLifeProduced = 0;
  let totalClicks = 0;
  let humansCreated = 0;
  let animalsCreated = 0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 8;

  let rotationSpeed = 0.002;
  let moonRotationSpeed = 0.002;
  let moonRevolutionSpeed = 0.001;
  let moonDistance = 2;
  let moon, moonOrbit;

  let life = 0;
  let lifePerClick = 1;
  let lifePerSecond = 0;
  let humans = 0;
  let animals = 0;
  let planetsProduced = 0;
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
  let gameSeconds = 0;
  let gameDays = 0;
  let gameYears = 0;
  let isSoundEnabled = true;
  let isMusicEnabled = true;
  let isSharpnessEnabled = true;
  let isCloseupEnabled = true;
  let isFastNotesEnabled = true;

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
      isSharpnessEnabled = gameState.isSharpnessEnabled || false;
      isCloseupEnabled = gameState.isCloseupEnabled || false;
      isFastNotesEnabled = gameState.isFastNotesEnabled !== undefined ? gameState.isFastNotesEnabled : true;
      isShortNotationEnabled = gameState.isShortNotationEnabled !== undefined ? gameState.isShortNotationEnabled : true;

      const lastActiveTime = parseInt(localStorage.getItem('lastActiveTime') || Date.now().toString(), 10);
      const offlineProgress = calculateOfflineProgress(lastActiveTime);
      if (offlineProgress) {
        showOfflineProgressNotification(offlineProgress.lifeGained, offlineProgress.timePassed);
      }

      updateUISettings();
      updateCounters();
      updateTimeCounter();
      updateStats();
      updateAllUpgradeButtonTexts();
    } else {
      console.log("No saved game found. Starting a new game.");
    }
  } catch (error) {
    console.error("Failed to load game state:", error);
  }
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
      isShortNotationEnabled,
      isSharpnessEnabled,
      isCloseupEnabled,
      isFastNotesEnabled,
    };
    localStorage.setItem('planetIdleGame', JSON.stringify(gameState));
    localStorage.setItem('lastActiveTime', Date.now().toString());
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
  }

  function autosave() {
  saveGame();
  console.log('Game autosaved');
  }

  function autoload() {
  loadGame();
  console.log('Game autoloaded');
  }

  document.addEventListener('DOMContentLoaded', () => {
  loadGame();
  initMobileTabs();
  initializeAudio();
  updateStats();
  autosave();
  autoload();
  });

  setInterval(() => {
  autosave();
  autoload();
  }, 30000);

  document.getElementById('toggle-music').addEventListener('click', () => {
  isMusicEnabled = !isMusicEnabled;
  document.getElementById('toggle-music').textContent = `Music: ${isMusicEnabled ? 'On' : 'Off'}`;
  toggleBackgroundMusic();
  });

  document.getElementById('toggle-sound').addEventListener('click', () => {
  isSoundEnabled = !isSoundEnabled;
  document.getElementById('toggle-sound').textContent = `Sound Effects: ${isSoundEnabled ? 'On' : 'Off'}`;
  });

  document.getElementById('toggle-short-notation').addEventListener('click', () => {
  isShortNotationEnabled = !isShortNotationEnabled;
  document.getElementById('toggle-short-notation').textContent = `Short Numbers: ${isShortNotationEnabled ? 'On' : 'Off'}`;
  updateCounters();
  updateAllUpgradeButtonTexts();
  saveGame(); // Save the preference
  });

  document.getElementById('toggle-closeup').addEventListener('click', toggleCloseup);

  function toggleCloseup() {
  isCloseupEnabled = !isCloseupEnabled;
  document.getElementById('toggle-closeup').textContent = `Planet Close-up: ${isCloseupEnabled ? 'On' : 'Off'}`;
  updateCameraPosition();
  }

  document.getElementById('toggle-sharpness').addEventListener('click', () => {
  isSharpnessEnabled = !isSharpnessEnabled;
  document.getElementById('toggle-sharpness').textContent = `Galaxy Sharpness: ${isSharpnessEnabled ? 'On' : 'Off'}`;
  updateSharpness();
  });

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
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days} days, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('game-container').appendChild(renderer.domElement);

  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({color: 0xFFFFFF, size: 0.1});

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
    bumpScale: 0.002,
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
  const minutes = Math.floor((gameSeconds % 86400) / 60);
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
  const x = event.clientX || (event.touches && event.touches[0].clientX);
  const y = event.clientY || (event.touches && event.touches[0].clientY);

  if (x === undefined || y === undefined) return;

  life += lifePerClick;
  totalClicks++;
  totalLifeProduced += lifePerClick;
  updateCounters();
  updateStats();

  if (!audioContext) {
    initializeAudio();
  }

  playClickSound();

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

  const particle = document.createElement('div');
  particle.classList.add('life-particle');
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  document.body.appendChild(particle);

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

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');

      navButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });
  }

  document.getElementById('exit-game').addEventListener('click', function() {
    if (confirm('Are you sure you want to exit the game?')) {
        if (window.cordova) {
            saveGame(); // Save before exit
            navigator.app.exitApp(); // Exit the app
        }
    }
  });