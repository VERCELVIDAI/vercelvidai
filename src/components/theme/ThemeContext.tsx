'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ColorTheme, ThemeMode, COLOR_THEMES, getThemeById, getDefaultTheme } from '@/lib/themes';

export type ResolvedMode = 'dark' | 'light';

interface ThemeContextType {
  colorTheme: string;
  themeDetails: ColorTheme;
  mode: ThemeMode;
  resolvedMode: ResolvedMode;
  isCompleted: boolean;
  setColorTheme: (themeId: string, persistToBackend?: boolean) => void;
  setMode: (mode: ThemeMode, persistToBackend?: boolean) => void;
  toggleMode: () => void;
  markCompleted: () => Promise<void>;
  resetToDefault: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<string>('midnight-violet');
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [resolvedMode, setResolvedMode] = useState<ResolvedMode>('dark');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Apply CSS variables to document.documentElement
  const applyThemeToDOM = useCallback((themeId: string, activeMode: ThemeMode) => {
    if (typeof window === 'undefined') return;

    const theme = getThemeById(themeId);
    let resolved: ResolvedMode = 'dark';
    if (activeMode === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = activeMode;
    }

    setResolvedMode(resolved);
    const root = document.documentElement;

    // Set attributes for CSS selectors
    root.setAttribute('data-color-theme', theme.id);
    root.setAttribute('data-theme', resolved);
    root.style.colorScheme = resolved;

    if (resolved === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Apply Palette Variables
    const palette = resolved === 'dark' ? theme.dark : theme.light;
    root.style.setProperty('--app-bg', palette.bg);
    root.style.setProperty('--app-surface', palette.surface);
    root.style.setProperty('--app-sidebar', palette.sidebar);
    root.style.setProperty('--app-card', palette.card);
    root.style.setProperty('--app-card-border', palette.cardBorder);
    root.style.setProperty('--app-text-primary', palette.textPrimary);
    root.style.setProperty('--app-text-secondary', palette.textSecondary);
    root.style.setProperty('--app-text-muted', palette.textMuted);
    root.style.setProperty('--app-primary', palette.primary);
    root.style.setProperty('--app-primary-hover', palette.primaryHover);
    root.style.setProperty('--app-primary-foreground', palette.primaryForeground);
    root.style.setProperty('--app-secondary', palette.secondary);
    root.style.setProperty('--app-ring', palette.ring);
    root.style.setProperty('--app-input-bg', palette.inputBg);
    root.style.setProperty('--app-input-border', palette.inputBorder);
    root.style.setProperty('--app-gradient-primary', palette.gradientPrimary);
    root.style.setProperty('--app-badge-bg', palette.badgeBg);
    root.style.setProperty('--app-badge-text', palette.badgeText);
    root.style.setProperty('--app-badge-border', palette.badgeBorder);
    root.style.setProperty('--app-glow', palette.glow);
  }, []);

  // Initialize from localStorage and check backend for authenticated user
  useEffect(() => {
    let initialColor = 'midnight-violet';
    let initialMode: ThemeMode = 'dark';
    let initialCompleted = false;

    try {
      const savedColor = localStorage.getItem('vidai_color_theme');
      if (savedColor && COLOR_THEMES.some((t) => t.id === savedColor)) {
        initialColor = savedColor;
      }
      const savedMode = localStorage.getItem('vidai_theme') as ThemeMode;
      if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
        initialMode = savedMode;
      }
      initialCompleted = localStorage.getItem('vidai_theme_completed') === 'true';
    } catch (e) {}

    setColorThemeState(initialColor);
    setModeState(initialMode);
    setIsCompleted(initialCompleted);
    applyThemeToDOM(initialColor, initialMode);
    setMounted(true);

    // Fetch authoritative backend settings if user is logged in
    fetch('/api/user/theme')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.themePreferences) {
          const { colorTheme: backendColor, mode: backendMode, completed: backendCompleted } = data.themePreferences;
          if (backendColor && COLOR_THEMES.some((t) => t.id === backendColor)) {
            setColorThemeState(backendColor);
            setModeState(backendMode);
            setIsCompleted(backendCompleted);
            applyThemeToDOM(backendColor, backendMode);
            try {
              localStorage.setItem('vidai_color_theme', backendColor);
              localStorage.setItem('vidai_theme', backendMode);
              localStorage.setItem('vidai_theme_completed', backendCompleted ? 'true' : 'false');
            } catch (e) {}
          }
        }
      })
      .catch(() => {});
  }, [applyThemeToDOM]);

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'vidai_color_theme' && e.newValue) {
        setColorThemeState(e.newValue);
        applyThemeToDOM(e.newValue, mode);
      } else if (e.key === 'vidai_theme' && e.newValue) {
        const newMode = e.newValue as ThemeMode;
        setModeState(newMode);
        applyThemeToDOM(colorTheme, newMode);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [colorTheme, mode, applyThemeToDOM]);

  // System mode change listener
  useEffect(() => {
    if (mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      applyThemeToDOM(colorTheme, 'system');
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [mode, colorTheme, applyThemeToDOM]);

  const setColorTheme = (themeId: string, persistToBackend = true) => {
    const valid = getThemeById(themeId);
    setColorThemeState(valid.id);
    applyThemeToDOM(valid.id, mode);

    try {
      localStorage.setItem('vidai_color_theme', valid.id);
    } catch (e) {}

    if (persistToBackend) {
      fetch('/api/user/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colorTheme: valid.id, mode }),
      }).catch(() => {});
    }
  };

  const setMode = (newMode: ThemeMode, persistToBackend = true) => {
    setModeState(newMode);
    applyThemeToDOM(colorTheme, newMode);

    try {
      localStorage.setItem('vidai_theme', newMode);
    } catch (e) {}

    if (persistToBackend) {
      fetch('/api/user/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colorTheme, mode: newMode }),
      }).catch(() => {});
    }
  };

  const toggleMode = () => {
    const next = resolvedMode === 'dark' ? 'light' : 'dark';
    setMode(next);
  };

  const markCompleted = async () => {
    setIsCompleted(true);
    try {
      localStorage.setItem('vidai_theme_completed', 'true');
    } catch (e) {}

    try {
      await fetch('/api/user/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colorTheme, mode, completed: true }),
      });
    } catch (e) {}
  };

  const resetToDefault = () => {
    setColorTheme('midnight-violet');
    setMode('dark');
  };

  const themeDetails = getThemeById(colorTheme);

  return (
    <ThemeContext.Provider
      value={{
        colorTheme,
        themeDetails,
        mode,
        resolvedMode,
        isCompleted,
        setColorTheme,
        setMode,
        toggleMode,
        markCompleted,
        resetToDefault,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
