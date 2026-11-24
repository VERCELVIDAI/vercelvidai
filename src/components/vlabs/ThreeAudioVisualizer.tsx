'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeAudioVisualizerProps {
  className?: string;
  isPlaying?: boolean;
}

export function ThreeAudioVisualizer({ className = '', isPlaying = false }: ThreeAudioVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect low-performance / mobile devices
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Group for mouse rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Floating Audio Sphere (Wireframe / Points hybrid)
    const sphereRadius = 4.2;
    const sphereDetail = isMobile ? 24 : 42;
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, sphereDetail, sphereDetail);
    const spherePos = sphereGeometry.attributes.position;
    const originalPos = spherePos.clone();

    // Emerald and Pink gradient vertex colors
    const colors = new Float32Array(spherePos.count * 3);
    for (let i = 0; i < spherePos.count; i++) {
      const y = spherePos.getY(i);
      const ratio = (y + sphereRadius) / (sphereRadius * 2);
      // Emerald: (0.06, 0.72, 0.5) to Pink/Magenta: (0.95, 0.12, 0.4)
      colors[i * 3] = THREE.MathUtils.lerp(0.06, 0.95, ratio);
      colors[i * 3 + 1] = THREE.MathUtils.lerp(0.85, 0.12, ratio);
      colors[i * 3 + 2] = THREE.MathUtils.lerp(0.55, 0.45, ratio);
    }
    sphereGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Points Material for Glowing Audio Particles
    const pointsMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.14 : 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const spherePoints = new THREE.Points(sphereGeometry, pointsMaterial);
    mainGroup.add(spherePoints);

    // Subtle inner glowing mesh
    const innerMeshGeo = new THREE.SphereGeometry(sphereRadius * 0.95, 20, 20);
    const innerMeshMat = new THREE.MeshBasicMaterial({
      color: 0x052e25,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    });
    const innerMesh = new THREE.Mesh(innerMeshGeo, innerMeshMat);
    mainGroup.add(innerMesh);

    // 2. Concentric Soundwave Rings
    const ringCount = isMobile ? 3 : 5;
    const rings: THREE.LineLoop[] = [];
    for (let r = 0; r < ringCount; r++) {
      const ringRadius = 5.8 + r * 1.5;
      const ringSegments = 90;
      const ringGeo = new THREE.BufferGeometry();
      const ringPositions = new Float32Array((ringSegments + 1) * 3);

      for (let s = 0; s <= ringSegments; s++) {
        const theta = (s / ringSegments) * Math.PI * 2;
        ringPositions[s * 3] = Math.cos(theta) * ringRadius;
        ringPositions[s * 3 + 1] = 0;
        ringPositions[s * 3 + 2] = Math.sin(theta) * ringRadius;
      }
      ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));

      const ringMat = new THREE.LineBasicMaterial({
        color: r % 2 === 0 ? 0x10b981 : 0xf43f5e,
        transparent: true,
        opacity: 0.35 - r * 0.05,
        blending: THREE.AdditiveBlending,
      });

      const ring = new THREE.LineLoop(ringGeo, ringMat);
      ring.rotation.x = Math.PI * 0.35 + r * 0.15;
      ring.rotation.y = r * 0.4;
      mainGroup.add(ring);
      rings.push(ring);
    }

    // 3. Floating Ambient Star/Particle Cloud
    const particleCount = isMobile ? 250 : 600;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      const r = 8 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      particlePositions[p * 3] = r * Math.cos(theta) * Math.cos(phi);
      particlePositions[p * 3 + 1] = r * Math.sin(phi);
      particlePositions[p * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x34d399,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const ambientParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(ambientParticles);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotationY = x * 0.6;
      targetRotationX = -y * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const amplitude = isPlayingRef.current ? 1.8 : 0.8;
      const speed = isPlayingRef.current ? 3.5 : 1.4;

      // Smooth mouse follow
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

      // Idle rotation
      mainGroup.rotation.z += 0.002;
      ambientParticles.rotation.y += 0.0008;

      // Deform Central Sphere with Soundwave Harmonics
      const positionAttribute = sphereGeometry.attributes.position;
      for (let i = 0; i < positionAttribute.count; i++) {
        const u = originalPos.getX(i);
        const v = originalPos.getY(i);
        const w = originalPos.getZ(i);

        const dist = Math.sqrt(u * u + v * v + w * w);
        const normalX = u / dist;
        const normalY = v / dist;
        const normalZ = w / dist;

        // Multi-frequency wave interference
        const wave1 = Math.sin(normalX * 4 + elapsedTime * speed) * 0.35 * amplitude;
        const wave2 = Math.cos(normalY * 5 + elapsedTime * (speed * 0.8)) * 0.25 * amplitude;
        const wave3 = Math.sin(normalZ * 6 + elapsedTime * (speed * 1.2)) * 0.2 * amplitude;
        const displacement = wave1 + wave2 + wave3;

        positionAttribute.setXYZ(
          i,
          u + normalX * displacement,
          v + normalY * displacement,
          w + normalZ * displacement
        );
      }
      positionAttribute.needsUpdate = true;

      // Oscillate Soundwave Rings
      rings.forEach((ring, index) => {
        const ringAmp = Math.sin(elapsedTime * (2 + index * 0.5)) * 0.08 * amplitude;
        ring.scale.set(1 + ringAmp, 1 + ringAmp, 1 + ringAmp);
        ring.rotation.z += 0.004 * (index % 2 === 0 ? 1 : -1);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sphereGeometry.dispose();
      pointsMaterial.dispose();
      innerMeshGeo.dispose();
      innerMeshMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[380px] sm:h-[480px] lg:h-[540px] flex items-center justify-center pointer-events-none select-none ${className}`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-emerald-500/15 via-transparent to-transparent blur-2xl pointer-events-none" />
    </div>
  );
}
