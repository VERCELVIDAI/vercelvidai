'use client';

import React from 'react';
import { Sparkles, User, ShieldCheck } from 'lucide-react';

interface DevDemoShortcutsProps {
  onFill: (email: string, pass: string) => void;
}

export function DevDemoShortcuts({ onFill }: DevDemoShortcutsProps) {
  // Always render in demo mode or development
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDemoMode && !isDev) {
    return null;
  }

  return (
    <div className="mt-5 p-3.5 rounded-2xl bg-[#11131A] border border-white/8 text-xs shadow-xs text-white">
      <div className="flex items-center justify-between gap-1.5 font-bold text-white mb-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick Demo Access (1-Click Fill):</span>
        </div>
        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
          Demo Mode
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onFill('creator@fluviaflow.ai', 'Demo1234!')}
          className="py-2 px-2.5 bg-[#151822] hover:bg-[#1C202C] text-white rounded-xl border border-white/10 hover:border-indigo-500/40 font-semibold transition-all flex items-center justify-center gap-1.5 text-center text-xs shadow-2xs cursor-pointer group"
        >
          <User className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>Creator Demo</span>
        </button>

        <button
          type="button"
          onClick={() => onFill('admin@fluviaflow.ai', 'Admin1234!')}
          className="py-2 px-2.5 bg-[#151822] hover:bg-[#1C202C] text-white rounded-xl border border-white/10 hover:border-violet-500/40 font-semibold transition-all flex items-center justify-center gap-1.5 text-center text-xs shadow-2xs cursor-pointer group"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
          <span>Admin Master</span>
        </button>
      </div>

      <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-center gap-2">
        <span>Password: <code className="font-mono text-slate-200 bg-black/40 px-1 py-0.5 rounded border border-white/8">Demo1234!</code> / <code className="font-mono text-slate-200 bg-black/40 px-1 py-0.5 rounded border border-white/8">Admin1234!</code></span>
      </div>
    </div>
  );
}
