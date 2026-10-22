'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { Palette, Plus, Check, Trash2, Sparkles, Sliders } from 'lucide-react';

export default function BrandKitPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [brandName, setBrandName] = useState('Fluvia Flow Signature Brand');
  const [colors, setColors] = useState<string[]>(['#0B0C10', '#8B5CF6', '#38BDF8', '#FFFFFF']);
  const [fonts, setFonts] = useState<string[]>(['Inter', 'Outfit', 'Cinzel']);
  const [guidelines, setGuidelines] = useState(
    'Modern, high-energy tech visual aesthetic with violet rim lighting, quick 3-second kinetic cuts, and punchy value-oriented copywriting.'
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
    const defaultColor = '#EC4899';
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
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div
      className="min-h-screen flex transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text-primary)',
      }}
    >
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
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
              <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
                <Palette className="w-4 h-4" />
                <span>Brand Identity</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Brand Kit</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Lock your company typography, palette, and stylistic guidelines across all AI video workflows.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 shrink-0"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved to Studio' : 'Save Brand Kit'}</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6 text-xs">
            {/* Brand Name */}
            <div>
              <label className="block text-slate-300 uppercase font-semibold mb-2">Brand Identifier</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#0E1017] text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>

            {/* Brand Palette */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-300 uppercase font-semibold">Color Palette</label>
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Color</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-[#0E1017] border border-white/10">
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shrink-0"
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
                      className="bg-transparent text-white font-mono text-xs w-20 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(i)}
                      className="text-slate-500 hover:text-rose-400"
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
                    className="px-3 py-1.5 rounded-lg bg-[#0E1017] border border-white/10 text-white font-mono"
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
                className="w-full bg-[#0E1017] text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-xs resize-none leading-relaxed"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                These directives are automatically injected into generation prompts when generating branded commercials.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
