'use client';

import React from 'react';

export function FluviaMotionBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#090A0D] select-none"
    >
      {/* 1. Base Dark Charcoal Canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090A0D] via-[#0E1015] to-[#090A0D]" />

      {/* 2. Top-Center Deep Violet/Indigo Flare (Cinema Ambience) */}
      <div
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vw] max-w-[1100px] max-h-[700px] rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.3) 0%, rgba(124,58,237,0.15) 50%, rgba(9,10,13,0) 80%)',
          willChange: 'transform',
        }}
      />

      {/* 3. Subtle Cyber Cyan Rim (Top Right) */}
      <div
        className="absolute top-[10%] -right-[15%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] rounded-full blur-[130px] opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(99,102,241,0.05) 50%, rgba(9,10,13,0) 80%)',
          willChange: 'transform',
        }}
      />

      {/* 4. Subtle Emerald Glow (Bottom Left) */}
      <div
        className="absolute bottom-[5%] -left-[10%] w-[50vw] h-[50vw] max-w-[750px] max-h-[750px] rounded-full blur-[140px] opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(9,10,13,0) 75%)',
          willChange: 'transform',
        }}
      />

      {/* 5. Minimalist Dark Grain / Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 0.75px, transparent 0.75px)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
