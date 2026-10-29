'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Activity, Eye, Zap, RefreshCw } from 'lucide-react';

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
  const [isInteractive, setIsInteractive] = useState(true);
  const [particleCount, setParticleCount] = useState(0);
  const [showControls, setShowControls] = useState(false);

  // References to keep state mutable inside requestAnimationFrame without re-triggering effect
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const colorPalette = [
      'rgba(81, 69, 205, ',  // FLUVIA Indigo (#5145CD)
      'rgba(99, 102, 241, ', // Indigo-500
      'rgba(56, 189, 248, ', // Sky-400 (Cyan Accent)
      'rgba(139, 92, 246, ', // Violet-500
      'rgba(79, 70, 229, ',  // Deep Indigo
    ];

    const initParticles = () => {
      // Calculate responsive density
      const density = width < 768 ? 45 : 90;
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
          size: Math.random() * 2.5 + 1.2,
          color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
          alpha: Math.random() * 0.45 + 0.35,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          energy: 0,
        });
      }
      particlesRef.current = particles;
      setParticleCount(particles.length);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse Tracking across entire container/window
    const onPointerMove = (e: PointerEvent) => {
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

    // Click Shockwave Burst
    const onPointerDown = (e: MouseEvent) => {
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

        // Agitate surrounding particles instantly
        particlesRef.current.forEach((p) => {
          const dx = p.x - clickX;
          const dy = p.y - clickY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220 && dist > 1) {
            const force = (1 - dist / 220) * 12;
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

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.15;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const currentMode = modeRef.current;
      const mouse = mouseRef.current;

      // 1. RENDER & EXPAND SHOCKWAVES
      for (let s = shockwavesRef.current.length - 1; s >= 0; s--) {
        const sw = shockwavesRef.current[s];
        sw.radius += 7;
        sw.opacity *= 0.95;

        if (sw.opacity < 0.02 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${sw.color}${sw.opacity.toFixed(2)})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Secondary subtle outer glow
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = `${sw.color}${(sw.opacity * 0.4).toFixed(2)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // 2. CURSOR GRAVITATIONAL OR ENERGY HALO
      if (mouse.isHovering) {
        ctx.save();
        const haloGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          currentMode === 'vortex' ? 240 : 160
        );
        haloGrad.addColorStop(0, 'rgba(81, 69, 205, 0.12)');
        haloGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.06)');
        haloGrad.addColorStop(1, 'rgba(81, 69, 205, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, currentMode === 'vortex' ? 240 : 160, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. UPDATE & DRAW PARTICLES
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Breathing & pulse phase
        p.phase += p.pulseSpeed;
        const currentAlpha = Math.min(1, Math.max(0.15, p.alpha + Math.sin(p.phase) * 0.2 + p.energy * 0.4));
        const currentSize = p.size * (1 + Math.sin(p.phase) * 0.3 + p.energy * 0.6);

        // Decay extra impulse energy
        p.energy *= 0.94;

        // Mode-Specific Physics
        if (currentMode === 'quantum') {
          // Flowfield wave effect
          const angle = Math.sin(p.x * 0.005 + time * 0.8) * Math.cos(p.y * 0.005 + time * 0.8) * Math.PI * 2;
          p.vx += Math.cos(angle) * 0.04;
          p.vy += Math.sin(angle) * 0.04;
        } else if (currentMode === 'vortex') {
          // Gravitational swirling vortex around cursor
          if (mouse.isHovering) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 280 && dist > 10) {
              const tangentAngle = Math.atan2(dy, dx) + Math.PI / 2;
              const pullForce = (1 - dist / 280) * 0.6;
              const swirlForce = (1 - dist / 280) * 1.2;

              p.vx += (dx / dist) * pullForce + Math.cos(tangentAngle) * swirlForce;
              p.vy += (dy / dist) * pullForce + Math.sin(tangentAngle) * swirlForce;
            }
          }
        } else if (currentMode === 'neural') {
          // Subtle synaptic Brownian motion
          p.vx += (Math.random() - 0.5) * 0.15;
          p.vy += (Math.random() - 0.5) * 0.15;
        }

        // Natural cursor repulsion or attractor (if not vortex)
        if (mouse.isHovering && currentMode !== 'vortex') {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;

          if (dist < maxDist && dist > 1) {
            const force = (1 - dist / maxDist) * 1.5;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
            p.energy = Math.max(p.energy, force * 0.7);
          }
        }

        // Apply friction damping
        p.vx = p.vx * 0.95 + p.baseVx * 0.05;
        p.vy = p.vy * 0.95 + p.baseVy * 0.05;

        // Position update
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha.toFixed(2)})`;
        ctx.shadowColor = 'rgba(81, 69, 205, 0.4)';
        ctx.shadowBlur = p.energy > 0.2 ? 10 : 3;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset blur for lines
      }

      // 4. DRAW CONNECTIVE SYNAPSE FILAMENTS
      const maxConnectDistance = currentMode === 'neural' ? 140 : 100;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDistance) {
            const lineAlpha = (1 - dist / maxConnectDistance) * 0.22 * Math.max(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            // If excited by mouse or shockwave, draw brighter cyan/violet line
            if (p1.energy > 0.3 || p2.energy > 0.3) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.6, lineAlpha * 2.5).toFixed(2)})`;
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = `rgba(81, 69, 205, ${lineAlpha.toFixed(2)})`;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
          }
        }
      }

      // 5. DRAW SYNAPSE FIBERS TO CURSOR
      if (mouse.isHovering) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const cursorConnectDist = currentMode === 'neural' ? 170 : 130;

          if (dist < cursorConnectDist) {
            const alpha = (1 - dist / cursorConnectDist) * 0.4;
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
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const cycleMode = (nextMode: EffectMode) => {
    setMode(nextMode);
    // Agitate particles on mode shift
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
      y: h * 0.4,
      radius: 5,
      maxRadius: Math.max(w, h) * 0.7,
      opacity: 0.9,
      color: 'rgba(81, 69, 205, ',
    });

    particlesRef.current.forEach((p) => {
      p.energy = 1.0;
      p.vx += (Math.random() - 0.5) * 6;
      p.vy += (Math.random() - 0.5) * 6;
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* 1. CHROMATIC VOLUMETRIC AURORA LIGHT BLOBS */}
      <div className="absolute -top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#5145CD]/18 via-[#818CF8]/14 to-transparent blur-[110px] animate-pulse duration-[7000ms] pointer-events-none" />
      <div className="absolute top-[20%] right-[5%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-[#38BDF8]/15 via-[#6366F1]/12 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[400px] rounded-full bg-gradient-to-t from-[#8B5CF6]/14 via-[#C7D2FE]/10 to-transparent blur-[100px] pointer-events-none" />

      {/* 2. SUBTLE ARCHITECTURAL CYBER-GRID OVERLAY */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
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

      {/* 4. INTERACTIVE LIVE HUD CONTROLLER BADGE (POINTER EVENTS ENABLED) */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E5E7EB] shadow-md text-xs transition-all hover:shadow-lg">
          {/* Live Pulsing Status Pill */}
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

          {/* Quick Energy Shockwave Trigger */}
          <button
            type="button"
            onClick={triggerQuantumShockwave}
            className="p-1.5 rounded-full hover:bg-[#F1F3F5] text-[#667085] hover:text-[#5145CD] transition-colors cursor-pointer"
            title="Trigger Neural Energy Pulse"
            aria-label="Trigger pulse"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>

          {/* Expanded Mode Controls Popup */}
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
                💡 Click anywhere to pulse
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}