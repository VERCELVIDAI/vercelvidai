// ==============================================================================
// FLUVIA FLOW — UNIFIED WHITE + EMERALD GREEN + SOFT PINK THEME DEFINITIONS
// ==============================================================================

export type ThemeMode = 'light';
export type ResolvedMode = 'light';
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
  bg: '#FFFFFF',
  surface: 'rgba(255, 255, 255, 0.85)',
  sidebar: 'rgba(255, 255, 255, 0.85)',
  card: 'rgba(255, 255, 255, 0.72)',
  cardBorder: 'rgba(16, 185, 129, 0.16)',
  textPrimary: '#17211D',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  primary: '#10B981',
  primaryHover: '#047857',
  primaryForeground: '#FFFFFF',
  secondary: '#EC4899',
  ring: '#10B981',
  inputBg: 'rgba(255, 255, 255, 0.9)',
  inputBorder: 'rgba(16, 185, 129, 0.2)',
  gradientPrimary: 'linear-gradient(135deg, #10B981 0%, #047857 50%, #059669 100%)',
  badgeBg: '#D1FAE5',
  badgeText: '#047857',
  badgeBorder: 'rgba(16, 185, 129, 0.28)',
  glow: 'rgba(16, 185, 129, 0.2)',
};

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'fluvia-emerald',
    name: 'Fluvia Emerald Glass',
    description: 'Crisp white canvas with radiant emerald ribbons, light mint gradients, and soft pink accents.',
    tone: 'vibrant',
    previewColors: {
      primary: '#10B981',
      secondary: '#EC4899',
      darkBg: '#FFFFFF',
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
