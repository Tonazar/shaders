import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ASScroll from "@ashthornton/asscroll";

import gsap from "gsap";

import * as dat from "dat.gui";

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import testTexture from "./textures/texture1.jpg";

const scene = new THREE.Scene();
const container = document.getElementById("container");
const width = container.offsetWidth;
const height = container.offsetHeight;
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.fov = (2 * Math.atan(height / 2 / 600) * 180) / Math.PI;
camera.position.z = 600;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

const asscroll = new ASScroll({ disableRaf: true });
asscroll.enable({ horizontalScroll: true });

const geometry = new THREE.PlaneBufferGeometry(1, 1, 30, 30);
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { value: new THREE.TextureLoader().load(testTexture) },
    uProgress: { value: 0 },
    uResolution: { value: new THREE.Vector2(width, height) },
    uQuadSize: { value: new THREE.Vector2(500, 500) },
    uCorners: { value: new THREE.Vector2(0, 0) },
  },
  vertexShader: vertex,
  fragmentShader: fragment,
});
const cube = new THREE.Mesh(geometry, material);
cube.scale.set(500, 500, 1);
// scene.add(cube);
cube.position.x = 300;

const settings = {
  progress: 0,
};

// const gui = new dat.GUI();
// gui.add(settings, "progress", 0, 1, 0.001);

//cloning-------------------------------------------------------------------
let materialArray = [];
const images = [...document.querySelectorAll(".js-image")];
const imageStore = images.map((img) => {
  let newMaterial = material.clone();
  materialArray.push(newMaterial);

  let newTexture = new THREE.Texture(img);
  newTexture.needsUpdate = true;

  newMaterial.uniforms.uTexture.value = newTexture;

  img.addEventListener("mouseover", () => {
    //gsap------------------------------------------------------------------
    const tl = gsap
      .timeline()
      .to(newMaterial.uniforms.uCorners.value, { x: 1, duration: 0.4 })
      .to(newMaterial.uniforms.uCorners.value, { y: 1, duration: 0.4 }, 0.2);
  });
  img.addEventListener("mouseout", () => {
    //gsap------------------------------------------------------------------
    const tl = gsap
      .timeline()
      .to(newMaterial.uniforms.uCorners.value, { x: 0, duration: 0.4 })
      .to(newMaterial.uniforms.uCorners.value, { y: 0, duration: 0.4 }, 0.2);
  });

  let newMesh = new THREE.Mesh(geometry, newMaterial);
  scene.add(newMesh);

  let bounds = img.getBoundingClientRect();
  newMesh.scale.set(bounds.width, bounds.height, 1);

  return {
    img: img,
    newMesh: newMesh,
    width: bounds.width,
    height: bounds.height,
    top: bounds.top,
    left: bounds.left,
  };
});

//Positioning--------------------------------------------------------------
const setPosition = () => {
  imageStore.forEach((object) => {
    object.newMesh.position.x =
      -asscroll.currentPos + object.left - width / 2 + object.width / 2;
    object.newMesh.position.y = -object.top + height / 2 - object.width / 2;
  });
};

//resize new meshes -------------------------------------------------------
materialArray.forEach((mat) => {
  mat.uniforms.uResolution.value.x = width;
  mat.uniforms.uResolution.value.y = height;
});

imageStore.forEach((item) => {
  let bounds = item.img.getBoundingClientRect();
  item.newMesh.scale.set(bounds.width, bounds.height, 1);
  item.top = bounds.top;
  item.left = bounds.left + asscroll.currentPos;
  item.width = bounds.width;
  item.height = bounds.height;

  item.newMesh.material.uniforms.uQuadSize.value.x = bounds.width;
  item.newMesh.material.uniforms.uQuadSize.value.y = bounds.height;

  // item.newMesh.material.uniforms.uTextureSize.value.x = bounds.width;
  // item.newMesh.material.uniforms.uTextureSize.value.y = bounds.height;
});

function animate() {
  requestAnimationFrame(animate);
  // material.uniforms.uProgress.value = settings.progress;
  // tl.progress(settings.progress);

  asscroll.update();
  setPosition();

  renderer.render(scene, camera);
}

animate();
