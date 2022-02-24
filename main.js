import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DoubleSide } from 'three';

import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'

import earthVertexShader from './shaders/earthVertex.glsl'
import earthFragmentShader from './shaders/earthFragment.glsl'



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'), 
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(0);
camera.position.setX(30);
camera.position.y = 40;

//earth edit
camera.position.setZ(0);
camera.position.setX(80);
camera.position.y = 10;
renderer.render(scene, camera);

//light

const pointLight = new THREE.PointLight(0xFCF9D9);
pointLight.decay = 1;
pointLight.position.set(5, 5, 5);
pointLight.castShadow=true;
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//control
const controls = new OrbitControls(camera, renderer.domElement);
const gridHelper = new THREE.GridHelper(600, 30);
//scene.add(gridHelper);
//background

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;



const relativePostition = 20;
const normalTexture = new THREE.TextureLoader().load('normal.jpg');


function addPlanet(size,texture,position, normal = normalTexture){
  
  const planetTexture = new THREE.TextureLoader().load(texture);
  const geometry = new THREE.SphereGeometry(size,32,32);
  const material = new THREE.MeshStandardMaterial({  map: planetTexture,normalMap: normal});
  const planet = new THREE.Mesh(geometry, material);
 
  const orbit = new THREE.Object3D();
  orbit.add(planet);
  scene.add(orbit);
  planet.position.x = position;

  //rings
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(position,0.02,30,100),
    new THREE.MeshStandardMaterial({color : 0xffffff, side: DoubleSide})
  )
  
  ring1.rotation.x = Math.PI/2;
  scene.add(ring1)
  return {planet,orbit}
}


const sunTexture = new THREE.TextureLoader().load('sun.jpg');
const geometry = new THREE.SphereGeometry(15,32,32);
const material = new THREE.MeshBasicMaterial({  map: sunTexture,normalMap: normalTexture});
const sun = new THREE.Mesh(geometry, material);

// create sun glow
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(15, 32, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
)
// create earthlow
const earthGlow = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 50),
  new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
)
earthGlow.position.x = relativePostition*3;




const sunOrbit = new THREE.Object3D();
sunOrbit.add(atmosphere)
sunOrbit.add(sun);

scene.add(sunOrbit);



const mercury = addPlanet(3,'mercury.jpg',relativePostition *1.5);
const venus = addPlanet(3,'venus.jpg',relativePostition *2);

const earthTexture = new THREE.TextureLoader().load('earth-normal.jpg');
const earth = addPlanet(3,'earth.jpg',relativePostition *3,earthTexture);
earth.orbit.add(earthGlow)
const moon = addPlanet(1,'moon.jpg',8);
earth.planet.add(moon.orbit);


const mars = addPlanet(3,'mars.jpg',relativePostition *4);
const jupyter = addPlanet(3,'jupyter.jpg',relativePostition *5);
const saturn = addPlanet(3,'saturn.jpg',relativePostition *6);
const uranus = addPlanet(3,'uranus.jpg',relativePostition *7);
const neptune = addPlanet(3,'neptune.jpg',relativePostition *8);


const saturnRingTexture = new THREE.TextureLoader().load('saturn-ring.jpg');

const saturnRing = new THREE.Mesh(
  new THREE.RingGeometry(13,20, 30),
  new THREE.MeshBasicMaterial({
    map: saturnRingTexture,
    side: DoubleSide
  })
);
saturnRing.rotation.x = 2;
saturnRing.scale.set(0.3, 0.3, 0.3)
saturn.planet.add(saturnRing);

 //MOON ring
const moonRing = new THREE.Mesh(
  new THREE.TorusGeometry(8,0.02,30,100),
  new THREE.MeshStandardMaterial({color : 0xffffff, side: DoubleSide})
)

moonRing.rotation.x = Math.PI/2;
//ring1.position.x = 30;
earth.planet.add(moonRing)


function addStar() {
  const geometry = new THREE.OctahedronGeometry(0.25);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(600));

  star.position.set(x, y, z);
  sunOrbit.add(star);
  return star;
}

const stars = [];
for (let x =0; x <200;x++){
  stars[x] = addStar();
}

//earth.orbit.position.y =10;
function animate() {
  requestAnimationFrame(animate);
  sun.rotation.y += 0.005;
  sunOrbit.rotation.y -= 0.0002;//anchor for stars
  
  mercury.planet.rotation.y += 0.01;
  mercury.orbit.rotation.y += 0.00479;
 
  venus.planet.rotation.y += 0.03;
  venus.orbit.rotation.y += 0.0035;

  earth.planet.rotation.y += 0.01;
  earth.orbit.rotation.y += 0.00298;
 

  moon.planet.rotation.y += 0.001;
  moon.orbit.rotation.y += 0.0001;

 
  mars.planet.rotation.y += 0.001;
  mars.orbit.rotation.y += 0.00241;

  jupyter.planet.rotation.y += 0.001;
  jupyter.orbit.rotation.y += 0.00131;

  saturn.planet.rotation.y += 0.001;
  saturn.orbit.rotation.y += 0.00097;
  

  uranus.planet.rotation.y += 0.001;
  uranus.orbit.rotation.y += 0.00068;

  neptune.planet.rotation.y += 0.001;
  neptune.orbit.rotation.y += 0.00054;


  controls.update();
  renderer.render(scene, camera);
}

animate();