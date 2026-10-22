'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';
import { Sun, Moon, Laptop } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'dropdown' | 'pill';
}

export function ThemeToggle({ className = '', variant = 'icon' }: ThemeToggleProps) {
  const { mode, resolvedMode, setMode, toggleMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 ${className}`} />
    );
  }

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center p-1 rounded-xl bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 ${className}`}>
        <button
          type="button"
          onClick={() => setMode('light')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            mode === 'light'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Light mode"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('dark')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            mode === 'dark'
              ? 'bg-theme-primary text-white shadow-sm font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          style={{
            backgroundColor: mode === 'dark' ? 'var(--app-primary)' : 'transparent',
          }}
          title="Dark mode"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('system')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            mode === 'system'
              ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="System preference"
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Auto</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={`Switch to ${resolvedMode === 'dark' ? 'light' : 'dark'} mode`}
      className={`relative p-2 rounded-xl transition-all border ${
        resolvedMode === 'dark'
          ? 'bg-white/5 hover:bg-white/10 text-amber-300 border-white/10 hover:border-violet-500/40 shadow-sm'
          : 'bg-slate-100 hover:bg-slate-200 text-violet-600 border-slate-200 hover:border-violet-400 shadow-sm'
      } ${className}`}
      title={`Switch to ${resolvedMode === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedMode === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45 duration-300" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12 duration-300" />
      )}
    </button>
  );
}
