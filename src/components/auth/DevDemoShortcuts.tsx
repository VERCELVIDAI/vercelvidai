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
    <div className="mt-4 p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-violet-400 mb-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Development Only Shortcuts:</span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onFill('creator@vidai.io', 'Demo1234!')}
          className="flex-1 py-1 px-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 rounded border border-violet-500/20 font-medium transition-colors text-center text-[11px]"
        >
          Dev Creator
        </button>
        <button
          type="button"
          onClick={() => onFill('admin@vidai.io', 'Admin1234!')}
          className="flex-1 py-1 px-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/20 font-medium transition-colors text-center text-[11px]"
        >
          Dev Admin
        </button>
      </div>
    </div>
  );
}
