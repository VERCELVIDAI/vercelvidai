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
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const content = (
    <div className={`flex items-center gap-2.5 group select-none cursor-pointer ${className}`}>
      {/* Fluid-motion Playframe Mark */}
      <div
        className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-pink-400 p-[1.5px] shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/35 group-hover:scale-105 transition-all duration-300 ease-out`}
      >
        <div className="w-full h-full bg-white/90 backdrop-blur-md rounded-[10px] flex items-center justify-center relative overflow-hidden border border-white/60">
          {/* Luminous dynamic ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-transparent to-pink-500/15 opacity-80 group-hover:opacity-100 transition-opacity" />

          {/* Fluid Flow & Cinema Playframe Icon */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5 relative z-10"
          >
            <defs>
              <linearGradient id="fluviaEmeraldGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10B981" />
                <stop offset="0.6" stopColor="#047857" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="fluviaPinkGrad" x1="12" y1="8" x2="24" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EC4899" />
                <stop offset="1" stopColor="#F472B6" />
              </linearGradient>
            </defs>

            {/* Fluid Ribbon wave 1 (Emerald) */}
            <path
              d="M6 16C6 10.4772 10.4772 6 16 6C20.5 6 24 8.5 25.5 12C23.5 10.5 21 10 18.5 10.5C14.5 11.5 12 15 10 18.5C8.5 21.5 6 22 6 16Z"
              fill="url(#fluviaEmeraldGrad)"
              fillOpacity="0.75"
            />

            {/* Fluid Ribbon wave 2 (Pink Accent) */}
            <path
              d="M26 16C26 21.5228 21.5228 26 16 26C11.5 26 8 23.5 6.5 20C8.5 21.5 11 22 13.5 21.5C17.5 20.5 20 17 22 13.5C23.5 10.5 26 10 26 16Z"
              fill="url(#fluviaPinkGrad)"
              fillOpacity="0.75"
            />

            {/* Minimalist Cinema Play Arrow Core */}
            <polygon
              points="14,11 21,16 14,21"
              fill="#047857"
              className="drop-shadow-sm"
            />
          </svg>
        </div>
      </div>

      {/* Typography: Wordmark in Deep Forest #17211D with emerald dot */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none">
          <span className={`font-black text-[#17211D] tracking-tight ${textSizes[size]}`}>
            FLUVIA
          </span>
          <span className={`font-light text-[#047857] ml-1.5 tracking-wider ${textSizes[size]}`}>
            FLOW
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1 mb-2 animate-pulse" />
        </div>
        {showTagline && (
          <span className="text-[10px] font-medium tracking-wide text-[#64748B] mt-0.5">
            {BRAND.tagline}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
