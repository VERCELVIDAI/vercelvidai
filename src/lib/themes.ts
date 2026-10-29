// ==============================================================================
// FLUVIA FLOW — CLEAN BUSINESS-GRADE SAAS DESIGN SYSTEM
// ==============================================================================
// Primary background: #FFFFFF
// Secondary surfaces: #F7F8FA, #F1F3F5
// Primary text: #17191D
// Secondary text: #667085
// Borders: #E5E7EB
// Accent: Deep Indigo #5145CD

export type ThemeMode = 'light';
export type ResolvedMode = 'light';
export type ThemeTone = 'minimal';

export interface ThemePalette {
  bg: string;
  surface: string;
  sidebar: string;
  card: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  secondary: string;
  ring: string;
  inputBg: string;
  inputBorder: string;
  gradientPrimary: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  glow: string;
}

export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  tone: ThemeTone;
  previewColors: {
    primary: string;
    secondary: string;
    darkBg: string;
    lightBg: string;
  };
  dark: ThemePalette;
  light: ThemePalette;
}

export const FLUVIA_PALETTE: ThemePalette = {
  bg: '#FFFFFF',
  surface: '#F7F8FA',
  sidebar: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#E5E7EB',
  textPrimary: '#17191D',
  textSecondary: '#667085',
  textMuted: '#9CA3AF',
  primary: '#5145CD',
  primaryHover: '#4338CA',
  primaryForeground: '#FFFFFF',
  secondary: '#F1F3F5',
  ring: '#5145CD',
  inputBg: '#FFFFFF',
  inputBorder: '#E5E7EB',
  gradientPrimary: 'linear-gradient(135deg, #5145CD 0%, #4338CA 100%)',
  badgeBg: '#EEF2FF',
  badgeText: '#5145CD',
  badgeBorder: '#E0E7FF',
  glow: 'rgba(81, 69, 205, 0.15)',
};

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'clean-light',
    name: 'Clean Light & Deep Indigo',
    description: 'Minimalist white canvas with soft grey surfaces and restrained deep indigo accents.',
    tone: 'minimal',
    previewColors: {
      primary: '#5145CD',
      secondary: '#F1F3F5',
      darkBg: '#F7F8FA',
      lightBg: '#FFFFFF',
    },
    dark: FLUVIA_PALETTE,
    light: FLUVIA_PALETTE,
  },
];

export function getThemeById(id: string): ColorTheme {
  return COLOR_THEMES[0];
}

export function getDefaultTheme(): ColorTheme {
  return COLOR_THEMES[0];
}
