export interface VoxBeat {
  beatNumber: number;
  label: string; // e.g. "Hook", "Context", "Turning Point", "Climax"
  headline: string; // e.g. "THE DISCOVERY", "ETHIOPIA 850 AD"
  script: string; // Voiceover narration for this beat
  visualDescription: string; // Description for collage poster
  accentDetails: string; // e.g. "washi tape, torn newspaper scrap, halftone dots"
  durationSec: number;
  posterUrl?: string;
  clipUrl?: string;
}

export interface VoxStyleInfo {
  id: string;
  name: string;
  description: string;
  badge: string;
  promptModifier: string;
  bgColors: string[];
  previewGradient: string;
}

export interface VoxNarrativeArc {
  id: string;
  name: string;
  description: string;
  beatsPattern: string[];
}

export const VOX_STYLES: VoxStyleInfo[] = [
  {
    id: 'modern-flat',
    name: 'Vox Modern Flat',
    description: 'Clean modern flat 2D illustrated collage in the signature Vox explainer motion-graphic style.',
    badge: 'Signature Vox',
    promptModifier:
      'Clean modern flat 2D illustrated collage in the Vox explainer motion-graphic style: bold flat-color vector-illustration cut-outs, simple confident shapes, limited contemporary palette of ochre, emerald, cream and deep navy, crisp infographic editorial layout, torn paper edges, washi tape corners, soft paper drop shadows.',
    bgColors: ['#0E121B', '#141A26', '#1E293B'],
    previewGradient: 'from-violet-600 via-indigo-600 to-[#d4ff00]',
  },
  {
    id: 'newsprint-editorial',
    name: 'Newsprint Editorial',
    description: 'Vintage newsprint broadsheet feature with heavy halftone print dots and tactile ink texture.',
    badge: 'Editorial',
    promptModifier:
      'Vintage newsprint editorial collage in the style of a mid-century front-page news feature: bold cut-out photographs and illustrations laid over a broadsheet newspaper page, heavy halftone print dots, aged newsprint texture with slight ink misregistration, tactile cinematic editorial energy.',
    bgColors: ['#12161F', '#1B2232', '#2A3449'],
    previewGradient: 'from-slate-700 via-zinc-800 to-slate-900',
  },
  {
    id: 'american-retro',
    name: 'American Retro',
    description: 'Vintage 1950s-60s advertising & pulp-magazine paper collage with nostalgic Western print imagery.',
    badge: 'Retro 1960s',
    promptModifier:
      'Vintage 1950s-60s American advertising and pulp-magazine paper collage: bold flat retro colors, mid-century engraved and illustrated Western cut-out figures, classic Americana printed imagery, aged pulp paper texture, halftone screen, nostalgic cinematic mood.',
    bgColors: ['#1B1218', '#261822', '#3D2034'],
    previewGradient: 'from-rose-600 via-orange-600 to-amber-500',
  },
  {
    id: 'zine',
    name: 'Punk Zine & Ransom',
    description: 'Gritty punk zine / ransom-note collage with torn newspaper scraps and photocopied contrast.',
    badge: 'High Contrast',
    promptModifier:
      'Gritty punk zine and ransom-note collage: torn newspaper and magazine scraps, cut-out mismatched headline letters, photocopied high-contrast halftone, black-and-white with one neon spot color, raw hand-cut scissor edges, DIY analog Xerox aesthetic.',
    bgColors: ['#161608', '#22220A', '#383810'],
    previewGradient: 'from-[#d4ff00] via-yellow-400 to-zinc-900',
  },
  {
    id: 'photo-collage',
    name: 'Archival Photo Collage',
    description: 'Cinematic documentary photo-collage with monochrome archival photographs & deep drop shadows.',
    badge: 'Documentary',
    promptModifier:
      'Cinematic documentary photo-collage: real black-and-white archival photographs cut out and layered with soft drop shadows, one restrained accent color, sepia and monochrome vintage photography, museum-curated editorial layout.',
    bgColors: ['#0B0E14', '#141822', '#222938'],
    previewGradient: 'from-blue-600 via-indigo-900 to-slate-950',
  },
  {
    id: 'gilded-deco',
    name: 'Luxury Gilded Deco',
    description: '1920s luxury art-deco editorial paper collage with gold foil paper accents and geometric line frames.',
    badge: 'Luxury 1920s',
    promptModifier:
      'Vintage luxury editorial paper collage, 1920s art-deco advertisement mood: aged cream paper with visible grain, champagne-gold foil paper accents, thin art-deco geometric line frames and gilded arches, torn French newspaper clippings, halftone print dots, opulent calm.',
    bgColors: ['#1C160B', '#2B200E', '#423214'],
    previewGradient: 'from-amber-400 via-yellow-600 to-amber-800',
  },
  {
    id: 'chinese-ink',
    name: 'Chinese Ink & Rice Paper',
    description: 'Woodblock-print cutouts, Dunhuang mineral pigments, aged rice paper, and vermilion seal stamps.',
    badge: 'Oriental Ink',
    promptModifier:
      'Mixed-media collage of Chinese woodblock-print and ink-mural cut-out figures, mineral pigments (ochre, vermilion, malachite green), aged rice-paper and Chinese newspaper clippings, vermilion seal stamps, elegant historical collage aesthetic.',
    bgColors: ['#180D10', '#261218', '#381B24'],
    previewGradient: 'from-red-600 via-stone-800 to-emerald-700',
  },
];

export const VOX_NARRATIVE_ARCS: VoxNarrativeArc[] = [
  {
    id: 'timeline',
    name: 'Timeline Explainer (Chronological)',
    description: 'Takes the viewer through key historical milestones from origin to breakthrough and modern future.',
    beatsPattern: ['Origins & Early Spark', 'The First Turning Point', 'The Explosive Breakthrough', 'Modern Legacy & Future'],
  },
  {
    id: 'problem-solution',
    name: 'Hook & Solution (Commercial Ad)',
    description: 'Opens with a relatable pain point, agitates the friction, introduces the revolutionary solution, and calls to action.',
    beatsPattern: ['The Friction / Hook', 'The Hidden Cost', 'The Revolutionary Discovery', 'The Transformation & CTA'],
  },
  {
    id: 'how-it-works',
    name: 'Mechanism Breakdown (Educational)',
    description: 'Demystifies complex engineering, economic, or biological systems step by step with tactile clarity.',
    beatsPattern: ['The Big Question', 'Core Principle (Under The Hood)', 'The Chain Reaction', 'Real-World Consequence'],
  },
  {
    id: 'deep-dive',
    name: 'Editorial Thesis (Thought Essay)',
    description: 'Presents a provocative thesis, presents archival evidence, challenges common belief, and leaves a profound takeaway.',
    beatsPattern: ['The Provocative Thesis', 'The Historical Evidence', 'The Unexpected Twist', 'The Takeaway Truth'],
  },
];

export const VOX_VOICES = [
  { id: 'male-vox', name: 'Marcus (Vox Editorial Doc)', gender: 'Male', accent: 'American', mood: 'Authoritative, curious & crisp' },
  { id: 'female-vox', name: 'Elena (Conversational Tech)', gender: 'Female', accent: 'Neutral', mood: 'Engaging, modern & fast-paced' },
  { id: 'calm-doc', name: 'David (Archival Historian)', gender: 'Male', accent: 'British', mood: 'Calm, observant & profound' },
  { id: 'punchy-ad', name: 'Maya (Dynamic Product Ad)', gender: 'Female', accent: 'American', mood: 'Punchy, vibrant & energetic' },
];

export const VOX_BGM_MOODS = [
  { id: 'investigative', name: 'Investigative Pulse', bpm: '110 BPM', instrument: 'Minimalist pizzicato strings & acoustic bass' },
  { id: 'lofi-groove', name: 'Upbeat Lo-Fi Collage', bpm: '90 BPM', instrument: 'Vintage Rhodes piano & dust-crackle beat' },
  { id: 'cinematic-epic', name: 'Cinematic Momentum', bpm: '124 BPM', instrument: 'Driving percussion & analog brass swell' },
  { id: 'ambient-tech', name: 'Modern Ambient Infographic', bpm: '100 BPM', instrument: 'Pristine arpeggiated bells & soft sub' },
];

export const SAMPLE_SHOWCASE_PROJECTS = [
  {
    id: 'demo-coffee',
    title: 'The Secret History of Coffee (Ethiopia 850 AD)',
    topic: 'How an Ethiopian goat herder named Kaldi discovered coffee beans and sparked a global revolution',
    styleId: 'newsprint-editorial',
    arcId: 'timeline',
    aspectRatio: '16:9',
    videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425287611_large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&auto=format&fit=crop&q=80',
    beatsCount: 4,
    narrationText: 'In 850 AD, an Ethiopian goat herder noticed his flock dancing with boundless energy after eating red berries. That accidental discovery ignited the worlds greatest trade empire.',
  },
  {
    id: 'demo-cold-brew',
    title: 'Artisanal Cold Brew Product Launch',
    topic: '18-hour cold steeped single-origin Ethiopian coffee beans bottled in vintage apothecary glass',
    styleId: 'modern-flat',
    arcId: 'problem-solution',
    aspectRatio: '9:16',
    videoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70868-537380145_large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=1000&auto=format&fit=crop&q=80',
    beatsCount: 4,
    narrationText: 'Standard coffee is roasted fast and bitter. We steep single-origin Arabica beans for eighteen slow hours in glacial water. Zero bitterness. 200mg of velvet energy.',
  },
  {
    id: 'demo-ai-chip',
    title: 'How GPUs Accidentally Built Artificial Intelligence',
    topic: 'How video game graphics silicon became the supercomputer engines of modern neural networks',
    styleId: 'zine',
    arcId: 'how-it-works',
    aspectRatio: '16:9',
    videoUrl: 'https://cdn.pixabay.com/video/2023/10/12/184734-874017770_large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1000&auto=format&fit=crop&q=80',
    beatsCount: 4,
    narrationText: 'In 1999, Nvidia built a chip to render 3D polygons for video games. Thirteen years later, a team of scientists realized that matrix math was identical to human neurons.',
  },
];
