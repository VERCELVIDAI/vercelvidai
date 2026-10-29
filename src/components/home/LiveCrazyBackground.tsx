'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';

type EffectMode = 'quantum' | 'neural' | 'vortex';

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
  const [mode, setMode] = useState<EffectMode>('quantum');
  const [particleCount, setParticleCount] = useState(0);
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
  });

  const shockwavesRef = useRef<Shockwave[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const modeRef = useRef<EffectMode>('quantum');
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

    // Detect mobile touch screen to disable heavy shadow blurs & touch gesture conflicts
    const checkIsMobile = () => {
      isMobile = window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024);
      return isMobile;
    };

    const colorPalette = [
      'rgba(81, 69, 205, ',  // FLUVIA Indigo (#5145CD)
      'rgba(99, 102, 241, ', // Indigo-500
      'rgba(56, 189, 248, ', // Sky-400 (Cyan Accent)
      'rgba(139, 92, 246, ', // Violet-500
      'rgba(79, 70, 229, ',  // Deep Indigo
    ];

    const initParticles = () => {
      // Significantly fewer particles on mobile for 60fps buttery smooth scroll
      const density = isMobile ? 22 : 65;
      const particles: Particle[] = [];

      for (let i = 0; i < density; i++) {
        const baseVx = (Math.random() - 0.5) * 0.6;
        const baseVy = (Math.random() - 0.5) * 0.6;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: baseVx,
          vy: baseVy,
          baseVx,
          baseVy,
          size: Math.random() * 2 + 1.2,
          color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
          alpha: Math.random() * 0.4 + 0.3,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.025,
          energy: 0,
        });
      }
      particlesRef.current = particles;
      setParticleCount(particles.length);
    };

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      checkIsMobile();

      // Cap DPR to 1 on mobile to prevent GPU thermal throttling, 1.5 on desktop
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

    // Performance: Pause RAF when scrolled out of view
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

    // Performance: Pause RAF when browser tab is inactive
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

    // Mouse Tracking (Only on desktop pointermove to avoid intercepting mobile touch scrolling)
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // Do not hijack touch scroll on mobile
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (
        clientX >= -50 &&
        clientX <= width + 50 &&
        clientY >= -50 &&
        clientY <= height + 50
      ) {
        const dx = clientX - mouseRef.current.prevX;
        const dy = clientY - mouseRef.current.prevY;
        mouseRef.current.speed = Math.sqrt(dx * dx + dy * dy);
        mouseRef.current.prevX = clientX;
        mouseRef.current.prevY = clientY;
        mouseRef.current.targetX = clientX;
        mouseRef.current.targetY = clientY;
        mouseRef.current.isHovering = true;
      } else {
        mouseRef.current.isHovering = false;
      }
    };

    const onPointerLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.targetX = -9999;
      mouseRef.current.targetY = -9999;
    };

    // Click Shockwave Burst (Desktop only to prevent accidental scroll agitation on mobile)
    const onPointerDown = (e: MouseEvent) => {
      if ((e as any).pointerType === 'touch') return;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (clickX >= 0 && clickX <= width && clickY >= 0 && clickY <= height) {
        shockwavesRef.current.push({
          x: clickX,
          y: clickY,
          radius: 10,
          maxRadius: Math.max(width, height) * 0.45,
          opacity: 0.8,
          color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        });

        particlesRef.current.forEach((p) => {
          const dx = p.x - clickX;
          const dy = p.y - clickY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220 && dist > 1) {
            const force = (1 - dist / 220) * 10;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
            p.energy = 0.9;
          }
        });
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);

    let time = 0;

    const render = () => {
      if (!isVisibleRef.current) {
        animFrameRef.current = null;
        return;
      }

      time += 0.016;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.15;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const currentMode = modeRef.current;
      const mouse = mouseRef.current;

      // 1. RENDER SHOCKWAVES
      for (let s = shockwavesRef.current.length - 1; s >= 0; s--) {
        const sw = shockwavesRef.current[s];
        sw.radius += 7;
        sw.opacity *= 0.95;

        if (sw.opacity < 0.02 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(s, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${sw.color}${sw.opacity.toFixed(2)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 2. CURSOR HALO (Desktop only)
      if (mouse.isHovering && !isMobile) {
        const haloGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          currentMode === 'vortex' ? 220 : 150
        );
        haloGrad.addColorStop(0, 'rgba(81, 69, 205, 0.12)');
        haloGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.05)');
        haloGrad.addColorStop(1, 'rgba(81, 69, 205, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, currentMode === 'vortex' ? 220 : 150, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. PARTICLES UPDATE & DRAW
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.phase += p.pulseSpeed;
        const currentAlpha = Math.min(1, Math.max(0.15, p.alpha + Math.sin(p.phase) * 0.2 + p.energy * 0.3));
        const currentSize = p.size * (1 + Math.sin(p.phase) * 0.25 + p.energy * 0.4);
        p.energy *= 0.94;

        if (currentMode === 'quantum') {
          const angle = Math.sin(p.x * 0.005 + time * 0.7) * Math.cos(p.y * 0.005 + time * 0.7) * Math.PI * 2;
          p.vx += Math.cos(angle) * 0.035;
          p.vy += Math.sin(angle) * 0.035;
        } else if (currentMode === 'vortex') {
          if (mouse.isHovering && !isMobile) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 260 && dist > 10) {
              const tangentAngle = Math.atan2(dy, dx) + Math.PI / 2;
              const pullForce = (1 - dist / 260) * 0.5;
              const swirlForce = (1 - dist / 260) * 1.1;
              p.vx += (dx / dist) * pullForce + Math.cos(tangentAngle) * swirlForce;
              p.vy += (dy / dist) * pullForce + Math.sin(tangentAngle) * swirlForce;
            }
          }
        } else if (currentMode === 'neural') {
          p.vx += (Math.random() - 0.5) * 0.12;
          p.vy += (Math.random() - 0.5) * 0.12;
        }

        if (mouse.isHovering && !isMobile && currentMode !== 'vortex') {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 1) {
            const force = (1 - dist / 130) * 1.3;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
            p.energy = Math.max(p.energy, force * 0.6);
          }
        }

        p.vx = p.vx * 0.95 + p.baseVx * 0.05;
        p.vy = p.vy * 0.95 + p.baseVy * 0.05;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha.toFixed(2)})`;
        // NO shadowBlur on mobile to eliminate GPU bottleneck
        if (!isMobile && p.energy > 0.3) {
          ctx.shadowColor = 'rgba(81, 69, 205, 0.4)';
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. DRAW CONNECTIVE SYNAPSE FILAMENTS
      const maxConnectDistance = isMobile ? 80 : currentMode === 'neural' ? 130 : 95;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDistance) {
            const lineAlpha = (1 - dist / maxConnectDistance) * 0.2 * Math.max(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            if (p1.energy > 0.3 || p2.energy > 0.3) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.5, lineAlpha * 2).toFixed(2)})`;
              ctx.lineWidth = 1;
            } else {
              ctx.strokeStyle = `rgba(81, 69, 205, ${lineAlpha.toFixed(2)})`;
              ctx.lineWidth = 0.7;
            }
            ctx.stroke();
          }
        }
      }

      // 5. DRAW SYNAPSE FIBERS TO CURSOR (Desktop only)
      if (mouse.isHovering && !isMobile) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.35;
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
      p.energy = 0.9;
      p.vx += (Math.random() - 0.5) * 3;
      p.vy += (Math.random() - 0.5) * 3;
    });
  };

  const triggerQuantumShockwave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    shockwavesRef.current.push({
      x: w / 2,
      y: h * 0.4,
      radius: 5,
      maxRadius: Math.max(w, h) * 0.7,
      opacity: 0.9,
      color: 'rgba(81, 69, 205, ',
    });

    particlesRef.current.forEach((p) => {
      p.energy = 0.9;
      p.vx += (Math.random() - 0.5) * 4;
      p.vy += (Math.random() - 0.5) * 4;
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 max-w-full"
      aria-hidden="true"
    >
      {/* 1. CHROMATIC VOLUMETRIC AURORA LIGHT BLOBS */}
      <div className="absolute -top-[15%] left-[10%] w-[240px] sm:w-[500px] h-[240px] sm:h-[500px] rounded-full bg-gradient-to-br from-[#5145CD]/16 via-[#818CF8]/12 to-transparent blur-[60px] sm:blur-[110px] pointer-events-none" />
      <div className="absolute top-[20%] right-[5%] w-[240px] sm:w-[550px] h-[240px] sm:h-[550px] rounded-full bg-gradient-to-bl from-[#38BDF8]/14 via-[#6366F1]/10 to-transparent blur-[70px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[260px] sm:w-[600px] h-[220px] sm:h-[400px] rounded-full bg-gradient-to-t from-[#8B5CF6]/12 via-[#C7D2FE]/8 to-transparent blur-[60px] sm:blur-[100px] pointer-events-none" />

      {/* 2. SUBTLE ARCHITECTURAL CYBER-GRID OVERLAY */}
      <div
        className="absolute inset-0 opacity-[0.025] sm:opacity-[0.035] pointer-events-none"
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

      {/* 4. INTERACTIVE LIVE HUD CONTROLLER BADGE (Desktop Only or Compact on Mobile) */}
      <div className="hidden sm:block absolute bottom-4 right-4 z-20 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E5E7EB] shadow-md text-xs transition-all hover:shadow-lg">
          <button
            type="button"
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] font-mono font-semibold transition-colors cursor-pointer"
            title="Click to toggle live canvas options"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5145CD] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5145CD]" />
            </span>
            <span className="text-[11px] uppercase tracking-wider">
              {mode === 'quantum' ? 'Quantum Wave' : mode === 'neural' ? 'Neural Synapse' : 'Cosmic Vortex'}
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
            <div className="absolute bottom-11 right-0 p-2 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl flex flex-col gap-1 min-w-[170px] animate-in fade-in slide-in-from-bottom-2 duration-150 z-30">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#E5E7EB] flex items-center justify-between">
                <span>Canvas Mode</span>
                <span className="text-[9px] font-mono text-[#5145CD]">{particleCount} Nodes</span>
              </div>
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
                💡 Move cursor to interact
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}