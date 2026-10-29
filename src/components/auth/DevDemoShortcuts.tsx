'use client';

import React from 'react';
import { Sparkles, User, ShieldCheck } from 'lucide-react';

interface DevDemoShortcutsProps {
  onFill: (email: string, pass: string) => void;
}

export function DevDemoShortcuts({ onFill }: DevDemoShortcutsProps) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDemoMode && !isDev) {
    return null;
  }

  return (
    <div className="mt-5 p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs shadow-2xs text-[#17191D]">
      <div className="flex items-center justify-between gap-1.5 font-semibold text-[#17191D] mb-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
          <span>Quick Demo Access (1-Click Fill):</span>
        </div>
        <span className="text-[10px] font-mono text-[#5145CD] bg-[#5145CD]/10 px-2 py-0.5 rounded-full border border-[#5145CD]/20">
          Demo Mode
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onFill('creator@fluviaflow.ai', 'Demo1234!')}
          className="py-2 px-2.5 bg-white hover:bg-slate-50 text-[#17191D] rounded-lg border border-[#E5E7EB] hover:border-[#5145CD]/40 font-medium transition-all flex items-center justify-center gap-1.5 text-center text-xs shadow-2xs cursor-pointer group"
        >
          <User className="w-3.5 h-3.5 text-[#5145CD] group-hover:scale-105 transition-transform" />
          <span>Creator Demo</span>
        </button>

        <button
          type="button"
          onClick={() => onFill('admin@fluviaflow.ai', 'Admin1234!')}
          className="py-2 px-2.5 bg-white hover:bg-slate-50 text-[#17191D] rounded-lg border border-[#E5E7EB] hover:border-[#5145CD]/40 font-medium transition-all flex items-center justify-center gap-1.5 text-center text-xs shadow-2xs cursor-pointer group"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-105 transition-transform" />
          <span>Admin Master</span>
        </button>
      </div>

      <div className="mt-2 text-[10px] text-[#667085] flex items-center justify-center gap-2">
        <span>Password: <code className="font-mono text-[#17191D] bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB]">Demo1234!</code> / <code className="font-mono text-[#17191D] bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB]">Admin1234!</code></span>
      </div>
    </div>
  );
}
