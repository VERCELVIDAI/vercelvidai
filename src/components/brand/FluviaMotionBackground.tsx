'use client';

import React from 'react';

export function FluviaMotionBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#100A12] select-none"
    >
      {/* 1. Base Midnight Plum Canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#100A12] via-[#170E1A] to-[#100A12]" />

      {/* 2. Top-Center Hot Pink Ambient Flare */}
      <div
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vw] max-w-[1100px] max-h-[700px] rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(240,91,206,0.25) 0%, rgba(192,38,211,0.12) 50%, rgba(16,10,18,0) 80%)',
          willChange: 'transform',
        }}
      />

      {/* 3. Subtle Velvet Plum Rim (Top Right) */}
      <div
        className="absolute top-[10%] -right-[15%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] rounded-full blur-[130px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(57,35,59,0.5) 0%, rgba(240,91,206,0.06) 50%, rgba(16,10,18,0) 80%)',
          willChange: 'transform',
        }}
      />

      {/* 4. Deep Violet-Plum Glow (Bottom Left) */}
      <div
        className="absolute bottom-[5%] -left-[10%] w-[50vw] h-[50vw] max-w-[750px] max-h-[750px] rounded-full blur-[140px] opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(162,28,175,0.2) 0%, rgba(16,10,18,0) 75%)',
          willChange: 'transform',
        }}
      />

      {/* 5. Minimalist Velvet Grain / Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(rgba(245,234,244,0.4) 0.75px, transparent 0.75px)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
