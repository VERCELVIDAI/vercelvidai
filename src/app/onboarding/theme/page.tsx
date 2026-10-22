'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { useTheme } from '@/components/theme/ThemeContext';
import { COLOR_THEMES, ColorTheme, ThemeTone, ThemeMode } from '@/lib/themes';
import { ThemeCard } from '@/components/theme/ThemeCard';
import { MiniStudioPreview } from '@/components/theme/MiniStudioPreview';
import {
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
  Check,
  Palette,
  Flame,
  Layers,
} from 'lucide-react';

function ThemeSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  const {
    colorTheme,
    themeDetails,
    mode,
    resolvedMode,
    setColorTheme,
    setMode,
    markCompleted,
  } = useTheme();

  const [activeTone, setActiveTone] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const filteredThemes = COLOR_THEMES.filter((t) => {
    if (activeTone === 'all') return true;
    return t.tone === activeTone;
  });

  const handleSelectTheme = (theme: ColorTheme) => {
    setColorTheme(theme.id);
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      await markCompleted();
      router.push(returnUrl);
    } catch (e) {
      router.push('/dashboard');
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      setColorTheme('midnight-violet', true);
      await markCompleted();
      router.push(returnUrl);
    } catch (e) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b" style={{ borderColor: 'var(--app-card-border)' }}>
          <Logo size="md" />

          {/* Mode Switcher (Dark / Light / System) */}
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl flex items-center gap-1 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-card-border)' }}>
              <button
                type="button"
                onClick={() => setMode('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  mode === 'dark' ? 'text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: mode === 'dark' ? 'var(--app-primary)' : 'transparent',
                }}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  mode === 'light' ? 'text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: mode === 'light' ? 'var(--app-primary)' : 'transparent',
                }}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('system')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  mode === 'system' ? 'text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: mode === 'system' ? 'var(--app-primary)' : 'transparent',
                }}
                title="System preference"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Auto</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="text-xs font-medium px-3 py-1.5 rounded-lg hover:underline transition-all"
              style={{ color: 'var(--app-text-muted)' }}
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border"
            style={{
              backgroundColor: 'var(--app-badge-bg)',
              color: 'var(--app-badge-text)',
              borderColor: 'var(--app-badge-border)',
            }}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Workspace Personalization</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--app-text-primary)' }}>
            Make Fluvia Flow Yours.
          </h1>

          <p className="mt-3 text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--app-text-secondary)' }}>
            Choose your creative workspace colors. You can change them anytime.
          </p>
        </div>

        {/* Live Miniature Studio Preview */}
        <div className="max-w-4xl mx-auto mb-12">
          <MiniStudioPreview theme={themeDetails} mode={resolvedMode} />
        </div>

        {/* Tone Filter Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold uppercase tracking-wider mr-1" style={{ color: 'var(--app-text-muted)' }}>
              Filter:
            </span>
            {[
              { id: 'all', label: 'All 10 Themes' },
              { id: 'vibrant', label: 'Vibrant' },
              { id: 'cool', label: 'Cool Tones' },
              { id: 'warm', label: 'Warm Accents' },
              { id: 'minimal', label: 'Minimalist' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveTone(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                  activeTone === f.id ? 'text-white shadow-sm' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: activeTone === f.id ? 'var(--app-primary)' : 'var(--app-surface)',
                  borderColor: 'var(--app-card-border)',
                  color: activeTone === f.id ? '#FFFFFF' : 'var(--app-text-primary)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono" style={{ color: 'var(--app-text-muted)' }}>
            Selected: <strong style={{ color: 'var(--app-text-primary)' }}>{themeDetails.name}</strong> ({resolvedMode})
          </div>
        </div>

        {/* Theme Cards Grid (10 Themes) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 mb-12">
          {filteredThemes.map((t) => (
            <ThemeCard
              key={t.id}
              theme={t}
              isSelected={colorTheme === t.id}
              activeMode={resolvedMode}
              onSelect={handleSelectTheme}
            />
          ))}
        </div>

        {/* Bottom Floating Bar */}
        <div
          className="sticky bottom-6 z-30 max-w-2xl mx-auto rounded-2xl p-4 border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--app-surface)',
            borderColor: 'var(--app-card-border)',
            boxShadow: `0 20px 40px -10px var(--app-glow)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm font-black"
              style={{ backgroundImage: 'var(--app-gradient-primary)' }}
            >
              ✓
            </div>
            <div>
              <div className="text-xs font-extrabold" style={{ color: 'var(--app-text-primary)' }}>
                {themeDetails.name} Selected
              </div>
              <div className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                Applied across your video timeline, generator & dashboard.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shrink-0"
            style={{
              backgroundImage: 'var(--app-gradient-primary)',
            }}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ThemeOnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-mono text-xs">Loading theme personalization studio...</div>}>
      <ThemeSelectionContent />
    </Suspense>
  );
}
