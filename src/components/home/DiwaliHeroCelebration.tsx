'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Flame, Zap } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  friction: number;
  isSpark: boolean;
  flickerSpeed: number;
  phase: number;
}

interface CrackerShockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export function DiwaliHeroCelebration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [diyaLit, setDiyaLit] = useState(true);

  // Particles & Animations
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<CrackerShockwave[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const lastSpawnTimeRef = useRef(0);

  // Diwali festive palette: Radiant Gold, Saffron, Vermillion, Magenta, Emerald, Spark White
  const diwaliPalette = [
    '#F59E0B', // Saffron Gold
    '#FBBF24', // Warm Amber
    '#EF4444', // Festive Vermillion
    '#EC4899', // Gulal Pink
    '#10B981', // Emerald
    '#8B5CF6', // Royal Violet
    '#FEF08A', // Brilliant Yellow
    '#FFFFFF', // Spark White
  ];

  // Spawn sparkler trail on mouse movement (Phuljhadi effect)
  const spawnSparklerTrail = useCallback((x: number, y: number, count = 3) => {
    if (!particlesEnabled) return;
    const particles = particlesRef.current;
    if (particles.length > 200) return; // Prevent excessive load

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.5;
      const color = diwaliPalette[Math.floor(Math.random() * diwaliPalette.length)];

      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 0.8, // slight upward spark
        size: Math.random() * 3 + 1.2,
        color,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02,
        gravity: 0.06,
        friction: 0.96,
        isSpark: true,
        flickerSpeed: Math.random() * 0.3 + 0.1,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }, [particlesEnabled, diwaliPalette]);

  // Burst celebratory firecracker explosion on click (Anar / Rocket Blast)
  const spawnCrackerBurst = useCallback((x: number, y: number) => {
    if (!particlesEnabled) return;
    const particles = particlesRef.current;
    const shockwaves = shockwavesRef.current;

    // 1. Shockwave glow ring
    shockwaves.push({
      x,
      y,
      radius: 4,
      maxRadius: 45 + Math.random() * 25,
      alpha: 0.85,
      color: diwaliPalette[Math.floor(Math.random() * diwaliPalette.length)],
    });

    // 2. High-speed radial sparks (36 particles)
    const count = 38;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
      const speed = Math.random() * 5.5 + 2.0;
      const color = diwaliPalette[Math.floor(Math.random() * diwaliPalette.length)];

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color,
        alpha: 1,
        decay: Math.random() * 0.025 + 0.015,
        gravity: 0.09,
        friction: 0.94,
        isSpark: true,
        flickerSpeed: Math.random() * 0.4 + 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }, [particlesEnabled, diwaliPalette]);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas || !container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse movement listener on hero section
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        const now = performance.now();
        if (now - lastSpawnTimeRef.current > 25) {
          spawnSparklerTrail(x, y, 3);
          lastSpawnTimeRef.current = now;
        }
        lastMousePosRef.current = { x, y };
      }
    };

    // Click to blast fireworks
    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        spawnCrackerBurst(x, y);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Animation Loop
    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update shockwaves
      const shockwaves = shockwavesRef.current;
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 2.5;
        sw.alpha -= 0.04;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 2;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // Render & update sparkler & cracker particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= p.friction;
        p.vy = p.vy * p.friction + p.gravity;
        p.alpha -= p.decay;
        p.phase += p.flickerSpeed;

        if (p.alpha <= 0 || p.y > height + 20) {
          particles.splice(i, 1);
          continue;
        }

        // Sparkling twinkle alpha modulation
        const flickerAlpha = Math.max(0, p.alpha * (0.7 + 0.3 * Math.sin(p.phase)));

        ctx.save();
        ctx.globalAlpha = flickerAlpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 2.5;

        // Draw diamond spark shape for authentic Diwali firecracker sparkle
        ctx.translate(p.x, p.y);
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.4, -s * 0.4);
        ctx.lineTo(s, 0);
        ctx.lineTo(s * 0.4, s * 0.4);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.4, s * 0.4);
        ctx.lineTo(-s, 0);
        ctx.lineTo(-s * 0.4, -s * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [spawnSparklerTrail, spawnCrackerBurst]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10"
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* 1. INTERACTIVE DIWALI CRACKERS & SPARKLER CANVAS */}
      {/* ========================================================================= */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full z-20" />

      {/* ========================================================================= */}
      {/* 2. SACRED ANIMATED RANGOLI MANDALA (LEFT AMBIENT CENTERPIECE) */}
      {/* ========================================================================= */}
      <div className="absolute -top-12 -left-16 sm:-left-12 lg:-left-4 w-72 sm:w-96 lg:w-[440px] aspect-square pointer-events-none opacity-45 sm:opacity-55 hover:opacity-85 transition-opacity duration-500 z-10">
        {/* Warm Golden Radiant Aura behind Rangoli */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F59E0B]/20 via-[#EF4444]/15 to-[#EC4899]/15 blur-3xl animate-pulse" />

        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]"
        >
          <defs>
            {/* Rangoli Radial Gradients */}
            <radialGradient id="diwaliGold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.4" />
            </radialGradient>

            <radialGradient id="diwaliPetalRed" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#F97316" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0.6" />
            </radialGradient>

            <radialGradient id="diwaliLotusPink" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#881337" stopOpacity="0.4" />
            </radialGradient>

            <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            {/* Reusable Lotus Petal Symbol */}
            <path
              id="rangoli-petal"
              d="M 200,200 C 185,150 170,110 200,65 C 230,110 215,150 200,200 Z"
            />
            {/* Reusable Small Diya Symbol */}
            <g id="rangoli-diya">
              <ellipse cx="200" cy="58" rx="8" ry="4.5" fill="#B45309" stroke="#FDE047" strokeWidth="1" />
              <path
                d="M 197,55 Q 200,47 200,43 Q 200,47 203,55 Z"
                fill="url(#flameGrad)"
                className="animate-pulse"
              />
            </g>
          </defs>

          {/* LAYER 1: OUTER CLOCKWISE ROTATING MANDALA RING (36 Sacred Dots & Star Lattice) */}
          <g
            className="origin-center"
            style={{
              animation: 'spin 55s linear infinite',
              transformOrigin: '200px 200px',
            }}
          >
            {/* Outer dotted concentric circles */}
            <circle cx="200" cy="200" r="185" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.7" />
            <circle cx="200" cy="200" r="172" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
            <circle cx="200" cy="200" r="158" fill="none" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />

            {/* 16 Outer Decorative Rays */}
            {[...Array(16)].map((_, i) => (
              <g key={`ray-${i}`} transform={`rotate(${i * 22.5} 200 200)`}>
                <line x1="200" y1="158" x2="200" y2="185" stroke="#F59E0B" strokeWidth="1.2" opacity="0.85" />
                <circle cx="200" cy="185" r="2.5" fill="#FEF08A" />
              </g>
            ))}

            {/* 8 Outer Saffron Petals with Diyas */}
            {[...Array(8)].map((_, i) => (
              <g key={`outer-petal-${i}`} transform={`rotate(${i * 45} 200 200)`}>
                <use href="#rangoli-petal" fill="url(#diwaliPetalRed)" stroke="#FEF08A" strokeWidth="1" />
                <use href="#rangoli-diya" />
              </g>
            ))}
          </g>

          {/* LAYER 2: COUNTER-CLOCKWISE ROTATING SACRED LOTUS FLOWER (8 Radiant Pink Petals) */}
          <g
            className="origin-center"
            style={{
              animation: 'spin 38s linear infinite reverse',
              transformOrigin: '200px 200px',
            }}
          >
            <circle cx="200" cy="200" r="115" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />

            {[...Array(8)].map((_, i) => (
              <g key={`inner-petal-${i}`} transform={`rotate(${i * 45 + 22.5} 200 200)`}>
                <path
                  d="M 200,200 C 190,165 180,135 200,105 C 220,135 210,165 200,200 Z"
                  fill="url(#diwaliLotusPink)"
                  stroke="#FEF08A"
                  strokeWidth="1.2"
                />
                <circle cx="200" cy="115" r="2.5" fill="#FEF08A" />
              </g>
            ))}
          </g>

          {/* LAYER 3: INNER GEOMETRIC STAR CHAKRA */}
          <g
            className="origin-center"
            style={{
              animation: 'spin 22s linear infinite',
              transformOrigin: '200px 200px',
            }}
          >
            {[...Array(12)].map((_, i) => (
              <line
                key={`star-ray-${i}`}
                x1="200"
                y1="160"
                x2="200"
                y2="140"
                stroke="#FEF08A"
                strokeWidth="1.5"
                transform={`rotate(${i * 30} 200 200)`}
              />
            ))}
            <polygon
              points="200,150 209,165 226,160 216,175 226,190 209,185 200,200 191,185 174,190 184,175 174,160 191,165"
              fill="url(#diwaliGold)"
              stroke="#F59E0B"
              strokeWidth="1"
            />
          </g>

          {/* LAYER 4: GRAND CENTER DIYA WITH GLOWING FLICKERING FLAME */}
          <g transform="translate(0, 0)">
            {/* Center Brass Lamp Base */}
            <circle cx="200" cy="200" r="28" fill="#B45309" stroke="#FEF08A" strokeWidth="2" />
            <circle cx="200" cy="200" r="22" fill="#92400E" />

            {/* Glowing Sacred Oil Center */}
            <ellipse cx="200" cy="200" rx="14" ry="10" fill="#F59E0B" opacity="0.9" />

            {/* Majestic Central Diya Flame */}
            {diyaLit && (
              <g className="animate-pulse">
                {/* Flame Halo Aura */}
                <circle cx="200" cy="186" r="20" fill="#F59E0B" opacity="0.3" filter="blur(5px)" />
                {/* Animated Teardrop Flame */}
                <path
                  d="M 194,196 Q 200,172 200,165 Q 200,172 206,196 Q 200,202 194,196 Z"
                  fill="url(#flameGrad)"
                  filter="drop-shadow(0 0 8px rgba(254, 240, 138, 0.9))"
                />
                {/* Bright white-hot flame core */}
                <path
                  d="M 197,194 Q 200,178 200,174 Q 200,178 203,194 Z"
                  fill="#FFFFFF"
                />
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 3. SACRED ANIMATED RANGOLI MANDALA (RIGHT AMBIENT CENTERPIECE) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block absolute -top-16 -right-16 w-80 lg:w-[400px] aspect-square pointer-events-none opacity-45 hover:opacity-80 transition-opacity duration-500 z-10">
        <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-[#F59E0B]/20 via-[#EC4899]/15 to-[#8B5CF6]/15 blur-3xl animate-pulse" />

        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-[0_0_25px_rgba(245,158,11,0.45)]"
        >
          {/* Mirrored Counter-Rotating Rangoli */}
          <g
            className="origin-center"
            style={{
              animation: 'spin 48s linear infinite reverse',
              transformOrigin: '200px 200px',
            }}
          >
            <circle cx="200" cy="200" r="180" fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="5 5" opacity="0.7" />
            <circle cx="200" cy="200" r="160" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.6" />

            {[...Array(12)].map((_, i) => (
              <g key={`right-petal-${i}`} transform={`rotate(${i * 30} 200 200)`}>
                <path
                  d="M 200,200 C 185,150 170,110 200,65 C 230,110 215,150 200,200 Z"
                  fill="url(#diwaliPetalRed)"
                  stroke="#FEF08A"
                  strokeWidth="1"
                />
              </g>
            ))}
          </g>

          <g
            className="origin-center"
            style={{
              animation: 'spin 32s linear infinite',
              transformOrigin: '200px 200px',
            }}
          >
            {[...Array(8)].map((_, i) => (
              <g key={`right-inner-${i}`} transform={`rotate(${i * 45 + 22.5} 200 200)`}>
                <path
                  d="M 200,200 C 190,165 180,135 200,105 C 220,135 210,165 200,200 Z"
                  fill="url(#diwaliLotusPink)"
                  stroke="#FEF08A"
                  strokeWidth="1.2"
                />
              </g>
            ))}
          </g>

          {/* Center Diya Lamp */}
          <circle cx="200" cy="200" r="24" fill="#B45309" stroke="#FEF08A" strokeWidth="2" />
          <ellipse cx="200" cy="200" rx="12" ry="8" fill="#F59E0B" />
          <path
            d="M 195,196 Q 200,172 200,167 Q 200,172 205,196 Z"
            fill="url(#flameGrad)"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 4. DIWALI FESTIVE INTERACTIVE FLOATING PILL */}
      {/* ========================================================================= */}
      <div className="absolute top-4 right-4 pointer-events-auto z-30 hidden sm:flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            // Blast firecracker on demand
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              spawnCrackerBurst(rect.width * 0.5, rect.height * 0.25);
              spawnCrackerBurst(rect.width * 0.35, rect.height * 0.3);
              spawnCrackerBurst(rect.width * 0.65, rect.height * 0.3);
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white border border-[#F59E0B]/50 hover:border-[#F59E0B] text-xs font-bold text-[#B45309] shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all cursor-pointer backdrop-blur-md group"
          title="Click to burst Diwali fireworks!"
        >
          <span className="text-sm group-hover:rotate-12 transition-transform">🪔</span>
          <span>Burst Crackers!</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            ✨ Click Anywhere
          </span>
        </button>
      </div>
    </div>
  );
}
