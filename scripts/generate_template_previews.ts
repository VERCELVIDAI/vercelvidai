import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imgDir = path.join(process.cwd(), 'public', 'media', 'image-templates');
const txtDir = path.join(process.cwd(), 'public', 'media', 'text-templates');

fs.mkdirSync(imgDir, { recursive: true });
fs.mkdirSync(txtDir, { recursive: true });

interface PreviewSpec {
  filename: string;
  width: number;
  height: number;
  title: string;
  category: string;
  subtitle: string;
  bgGradStart: string;
  bgGradEnd: string;
  accentColor: string;
  iconSvg: string;
  details: string;
  tag: string;
}

const imageSpecs: PreviewSpec[] = [
  {
    filename: 'img-01-luxury-perfume.jpg',
    width: 1200,
    height: 1200,
    title: 'AURA FLACON',
    category: 'LUXURY PRODUCT PHOTOGRAPHY',
    subtitle: 'Emerald Crystal Fragrance with Prism Caustics',
    bgGradStart: '#041d13',
    bgGradEnd: '#0d3826',
    accentColor: '#10b981',
    details: 'Macro 8K • Carrara Marble Pedestal • Anamorphic Prism Refraction',
    tag: 'COMMERCIAL PHOTOGRAPHY',
    iconSvg: `<polygon points="600,320 680,480 680,720 520,720 520,480" fill="none" stroke="#10b981" stroke-width="8" /><circle cx="600" cy="280" r="30" fill="#34d399" />`,
  },
  {
    filename: 'img-02-ecommerce-audio.jpg',
    width: 1600,
    height: 900,
    title: 'SONIC AERO X',
    category: 'PREMIUM E-COMMERCE HERO',
    subtitle: 'Active Noise Cancelling Studio Headset',
    bgGradStart: '#0f172a',
    bgGradEnd: '#1e293b',
    accentColor: '#38bdf8',
    details: 'Zero-Gravity Plinth • Matte Basalt Texture • Floating Product Hero',
    tag: 'E-COMMERCE SHOWCASE',
    iconSvg: `<path d="M480 500 A120 120 0 0 1 720 500" fill="none" stroke="#38bdf8" stroke-width="12" /><rect x="440" y="480" width="50" height="90" rx="20" fill="#0284c7" /><rect x="710" y="480" width="50" height="90" rx="20" fill="#0284c7" />`,
  },
  {
    filename: 'img-03-skincare-serum.jpg',
    width: 1080,
    height: 1350,
    title: 'HYDRAGLOW BOTANICALS',
    category: 'BEAUTY & SKINCARE CAMPAIGN',
    subtitle: 'Triple Hyaluronic Acid Micro-Droplets',
    bgGradStart: '#1a1016',
    bgGradEnd: '#2e1224',
    accentColor: '#f43f5e',
    details: 'Suspended Gold Microspheres • Soft Natural Sunlight • Dew Sheen',
    tag: 'EDITORIAL BEAUTY',
    iconSvg: `<path d="M540 400 C540 400 440 560 440 640 A100 100 0 0 0 640 640 C640 560 540 400 540 400 Z" fill="none" stroke="#f43f5e" stroke-width="8" /><circle cx="540" cy="640" r="40" fill="#fb7185" />`,
  },
  {
    filename: 'img-04-automotive-poster.jpg',
    width: 1600,
    height: 900,
    title: 'APEX GT EVOLUZIONE',
    category: 'AUTOMOTIVE ADVERTISING POSTER',
    subtitle: 'Pure Electric Aerodynamic Hypercar',
    bgGradStart: '#020617',
    bgGradEnd: '#0f172a',
    accentColor: '#06b6d4',
    details: 'Brutalist Concrete Pavilion • Wet Track Reflections • Speed Light Streaks',
    tag: 'AUTOMOTIVE CAMPAIGN',
    iconSvg: `<path d="M400 520 L480 440 L720 440 L800 520 Z" fill="none" stroke="#06b6d4" stroke-width="10" /><circle cx="480" cy="540" r="30" fill="#0891b2" /><circle cx="720" cy="540" r="30" fill="#0891b2" />`,
  },
  {
    filename: 'img-05-mechanical-keyboard.jpg',
    width: 1200,
    height: 1200,
    title: 'TITAN 75 MECHANICAL',
    category: 'MINIMALIST PRODUCT LAUNCH',
    subtitle: 'Gasket-Mounted CNC Aluminum Chassis',
    bgGradStart: '#18181b',
    bgGradEnd: '#27272a',
    accentColor: '#f59e0b',
    details: 'Warm Copper Rim Glow • PBT Double-Shot Keycaps • Top-Down Studio Flatlay',
    tag: 'HARDWARE HARDCORE',
    iconSvg: `<rect x="420" y="460" width="360" height="180" rx="16" fill="none" stroke="#f59e0b" stroke-width="8" /><rect x="460" y="500" width="40" height="40" rx="6" fill="#d97706" /><rect x="520" y="500" width="40" height="40" rx="6" fill="#d97706" /><rect x="580" y="500" width="40" height="40" rx="6" fill="#d97706" /><rect x="640" y="500" width="40" height="40" rx="6" fill="#d97706" />`,
  },
  {
    filename: 'img-06-espresso-commercial.jpg',
    width: 1200,
    height: 1200,
    title: 'ORIGIN CRAFT ESPRESSO',
    category: 'CINEMATIC BRAND POSTER',
    subtitle: 'Artisanal Single-Origin Crema Extraction',
    bgGradStart: '#27170a',
    bgGradEnd: '#3f2510',
    accentColor: '#d97706',
    details: 'Atmospheric Micro-Steam • Golden Crema Swirls • Italian Brass Portafilter',
    tag: 'ARTISANAL BEVERAGE',
    iconSvg: `<path d="M480 460 L500 620 C500 660 700 660 700 620 L720 460 Z" fill="none" stroke="#d97706" stroke-width="8" /><path d="M710 500 C760 500 760 580 710 580" fill="none" stroke="#d97706" stroke-width="8" />`,
  },
  {
    filename: 'img-07-hydration-drink.jpg',
    width: 1080,
    height: 1920,
    title: 'SOLARIS SPARKLING CITRUS',
    category: 'SOCIAL MEDIA AD CREATIVE',
    subtitle: 'Zero-Sugar Electrolyte Infusion',
    bgGradStart: '#142006',
    bgGradEnd: '#273c09',
    accentColor: '#84cc16',
    details: 'Macro Condensation Droplets • Sliced Blood Orange • Bursting Ice Crystals',
    tag: 'VIRAL AD CREATIVE',
    iconSvg: `<rect x="460" y="700" width="160" height="340" rx="20" fill="none" stroke="#84cc16" stroke-width="10" /><circle cx="540" cy="800" r="40" fill="#65a30d" />`,
  },
  {
    filename: 'img-08-youtube-workspace.jpg',
    width: 1280,
    height: 720,
    title: 'THE ULTIMATE CREATOR SETUP',
    category: 'PROFESSIONAL YOUTUBE THUMBNAIL',
    subtitle: 'Curved OLED & Studio Precision Sound',
    bgGradStart: '#090d16',
    bgGradEnd: '#131b2e',
    accentColor: '#818cf8',
    details: 'High-Contrast Depth • Amber Hue Accent • Minimalist Walnut Wood Desk',
    tag: 'HIGH CTR THUMBNAIL',
    iconSvg: `<rect x="460" y="240" width="360" height="200" rx="12" fill="none" stroke="#818cf8" stroke-width="8" /><line x1="640" y1="440" x2="640" y2="500" stroke="#818cf8" stroke-width="8" />`,
  },
  {
    filename: 'img-09-haute-couture.jpg',
    width: 1080,
    height: 1350,
    title: 'MAISON ÉMERAUDE',
    category: 'EDITORIAL FASHION PHOTOGRAPHY',
    subtitle: 'Architectural Iridescent Trench',
    bgGradStart: '#051811',
    bgGradEnd: '#0f291e',
    accentColor: '#10b981',
    details: 'Brutalist Concrete Pavilion • Flowing Heavy Silk • High Vogue Contrast',
    tag: 'HAUTE COUTURE',
    iconSvg: `<path d="M540 400 L440 680 L640 680 Z" fill="none" stroke="#10b981" stroke-width="8" /><circle cx="540" cy="340" r="40" fill="#059669" />`,
  },
  {
    filename: 'img-10-artisanal-sourdough.jpg',
    width: 1200,
    height: 1200,
    title: 'FERMENT & OAK',
    category: 'FOOD & BEVERAGE CAMPAIGN',
    subtitle: 'Wood-Fired Wild Yeast Loaf',
    bgGradStart: '#2b1b0b',
    bgGradEnd: '#42280e',
    accentColor: '#f59e0b',
    details: 'Golden Blistered Crust • Melted Truffle Butter • Natural Window Sidelight',
    tag: 'CULINARY ADVERTISING',
    iconSvg: `<ellipse cx="600" cy="560" rx="180" ry="100" fill="none" stroke="#f59e0b" stroke-width="8" /><path d="M460 540 Q600 480 740 540" fill="none" stroke="#d97706" stroke-width="6" />`,
  },
  {
    filename: 'img-11-saas-isometric.jpg',
    width: 1600,
    height: 900,
    title: 'SYNAPSE ENTERPRISE CLOUD',
    category: 'SAAS PRODUCT LAUNCH GRAPHIC',
    subtitle: 'Real-Time Vector Intelligence Command Center',
    bgGradStart: '#061727',
    bgGradEnd: '#0c2742',
    accentColor: '#38bdf8',
    details: 'Translucent Glass Dashboard Layers • Glowing Emerald Metrics • 3D Isometric Space',
    tag: 'TECH KEYNOTE ASSET',
    iconSvg: `<polygon points="600,320 800,420 600,520 400,420" fill="none" stroke="#38bdf8" stroke-width="8" /><polygon points="600,520 800,620 600,720 400,620" fill="none" stroke="#0284c7" stroke-width="8" />`,
  },
  {
    filename: 'img-12-fluid-typography.jpg',
    width: 1200,
    height: 1200,
    title: 'KINETIC CHROME FUTURA',
    category: 'PREMIUM TYPOGRAPHY-LED POSTER',
    subtitle: 'Modernist Swiss Grid Intersecting Fluid Silver',
    bgGradStart: '#111827',
    bgGradEnd: '#1f2937',
    accentColor: '#e5e7eb',
    details: 'Helvetica Neue Black • Molten Liquid Reflections • Monochromatic Purity',
    tag: 'TYPOGRAPHIC ART',
    iconSvg: `<text x="600" y="580" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="140" fill="#f3f4f6" text-anchor="middle">AGY</text>`,
  },
  {
    filename: 'img-13-minimalist-moodboard.jpg',
    width: 1200,
    height: 1200,
    title: 'TERRA NOIR PALETTE',
    category: 'BRAND MOODBOARD',
    subtitle: 'Sustainable Luxury Brand Identity Assets',
    bgGradStart: '#1c1917',
    bgGradEnd: '#292524',
    accentColor: '#a8a29e',
    details: 'Raw Belgian Linen • Honed Travertine • Matte Ceramic • Mediterranean Olive',
    tag: 'CREATIVE DIRECTION',
    iconSvg: `<rect x="420" y="440" width="140" height="140" fill="#78716c" /><rect x="580" y="440" width="140" height="140" fill="#a8a29e" /><rect x="420" y="600" width="140" height="140" fill="#57534e" /><rect x="580" y="600" width="140" height="140" fill="#292524" />`,
  },
  {
    filename: 'img-14-autumn-cashmere.jpg',
    width: 1600,
    height: 900,
    title: 'AURORA FALL CAMPAIGN',
    category: 'SEASONAL COMMERCIAL CAMPAIGN',
    subtitle: 'Pure Mongolian Ribbed Knitwear',
    bgGradStart: '#2d1b10',
    bgGradEnd: '#452718',
    accentColor: '#fb923c',
    details: 'Warm Autumn Sunbeams • Natural Oak Grain Pedestal • Soft Tactile Cashmere',
    tag: 'SEASONAL ADVERTISING',
    iconSvg: `<path d="M460 480 C500 420 700 420 740 480 L760 620 L440 620 Z" fill="none" stroke="#fb923c" stroke-width="8" />`,
  },
  {
    filename: 'img-15-ceramic-zen-cosmetic.jpg',
    width: 1200,
    height: 1200,
    title: 'SERENITY MINERAL BALM',
    category: 'CLEAN STUDIO COMPOSITION',
    subtitle: 'Zen Stone Pedestal & Morning Dew Mist',
    bgGradStart: '#0f1715',
    bgGradEnd: '#162822',
    accentColor: '#34d399',
    details: 'Basalt River Stones • Matte Porcelain Jar • Soft Atmospheric Cloud Shadow',
    tag: 'MINIMAL LUXURY',
    iconSvg: `<ellipse cx="600" cy="620" rx="160" ry="60" fill="#064e3b" /><rect x="520" y="460" width="160" height="130" rx="16" fill="none" stroke="#34d399" stroke-width="8" />`,
  },
];

const textSpecs: PreviewSpec[] = [
  {
    filename: 'txt-01-chrome-title.jpg',
    width: 1600,
    height: 900,
    title: 'CINEMATIC 3D CHROME',
    category: 'TEXT ANIMATION',
    subtitle: 'Heavy Specular Bevels & Reflective Raytracing',
    bgGradStart: '#020617',
    bgGradEnd: '#0f172a',
    accentColor: '#94a3b8',
    details: 'Heavy Extruded Depth • Anamorphic Blue Lens Flare • 60fps Motion Reveal',
    tag: 'BLOCKBUSTER TITLE',
    iconSvg: `<text x="800" y="490" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="110" fill="url(#chromeGrad)" text-anchor="middle" letter-spacing="8">CHROME 3D</text>`,
  },
  {
    filename: 'txt-02-liquid-metal.jpg',
    width: 1600,
    height: 900,
    title: 'LIQUID MERCURY TYPE',
    category: 'TEXT ANIMATION',
    subtitle: 'Organic Fluid Chrome Morphing into Serif Glyph',
    bgGradStart: '#09090b',
    bgGradEnd: '#18181b',
    accentColor: '#cbd5e1',
    details: 'Viscous Surface Tension • Specular Highlights • Fluid Particle Physics',
    tag: 'ORGANIC MOTION',
    iconSvg: `<text x="800" y="490" font-family="'Times New Roman', serif" font-weight="bold" font-size="120" fill="#e2e8f0" text-anchor="middle" font-style="italic">Fluidum</text>`,
  },
  {
    filename: 'txt-03-emerald-glass.jpg',
    width: 1600,
    height: 900,
    title: 'EMERALD GLASS REVEAL',
    category: 'TEXT ANIMATION',
    subtitle: 'Frosted Translucent Glass with Glowing Caustics',
    bgGradStart: '#031a11',
    bgGradEnd: '#093623',
    accentColor: '#10b981',
    details: 'Subsurface Scattering • Internal Refraction • Signature Fluvia Flow Theme',
    tag: 'SIGNATURE BRAND',
    iconSvg: `<text x="800" y="490" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="110" fill="#34d399" text-anchor="middle" letter-spacing="6">EMERALD</text>`,
  },
  {
    filename: 'txt-04-kinetic-ads.jpg',
    width: 1080,
    height: 1920,
    title: 'KINETIC AD PULSE',
    category: 'TEXT ANIMATION',
    subtitle: 'High-Tempo Staggered Spring Motion for Reels',
    bgGradStart: '#18181b',
    bgGradEnd: '#27272a',
    accentColor: '#e11d48',
    details: 'Vertical 9:16 Optimized • High Impact Bouncy Physics • Color Block Reveal',
    tag: 'VIRAL REELS',
    iconSvg: `<text x="540" y="900" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="140" fill="#f43f5e" text-anchor="middle">STOP</text><text x="540" y="1040" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="140" fill="#ffffff" text-anchor="middle">SCROLLING</text>`,
  },
  {
    filename: 'txt-05-neon-light.jpg',
    width: 1600,
    height: 900,
    title: 'CYBERPUNK NEON TUBE',
    category: 'TEXT ANIMATION',
    subtitle: 'Authentic Gas-Tube Flicker with Wet Ground Reflection',
    bgGradStart: '#080112',
    bgGradEnd: '#170326',
    accentColor: '#c084fc',
    details: 'Humming Electric Filament • Volumetric Atmosphere • Neon Glow Bloom',
    tag: 'CYBERPUNK',
    iconSvg: `<text x="800" y="490" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="110" fill="#e879f9" text-anchor="middle" stroke="#f0abfc" stroke-width="3">NIGHT CITY</text>`,
  },
  {
    filename: 'txt-06-luxury-minimalist.jpg',
    width: 1600,
    height: 900,
    title: 'MAJESTY MINIMALIST INTRO',
    category: 'TEXT ANIMATION',
    subtitle: 'Ultra-Wide Tracked-Out Serif with Quiet Fade',
    bgGradStart: '#0f1715',
    bgGradEnd: '#1c2824',
    accentColor: '#e2e8f0',
    details: 'Quiet Luxury • Slow Letter-Spacing Expansion • Understated Elegance',
    tag: 'LUXURY BRAND',
    iconSvg: `<text x="800" y="490" font-family="'Times New Roman', serif" font-size="80" fill="#f8fafc" text-anchor="middle" letter-spacing="24">VALENCE</text>`,
  },
  {
    filename: 'txt-07-editorial-headline.jpg',
    width: 1600,
    height: 900,
    title: 'BRUTALIST EDITORIAL MASK',
    category: 'TEXT ANIMATION',
    subtitle: 'High-Contrast Split-Block Slide Reveal',
    bgGradStart: '#000000',
    bgGradEnd: '#171717',
    accentColor: '#facc15',
    details: 'Magazine Headline Pacing • Bold Monochrome Masking • Punchy Inversion',
    tag: 'EDITORIAL',
    iconSvg: `<rect x="360" y="380" width="880" height="150" fill="#facc15" /><text x="800" y="490" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="110" fill="#000000" text-anchor="middle">HEADLINE</text>`,
  },
  {
    filename: 'txt-08-glitch-typography.jpg',
    width: 1600,
    height: 900,
    title: 'NEURAL GLITCH DISRUPTION',
    category: 'TEXT ANIMATION',
    subtitle: 'RGB Chromatic Separation & Scanline Jitter',
    bgGradStart: '#020617',
    bgGradEnd: '#0b0f19',
    accentColor: '#22d3ee',
    details: 'Cyber Threat Aesthetics • Digital Artifact Phasing • High Frequency Jitter',
    tag: 'GLITCH VFX',
    iconSvg: `<text x="796" y="490" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="120" fill="#ec4899" text-anchor="middle">SYNTAX</text><text x="804" y="490" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="120" fill="#06b6d4" text-anchor="middle">SYNTAX</text><text x="800" y="490" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="120" fill="#ffffff" text-anchor="middle">SYNTAX</text>`,
  },
  {
    filename: 'txt-09-smooth-mask-wipe.jpg',
    width: 1600,
    height: 900,
    title: 'ANGULAR CURTAIN WIPE',
    category: 'TEXT ANIMATION',
    subtitle: 'Diagonal Gradient Soft-Edge Vector Sweep',
    bgGradStart: '#0f172a',
    bgGradEnd: '#1e293b',
    accentColor: '#38bdf8',
    details: 'Silicon Valley Keynote Style • 45-Degree Soft Feather • Ultra-Smooth 60fps',
    tag: 'MODERN TECH',
    iconSvg: `<text x="800" y="490" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="100" fill="#e0f2fe" text-anchor="middle">STREAMLINE</text>`,
  },
  {
    filename: 'txt-10-particle-typography.jpg',
    width: 1600,
    height: 900,
    title: 'GOLDEN PARTICLE SWARM',
    category: 'TEXT ANIMATION',
    subtitle: 'Stardust Particles Coalescing into Sharp Vector Glyphs',
    bgGradStart: '#1c1305',
    bgGradEnd: '#332007',
    accentColor: '#fbbf24',
    details: 'Physics Particle Assembly • Ambient Dust Drift • Award Show Opener',
    tag: 'PARTICLE SYSTEM',
    iconSvg: `<text x="800" y="490" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="110" fill="#fef3c7" text-anchor="middle" letter-spacing="10">COSMOS</text>`,
  },
  {
    filename: 'txt-11-typewriter-story.jpg',
    width: 1600,
    height: 900,
    title: 'MONOSPACE STORY CADENCE',
    category: 'TEXT ANIMATION',
    subtitle: 'Rhythmic Mechanical Keystroke Storytelling',
    bgGradStart: '#111827',
    bgGradEnd: '#1f2937',
    accentColor: '#10b981',
    details: 'Terminal Monospace Typography • Blinking Caret Cursor • Narrative Pauses',
    tag: 'DEV & ESSAY',
    iconSvg: `<text x="800" y="490" font-family="'Courier New', monospace" font-weight="bold" font-size="80" fill="#34d399" text-anchor="middle">const future = new Vision();█</text>`,
  },
  {
    filename: 'txt-12-logo-tagline.jpg',
    width: 1600,
    height: 900,
    title: 'MONOGRAM & SUBTITLE LOCKUP',
    category: 'TEXT ANIMATION',
    subtitle: 'Vector Stroke Draw with Coordinated Subline Fade',
    bgGradStart: '#0a0f0d',
    bgGradEnd: '#131f1a',
    accentColor: '#10b981',
    details: 'SVG Stroke Dashoffset Animation • Synchronized Tagline • Commercial Polish',
    tag: 'BRAND OUTRO',
    iconSvg: `<circle cx="800" cy="400" r="60" fill="none" stroke="#10b981" stroke-width="8" /><path d="M780 370 L820 400 L780 430 Z" fill="#34d399" /><text x="800" y="520" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="60" fill="#ffffff" text-anchor="middle" letter-spacing="8">FLUVIA</text><text x="800" y="560" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="24" fill="#a7f3d0" text-anchor="middle" letter-spacing="6">CREATIVE INTELLIGENCE</text>`,
  },
];

function escapeXml(unsafe: string): string {
  return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

async function generateSvgBuffer(spec: PreviewSpec): Promise<Buffer> {
  const safeTitle = escapeXml(spec.title);
  const safeSubtitle = escapeXml(spec.subtitle);
  const safeCategory = escapeXml(spec.category);
  const safeDetails = escapeXml(spec.details);
  const safeTag = escapeXml(spec.tag);

  const svg = `<svg width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${spec.bgGradStart}" />
        <stop offset="100%" stop-color="${spec.bgGradEnd}" />
      </linearGradient>
      <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="35%" stop-color="#94a3b8" />
        <stop offset="50%" stop-color="#ffffff" />
        <stop offset="70%" stop-color="#475569" />
        <stop offset="100%" stop-color="#cbd5e1" />
      </linearGradient>
      <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${spec.accentColor}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="${spec.accentColor}" stop-opacity="0" />
      </radialGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Background Base -->
    <rect width="${spec.width}" height="${spec.height}" fill="url(#bgGrad)" />
    <rect width="${spec.width}" height="${spec.height}" fill="url(#grid)" />

    <!-- Ambient Center Light -->
    <circle cx="${spec.width / 2}" cy="${spec.height / 2}" r="${Math.min(spec.width, spec.height) * 0.45}" fill="url(#glowGrad)" />

    <!-- Outer Decorative Border -->
    <rect x="24" y="24" width="${spec.width - 48}" height="${spec.height - 48}" rx="20" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
    <rect x="36" y="36" width="${spec.width - 72}" height="${spec.height - 72}" rx="14" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />

    <!-- Top Badge / Category -->
    <rect x="60" y="60" width="280" height="36" rx="18" fill="rgba(0,0,0,0.5)" stroke="${spec.accentColor}" stroke-opacity="0.5" stroke-width="1.5" />
    <circle cx="80" cy="78" r="6" fill="${spec.accentColor}" />
    <text x="96" y="83" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12" fill="#ffffff" letter-spacing="1.5">${safeTag}</text>

    <!-- Top Right Brand Stamp -->
    <text x="${spec.width - 60}" y="84" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="14" fill="rgba(255,255,255,0.6)" text-anchor="end" letter-spacing="3">FLUVIA STUDIO</text>

    <!-- Center Creative Icon Graphic -->
    <g>
      ${spec.iconSvg}
    </g>

    <!-- Bottom Typography Info Box -->
    <g transform="translate(60, ${spec.height - 180})">
      <rect x="0" y="0" width="${spec.width - 120}" height="120" rx="16" fill="rgba(0,0,0,0.65)" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
      <text x="32" y="42" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="1">${safeTitle}</text>
      <text x="32" y="72" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="16" fill="${spec.accentColor}">${safeSubtitle}</text>
      <text x="32" y="98" font-family="'Courier New', monospace" font-size="13" fill="rgba(255,255,255,0.65)">${safeDetails}</text>
    </g>
  </svg>`;

  return Buffer.from(svg);
}

async function run() {
  console.log('Rendering 15 image template previews...');
  for (const spec of imageSpecs) {
    const svgBuf = await generateSvgBuffer(spec);
    const dest = path.join(imgDir, spec.filename);
    await sharp(svgBuf)
      .jpeg({ quality: 92 })
      .toFile(dest);
    const stats = fs.statSync(dest);
    console.log(`  ✓ Created ${spec.filename} (${stats.size} bytes)`);
  }

  console.log('\nRendering 12 text animation template previews...');
  for (const spec of textSpecs) {
    const svgBuf = await generateSvgBuffer(spec);
    const dest = path.join(txtDir, spec.filename);
    await sharp(svgBuf)
      .jpeg({ quality: 92 })
      .toFile(dest);
    const stats = fs.statSync(dest);
    console.log(`  ✓ Created ${spec.filename} (${stats.size} bytes)`);
  }

  console.log('\n🎉 ALL 27 HIGH-RES TEMPLATE PREVIEWS GENERATED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
