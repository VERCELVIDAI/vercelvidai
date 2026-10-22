'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { useTheme } from '@/components/theme/ThemeContext';
import { COLOR_THEMES, ColorTheme, ThemeTone } from '@/lib/themes';
import { ThemeCard } from '@/components/theme/ThemeCard';
import { MiniStudioPreview } from '@/components/theme/MiniStudioPreview';
import {
  Palette,
  Sun,
  Moon,
  Laptop,
  Check,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export default function AppearanceSettingsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeTone, setActiveTone] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);

  const {
    colorTheme,
    themeDetails,
    mode,
    resolvedMode,
    setColorTheme,
    setMode,
    resetToDefault,
  } = useTheme();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d) router.push('/login');
        else setUserData(d);
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSelectTheme = (theme: ColorTheme) => {
    setColorTheme(theme.id);
    showToast(`Switched workspace theme to ${theme.name}`);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colorTheme, mode, completed: true }),
      });
      if (res.ok) {
        showToast('Appearance preferences saved to your account.');
      } else {
        throw new Error('Could not save theme preference');
      }
    } catch (e: any) {
      showToast('Preference updated locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    resetToDefault();
    showToast('Reset to default Midnight Violet theme.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-xs" style={{ backgroundColor: 'var(--app-bg)', color: 'var(--app-text-muted)' }}>
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = userData?.user || {};
  const credits = userData?.credits || { availableBalance: 0, reservedBalance: 0 };

  const filteredThemes = COLOR_THEMES.filter((t) => {
    if (activeTone === 'all') return true;
    return t.tone === activeTone;
  });

  return (
    <div className="min-h-screen flex transition-colors duration-200" style={{ backgroundColor: 'var(--app-bg)', color: 'var(--app-text-primary)' }}>
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={userData?.workspace?.name}
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/settings"
                className="text-xs font-semibold hover:underline flex items-center gap-1"
                style={{ color: 'var(--app-text-muted)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Account Settings</span>
              </Link>
              <span style={{ color: 'var(--app-card-border)' }}>/</span>
              <span className="text-xs font-bold" style={{ color: 'var(--app-primary)' }}>
                Appearance & Workspace Themes
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors"
                style={{
                  backgroundColor: 'var(--app-card)',
                  borderColor: 'var(--app-card-border)',
                  color: 'var(--app-text-secondary)',
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 transition-all"
                style={{
                  backgroundImage: 'var(--app-gradient-primary)',
                }}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Theme'}</span>
              </button>
            </div>
          </div>

          {/* Heading */}
          <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-card-border)' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border"
                  style={{
                    backgroundColor: 'var(--app-badge-bg)',
                    color: 'var(--app-badge-text)',
                    borderColor: 'var(--app-badge-border)',
                  }}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Color Personalization</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--app-text-primary)' }}>
                  Workspace Appearance
                </h1>
                <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                  Customize your video creation studio with bespoke accent palettes and light/dark modes.
                </p>
              </div>

              {/* Mode Switcher */}
              <div
                className="p-1 rounded-xl flex items-center gap-1 border shrink-0"
                style={{
                  backgroundColor: 'var(--app-surface)',
                  borderColor: 'var(--app-card-border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setMode('dark')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    mode === 'dark' ? 'text-white shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: mode === 'dark' ? 'var(--app-primary)' : 'transparent',
                    color: mode === 'dark' ? '#FFFFFF' : 'var(--app-text-primary)',
                  }}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('light')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    mode === 'light' ? 'text-white shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: mode === 'light' ? 'var(--app-primary)' : 'transparent',
                    color: mode === 'light' ? '#FFFFFF' : 'var(--app-text-primary)',
                  }}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('system')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    mode === 'system' ? 'text-white shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: mode === 'system' ? 'var(--app-primary)' : 'transparent',
                    color: mode === 'system' ? '#FFFFFF' : 'var(--app-text-primary)',
                  }}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Auto</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Live Mini Studio Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
              <span>Live Studio Mockup Preview</span>
              <span className="font-mono text-[11px]" style={{ color: 'var(--app-primary)' }}>
                Active: {themeDetails.name} ({resolvedMode})
              </span>
            </div>
            <MiniStudioPreview theme={themeDetails} mode={resolvedMode} />
          </div>

          {/* Tone Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold uppercase tracking-wider mr-1" style={{ color: 'var(--app-text-muted)' }}>
              Filter Themes:
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
                  backgroundColor: activeTone === f.id ? 'var(--app-primary)' : 'var(--app-card)',
                  borderColor: 'var(--app-card-border)',
                  color: activeTone === f.id ? '#FFFFFF' : 'var(--app-text-primary)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* 10 Theme Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
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
        </main>
      </div>

      {/* Confirmation Toast Notification */}
      {toastMsg && (
        <div
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200"
          style={{
            backgroundColor: 'var(--app-surface)',
            borderColor: 'var(--app-card-border)',
            boxShadow: `0 20px 40px -10px var(--app-glow)`,
            color: 'var(--app-text-primary)',
          }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: 'var(--app-primary)' }}
          >
            ✓
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
