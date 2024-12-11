let isInitialized = false;
let originalLPS = 0;
let asteroids = [];
let lifePerSecond = 0;
let life = 0;
let isApocalypseActive = false;

function toggleApocalypse() {
  const apocalypseCost = 1000000;

  if (!isApocalypseActive && life >= apocalypseCost) {
    life -= apocalypseCost;
    isApocalypseActive = true;
    originalLPS = lifePerSecond;
    earth.classList.add('apocalypse-active');
    document.getElementById('apocalypse-trigger').textContent = 'Stop Apocalypse';
  } else if (isApocalypseActive) {
    isApocalypseActive = false;
    lifePerSecond = originalLPS;
    earth.classList.remove('apocalypse-active');
    document.getElementById('apocalypse-trigger').textContent = 'Trigger Apocalypse (Cost: 1M Life)';

    asteroids.forEach(asteroid => scene.remove(asteroid));
    asteroids = [];
  }

  updateCounters();
}

document.getElementById('apocalypse-trigger').addEventListener('click', toggleApocalypse);

function updateAsteroids() {
  if (!isApocalypseActive) return;

  if (Math.random() < 0.05 * (lifePerSecond / 100)) {
    createAsteroid();
  }

  asteroids.forEach((asteroid, index) => {
    if (!asteroid.userData.impacted) {
      asteroid.position.add(asteroid.userData.velocity);

      if (asteroid.position.length() < 1.2) {
        createExplosion(asteroid.position);
        asteroid.userData.impacted = true;
        lifePerSecond = Math.max(0, lifePerSecond * 0.95);
        updateCounters();

        setTimeout(() => {
          scene.remove(asteroid);
          asteroids.splice(index, 1);
        }, 100);
      }
    }
  });
}

function createAsteroid() {
  const asteroidGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const asteroidMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
  const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI;
  asteroid.position.setFromSpherical(new THREE.Spherical(20, phi, theta));

  const direction = new THREE.Vector3();
  direction.subVectors(new THREE.Vector3(0, 0, 0), asteroid.position).normalize();

  asteroid.userData.velocity = direction.multiplyScalar(0.1);
  asteroid.userData.impacted = false;

  scene.add(asteroid);
  asteroids.push(asteroid);
}

function createExplosion(position) {
  const particles = [];
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'explosion';
    particle.style.left = '50%';
    particle.style.top = '50%';
    document.getElementById('game-container').appendChild(particle);

    particles.push(particle);

    setTimeout(() => particle.remove(), 1000);
  }
}
