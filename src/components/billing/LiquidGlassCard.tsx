'use client';

import React, { useRef, useState, useEffect } from 'react';

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  tiltMax?: number;
  glowOpacity?: number;
}

export function LiquidGlassCard({
  children,
  className = '',
  interactive = true,
  tiltMax = 3.5,
  glowOpacity = 0.6,
  ...props
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMotionSafe, setIsMotionSafe] = useState(true);

  useEffect(() => {
    // Check if user prefers reduced motion or is on touch device
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsMotionSafe(!prefersReduced && !isTouch && interactive);
  }, [interactive]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMotionSafe || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Calculate normalized position (-1 to 1)
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    // Subtle 3D tilt: mouse up tilts card back (negative X rot), mouse right tilts card right (positive Y rot)
    setRotation({
      x: -normY * tiltMax,
      y: normX * tiltMax,
    });
  };

  const handleMouseEnter = () => {
    if (isMotionSafe) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos(null);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isMotionSafe && isHovered
          ? `perspective(1200px) rotateX(${rotation.x.toFixed(2)}deg) rotateY(${rotation.y.toFixed(2)}deg) translateZ(2px)`
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: isHovered ? 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)' : 'transform 0.45s cubic-bezier(0.2, 0, 0, 1)',
      }}
      className={`relative rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_rgba(81,69,205,0.06),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden ${className}`}
      {...props}
    >
      {/* Specular Liquid Glass Highlight overlay following cursor */}
      {isMotionSafe && mousePos && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, ${glowOpacity}), rgba(238, 242, 255, 0.25) 35%, transparent 70%)`,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Subtle edge refraction highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/60 z-10" />

      {/* Card Content */}
      <div className="relative z-0">{children}</div>
    </div>
  );
}
