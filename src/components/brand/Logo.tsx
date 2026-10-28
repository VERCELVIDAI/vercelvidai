'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND } from '@/lib/brand';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  showTagline?: boolean;
}

export function Logo({ className = '', size = 'md', href = '/', showTagline = false }: LogoProps) {
  const iconSizes = {
    sm: 'w-6 h-6 sm:w-7 sm:h-7',
    md: 'w-7 h-7 sm:w-8 sm:h-8',
    lg: 'w-9 h-9 sm:w-10 sm:h-10',
    xl: 'w-11 h-11 sm:w-12 sm:h-12',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-[15px] sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
  };

  const content = (
    <div className={`flex items-center gap-2 sm:gap-2.5 group select-none cursor-pointer shrink-0 min-w-0 ${className}`}>
      {/* Whisk Flow Studio Mark */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-tr from-[#F05BCE] via-[#E046BD] to-[#C026D3] p-[1px] shadow-lg shadow-[#F05BCE]/20 group-hover:shadow-[#F05BCE]/40 group-hover:scale-105 transition-all duration-300 ease-out`}
      >
        <div className="w-full h-full bg-[#211522] rounded-[11px] flex items-center justify-center relative overflow-hidden border border-[#39233B]">
          {/* Subtle Ambient Lens Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F05BCE]/20 via-transparent to-[#C026D3]/20 opacity-80 group-hover:opacity-100 transition-opacity" />

          {/* Cinematic Shutter / K-Facet Studio Mark */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5 relative z-10"
          >
            <defs>
              <linearGradient id="klingPrimaryGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F05BCE" />
                <stop offset="0.5" stopColor="#E046BD" />
                <stop offset="1" stopColor="#C026D3" />
              </linearGradient>
            </defs>

            {/* Left Vertical Blade */}
            <path
              d="M8 7C8 6.44772 8.44772 6 9 6H12C12.5523 6 13 6.44772 13 7V25C13 25.5523 12.5523 26 12 26H9C8.44772 26 8 25.5523 8 25V7Z"
              fill="url(#klingPrimaryGrad)"
            />

            {/* Top Right Angular Shutter Blade */}
            <path
              d="M16 16L23.2 7.6C23.6 7.1 24.4 7.4 24.4 8V11C24.4 11.5 24.1 12 23.7 12.4L18.8 17.5L16 16Z"
              fill="url(#klingPrimaryGrad)"
              fillOpacity="0.85"
            />

            {/* Bottom Right Angular Shutter Blade */}
            <path
              d="M16 16L23.7 24.6C24.1 25 24.4 25.5 24.4 26V25C24.4 24.4 23.6 24 23.2 23.5L16 16Z"
              fill="url(#klingPrimaryGrad)"
              fillOpacity="0.95"
            />

            {/* Glowing Core Dot */}
            <circle cx="15.5" cy="16" r="2" fill="#F05BCE" />
          </svg>
        </div>
      </div>

      {/* Typography: Rose White Wordmark with Hot Pink Accent */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none gap-1.5">
          <span className={`font-black text-[#F5EAF4] tracking-tight ${textSizes[size]}`}>
            WHISK
          </span>
          <span className={`font-light text-[#F05BCE] tracking-wider ${textSizes[size]}`}>
            FLOW
          </span>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#F05BCE]/15 text-[#F05BCE] border border-[#F05BCE]/30 uppercase tracking-widest">
            STUDIO
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-medium tracking-wide text-[#A99AAA] mt-1">
            {BRAND.tagline}
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
