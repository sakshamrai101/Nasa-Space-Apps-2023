import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const App = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
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

    
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const texture = new THREE.TextureLoader().load("/moon_texture.jpg");
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const moon = new THREE.Mesh(geometry, material);
    scene.add(moon);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      moon.rotation.x += 0.005;
      moon.rotation.y += 0.005;
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div ref={sceneRef}></div>;
};

export default App;
