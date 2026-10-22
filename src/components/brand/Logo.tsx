import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export function Logo({ className = '', size = 'md', href = '/' }: LogoProps) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Custom abstract play-frame & neural motion symbol */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-sky-400 p-[1.5px] shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300`}>
        <div className="w-full h-full bg-[#090A0F] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle glowing motion waves */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-sky-500/10" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4/6 h-4/6 text-white group-hover:scale-110 transition-transform duration-300"
          >
            {/* Play-frame motion dynamic polygon */}
            <path
              d="M7.5 4.5L18.5 12L7.5 19.5V4.5Z"
              className="fill-violet-400/30 stroke-violet-400 stroke-[1.5]"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 7.5L16 12L9.5 16.5V7.5Z"
              className="fill-sky-400"
            />
            {/* Dual speed-line accents */}
            <line x1="3" y1="9" x2="5.5" y2="9" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2" y1="14" x2="5.5" y2="14" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 ${textSizes[size]}`}>
          <span>Vercel</span>
          <span className="bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
            Vidai
          </span>
        </span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
