import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import './App.css';

const App = () => {
  const sceneRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [earthTime, setEarthTime] = useState(new Date().toLocaleTimeString());
  const [useEarthTime, setUseEarthTime] = useState(false);
  const light = useRef(null);
  const moon = useRef(null);
  const isSceneInitialized = useRef(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleEarthTime = () => {
    setUseEarthTime(!useEarthTime);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setEarthTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isSceneInitialized.current) {
      const scene = new THREE.Scene();
      light.current = new THREE.DirectionalLight(0xffffff, 1);
      scene.add(light.current);

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      sceneRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.SphereGeometry(10, 32, 32);
      const texture = new THREE.TextureLoader().load("/moon_texture.jpg");
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const lambertMaterial = new THREE.MeshLambertMaterial({ map: texture });

      moon.current = new THREE.Mesh(geometry, material);
      scene.add(moon.current);

      camera.position.z = 30;

      const animate = () => {
        requestAnimationFrame(animate);

        // Rotate the moon
        if (moon.current) {
          moon.current.rotation.y += 0.005;
        }

        if (useEarthTime) {
          const currentTime = new Date();
          const sunAngle = ((currentTime.getHours() + currentTime.getMinutes() / 60) / 24) * Math.PI * 2;
          light.current.position.set(Math.sin(sunAngle) * 30, 0, Math.cos(sunAngle) * 30);
          moon.current.material = lambertMaterial;
        } else {
          moon.current.material = material;
        }

        renderer.render(scene, camera);
      };

      animate();
      isSceneInitialized.current = true;
    }
  }, [useEarthTime]);

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
          <div className="slider-container">
            <label>Earth Time:</label>
            <div>{earthTime}</div>
            <button onClick={toggleEarthTime} className="control-button">Toggle Earth Time</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
