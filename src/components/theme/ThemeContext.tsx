'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ColorTheme, ThemeMode, COLOR_THEMES, FLUVIA_PALETTE } from '@/lib/themes';

export type ResolvedMode = 'dark';

interface ThemeContextType {
  colorTheme: string;
  themeDetails: ColorTheme;
  mode: 'dark';
  resolvedMode: 'dark';
  isCompleted: boolean;
  setColorTheme: (themeId: string, persistToBackend?: boolean) => void;
  setMode: (mode: any, persistToBackend?: boolean) => void;
  toggleMode: () => void;
  markCompleted: () => Promise<void>;
  resetToDefault: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme] = useState<string>('kling-obsidian');
  const [mode] = useState<'dark'>('dark');
  const [resolvedMode] = useState<'dark'>('dark');
  const [isCompleted, setIsCompleted] = useState<boolean>(true);

  // Apply CSS variables to document.documentElement
  const applyThemeToDOM = useCallback(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.setAttribute('data-color-theme', 'kling-obsidian');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
    root.classList.remove('light');
    root.classList.add('dark');

    // Apply Palette Variables
    const palette = FLUVIA_PALETTE;
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

  useEffect(() => {
    try {
      localStorage.setItem('fluvia_theme', 'dark');
      localStorage.setItem('fluvia_color_theme', 'kling-obsidian');
    } catch {}

    applyThemeToDOM();
  }, [applyThemeToDOM]);

  const setColorTheme = () => {
    applyThemeToDOM();
  };

  const setMode = () => {
    applyThemeToDOM();
  };

  const toggleMode = () => {
    applyThemeToDOM();
  };

  const markCompleted = async () => {
    setIsCompleted(true);
  };

  const resetToDefault = () => {
    applyThemeToDOM();
  };

  return (
    <ThemeContext.Provider
      value={{
        colorTheme,
        themeDetails: COLOR_THEMES[0],
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
