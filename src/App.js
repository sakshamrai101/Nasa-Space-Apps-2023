import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import './App.css';

const App = () => {
  const sceneRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const isSceneInitialized = useRef(false);

  useEffect(() => {
    if (!isSceneInitialized.current) {
    console.log('Initializing scene...');
    const scene = new THREE.Scene();
    scene.clear();  
    

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

  
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });

    const vertices = [];

    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      vertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

   
    const geometry = new THREE.SphereGeometry(10, 32, 32);
    const texture = new THREE.TextureLoader().load("/moon_texture.jpg");
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const moon = new THREE.Mesh(geometry, material);
    scene.add(moon);

    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);
      moon.rotation.x += 0.005;
      moon.rotation.y += 0.005;
      renderer.render(scene, camera);
    };

    animate();
      isSceneInitialized.current = true;
    }
  }, []);

  return (
    <div ref={sceneRef} className="scene-container">
      <div className="landing-page">
        <h1>Moon-Markers 2.0</h1>
        <button onClick={toggleSidebar} className="launch-button">Take me to the moon</button>
      </div>
      {showSidebar && (
        <div className="sidebar">
          <h2>Moonquake Data</h2>
          <button className="control-button">Activate Sensor 1</button>
          <button className="control-button">Activate Sensor 2</button>
          <button className="control-button">Show Heatmap</button>
          <div className="slider-container">
            <label>Seismic Activity:</label>
            <input type="range" min="1" max="100" className="control-slider" />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
