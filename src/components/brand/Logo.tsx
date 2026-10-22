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
        className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-violet-500/25 group-hover:shadow-cyan-400/30 group-hover:scale-105 transition-all duration-300 ease-out`}
      >
        <div className="w-full h-full bg-[#090A10] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Luminous dynamic background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-400/20 opacity-70 group-hover:opacity-100 transition-opacity" />
          
          {/* Fluid Flow & Cinema Playframe Icon */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5 relative z-10"
          >
            <defs>
              <linearGradient id="fluviaGrad1" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" />
                <stop offset="0.5" stopColor="#6366F1" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="fluviaGrad2" x1="12" y1="8" x2="24" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#C084FC" />
              </linearGradient>
            </defs>

            {/* Fluid Ribbon wave 1 */}
            <path
              d="M6 16C6 10.4772 10.4772 6 16 6C20.5 6 24 8.5 25.5 12C23.5 10.5 21 10 18.5 10.5C14.5 11.5 12 15 10 18.5C8.5 21.5 6 22 6 16Z"
              fill="url(#fluviaGrad1)"
              fillOpacity="0.4"
            />
            
            {/* Fluid Ribbon wave 2 */}
            <path
              d="M26 16C26 21.5228 21.5228 26 16 26C11.5 26 8 23.5 6.5 20C8.5 21.5 11 22 13.5 21.5C17.5 20.5 20 17 22 13.5C23.5 10.5 26 10 26 16Z"
              fill="url(#fluviaGrad1)"
              fillOpacity="0.6"
            />

            {/* Central Precision Play Aperture */}
            <path
              d="M13 10.8C13 9.94828 13.9355 9.42777 14.6582 9.87358L22.2883 14.5736C22.9774 14.9984 22.9774 16.0016 22.2883 16.4264L14.6582 21.1264C13.9355 21.5722 13 21.0517 13 20.2V10.8Z"
              fill="url(#fluviaGrad2)"
            />

            {/* Radiant core spark */}
            <circle cx="16" cy="16" r="1.5" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Fluvia Flow Wordmark */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-tight flex items-center gap-1.5 ${textSizes[size]}`}>
          <span className="text-slate-900 dark:text-white uppercase tracking-wider font-sans">
            Fluvia
          </span>
          <span className="bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider font-sans">
            Flow
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-zinc-400 font-medium">
            {BRAND.tagline}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
