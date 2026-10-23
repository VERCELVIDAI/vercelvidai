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
    <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-pink-50/40 border border-emerald-500/20 text-xs shadow-xs">
      <div className="flex items-center justify-between gap-1.5 font-bold text-[#17211D] mb-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Quick Demo Access (1-Click Fill):</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded-full border border-emerald-300">
          Demo Mode
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onFill('creator@fluviaflow.ai', 'Demo1234!')}
          className="py-2 px-2.5 bg-white hover:bg-emerald-50 text-[#17211D] rounded-xl border border-emerald-500/25 hover:border-emerald-500/50 font-semibold transition-all flex items-center justify-center gap-1.5 text-center text-xs shadow-2xs cursor-pointer group"
        >
          <User className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span>Creator Demo</span>
        </button>

        <button
          type="button"
          onClick={() => onFill('admin@fluviaflow.ai', 'Admin1234!')}
          className="py-2 px-2.5 bg-white hover:bg-pink-50 text-[#17211D] rounded-xl border border-pink-500/25 hover:border-pink-500/50 font-semibold transition-all flex items-center justify-center gap-1.5 text-center text-xs shadow-2xs cursor-pointer group"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-pink-600 group-hover:scale-110 transition-transform" />
          <span>Admin Master</span>
        </button>
      </div>

      <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-center gap-2">
        <span>Password: <code className="font-mono text-slate-700 bg-slate-100 px-1 rounded">Demo1234!</code> / <code className="font-mono text-slate-700 bg-slate-100 px-1 rounded">Admin1234!</code></span>
      </div>
    </div>
  );
}
