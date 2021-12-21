import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import gsap from "gsap";

import * as dat from "dat.gui";

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";

import testTexture from "./textures/hud.jpg";

export default class Sketch {
  constructor(options) {
    this.container = options.dom;
    this.scene = new THREE.Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      30,
      this.width / this.height,
      10,
      1000
    );

    //camera fov angle calculation
    //this.camera.fov = 2 * Math.atan(this.height / 2 / 600)* 180 / Math.PI;
    const halfAngle = Math.atan(this.height / 2 / 600); // 600 distance from camera
    const radToDeg = (halfAngle * 180) / Math.PI; // Radien to Degree
    this.camera.fov = radToDeg * 2;

    this.camera.position.z = 600;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;
    this.setupSettings();
    this.resize();
    this.setUpResize();
    this.addObjects();
    this.render();
  }

  setupSettings() {
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.001);
  }

  setUpResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }
  addObjects() {
    this.geometry = new THREE.PlaneBufferGeometry(300, 300, 100, 100);
    //Shaders
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        uProgress: { value: 0 },
        uTexture: { value: new THREE.TextureLoader().load(testTexture) },
        uTextureSize: { value: new THREE.Vector2(100, 100) },
        uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uQuadSize: { value: new THREE.Vector2(300, 300) },
      },
      fragmentShader: fragment,
      vertexShader: vertex,
    });

    //gsap
    this.tl = gsap
      .timeline()
      .to(this.material.uniforms.uCorners.value, {
        x: 1,
        duration: 1,
      })
      .to(
        this.material.uniforms.uCorners.value,
        {
          y: 1,
          duration: 1,
        },
        0.2
      )
      .to(
        this.material.uniforms.uCorners.value,
        {
          z: 1,
          duration: 1,
        },
        0.4
      )
      .to(
        this.material.uniforms.uCorners.value,
        {
          w: 1,
          duration: 1,
        },
        0.6
      );

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.mesh.position.x = 300;
    this.mesh.rotation.z = 30;
  }
  render() {
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.uProgress.value = this.settings.progress;
    // this.tl.progress(this.settings.progress);

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({ dom: document.getElementById("container") });
