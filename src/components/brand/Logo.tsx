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
      {/* Fluvia Flow Studio Mark (Business Indigo) */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 rounded-xl bg-[#5145CD] p-[1px] shadow-sm group-hover:bg-[#4338CA] transition-all duration-200 ease-out`}
      >
        <div className="w-full h-full bg-[#5145CD] rounded-[11px] flex items-center justify-center relative overflow-hidden text-white">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5 relative z-10"
          >
            {/* Left Vertical Bar */}
            <rect x="7" y="6" width="5" height="20" rx="2" fill="#FFFFFF" />
            {/* Top Branch */}
            <path
              d="M16 16L23.2 8.5C23.6 8 24.5 8.3 24.5 9V12C24.5 12.5 24.2 13 23.8 13.4L18.8 17.5L16 16Z"
              fill="#FFFFFF"
              fillOpacity="0.9"
            />
            {/* Bottom Branch */}
            <path
              d="M16 16L23.8 23.6C24.2 24 24.5 24.5 24.5 25V24C24.5 23.3 23.6 23 23.2 22.5L16 16Z"
              fill="#FFFFFF"
              fillOpacity="0.9"
            />
            {/* Center Dynamic Core */}
            <circle cx="15.5" cy="16" r="2" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Typography: Charcoal Wordmark with Deep Indigo Studio Tag */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none gap-1.5">
          <span className={`font-extrabold text-[#17191D] tracking-tight ${textSizes[size]}`}>
            FLUVIA
          </span>
          <span className={`font-semibold text-[#5145CD] tracking-tight ${textSizes[size]}`}>
            FLOW
          </span>
          <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE] uppercase tracking-wider">
            AI ADS
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-medium tracking-normal text-[#667085] mt-0.5">
            AI Ad Creation Studio
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
