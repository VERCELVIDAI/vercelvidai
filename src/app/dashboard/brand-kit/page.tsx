'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { Palette, Plus, Check, Sparkles } from 'lucide-react';

export default function BrandKitPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [brandName, setBrandName] = useState('Fluvia Flow Signature Studio Brand');
  const [colors, setColors] = useState<string[]>(['#090A0D', '#6366F1', '#7C3AED', '#06B6D4', '#F8FAFC']);
  const [fonts, setFonts] = useState<string[]>(['Inter', 'Plus Jakarta Sans', 'JetBrains Mono']);
  const [guidelines, setGuidelines] = useState(
    'Sophisticated, high-density cinematic aesthetic with near-black charcoal surfaces, restrained electric indigo accents, and crisp high-contrast monospace typography.'
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
  }, []);

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
      <div className="min-h-screen bg-[#090A0D] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden bg-[#090A0D] text-white relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#090A0D]">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
                <Palette className="w-4 h-4 text-indigo-400" />
                <span>Brand Identity</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Brand Kit</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Lock your company typography, palette, and stylistic guidelines across all AI video workflows.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 shrink-0 transition-all cursor-pointer"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>{savedSuccess ? 'Saved to Studio' : 'Save Brand Kit'}</span>
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-[#0E1015] border border-white/8 space-y-6 text-xs shadow-xl">
            {/* Brand Name */}
            <div>
              <label className="block text-slate-300 uppercase font-semibold mb-2">Brand Identifier</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#11131A] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Brand Palette */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-300 uppercase font-semibold">Color Palette</label>
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Color</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-[#11131A] border border-white/10">
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shadow-sm shrink-0"
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
                      className="bg-transparent text-white font-mono font-medium text-xs w-20 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(i)}
                      className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <label className="block text-slate-300 uppercase font-semibold mb-2">Approved Fonts</label>
              <div className="flex flex-wrap gap-2">
                {fonts.map((f, fi) => (
                  <span
                    key={fi}
                    className="px-3 py-1.5 rounded-lg bg-[#11131A] border border-white/10 text-white font-medium font-mono text-xs"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Tone of Voice Guidelines */}
            <div>
              <label className="block text-slate-300 uppercase font-semibold mb-2">Tone of Voice & Creative Directives</label>
              <textarea
                rows={4}
                value={guidelines}
                onChange={(e) => setGuidelines(e.target.value)}
                className="w-full bg-[#11131A] border border-white/10 text-white p-4 rounded-xl text-xs resize-none leading-relaxed focus:outline-none focus:border-indigo-500"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                These directives are automatically injected into generation prompts when generating branded commercials.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
