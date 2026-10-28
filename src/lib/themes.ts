// ==============================================================================
// FLUVIA FLOW — KLING AI CINEMATIC OBSIDIAN STUDIO THEME DEFINITIONS
// ==============================================================================

export type ThemeMode = 'dark' | 'light';
export type ResolvedMode = 'dark';
export type ThemeTone = 'vibrant' | 'minimal';

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
  bg: '#090A0D',
  surface: '#11131A',
  sidebar: '#0B0C10',
  card: '#151822',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#6366F1',
  primaryHover: '#4F46E5',
  primaryForeground: '#FFFFFF',
  secondary: '#7C3AED',
  ring: '#6366F1',
  inputBg: 'rgba(14, 16, 23, 0.92)',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
  gradientPrimary: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #7C3AED 100%)',
  badgeBg: 'rgba(99, 102, 241, 0.15)',
  badgeText: '#A5B4FC',
  badgeBorder: 'rgba(99, 102, 241, 0.3)',
  glow: 'rgba(99, 102, 241, 0.2)',
};

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'kling-obsidian',
    name: 'Kling AI Obsidian Dark',
    description: 'Deep obsidian charcoal canvas with electric indigo flares, cyber cyan badges, and cinema monitors.',
    tone: 'vibrant',
    previewColors: {
      primary: '#6366F1',
      secondary: '#7C3AED',
      darkBg: '#090A0D',
      lightBg: '#11131A',
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
