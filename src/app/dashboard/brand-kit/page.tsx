'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { Palette, Plus, Check, Sparkles } from 'lucide-react';

export default function BrandKitPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [brandName, setBrandName] = useState('Fluvia Flow Signature Brand');
  const [colors, setColors] = useState<string[]>(['#5145CD', '#17191D', '#667085', '#38BDF8', '#F7F8FA']);
  const [fonts, setFonts] = useState<string[]>(['Inter', 'Plus Jakarta Sans', 'JetBrains Mono']);
  const [guidelines, setGuidelines] = useState(
    'High-converting commercial aesthetic with clean white surfaces, restrained deep indigo accents, crisp typography, and photorealistic product staging.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d) router.push('/login');
        else setData(d);
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleAddColor = () => {
    const defaultColor = '#10B981';
    if (!colors.includes(defaultColor)) {
      setColors([...colors, defaultColor]);
    }
  };

  const handleRemoveColor = (idx: number) => {
    setColors(colors.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Loading brand kit guidelines...</span>
        </div>
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-[#070A0F] text-white relative selection:bg-[#d4ff00] selection:text-black">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden relative bg-[#070A0F] pb-24 md:pb-6">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 shadow-2xl backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2 text-violet-400 font-black text-xs uppercase tracking-wider mb-1 font-mono">
                <Palette className="w-4 h-4 text-violet-400" />
                <span>Brand Identity</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Brand Kit & Guidelines</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Lock your company typography, palette, and stylistic guidelines across all AI video workflows.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.35)] shrink-0 transition-all cursor-pointer self-start sm:self-auto border border-violet-400/30"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-[#d4ff00]" /> : <Sparkles className="w-4 h-4 text-[#d4ff00]" />}
              <span>{savedSuccess ? 'Saved to Studio' : 'Save Brand Kit'}</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 space-y-6 text-xs shadow-2xl">
            {/* Brand Name */}
            <div>
              <label className="block text-white uppercase font-black text-[11px] tracking-wider mb-2">
                Brand Identifier
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#141A26] border border-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Brand Palette */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-white uppercase font-black text-[11px] tracking-wider">
                  Color Palette
                </label>
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Color</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-[#141A26] border border-slate-800">
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shadow-xs shrink-0"
                      style={{ backgroundColor: c }}
                    />
                    <input
                      type="text"
                      value={c}
                      onChange={(e) => {
                        const updated = [...colors];
                        updated[i] = e.target.value;
                        setColors(updated);
                      }}
                      className="bg-transparent text-white font-mono font-bold text-xs w-20 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(i)}
                      className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <label className="block text-white uppercase font-black text-[11px] tracking-wider mb-2">
                Approved Fonts
              </label>
              <div className="flex flex-wrap gap-2">
                {fonts.map((f, fi) => (
                  <span
                    key={fi}
                    className="px-3 py-1.5 rounded-lg bg-[#141A26] border border-slate-800 text-slate-300 font-bold font-mono text-xs"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Tone of Voice Guidelines */}
            <div>
              <label className="block text-white uppercase font-black text-[11px] tracking-wider mb-2">
                Tone of Voice & Creative Directives
              </label>
              <textarea
                rows={4}
                value={guidelines}
                onChange={(e) => setGuidelines(e.target.value)}
                className="w-full bg-[#141A26] border border-slate-800 text-white p-3.5 rounded-xl text-xs resize-none leading-relaxed focus:outline-none focus:border-violet-500 placeholder:text-slate-500 font-medium"
              />
              <p className="mt-1.5 text-[11px] text-slate-400">
                These directives are automatically injected into prompts when generating branded commercial videos.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}