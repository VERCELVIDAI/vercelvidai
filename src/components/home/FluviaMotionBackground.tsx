'use client';

import React from 'react';

export function FluviaMotionBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {/* Base deep space gradient */}
      <div className="absolute inset-0 bg-[#080D0B]" />

      {/* Signature Fluvia Flow Motion Ribbons */}
      {/* Primary Emerald/Teal Ribbon - Top Center/Left */}
      <div
        className="fluvia-ribbon-1 opacity-70"
        style={{
          background: 'radial-gradient(circle at 45% 40%, rgba(16, 185, 129, 0.22) 0%, rgba(4, 120, 87, 0.1) 40%, rgba(8, 13, 11, 0) 70%)',
        }}
      />

      {/* Secondary Soft Pink & Magenta Ribbon - Mid Right */}
      <div
        className="fluvia-ribbon-2 opacity-60"
        style={{
          background: 'radial-gradient(circle at 60% 45%, rgba(236, 72, 153, 0.16) 0%, rgba(219, 39, 119, 0.08) 35%, rgba(8, 13, 11, 0) 70%)',
        }}
      />

      {/* Tertiary Luminous Teal Glow - Bottom */}
      <div
        className="fluvia-ribbon-3 opacity-50"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(20, 184, 166, 0.14) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(8, 13, 11, 0) 75%)',
        }}
      />

      {/* Subtle Grid / Atmospheric Texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #10B981 1px, transparent 1px), linear-gradient(to bottom, #10B981 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Gradient mask for smooth edge fading */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080D0B]/90" />
    </div>
  );
}
