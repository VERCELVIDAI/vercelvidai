"use client";

import React, { useMemo } from "react";

interface DevotionalParticlesProps {
  count?: number;
  className?: string;
}

export function DevotionalParticles({ count = 14, className = "" }: DevotionalParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 100) / count + (Math.sin(i * 99) * 4 + 2)}%`,
      top: `${60 + (i % 5) * 8}%`,
      size: `${3 + (i % 4) * 2}px`,
      duration: `${4.5 + (i % 4) * 1.5}s`,
      delay: `${(i * 0.45).toFixed(2)}s`,
      opacity: (0.4 + (i % 3) * 0.2).toFixed(2),
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-gradient-to-t from-amber-400 to-yellow-200 animate-diya-float shadow-[0_0_8px_rgba(245,158,11,0.8)]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: Number(p.opacity),
          }}
        />
      ))}
    </div>
  );
}
