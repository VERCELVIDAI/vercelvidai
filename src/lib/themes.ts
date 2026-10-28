// ==============================================================================
// WHISK FLOW — MIDNIGHT PLUM × HOT PINK DESIGN SYSTEM
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

// LOCKED BRAND COLORS:
// - Primary background: #100A12
// - Secondary surfaces: #211522
// - Primary accent: #F05BCE
// - Primary text: #F5EAF4
// - Muted text: #A99AAA
// - Borders: #39233B

export const FLUVIA_PALETTE: ThemePalette = {
  bg: '#100A12',
  surface: '#211522',
  sidebar: '#170E1A',
  card: '#211522',
  cardBorder: '#39233B',
  textPrimary: '#F5EAF4',
  textSecondary: '#A99AAA',
  textMuted: '#A99AAA',
  primary: '#F05BCE',
  primaryHover: '#E046BD',
  primaryForeground: '#FFFFFF',
  secondary: '#C026D3',
  ring: '#F05BCE',
  inputBg: 'rgba(33, 21, 34, 0.85)',
  inputBorder: '#39233B',
  gradientPrimary: 'linear-gradient(135deg, #F05BCE 0%, #E046BD 50%, #C026D3 100%)',
  badgeBg: 'rgba(240, 91, 206, 0.15)',
  badgeText: '#F05BCE',
  badgeBorder: 'rgba(240, 91, 206, 0.35)',
  glow: 'rgba(240, 91, 206, 0.25)',
};

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'midnight-plum',
    name: 'Midnight Plum × Hot Pink',
    description: 'Deep midnight plum canvas with layered velvet plum surfaces, hot pink highlights, and luminous rose text.',
    tone: 'vibrant',
    previewColors: {
      primary: '#F05BCE',
      secondary: '#C026D3',
      darkBg: '#100A12',
      lightBg: '#211522',
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
