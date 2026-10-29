'use client';

import React from 'react';

export function FluviaMotionBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white select-none"
    >
      {/* 1. Base Crisp White Canvas */}
      <div className="absolute inset-0 bg-[#FFFFFF]" />

      {/* 2. Soft, ultra-subtle off-white gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#FAFAFC] to-[#F7F8FA]" />

      {/* 3. Extremely subtle hairline grid pattern (0.015 opacity) */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(23, 25, 29, 0.4) 0.75px, transparent 0.75px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
