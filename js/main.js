const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0x87ceeb, 1);

const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

let start_position = 9;
let endposition = -9;
const text = document.querySelector(".text");
let gamestart = "Loading";
let isLookingback = true;
let ans = false;
let colors;
function createCubeF(size, positionX, positionY) {
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = positionX;
  cube.position.y = positionY;
  scene.add(cube);
}
function createCubel(size, positionX, positionY) {
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = positionX;
  cube.position.y = positionY;
  scene.add(cube);
}
function createCubePath(size, positionX, positionY) {
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  const material = new THREE.MeshBasicMaterial({ color: 0xc4d300 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = positionX;
  cube.position.y = positionY;
  scene.add(cube);
  return cube;
}
function createCubegreen(size, positionX) {
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = positionX;
  scene.add(cube);
  return cube;
}
function createCubered(size, positionX) {
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = positionX;
  scene.add(cube);
  return cube;
}

camera.position.z = 10;
const loader = new THREE.GLTFLoader();

// class Doll {
//   constructor() {
//     loader.load("../models/scene.gltf", (gltf) => {
//       scene.add(gltf.scene);
//       gltf.scene.scale.set(0.3, 0.3, 0.3);
//       gltf.scale.position.set(0,0.8, 0);
//       this.doll = gltf.scene;
//     });
//   }
//   lookBackward() {
//     gsap.to(doll.rotation, { duration: 0.45, y: -3.15 });
//   }
//   lookForward() {
//     gsap.to(doll.rotation, { duration: 0.45, y: -0 });
//   }
// }

// let doll = new Doll();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let doll;
loader.load("../models/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  doll = gltf.scene;
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.position.set(0, 0.8, 0);
});
function lookBackward() {
  text.innerText = "Green Light";
  if (gamestart == "Over") {
    text.innerText = "End";
  }
  let progressbar = createCubegreen({ w: 9, h: 1, d: 1 }, 0);
  progressbar.position.y = 7.0;
  gsap.to(doll.rotation, { duration: 0.45, y: -3.15 });
  setTimeout(() => (isLookingback = true), 200);
}
function lookForward() {
  text.innerText = "Red Light";
  if (gamestart == "Over") {
    text.innerText = "End";
  }
  let progressbar = createCubered({ w: 9, h: 1, d: 1 }, 0);
  progressbar.position.y = 7.0;
  gsap.to(doll.rotation, { duration: 0.45, y: -0 });
  setTimeout(() => (isLookingback = false), 500);
}

async function start() {
  lookBackward();
  await delay(Math.random() * 1000 + 1000);
  lookForward();
  await delay(Math.random() * 750 + 750);
  start();
}

// setTimeout(() => {
//   lookBackward();
// }, 1000);
// setTimeout(() => {
//   lookForward();
// }, 2000);
// setTimeout(() => {
//   start();
// }, 1000);

async function init() {
  await delay(500);
  text.innerText = "Starting in 3";
  await delay(500);
  text.innerText = "Starting in 2";
  await delay(500);
  text.innerText = "Starting in 1";
  await delay(500);
  text.innerText = "GO  !!!!";
  startGame();
}
function startGame() {
  // let progressbar = createCubepro({ w: 9, h: 1, d: 1 }, 0, colors);
  // progressbar.position.y = 7.0;
  gamestart = "started";
  start();
}
init();

// Creating runway

function createTrack() {
  createCubePath({ w: 12 * 2 + 0.2, h: 1.7, d: 0.1 }, 0, -2).position.z = -0.2;
  createCubeF({ w: 0.2, h: 2, d: 0.1 }, 12, -2);
  createCubel({ w: 0.2, h: 2, d: 0.1 }, -12, -2);
}
createTrack();

// Player Function

class Player {
  constructor() {
    const geometry = new THREE.SphereGeometry(0.4, 50, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.z = 3.1;
    sphere.position.x = 8;
    sphere.position.y = -1.4;
    scene.add(sphere);
    this.player = sphere;
    this.playerInfo = {
      positionX: 9,
      velocity: 0,
    };
  }
  run() {
    this.playerInfo.velocity = 0.03;
  }
  check() {
    if (this.playerInfo.velocity > 0 && !isLookingback) {
      text.innerText = "You Lose";
      ans = true;
      gamestart = "Over";
    }
    if (this.playerInfo.positionX < endposition) {
      text.innerText = "You Win";
      ans = true;
      gamestart = "Over";
    }
  }
  update() {
    this.check();
    this.playerInfo.positionX -= this.playerInfo.velocity;
    this.player.position.x = this.playerInfo.positionX;
  }

  stop() {
    // this.playerInfo.velocity = 0;
    gsap.to(this.playerInfo, { velocity: 0, duration: 0.5 });
  }
}

const player = new Player();
function animate() {
  if (gamestart == "Over") return;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  player.update();
}

animate();

//Key Press Handling

window.addEventListener("keydown", (e) => {
  if (gamestart != "started") return;
  if (e.key == "ArrowUp") {
    player.run();
  }
});
window.addEventListener("keyup", (e) => {
  if (e.key == "ArrowUp") {
    player.stop();
  }
});
