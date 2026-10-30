'use client';

import React from 'react';

interface AnimatedCheckmarkProps {
  size?: number;
  className?: string;
}

export function AnimatedCheckmark({ size = 64, className = '' }: AnimatedCheckmarkProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 shadow-xs transition-transform ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-600"
      >
        <path
          d="M20 6L9 17l-5-5"
          style={{
            strokeDasharray: 30,
            strokeDashoffset: 0,
            animation: 'fluvia-check-draw 0.75s cubic-bezier(0.65, 0, 0.45, 1) forwards',
          }}
        />
      </svg>

      <style jsx global>{`
        @keyframes fluvia-check-draw {
          0% {
            stroke-dashoffset: 30;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
