'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Zap, Flame, Compass, Eye } from 'lucide-react';

type EffectMode = 'stardust' | 'neural' | 'quantum' | 'vortex';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  color: string;
  alpha: number;
  phase: number;
  pulseSpeed: number;
  energy: number;
}

interface MouseSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxLife: number;
  life: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  isStar: boolean;
}

interface DataPhoton {
  p1Index: number;
  p2Index: number;
  progress: number;
  speed: number;
  color: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
}

export function LiveCrazyBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<EffectMode>('stardust');
  const [showControls, setShowControls] = useState(false);

  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    isHovering: false,
    speed: 0,
    prevX: 0,
    prevY: 0,
    lastSpawnTime: 0,
  });

  const shockwavesRef = useRef<Shockwave[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseSparksRef = useRef<MouseSpark[]>([]);
  const photonsRef = useRef<DataPhoton[]>([]);
  const modeRef = useRef<EffectMode>('stardust');
  modeRef.current = mode;

  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let isMobile = false;

    // Check if device is mobile or touch
    const checkIsMobile = () => {
      isMobile = window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024);
      return isMobile;
    };

    // Brand Palette: Fluvia Indigo, Sky Cyan, Electric Violet, Pure Bright
    const sparkColors = [
      '#5145CD', // Fluvia Indigo
      '#6366F1', // Indigo 500
      '#38BDF8', // Sky Cyan
      '#818CF8', // Indigo 400
      '#A855F7', // Purple 500
      '#FFFFFF', // White Spark
    ];

    const particlePalette = [
      'rgba(81, 69, 205, ',  // Indigo
      'rgba(99, 102, 241, ', // Light Indigo
      'rgba(56, 189, 248, ', // Sky
      'rgba(139, 92, 246, ', // Violet
      'rgba(79, 70, 229, ',  // Deep Indigo
    ];

    const initParticles = () => {
      const density = isMobile ? 24 : 70;
      const particles: Particle[] = [];

      for (let i = 0; i < density; i++) {
        const baseVx = (Math.random() - 0.5) * 0.7;
        const baseVy = (Math.random() - 0.5) * 0.7;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: baseVx,
          vy: baseVy,
          baseVx,
          baseVy,
          size: Math.random() * 2.2 + 1.2,
          color: particlePalette[Math.floor(Math.random() * particlePalette.length)],
          alpha: Math.random() * 0.45 + 0.25,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          energy: 0,
        });
      }
      particlesRef.current = particles;
    };

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      checkIsMobile();

      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initParticles();
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Intersection Observer to pause rendering when out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !animFrameRef.current) {
          animFrameRef.current = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Visibility change handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      } else {
        isVisibleRef.current = true;
        if (!animFrameRef.current) {
          animFrameRef.current = requestAnimationFrame(render);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Helper: spawn sparkling stardust particles at cursor
    const spawnSparks = (x: number, y: number, count = 2, speedMult = 1) => {
      if (isMobile) return;
      const sparks = mouseSparksRef.current;
      // Cap max sparks to prevent memory bloat
      if (sparks.length > 85) sparks.splice(0, count);

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 2 + 0.8) * speedMult;
        sparks.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5, // slight upward float
          size: Math.random() * 2.8 + 1.2,
          maxLife: 35 + Math.random() * 30,
          life: 0,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.15,
          isStar: Math.random() > 0.45, // 55% of particles are 4-point star sparkles!
        });
      }
    };

    // Pointer move tracking across hero section
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (
        clientX >= -60 &&
        clientX <= width + 60 &&
        clientY >= -60 &&
        clientY <= height + 60
      ) {
        const dx = clientX - mouseRef.current.prevX;
        const dy = clientY - mouseRef.current.prevY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        mouseRef.current.speed = speed;
        mouseRef.current.prevX = clientX;
        mouseRef.current.prevY = clientY;
        mouseRef.current.targetX = clientX;
        mouseRef.current.targetY = clientY;
        mouseRef.current.isHovering = true;

        // Spawn dynamic sparks based on movement speed
        const now = performance.now();
        if (now - mouseRef.current.lastSpawnTime > 16) {
          const spawnCount = Math.min(5, Math.max(1, Math.floor(speed * 0.18)));
          spawnSparks(clientX, clientY, spawnCount, Math.min(speed * 0.08 + 1, 2.5));
          mouseRef.current.lastSpawnTime = now;
        }
      } else {
        mouseRef.current.isHovering = false;
      }
    };

    const onPointerLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.targetX = -9999;
      mouseRef.current.targetY = -9999;
    };

    // Click: Trigger dazzling shockwave + spark explosion
    const onPointerDown = (e: MouseEvent) => {
      if ((e as any).pointerType === 'touch') return;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (clickX >= 0 && clickX <= width && clickY >= 0 && clickY <= height) {
        // Shockwave ring
        shockwavesRef.current.push({
          x: clickX,
          y: clickY,
          radius: 8,
          maxRadius: Math.max(width, height) * 0.55,
          opacity: 0.9,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
        });

        // Burst of 16-24 sparkling stardust particles
        spawnSparks(clickX, clickY, 18, 2.2);

        // Repel network particles with energy wave
        particlesRef.current.forEach((p) => {
          const dx = p.x - clickX;
          const dy = p.y - clickY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 260 && dist > 1) {
            const force = (1 - dist / 260) * 12;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
            p.energy = 1.0;
          }
        });
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);

    // Draw 4-point twinkling star
    const drawStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number,
      rot: number,
      color: string,
      alpha: number
    ) => {
      let rotStep = (Math.PI / spikes);
      let x = cx;
      let y = cy;

      context.save();
      context.beginPath();
      context.translate(cx, cy);
      context.rotate(rot);
      context.moveTo(0, -outerRadius);

      for (let i = 0; i < spikes; i++) {
        x = Math.cos(i * rotStep * 2) * outerRadius;
        y = Math.sin(i * rotStep * 2) * outerRadius;
        context.lineTo(x, y);

        x = Math.cos(i * rotStep * 2 + rotStep) * innerRadius;
        y = Math.sin(i * rotStep * 2 + rotStep) * innerRadius;
        context.lineTo(x, y);
      }
      context.lineTo(0, -outerRadius);
      context.closePath();
      context.fillStyle = color;
      context.globalAlpha = alpha;
      context.fill();
      context.restore();
    };

    let time = 0;

    // MAIN KINETIC ANIMATION RENDER LOOP
    const render = () => {
      if (!isVisibleRef.current) {
        animFrameRef.current = null;
        return;
      }

      time += 0.016;

      // Smooth mouse target interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.18;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.18;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const sparks = mouseSparksRef.current;
      const photons = photonsRef.current;
      const currentMode = modeRef.current;
      const mouse = mouseRef.current;

      // -------------------------------------------------------------
      // 1. MAGNETIC DYNAMIC CURSOR SPOTLIGHT (Multi-ring luminous aura)
      // -------------------------------------------------------------
      if (mouse.isHovering && !isMobile) {
        const spotlightRadius = currentMode === 'vortex' ? 260 : 190;

        const haloGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          spotlightRadius
        );
        haloGrad.addColorStop(0, 'rgba(81, 69, 205, 0.16)');
        haloGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.08)');
        haloGrad.addColorStop(0.7, 'rgba(139, 92, 246, 0.03)');
        haloGrad.addColorStop(1, 'rgba(81, 69, 205, 0)');

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, spotlightRadius, 0, Math.PI * 2);
        ctx.fill();

        // High-tech core point
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.shadowColor = '#5145CD';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // -------------------------------------------------------------
      // 2. RENDER SHOCKWAVE REFRACTION RINGS
      // -------------------------------------------------------------
      for (let s = shockwavesRef.current.length - 1; s >= 0; s--) {
        const sw = shockwavesRef.current[s];
        sw.radius += 8;
        sw.opacity *= 0.94;

        if (sw.opacity < 0.015 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(s, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color.includes('(') ? `${sw.color}${sw.opacity.toFixed(2)})` : sw.color;
        ctx.lineWidth = Math.max(1, 3 * sw.opacity);
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // 3. RENDER MOUSE STARDUST SPARKLES & EMBER TAIL
      // -------------------------------------------------------------
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.life += 1;
        const progress = sp.life / sp.maxLife;

        if (progress >= 1) {
          sparks.splice(i, 1);
          continue;
        }

        // Physics: velocity with friction and upward thermal draft
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.96;
        sp.vy *= 0.96;
        sp.rotation += sp.rotSpeed;

        const sparkAlpha = Math.sin(progress * Math.PI) * 0.9;
        const sparkScale = Math.sin(progress * Math.PI) * sp.size;

        if (sp.isStar) {
          // Twinkling 4-point diamond star
          drawStar(
            ctx,
            sp.x,
            sp.y,
            4,
            sparkScale * 1.8,
            sparkScale * 0.45,
            sp.rotation,
            sp.color,
            sparkAlpha
          );
        } else {
          // Circular luminous particle with micro glow
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, Math.max(0.8, sparkScale), 0, Math.PI * 2);
          ctx.fillStyle = sp.color;
          ctx.globalAlpha = sparkAlpha;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      // -------------------------------------------------------------
      // 4. PARTICLES UPDATE & DRAW
      // -------------------------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.phase += p.pulseSpeed;
        const currentAlpha = Math.min(1, Math.max(0.18, p.alpha + Math.sin(p.phase) * 0.2 + p.energy * 0.35));
        const currentSize = p.size * (1 + Math.sin(p.phase) * 0.25 + p.energy * 0.4);
        p.energy *= 0.94;

        if (currentMode === 'quantum' || currentMode === 'stardust') {
          const angle = Math.sin(p.x * 0.005 + time * 0.7) * Math.cos(p.y * 0.005 + time * 0.7) * Math.PI * 2;
          p.vx += Math.cos(angle) * 0.038;
          p.vy += Math.sin(angle) * 0.038;
        } else if (currentMode === 'vortex') {
          if (mouse.isHovering && !isMobile) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 280 && dist > 10) {
              const tangentAngle = Math.atan2(dy, dx) + Math.PI / 2;
              const pullForce = (1 - dist / 280) * 0.6;
              const swirlForce = (1 - dist / 280) * 1.25;
              p.vx += (dx / dist) * pullForce + Math.cos(tangentAngle) * swirlForce;
              p.vy += (dy / dist) * pullForce + Math.sin(tangentAngle) * swirlForce;
            }
          }
        } else if (currentMode === 'neural') {
          p.vx += (Math.random() - 0.5) * 0.15;
          p.vy += (Math.random() - 0.5) * 0.15;
        }

        // Magnetic Reaction to Cursor (Smooth push/pull)
        if (mouse.isHovering && !isMobile && currentMode !== 'vortex') {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150 && dist > 1) {
            const force = (1 - dist / 150) * 1.4;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
            p.energy = Math.max(p.energy, force * 0.7);
          }
        }

        // Friction dampening
        p.vx = p.vx * 0.95 + p.baseVx * 0.05;
        p.vy = p.vy * 0.95 + p.baseVy * 0.05;

        p.x += p.vx;
        p.y += p.vy;

        // Screen boundary wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha.toFixed(2)})`;
        if (!isMobile && p.energy > 0.3) {
          ctx.shadowColor = 'rgba(81, 69, 205, 0.45)';
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // -------------------------------------------------------------
      // 5. DRAW CONNECTIVE SYNAPSE FILAMENTS
      // -------------------------------------------------------------
      const maxConnectDistance = isMobile ? 80 : currentMode === 'neural' ? 140 : 105;
      const activeConnections: { p1: number; p2: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDistance) {
            activeConnections.push({ p1: i, p2: j });
            const lineAlpha = (1 - dist / maxConnectDistance) * 0.22 * Math.max(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            if (p1.energy > 0.3 || p2.energy > 0.3) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.55, lineAlpha * 2.2).toFixed(2)})`;
              ctx.lineWidth = 1.1;
            } else {
              ctx.strokeStyle = `rgba(81, 69, 205, ${lineAlpha.toFixed(2)})`;
              ctx.lineWidth = 0.75;
            }
            ctx.stroke();
          }
        }
      }

      // -------------------------------------------------------------
      // 6. SPAWN & DRAW DATA PHOTONS (Electric pulses along lines)
      // -------------------------------------------------------------
      if (!isMobile && activeConnections.length > 0) {
        // Randomly spawn a photon traveling along a connection line
        if (Math.random() < 0.25 && photons.length < 18) {
          const conn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
          photons.push({
            p1Index: conn.p1,
            p2Index: conn.p2,
            progress: 0,
            speed: 0.025 + Math.random() * 0.035,
            color: Math.random() > 0.5 ? '#38BDF8' : '#FFFFFF',
          });
        }

        // Draw and update photons
        for (let i = photons.length - 1; i >= 0; i--) {
          const ph = photons[i];
          ph.progress += ph.speed;

          if (ph.progress >= 1) {
            photons.splice(i, 1);
            continue;
          }

          const p1 = particles[ph.p1Index];
          const p2 = particles[ph.p2Index];
          if (!p1 || !p2) {
            photons.splice(i, 1);
            continue;
          }

          const curX = p1.x + (p2.x - p1.x) * ph.progress;
          const curY = p1.y + (p2.y - p1.y) * ph.progress;

          ctx.beginPath();
          ctx.arc(curX, curY, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = ph.color;
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // -------------------------------------------------------------
      // 7. SYNAPSE STREAMERS TO CURSOR (Desktop only)
      // -------------------------------------------------------------
      if (mouse.isHovering && !isMobile) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 145) {
            const alpha = (1 - dist / 145) * 0.4;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha.toFixed(2)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('mouseleave', onPointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const cycleMode = (nextMode: EffectMode) => {
    setMode(nextMode);
    particlesRef.current.forEach((p) => {
      p.energy = 1.0;
      p.vx += (Math.random() - 0.5) * 4;
      p.vy += (Math.random() - 0.5) * 4;
    });
  };

  const triggerQuantumShockwave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    shockwavesRef.current.push({
      x: w / 2,
      y: h * 0.45,
      radius: 6,
      maxRadius: Math.max(w, h) * 0.75,
      opacity: 0.95,
      color: '#5145CD',
    });

    // Burst of sparks
    if (mouseSparksRef.current) {
      for (let i = 0; i < 28; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1.5;
        mouseSparksRef.current.push({
          x: w / 2,
          y: h * 0.45,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1.2,
          maxLife: 45,
          life: 0,
          color: ['#5145CD', '#38BDF8', '#8B5CF6', '#FFFFFF'][Math.floor(Math.random() * 4)],
          rotation: Math.random() * Math.PI,
          rotSpeed: 0.1,
          isStar: true,
        });
      }
    }

    particlesRef.current.forEach((p) => {
      p.energy = 1.0;
      p.vx += (Math.random() - 0.5) * 5;
      p.vy += (Math.random() - 0.5) * 5;
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 max-w-full"
      aria-hidden="true"
    >
      {/* 1. CHROMATIC VOLUMETRIC AURORA LIGHT BLOBS */}
      <div className="absolute -top-[15%] left-[10%] w-[240px] sm:w-[500px] h-[240px] sm:h-[500px] rounded-full bg-gradient-to-br from-[#5145CD]/18 via-[#818CF8]/14 to-transparent blur-[60px] sm:blur-[110px] pointer-events-none" />
      <div className="absolute top-[20%] right-[5%] w-[240px] sm:w-[550px] h-[240px] sm:h-[550px] rounded-full bg-gradient-to-bl from-[#38BDF8]/16 via-[#6366F1]/12 to-transparent blur-[70px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[260px] sm:w-[600px] h-[220px] sm:h-[400px] rounded-full bg-gradient-to-t from-[#8B5CF6]/14 via-[#C7D2FE]/10 to-transparent blur-[60px] sm:blur-[100px] pointer-events-none" />

      {/* 2. ARCHITECTURAL CYBER-GRID OVERLAY */}
      <div
        className="absolute inset-0 opacity-[0.035] sm:opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #5145CD 1px, transparent 1px),
            linear-gradient(to bottom, #5145CD 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 3. HARDWARE-ACCELERATED LIVE KINETIC CANVAS */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* 4. INTERACTIVE LIVE HUD CONTROLLER BADGE */}
      <div className="hidden sm:block absolute bottom-4 right-4 z-20 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E5E7EB] shadow-md text-xs transition-all hover:shadow-lg">
          <button
            type="button"
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] font-mono font-semibold transition-colors cursor-pointer"
            title="Click to toggle live mouse effect options"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5145CD] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5145CD]" />
            </span>
            <span className="text-[11px] uppercase tracking-wider font-bold">
              {mode === 'stardust'
                ? '✨ Stardust Trail'
                : mode === 'neural'
                ? '⚡ Neural Synapse'
                : mode === 'quantum'
                ? '🌊 Quantum Wave'
                : '🌌 Cosmic Vortex'}
            </span>
            <Sparkles className="w-3 h-3 text-[#5145CD]" />
          </button>

          <button
            type="button"
            onClick={triggerQuantumShockwave}
            className="p-1.5 rounded-full hover:bg-[#F1F3F5] text-[#667085] hover:text-[#5145CD] transition-colors cursor-pointer"
            title="Trigger Neural Energy Pulse"
            aria-label="Trigger pulse"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>

          {showControls && (
            <div className="absolute bottom-11 right-0 p-2 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl flex flex-col gap-1 min-w-[190px] animate-in fade-in slide-in-from-bottom-2 duration-150 z-30">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#E5E7EB] flex items-center justify-between">
                <span>Interactive Mode</span>
                <span className="text-[9px] font-mono text-[#5145CD]">Live Motion</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  cycleMode('stardust');
                  setShowControls(false);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  mode === 'stardust'
                    ? 'bg-[#EEF2FF] text-[#5145CD] font-bold'
                    : 'text-[#17191D] hover:bg-[#F7F8FA]'
                }`}
              >
                <span>✨ Stardust Trail</span>
                {mode === 'stardust' && <span className="w-1.5 h-1.5 rounded-full bg-[#5145CD]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  cycleMode('neural');
                  setShowControls(false);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  mode === 'neural'
                    ? 'bg-[#EEF2FF] text-[#5145CD] font-bold'
                    : 'text-[#17191D] hover:bg-[#F7F8FA]'
                }`}
              >
                <span>⚡ Neural Synapse</span>
                {mode === 'neural' && <span className="w-1.5 h-1.5 rounded-full bg-[#5145CD]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  cycleMode('quantum');
                  setShowControls(false);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  mode === 'quantum'
                    ? 'bg-[#EEF2FF] text-[#5145CD] font-bold'
                    : 'text-[#17191D] hover:bg-[#F7F8FA]'
                }`}
              >
                <span>🌊 Quantum Wave</span>
                {mode === 'quantum' && <span className="w-1.5 h-1.5 rounded-full bg-[#5145CD]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  cycleMode('vortex');
                  setShowControls(false);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  mode === 'vortex'
                    ? 'bg-[#EEF2FF] text-[#5145CD] font-bold'
                    : 'text-[#17191D] hover:bg-[#F7F8FA]'
                }`}
              >
                <span>🌌 Cosmic Vortex</span>
                {mode === 'vortex' && <span className="w-1.5 h-1.5 rounded-full bg-[#5145CD]" />}
              </button>
              <div className="pt-1 mt-1 border-t border-[#E5E7EB] px-2 py-1 text-[10px] text-[#667085]">
                💡 Move mouse or click anywhere
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
