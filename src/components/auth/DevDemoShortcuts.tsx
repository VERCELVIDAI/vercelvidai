'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface DevDemoShortcutsProps {
  onFill: (email: string, pass: string) => void;
}

export function DevDemoShortcuts({ onFill }: DevDemoShortcutsProps) {
  // Only render if explicitly running in development mode AND NEXT_PUBLIC_DEMO_LOGIN === 'true'
  const isDev = process.env.NODE_ENV === 'development';
  const isDemoLoginEnabled = process.env.NEXT_PUBLIC_DEMO_LOGIN === 'true';

  if (!isDev || !isDemoLoginEnabled) {
    return null;
  }

  return (
    <div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-500/20 text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-emerald-800 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>Development Demo Shortcuts:</span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onFill('creator@vidai.io', 'Demo1234!')}
          className="flex-1 py-1 px-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg border border-emerald-300 font-medium transition-colors text-center text-[11px] cursor-pointer"
        >
          Dev Creator
        </button>
        <button
          type="button"
          onClick={() => onFill('admin@vidai.io', 'Admin1234!')}
          className="flex-1 py-1 px-2 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-lg border border-pink-300 font-medium transition-colors text-center text-[11px] cursor-pointer"
        >
          Dev Admin
        </button>
      </div>
    </div>
  );
}
