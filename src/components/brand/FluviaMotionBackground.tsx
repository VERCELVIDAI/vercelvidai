'use client';

import React from 'react';

export function FluviaMotionBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white select-none"
    >
      {/* 1. Base clean white canvas with subtle gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F0FDF4]/50" />

      {/* 2. Fluid Ambient Emerald Ribbon 1 (Top Left to Center) */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full blur-[100px] opacity-40 animate-flow-ribbon"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.28) 0%, rgba(209,250,229,0.35) 45%, rgba(255,255,255,0) 75%)',
          willChange: 'transform',
        }}
      />

      {/* 3. Fluid Soft Pink Ambient Field (Top Right to Middle) */}
      <div
        className="absolute -top-[10%] -right-[15%] w-[60vw] h-[60vw] max-w-[850px] max-h-[850px] rounded-full blur-[110px] opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(244,114,182,0.22) 0%, rgba(252,231,243,0.45) 50%, rgba(255,255,255,0) 75%)',
          animation: 'flow-ribbon 28s ease-in-out infinite reverse',
          willChange: 'transform',
        }}
      />

      {/* 4. Fluid Mint Liquid-Glass Ribbon (Center to Bottom Left) */}
      <div
        className="absolute top-[40%] -left-[15%] w-[70vw] h-[55vw] max-w-[950px] max-h-[750px] rounded-[40%] blur-[120px] opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.20) 0%, rgba(209,250,229,0.3) 50%, rgba(255,255,255,0) 80%)',
          animation: 'float-slow 14s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* 5. Delicate Soft Rose Highlight (Bottom Right) */}
      <div
        className="absolute -bottom-[15%] right-[5%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full blur-[100px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, rgba(255,241,247,0.5) 55%, rgba(255,255,255,0) 80%)',
          animation: 'float-slow 18s ease-in-out infinite reverse',
          willChange: 'transform',
        }}
      />

      {/* 6. Subtle Micro-dot Mesh for Organic Cinematic Texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#047857 0.75px, transparent 0.75px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
