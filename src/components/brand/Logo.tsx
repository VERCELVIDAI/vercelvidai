'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  showTagline?: boolean;
}

export function Logo({ className = '', size = 'md', href = '/', showTagline = false }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const badgeSizes = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
    xl: 'text-xs px-3 py-1',
  };

  const content = (
    <div className={`flex items-center gap-2.5 group select-none cursor-pointer shrink-0 min-w-0 ${className}`}>
      {/* Dynamic FLUVIA FLOW Kinetic Monogram */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-[#5145CD] via-[#4338CA] to-[#312E81] p-[1.5px] shadow-sm group-hover:shadow-md group-hover:scale-[1.03] transition-all duration-200 ease-out`}
      >
        <div className="w-full h-full bg-[#5145CD] rounded-[10.5px] flex items-center justify-center relative overflow-hidden text-white">
          {/* Subtle Ambient Light Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 pointer-events-none" />

          {/* Precision SVG Kinetic Stream Emblem */}
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[72%] h-[72%] relative z-10"
          >
            {/* Primary Fluid Spine (Vertical curved stem) */}
            <path
              d="M9.5 7.5C8.39543 7.5 7.5 8.39543 7.5 9.5V26.5C7.5 27.6046 8.39543 28.5 9.5 28.5H11.5C12.6046 28.5 13.5 27.6046 13.5 26.5V19.5H18.5C19.6046 19.5 20.5 18.6046 20.5 17.5C20.5 16.3954 19.6046 15.5 18.5 15.5H13.5V11.5H25.5C26.6046 11.5 27.5 10.6046 27.5 9.5C27.5 8.39543 26.6046 7.5 25.5 7.5H9.5Z"
              fill="#FFFFFF"
            />
            {/* Upper Flow Ribbon Swoosh */}
            <path
              d="M17.5 7.5C22.5 7.5 27.5 10.5 28.5 15.5C25.5 14 21 14 17.5 15.5V7.5Z"
              fill="#FFFFFF"
              fillOpacity="0.45"
            />
            {/* Kinetic Video Frame Ray / Lens Accent */}
            <circle
              cx="26"
              cy="23"
              r="3.25"
              fill="#FFFFFF"
            />
            <path
              d="M24.75 21.75L27.75 23L24.75 24.25V21.75Z"
              fill="#5145CD"
            />
          </svg>
        </div>
      </div>

      {/* Typography: Balanced Grotesque Wordmark + AI Studio Tag */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center tracking-tight leading-none gap-1.5">
          <span className={`font-black text-[#17191D] tracking-[-0.03em] ${textSizes[size]}`}>
            FLUVIA
          </span>
          <span className={`font-semibold text-[#5145CD] tracking-[-0.03em] ${textSizes[size]}`}>
            FLOW
          </span>
          <span className={`font-mono font-bold rounded-md bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF] uppercase tracking-wider ${badgeSizes[size]}`}>
            AI STUDIO
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium tracking-normal text-[#667085] mt-1">
            AI Ad Creation & Creative Production
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
