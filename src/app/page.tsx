'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { FirstCampaignModal } from '@/components/promotions/FirstCampaignModal';
import { LiveCrazyBackground } from '@/components/home/LiveCrazyBackground';
import { DiwaliHeroCelebration } from '@/components/home/DiwaliHeroCelebration';
import {
  Sparkles,
  ArrowRight,
  Video,
  Image as ImageIcon,
  Mic,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Layers,
  ShieldCheck,
  Zap,
  Tag,
  Film,
  Sliders,
  ExternalLink,
  Camera,
} from 'lucide-react';

interface AdPreset {
  id: string;
  slug: string;
  title: string;
  category: string;
  aspect: '9:16' | '16:9';
  duration: string;
  credits: number;
  badge: string;
  videoUrl: string;
  poster: string;
  prompt: string;
  tags?: string[];
}

const FLAGSHIP_HERO_VIDEOS: AdPreset[] = [
  {
    id: 'vid_astronaut_spacewalk',
    slug: 'orbital-spacewalk-cinematic-sci-fi',
    title: 'Orbital Spacewalk — Cinematic Sci-Fi Film',
    category: 'Cinematic Sci-Fi',
    aspect: '16:9',
    duration: '8s',
    credits: 15,
    badge: 'Trending',
    videoUrl: '/media/showcase/vidai-astronaut-spacewalk.mp4',
    poster: '/media/showcase/vidai-astronaut-spacewalk.jpg',
    prompt: 'Photorealistic IMAX 70mm cinematic space sequence of an astronaut performing high-orbit spacewalk outside exterior solar truss, planet Earth curve glowing beneath with atmospheric blue haze, intense specular sun reflection on gold helmet visor, 8k masterpiece.',
    tags: ['#Spacewalk', '#SciFiCommercial', '#Cinematic4K', '#Astronaut', '#IMAXSpace'],
  },
  {
    id: 'vid_jungle_expedition',
    slug: 'amazonia-expedition-cinematic-adventure',
    title: 'Amazonia Expedition — Cinematic Adventure',
    category: 'Adventure Film',
    aspect: '16:9',
    duration: '9s',
    credits: 15,
    badge: 'Featured',
    videoUrl: '/media/showcase/vidai-jungle-expedition.mp4',
    poster: '/media/showcase/vidai-jungle-expedition.jpg',
    prompt: 'Cinematic action adventure film close-up of determined female explorer in rugged khaki jacket carefully parting giant wet monstera leaf in dense humid rainforest, water droplets glinting on skin, soft volumetric god rays piercing misty canopy, 4k 60fps.',
    tags: ['#JungleAdventure', '#CinematicFilm', '#Expedition', '#OutdoorBrand'],
  },
  {
    id: 'vid_haute_couture_skaters',
    slug: 'swan-elegance-haute-couture-ice-gala',
    title: 'Swan Elegance — Haute Couture Ice Gala',
    category: 'Haute Couture',
    aspect: '16:9',
    duration: '15s',
    credits: 15,
    badge: 'Hot',
    videoUrl: '/media/showcase/vidai-haute-couture-skaters.mp4',
    poster: '/media/showcase/vidai-haute-couture-skaters.jpg',
    prompt: 'Haute couture fashion editorial commercial of synchronized female ice skaters in shimmering crystal-embellished swan feather gowns gliding gracefully across mist-covered arena ice rink, moody stadium floodlights, vogue elegance, slow motion 4k.',
    tags: ['#HauteCouture', '#FashionFilm', '#IceGala', '#LuxuryCampaign'],
  },
  {
    id: 'vid_snow_avalanche',
    slug: 'apex-descent-extreme-powder-snowboarding',
    title: 'Apex Descent — Extreme Powder Snowboarding',
    category: 'Action Sports',
    aspect: '16:9',
    duration: '15s',
    credits: 15,
    badge: 'Viral',
    videoUrl: '/media/showcase/vidai-snow-avalanche.mp4',
    poster: '/media/showcase/vidai-snow-avalanche.jpg',
    prompt: 'Action sports commercial tracking shot of snowboarder in high-tech grey storm jacket bombing down steep untouched alpine glacier, massive billowing powder cloud rising behind, blinding blue sky, high shutter speed action 4k.',
    tags: ['#ExtremeSports', '#Snowboarding', '#AvalancheAction', '#WinterCampaign'],
  },
  {
    id: 'vid_cyberpunk_superbike',
    slug: 'neo-tokyo-gp-cyberpunk-superbike-street-race',
    title: 'Neo-Tokyo GP — Cyberpunk Superbike Street Race',
    category: 'Automotive & Cinematic',
    aspect: '16:9',
    duration: '15s',
    credits: 15,
    badge: 'New',
    videoUrl: '/media/showcase/vidai-cyberpunk-superbike.mp4',
    poster: '/media/showcase/vidai-cyberpunk-superbike.jpg',
    prompt: 'Cyberpunk racing commercial shot of modified bright orange sports superbike drifting aggressively through wet rain-drenched neon Tokyo city boulevard at midnight, water spray mist illuminated by passing car headlights, Akira racing aesthetic, 4k 60fps.',
    tags: ['#CyberpunkRacing', '#Superbike', '#TokyoNight', '#AutomotiveAd'],
  },
];

// Original 9:16 Vertical Viral UGC & Social Reel Presets (Restored)
const VERTICAL_PRESETS: AdPreset[] = [
  {
    id: 'vid_09',
    slug: 'empire-cash-viral-ugc-hook',
    title: 'Empire Drop — Viral Cash UGC Hook',
    category: 'AI Influencer & UGC Hook',
    aspect: '9:16',
    duration: '15s',
    credits: 15,
    badge: 'Viral Hook',
    videoUrl: '/media/templates/tmpl-ugc-wealth-hook.mp4',
    poster: '/media/templates/poster-vid-ugc-wealth.jpg',
    prompt: 'High-energy viral social media hook of young creator in modern penthouse cascading thick brick stacks of hundred-dollar bills, dynamic handheld camera motion, luxury lifestyle aesthetic, natural bedroom window light, photorealistic 4k.',
    tags: ['#ViralHook', '#UGCCreator', '#TikTokAd'],
  },
  {
    id: 'vid_10',
    slug: 'matchday-celebration-football-star',
    title: 'Matchday Celebration — Football Star Reel',
    category: 'Sports & Social Reels',
    aspect: '9:16',
    duration: '6s',
    credits: 15,
    badge: 'Trending',
    videoUrl: '/media/templates/tmpl-sports-celebrity-reel.mp4',
    poster: '/media/templates/poster-vid-sports-celebrity.jpg',
    prompt: 'Cinematic celebration reel of football legend in red and green #7 national kit dancing with charismatic motion at gala banquet, studio softbox ambient fill light, sharp depth of field, 4k 60fps.',
    tags: ['#FootballStar', '#CelebrationReel', '#CR7Vibe'],
  },
  {
    id: 'vid_11',
    slug: 'costa-privee-mediterranean-resort',
    title: 'Costa Privée — Mediterranean Resort',
    category: 'Luxury Travel & Hospitality',
    aspect: '9:16',
    duration: '11s',
    credits: 15,
    badge: 'Featured',
    videoUrl: '/media/templates/tmpl-mediterranean-resort.mp4',
    poster: '/media/templates/poster-vid-mediterranean-resort.jpg',
    prompt: 'Cinematic luxury travel commercial featuring distinguished silver-haired gentleman in crisp white linen shirt relaxing at seaside Mediterranean beach club terrace, warm sunlight, gentle bokeh, luxury vacation vibe, 4k ultra-hd.',
    tags: ['#LuxuryTravel', '#ResortCommercial', '#QuietLuxury'],
  },
  {
    id: 'vid_12',
    slug: 'veloce-apex-cyber-hyperkart',
    title: 'Veloce Apex — Cyber Hyperkart',
    category: 'Automotive & Cinematic Ad',
    aspect: '9:16',
    duration: '16s',
    credits: 15,
    badge: 'Hot Reveal',
    videoUrl: '/media/templates/tmpl-cyber-hyperkart.mp4',
    poster: '/media/templates/poster-vid-cyber-hyperkart.jpg',
    prompt: 'Dramatic low-angle commercial reveal of futuristic custom twin-seat electric racing hyperkart in industrial concrete hangar, glossy black aero bodywork, wide track tires, atmospheric volumetric lighting, photorealistic automotive cinematography.',
    tags: ['#Hyperkart', '#ElectricRacing', '#AutomotiveCommercial'],
  },
];

// Original 16:9 Widescreen Commercial Ad Presets (Restored)
const FEATURED_AD_TEMPLATES: AdPreset[] = [
  {
    id: 'tmpl_01',
    slug: 'cinematic-product-commercial',
    title: 'Aura Privée — Luxury Perfume Film',
    category: 'Product Commercial',
    aspect: '16:9',
    duration: '15s',
    credits: 15,
    badge: 'Top Seller',
    videoUrl: '/media/templates/tmpl-02-luxury-perfume.mp4',
    poster: '/media/templates/poster-vid-01-perfume.jpg',
    prompt: 'Ultra-luxury midnight perfume bottle floating over liquid gold ripples, dramatic rim lighting, 4k cinematic commercial.',
    tags: ['#LuxuryPerfume', '#ProductFilm', '#Cinematic4K'],
  },
  {
    id: 'tmpl_02',
    slug: 'automotive-cinematic-film',
    title: 'AeroGT Hypercar Launch Campaign',
    category: 'Cinematic Automotive',
    aspect: '16:9',
    duration: '15s',
    credits: 15,
    badge: 'Hot',
    videoUrl: '/media/templates/tmpl-05-automotive-film.mp4',
    poster: '/media/templates/poster-vid-03-automotive.jpg',
    prompt: 'Sleek aerodynamic concept hypercar drifting through twilight mountain pass, laser grid reflections, photorealistic 8k.',
    tags: ['#Hypercar', '#AutomotiveCommercial', '#TwilightDrift'],
  },
  {
    id: 'tmpl_03',
    slug: 'skincare-product-reel',
    title: 'HydraLuxe Bio-Cellular Serum',
    category: 'Skincare & Beauty',
    aspect: '16:9',
    duration: '15s',
    credits: 15,
    badge: 'Trending',
    videoUrl: '/media/templates/tmpl-03-skincare-reel.mp4',
    poster: '/media/templates/poster-vid-02-skincare.jpg',
    prompt: 'Macro slow-motion droplet of golden hydration serum falling onto frosted glass podium, luxury cosmetic aesthetic.',
    tags: ['#Skincare', '#SerumCommercial', '#BeautyCreative'],
  },
  {
    id: 'tmpl_04',
    slug: 'technology-product-launch',
    title: 'Apex Titanium Pro Smartphone',
    category: 'Technology & Hardware',
    aspect: '16:9',
    duration: '15s',
    credits: 15,
    badge: 'Flagship',
    videoUrl: '/media/templates/tmpl-09-tech-product.mp4',
    poster: '/media/templates/poster-vid-04-smartphone.jpg',
    prompt: 'Futuristic titanium smartphone rotating seamlessly in zero-gravity space, micro lens reflections, clean studio lighting.',
    tags: ['#SmartphoneLaunch', '#TechHardware', '#StudioLighting'],
  },
];

function VerticalPresetCard({ preset }: { preset: AdPreset }) {
  const cardVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardVideoRef.current) {
      cardVideoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardVideoRef.current) {
      cardVideoRef.current.pause();
      cardVideoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="business-card overflow-hidden flex flex-col justify-between group rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-md transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 100% CLEAN VIDEO CONTAINER — NO TEXT, NO BADGES OVERLAYED ON THE VIDEO */}
      <div className="relative aspect-[9/16] w-full bg-[#17191D] overflow-hidden">
        <img
          src={preset.poster}
          alt={preset.title}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <video
          ref={cardVideoRef}
          src={preset.videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      </div>

      {/* METADATA CLEANLY UNDERNEATH VIDEO (ZERO TEXT ON THE VIDEO) */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-white border-t border-[#F1F3F5]">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF] truncate">
              {preset.category}
            </span>
            <span className="text-[10px] font-mono text-[#667085] bg-[#F1F3F5] px-1.5 py-0.5 rounded shrink-0">
              {preset.duration} • 9:16
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#17191D] line-clamp-1">{preset.title}</h4>
          <p className="text-[11px] text-[#667085] line-clamp-2 mt-1 leading-relaxed">
            {preset.prompt}
          </p>
        </div>

        <div className="space-y-2 pt-1 border-t border-[#F1F3F5]">
          <Link
            href={`/create?prompt=${encodeURIComponent(preset.prompt)}&aspect=9:16&mode=video`}
            className="w-full py-2 px-3 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use This Preset</span>
          </Link>
          <Link
            href={`/templates/${preset.slug}`}
            className="w-full py-1 text-center text-[11px] font-medium text-[#667085] hover:text-[#5145CD] transition-colors block"
          >
            Explore Storyboard →
          </Link>
        </div>
      </div>
    </div>
  );
}

function WidescreenPresetCard({ preset }: { preset: AdPreset }) {
  const cardVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardVideoRef.current) {
      cardVideoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardVideoRef.current) {
      cardVideoRef.current.pause();
      cardVideoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="business-card overflow-hidden flex flex-col justify-between group rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-md transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video w-full bg-[#17191D] overflow-hidden">
        <img
          src={preset.poster}
          alt={preset.title}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <video
          ref={cardVideoRef}
          src={preset.videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-white border-t border-[#F1F3F5]">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF] truncate">
              {preset.category}
            </span>
            <span className="text-[10px] font-mono text-[#667085] bg-[#F1F3F5] px-1.5 py-0.5 rounded shrink-0">
              {preset.duration} • 16:9
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#17191D] line-clamp-1">{preset.title}</h4>
          <p className="text-[11px] text-[#667085] line-clamp-2 mt-1 leading-relaxed">
            {preset.prompt}
          </p>
        </div>

        <div className="space-y-2 pt-1 border-t border-[#F1F3F5]">
          <Link
            href={`/create?prompt=${encodeURIComponent(preset.prompt)}&aspect=16:9&mode=video`}
            className="w-full py-2 px-3 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use Template</span>
          </Link>
          <Link
            href={`/templates/${preset.slug}`}
            className="w-full py-1 text-center text-[11px] font-medium text-[#667085] hover:text-[#5145CD] transition-colors block"
          >
            Explore Storyboard →
          </Link>
        </div>
      </div>
    </div>
  );
}

const OPENHIGGS_FEATURED_MODELS = [
  {
    id: 'seedance',
    name: 'Seedance 2.5 Director',
    provider: 'Seedance Engine',
    badge: 'Flagship Video',
    tagColor: 'text-[#d1fe17] bg-[#152212] border-[#d1fe17]/40',
    description: 'Next-generation cinematic video synthesis with frame-accurate multi-angle director control and video extension.',
    specs: {
      maxRes: '4K Ultra HD',
      modes: 'T2V, I2V, Frame Edit, Extend',
      fps: '24 / 30 / 60 FPS',
      cameraControl: 'Pan, Tilt, Zoom, Roll, Dolly',
    },
    samplePrompt: 'Cinematic wide tracking shot of a matte-black electric hypercar accelerating through neon-lit rainy Tokyo highway at night, anamorphic reflections, 4k 60fps.',
  },
  {
    id: 'kling',
    name: 'Kling 3.0 Motion Pro',
    provider: 'Kling AI',
    badge: 'Fluid Motion',
    tagColor: 'text-pink-400 bg-pink-950/40 border-pink-500/40',
    description: 'Master of high-speed fluid motion, physics simulation, and complex character interactions with start and end keyframes.',
    specs: {
      maxRes: '4K Cinema',
      modes: 'T2V, I2V, Start/End Frames',
      fps: '30 / 60 FPS',
      cameraControl: 'Trajectory Path, Orbital 360',
    },
    samplePrompt: 'High-speed camera tracking a glass perfume bottle splashing into turquoise glacial water in super slow-motion, liquid droplets shimmering with sunlight.',
  },
  {
    id: 'soul',
    name: 'Soul Cinema 4K',
    provider: 'Soul Engine',
    badge: 'Photoreal Color',
    tagColor: 'text-blue-400 bg-blue-950/40 border-blue-500/40',
    description: 'Photorealistic film-grade color science with natural organic light scatter, depth-of-field, and emotional closeups.',
    specs: {
      maxRes: '4K 10-Bit Log',
      modes: 'T2V, I2V, Master Grades',
      fps: '24 FPS Cinematic',
      cameraControl: 'Handheld organic, Steadicam',
    },
    samplePrompt: 'Intimate cinematic 35mm portrait shot of an artisan barista pouring micro-foam latte art, warm morning volumetric light through café window.',
  },
  {
    id: 'wan',
    name: 'Wan 3 Prime',
    provider: 'Wan AI',
    badge: 'Dynamic Range',
    tagColor: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/40',
    description: 'Extreme dynamic range model handling high-contrast scenes, volumetric fog, explosive action, and sci-fi environments.',
    specs: {
      maxRes: '4K HDR',
      modes: 'T2V, I2V, Video FX',
      fps: '30 FPS',
      cameraControl: 'Drone fly-through, Crane shot',
    },
    samplePrompt: 'FPV drone fly-through traversing deep into an ethereal bioluminescent cavern with glowing crystalline flora and floating neon particles.',
  },
  {
    id: 'flux',
    name: 'Flux 3 Ultra',
    provider: 'Black Forest Labs',
    badge: 'Studio Image',
    tagColor: 'text-purple-400 bg-purple-950/40 border-purple-500/40',
    description: 'The pinnacle of studio photography and typographical accuracy. Renders exact logos, billboards, and clean text.',
    specs: {
      maxRes: '4K / 8K Still',
      modes: 'T2I, I2I, Inpaint',
      fps: 'Ultra Still Rendering',
      cameraControl: 'Studio Lighting, Macro 100mm',
    },
    samplePrompt: 'Luxury titanium watch on dark marble slab, crisp engraved brand typography on dial, sharp macro studio lighting, Hasselblad photorealism.',
  },
  {
    id: 'ideogram',
    name: 'Ideogram 4 Text Pro',
    provider: 'Ideogram',
    badge: 'Typography Leader',
    tagColor: 'text-amber-400 bg-amber-950/40 border-amber-500/40',
    description: 'Flawless poster and typographic layouts. Renders exact slogans, multi-line packaging, and brand identities with zero distortions.',
    specs: {
      maxRes: '4K Poster Graphic',
      modes: 'T2I, Design Style, Lettering',
      fps: 'Vector-Grade Raster',
      cameraControl: 'Graphic Flatlay, Isometric',
    },
    samplePrompt: 'Vintage retro travel poster with bold typography stating "SUMMER ESCAPE", sunset over Amalfi coast, vibrant grain and pastel palette.',
  },
];

const OPENHIGGS_MODELS_TICKER = [
  'Seedance 2.5 Director', 'Seedance 2.5 Frame Edit', 'Seedance 2.5 Extend', 'Seedance 2.0 Fast', 'Seedance 2.0 Mini',
  'Kling 3.0 Pro', 'Kling 3.0 Standard', 'Kling 3.0 Turbo', 'Kling 2.6', 'Kling 2.5', 'Kling O1', 'Kling O3',
  'Soul Cinema 4K', 'Soul 2', 'DOP Camera Control',
  'Wan 3 Prime', 'Wan 3.0', 'Wan 2.7', 'Wan 2.6',
  'MiniMax Hailuo 2.3', 'MiniMax H3',
  'Flux 3 Ultra', 'Flux 2 Pro', 'Ideogram 4', 'Recraft 4.1', 'Grok Imagine 2', 'Grok Imagine Video 1.5',
  'PixVerse 6', 'LTX 2.5 Pro', 'LTX 2.5 Fast', 'Qwen Image 3', 'Happy Horse 1.1', 'Happy Horse 1.0', 'Z-Image Turbo',
];

export default function HomePage() {
  const [heroChannel, setHeroChannel] = useState<'flagship' | 'vertical' | 'commercials'>('flagship');
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const [unmutedHeroIndex, setUnmutedHeroIndex] = useState<number | null>(null);
  const [heroVideoProgress, setHeroVideoProgress] = useState(0);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);
  const [autoAdvancePaused, setAutoAdvancePaused] = useState(false);
  const mainHeroVideoRef = useRef<HTMLVideoElement | null>(null);
  const heroVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const activeHeroList = heroChannel === 'flagship'
    ? FLAGSHIP_HERO_VIDEOS
    : heroChannel === 'vertical'
    ? VERTICAL_PRESETS
    : FEATURED_AD_TEMPLATES;

  // Advance to next video in continuous loop
  const advanceToNextHeroVideo = useCallback(() => {
    setSelectedHeroIndex((prev) => (prev + 1) % activeHeroList.length);
    setHeroVideoProgress(0);
  }, [activeHeroList.length]);

  // When selected video or channel changes, auto-play it
  useEffect(() => {
    const video = mainHeroVideoRef.current;
    if (!video) return;
    setHeroVideoProgress(0);
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsHeroPlaying(true))
        .catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
    }
  }, [selectedHeroIndex, heroChannel]);

  // Fallback safety timer: in case onEnded is delayed or skipped by browser
  useEffect(() => {
    if (autoAdvancePaused || !isHeroPlaying) return;

    const currentItem = activeHeroList[selectedHeroIndex] || activeHeroList[0];
    const durationSec = parseInt(currentItem.duration, 10) || 10;
    const timer = setTimeout(() => {
      advanceToNextHeroVideo();
    }, (durationSec + 0.8) * 1000);

    return () => clearTimeout(timer);
  }, [selectedHeroIndex, heroChannel, autoAdvancePaused, isHeroPlaying, advanceToNextHeroVideo, activeHeroList]);

  const togglePlayPause = () => {
    const v = mainHeroVideoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => {
          setIsHeroPlaying(true);
          setAutoAdvancePaused(false);
        })
        .catch(() => {});
    } else {
      v.pause();
      setIsHeroPlaying(false);
      setAutoAdvancePaused(true);
    }
  };
  const [galleryTab, setGalleryTab] = useState<'vertical' | 'widescreen' | 'flagship'>('vertical');
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const [activeModelTab, setActiveModelTab] = useState<'seedance' | 'kling' | 'soul' | 'wan' | 'flux' | 'ideogram'>('seedance');
  const [openHiggsPrompt, setOpenHiggsPrompt] = useState('');
  const [showcaseMouse, setShowcaseMouse] = useState<{ x: number; y: number; isHovered: boolean }>({
    x: 0,
    y: 0,
    isHovered: false,
  });

  const handleShowcaseMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showcaseRef.current) return;
    const rect = showcaseRef.current.getBoundingClientRect();
    setShowcaseMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovered: true,
    });
  };

  const selectedPreset = activeHeroList[selectedHeroIndex] || activeHeroList[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#17191D] selection:bg-[#EEF2FF] selection:text-[#5145CD] overflow-x-hidden max-w-full">
      <Header />
      <FirstCampaignModal />

      <main className="flex-1 w-full overflow-x-hidden">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: COMMERCIAL VIDEO CREATIVE ENGINE */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F7F8FA] to-[#FFFFFF] border-b border-[#E5E7EB] w-full">
          {/* Live Interactive Canvas & Aurora Background */}
          <LiveCrazyBackground />

          {/* Diwali Festive Rangoli & Interactive Firecrackers Animation */}
          <DiwaliHeroCelebration />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
              {/* Diwali Special Festive Banner */}
              <div className="flex justify-center mb-0.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FEF3C7] via-[#FFFBEB] to-[#FEF3C7] border border-[#F59E0B]/60 text-xs text-[#92400E] font-bold shadow-xs hover:shadow-md transition-all">
                  <span className="text-sm">🪔</span>
                  <span className="tracking-wide">Shubh Diwali Edition • Light Up Your Ad Creatives</span>
                  <span className="text-xs">✨</span>
                </div>
              </div>

              {/* Flagship OpenHiggs Announcement Pill */}
              <div className="flex justify-center mb-1">
                <Link
                  href="/openhiggs"
                  className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0E150F] border border-[#d1fe17]/60 text-xs text-white shadow-lg hover:border-[#d1fe17] hover:shadow-[0_0_25px_rgba(209,254,23,0.35)] transition-all group max-w-full truncate"
                >
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d1fe17] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d1fe17]" />
                  </span>
                  <span className="text-[#d1fe17] font-black uppercase tracking-wider text-[10px] sm:text-[11px] shrink-0">
                    New Studio
                  </span>
                  <span className="text-slate-200 font-medium truncate">
                    OpenHiggs Studio is live with 38 Foundation Models
                  </span>
                  <span className="text-[10px] font-mono bg-[#d1fe17]/20 text-[#d1fe17] px-1.5 py-0.2 rounded font-bold hidden md:inline shrink-0">
                    Seedance 2.5 • Kling 3.0 • Wan 3
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#d1fe17] group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              </div>

              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-xs font-semibold text-[#5145CD] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>Commercial Video Creatives</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#17191D] leading-[1.15] break-words">
                Create high-converting video ads{' '}
                <span className="text-[#5145CD]">in minutes.</span>
              </h1>

              {/* Concise Supporting Copy */}
              <p className="text-base sm:text-lg text-[#667085] max-w-2xl mx-auto leading-relaxed">
                Empower your marketing team to produce broadcast-quality product commercials, performance video ads, and localized voiceovers from simple product inputs with next-generation commercial video engines.
              </p>

              {/* Strong Primary Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/openhiggs"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[#0F1607] bg-[#d1fe17] hover:bg-[#ddfe50] shadow-sm hover:shadow-[0_0_25px_rgba(209,254,23,0.4)] transition-all text-sm group"
                >
                  <Zap className="w-4 h-4 fill-current text-[#0F1607]" />
                  <span>OpenHiggs Studio (38 Models)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-[#5145CD] hover:bg-[#4338CA] shadow-sm hover:shadow-[0_10px_25px_rgba(81,69,205,0.3)] transition-all text-sm group"
                >
                  <span>Start Creating Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-[#17191D] bg-[#FFFFFF] hover:bg-[#F7F8FA] border border-[#E5E7EB] shadow-xs hover:border-[#C7D2FE] transition-all text-sm"
                >
                  <Film className="w-4 h-4 text-[#5145CD]" />
                  <span>Browse Ad Templates</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-[#667085]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>No credit card required to explore</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>1080p HD Video Exports</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Commercial rights included</span>
                </span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* HERO 16:9 FLAGSHIP CINEMATIC THEATER & 5-VIDEO INTERACTIVE SHOWCASE */}
            {/* ========================================================================= */}
            <div
              ref={showcaseRef}
              onMouseMove={handleShowcaseMouseMove}
              onMouseEnter={() => setShowcaseMouse((prev) => ({ ...prev, isHovered: true }))}
              onMouseLeave={() => setShowcaseMouse((prev) => ({ ...prev, isHovered: false }))}
              className="relative rounded-3xl border border-[#E5E7EB] bg-white/95 backdrop-blur-md shadow-2xl p-4 sm:p-6 max-w-5xl mx-auto mt-6 sm:mt-8 overflow-hidden transition-all duration-300"
            >
              {/* Dynamic Mouse Sheen Reflection on Showcase Card */}
              {showcaseMouse.isHovered && (
                <div
                  className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-3xl"
                  style={{
                    background: `radial-gradient(550px circle at ${showcaseMouse.x}px ${showcaseMouse.y}px, rgba(81, 69, 205, 0.08), rgba(56, 189, 248, 0.03) 40%, transparent 70%)`,
                  }}
                />
              )}

              {/* Top Navigation & Status Bar */}
              <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-[#E5E7EB] relative z-10 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                  <span className="font-bold text-xs sm:text-sm text-[#17191D]">
                    Flagship Cinema Showcase
                  </span>
                  
                  {/* Channels / Categories Switcher */}
                  <div className="inline-flex p-0.5 rounded-lg bg-[#F1F3F5] border border-[#E5E7EB] text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setHeroChannel('flagship');
                        setSelectedHeroIndex(0);
                        setAutoAdvancePaused(false);
                      }}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        heroChannel === 'flagship'
                          ? 'bg-white text-[#5145CD] shadow-xs'
                          : 'text-[#667085] hover:text-[#17191D]'
                      }`}
                    >
                      <span>🎬 4K Cinema</span>
                      <span className="text-[10px] font-mono opacity-80">(5)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHeroChannel('vertical');
                        setSelectedHeroIndex(0);
                        setAutoAdvancePaused(false);
                      }}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        heroChannel === 'vertical'
                          ? 'bg-white text-[#5145CD] shadow-xs'
                          : 'text-[#667085] hover:text-[#17191D]'
                      }`}
                    >
                      <span>⚡ 9:16 Viral</span>
                      <span className="text-[10px] font-mono opacity-80">(4)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHeroChannel('commercials');
                        setSelectedHeroIndex(0);
                        setAutoAdvancePaused(false);
                      }}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        heroChannel === 'commercials'
                          ? 'bg-white text-[#5145CD] shadow-xs'
                          : 'text-[#667085] hover:text-[#17191D]'
                      }`}
                    >
                      <span>💎 Brand Ads</span>
                      <span className="text-[10px] font-mono opacity-80">(4)</span>
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-[#5145CD] bg-[#EEF2FF] px-2 py-0.5 rounded-full border border-[#C7D2FE] font-semibold hidden md:inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5145CD] animate-ping" />
                    Auto-Play ({selectedHeroIndex + 1}/{activeHeroList.length})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Play / Pause Toggle Button */}
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] hover:bg-white text-xs font-semibold text-[#17191D] transition-colors cursor-pointer shadow-2xs"
                    title={isHeroPlaying ? 'Pause rotation' : 'Resume auto-play'}
                  >
                    {isHeroPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-[#5145CD]" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-[#10B981] fill-[#10B981]" />
                        <span>Play</span>
                      </>
                    )}
                  </button>

                  {/* Next Video Button */}
                  <button
                    type="button"
                    onClick={() => {
                      advanceToNextHeroVideo();
                      setAutoAdvancePaused(false);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] hover:bg-white text-xs font-medium text-[#17191D] transition-colors cursor-pointer shadow-2xs"
                    title="Next Scene"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3 h-3 text-[#5145CD]" />
                  </button>

                  {/* Sound Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (unmutedHeroIndex !== null) {
                        setUnmutedHeroIndex(null);
                      } else {
                        setUnmutedHeroIndex(selectedHeroIndex);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] hover:bg-white text-xs font-semibold text-[#17191D] transition-colors cursor-pointer shadow-2xs"
                    title={unmutedHeroIndex !== null ? 'Mute audio' : 'Unmute audio'}
                  >
                    {unmutedHeroIndex !== null ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#5145CD]" />
                        <span>Sound On</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-[#667085]" />
                        <span>Audio Muted</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* MAIN 16:9 CINEMA THEATER VIEWPORT */}
              <div className="relative aspect-[16/9] w-full bg-[#0D0E12] rounded-2xl overflow-hidden shadow-2xl border border-slate-900 group">
                {/* Thin Cinema Live Progress Bar at Top of Video */}
                <div className="absolute top-0 inset-x-0 h-1 bg-black/40 z-30 pointer-events-none">
                  <div
                    className="h-full bg-gradient-to-r from-[#5145CD] via-[#818CF8] to-[#d1fe17] transition-all duration-150 ease-linear shadow-[0_0_10px_rgba(81,69,205,0.8)]"
                    style={{ width: `${heroVideoProgress}%` }}
                  />
                </div>

                {/* Ambient Blurred Colored Glow Backdrop */}
                <img
                  src={selectedPreset.poster}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-125 pointer-events-none"
                />

                {/* Primary High-Resolution Video with Automatic Next Trigger */}
                <video
                  ref={mainHeroVideoRef}
                  key={selectedPreset.videoUrl}
                  src={selectedPreset.videoUrl}
                  poster={selectedPreset.poster}
                  autoPlay
                  muted={unmutedHeroIndex === null}
                  playsInline
                  preload="auto"
                  onPlay={() => setIsHeroPlaying(true)}
                  onPause={() => setIsHeroPlaying(false)}
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (v.duration && !isNaN(v.duration) && v.duration > 0) {
                      const pct = (v.currentTime / v.duration) * 100;
                      setHeroVideoProgress(pct);
                    }
                  }}
                  onEnded={() => {
                    advanceToNextHeroVideo();
                  }}
                  className="relative z-10 w-full h-full object-cover cursor-pointer"
                  onClick={togglePlayPause}
                />

                {/* In-Video Motion Headline Tag */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 pointer-events-none text-left">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-mono text-[#5145CD] font-bold border border-white/40 shadow-xs">
                    FLUVIA FLOW • {selectedPreset.category.toUpperCase()} • 1080P
                  </span>
                  <h3 className="mt-2 text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-lg">
                    {selectedPreset.title.split('—')[0].trim().toUpperCase()}
                  </h3>
                </div>

                {/* Floating Center Pause/Play Status Indicator (Click to toggle) */}
                <div
                  onClick={togglePlayPause}
                  className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/20"
                >
                  <div className="p-3.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-xl hover:scale-110 transition-transform">
                    {isHeroPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-[#d1fe17] fill-[#d1fe17]" />
                    )}
                  </div>
                </div>

                {/* Bottom Video Controls Overlay */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="font-mono text-slate-200 text-[11px]">
                      Scene {selectedHeroIndex + 1} of {activeHeroList.length}: {selectedPreset.title} • {selectedPreset.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#5145CD] text-white font-bold hidden sm:inline">
                      Gemini Omni 1.1 Flash
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/70 font-mono border border-white/20">
                      15 cr
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTIVE CHANNEL SCENE SELECTOR STRIP */}
              <div className={`mt-4 grid gap-2.5 sm:gap-3 ${
                activeHeroList.length === 5 ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'
              }`}>
                {activeHeroList.map((preset, idx) => {
                  const isSelected = selectedHeroIndex === idx;

                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        setSelectedHeroIndex(idx);
                        setAutoAdvancePaused(false);
                        if (unmutedHeroIndex !== null) setUnmutedHeroIndex(idx);
                      }}
                      className={`cursor-pointer rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between text-left group/card ${
                        isSelected
                          ? 'bg-[#EEF2FF] border-[#5145CD] ring-2 ring-[#5145CD]/40 shadow-md scale-[1.02]'
                          : 'bg-white border-[#E5E7EB] hover:border-[#5145CD]/50 hover:shadow-md'
                      }`}
                    >
                      {/* Video Thumbnail with Hover Preview */}
                      <div className="relative aspect-[16/10] w-full bg-[#0D0E12] overflow-hidden">
                        <img
                          src={preset.poster}
                          alt={preset.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                        />
                        <video
                          src={preset.videoUrl}
                          poster={preset.poster}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-[9px] font-mono">
                          <span>Scene {idx + 1}</span>
                          <span>{preset.duration}</span>
                        </div>
                      </div>

                      {/* Card Label & Active Progress Fill */}
                      <div className="p-2 sm:p-2.5 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-semibold text-[#5145CD] truncate">
                            {preset.category}
                          </span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5145CD] animate-ping" />
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-[#17191D] truncate">
                          {preset.title.split('—')[0].trim()}
                        </h4>

                        {/* Individual Scene Live Progress Bar */}
                        {isSelected && (
                          <div className="w-full h-1 bg-[#EEF2FF] border border-[#5145CD]/20 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-[#5145CD] transition-all duration-150 ease-linear rounded-full"
                              style={{ width: `${heroVideoProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DYNAMIC PROMPT BAR FOR SELECTED PRESET (CLEANLY BELOW GRID) */}
              {selectedPreset && (
                <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-left">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-[#17191D]">
                          {selectedPreset.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF]">
                          {selectedPreset.category}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E5E7EB] text-[#17191D]">
                          {selectedPreset.aspect} Cinema • {selectedPreset.duration}
                        </span>
                      </div>
                      <p className="text-[#667085] text-xs line-clamp-2 leading-relaxed">
                        &ldquo;{selectedPreset.prompt}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <Link
                      href={`/create?prompt=${encodeURIComponent(selectedPreset.prompt)}&aspect=${selectedPreset.aspect}&mode=video`}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Use This Preset</span>
                    </Link>
                    <Link
                      href={`/templates/${selectedPreset.slug}`}
                      className="hidden sm:inline-flex px-3 py-2.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#17191D] font-medium text-xs transition-colors"
                    >
                      Explore Storyboard →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 1.5 OPENHIGGS STUDIO SPOTLIGHT (38 MODELS • 1 COMPOSER • OPEN-SOURCE) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#0B0D14] text-white border-b border-white/10 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#d1fe17]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#5145CD]/20 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header Badge & Title */}
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#152117] border border-[#d1fe17]/50 text-[#d1fe17] text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(209,254,23,0.3)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OpenHiggs AI Integration</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                38 Foundation Models. <span className="text-[#d1fe17]">One Universal Prompt Bar.</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                The open creative alternative to fragmented AI subscriptions is now integrated directly into FLUVIA FLOW. Generate cinematic video and studio 4K images across 38 models with zero vendor lock-in.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/openhiggs"
                  className="px-6 py-3 rounded-xl bg-[#d1fe17] hover:bg-[#ddfe51] text-[#141a02] font-black text-sm shadow-[0_0_25px_rgba(209,254,23,0.45)] transition-all flex items-center gap-2 transform hover:scale-[1.02] active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-current text-[#141a02]" />
                  <span>Launch OpenHiggs Studio</span>
                  <ArrowRight className="w-4 h-4 text-[#141a02]" />
                </Link>

                <Link
                  href="/pricing"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition-all flex items-center gap-2"
                >
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Explore OpenHiggs Plans (3 Plans • 20% OFF)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* INTERACTIVE MODEL TEST-DRIVE DECK */}
            {(() => {
              const currentModel = OPENHIGGS_FEATURED_MODELS.find((m) => m.id === activeModelTab) || OPENHIGGS_FEATURED_MODELS[0];
              return (
                <div className="mb-14 rounded-3xl bg-[#121622] border-2 border-white/10 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-white/10">
                    {OPENHIGGS_FEATURED_MODELS.map((model) => {
                      const isActive = activeModelTab === model.id;
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            setActiveModelTab(model.id as any);
                            setOpenHiggsPrompt(model.samplePrompt);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                            isActive
                              ? 'bg-[#d1fe17] text-[#0f1505] shadow-[0_0_15px_rgba(209,254,23,0.35)]'
                              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                          }`}
                        >
                          <span>{model.name.split(' ')[0]}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                            isActive ? 'bg-[#0f1505]/20 text-[#0f1505]' : 'bg-white/10 text-slate-400'
                          }`}>
                            {model.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Model Details & Spec Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1 space-y-3 text-left">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${currentModel.tagColor}`}>
                          {currentModel.badge}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">by {currentModel.provider}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {currentModel.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {currentModel.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Max Resolution</span>
                          <span className="text-white font-bold font-mono">{currentModel.specs.maxRes}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Frame Rates</span>
                          <span className="text-white font-bold font-mono">{currentModel.specs.fps}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 col-span-2">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Camera Controls</span>
                          <span className="text-slate-200 font-medium">{currentModel.specs.cameraControl}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Prompt Runner */}
                    <div className="lg:col-span-2 bg-[#0A0D14] rounded-2xl p-5 border border-white/10 space-y-4 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#d1fe17]" />
                          <span>Interactive Test-Drive Prompt:</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Preloaded for {currentModel.name}
                        </span>
                      </div>

                      <textarea
                        rows={3}
                        value={openHiggsPrompt || currentModel.samplePrompt}
                        onChange={(e) => setOpenHiggsPrompt(e.target.value)}
                        className="w-full bg-[#141824] rounded-xl p-3.5 text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-[#d1fe17] font-mono resize-none leading-relaxed"
                        placeholder="Enter your prompt for OpenHiggs..."
                      />

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d1fe17] shrink-0" />
                          <span>Auto-configures resolution, seed & camera trajectory</span>
                        </div>

                        <Link
                          href={`/openhiggs?model=${currentModel.id}&prompt=${encodeURIComponent(openHiggsPrompt || currentModel.samplePrompt)}`}
                          className="px-5 py-2.5 rounded-xl bg-[#d1fe17] hover:bg-[#ddfe50] text-[#0f1505] font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Run in OpenHiggs Studio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Model Capability Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#121622] border border-white/10 hover:border-[#d1fe17]/50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-[#d1fe17]/20 border border-[#d1fe17]/30 flex items-center justify-center text-[#d1fe17] mb-4 group-hover:scale-110 transition-transform">
                  <Film className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-white">Seedance 2.5 Ecosystem</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Full support for Seedance 2.5 Director Mode, Frame Edit, Video Extend, plus Seedance 2.0 Fast and Mini engines.
                </p>
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">4K Director</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">Extend & Edit</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#121622] border border-white/10 hover:border-[#d1fe17]/50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-white">Kling 3.0 Full Suite</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Kling 3.0 Turbo, Standard, Pro, 4K, and Motion Pro algorithms with fine-grained camera controls and start/end frames.
                </p>
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">Motion Pro</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">4K Photoreal</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#121622] border border-white/10 hover:border-[#d1fe17]/50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-white">Soul Cinema & Wan 3</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Soul 2, Soul Cinema 4K, Wan 2.6, Wan 2.7, and Wan 3 Prime with harmonic fluid dynamics and cinematic motion blur.
                </p>
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">Fluid Physics</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">Soul Cinema</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#121622] border border-white/10 hover:border-[#d1fe17]/50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-white">Flux, Ideogram & Recraft</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  8 cutting-edge image models: Flux 2, Flux 3, Ideogram 4, Recraft 4.1, Grok Imagine 2, and Qwen Image 3.
                </p>
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">Typography 4K</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">Flux 3</span>
                </div>
              </div>
            </div>

            {/* 38-MODEL TICKER STRIP */}
            <div className="mt-10 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-mono font-bold text-[#d1fe17] shrink-0 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>All 38 Models:</span>
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {OPENHIGGS_MODELS_TICKER.map((m, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. 4-STEP CAMPAIGN WORKFLOW (HOW FLUVIA FLOW WORKS) */}
        {/* ========================================================================= */}
        <section id="features" className="py-20 bg-[#FFFFFF] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
                Simple & Scalable
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17191D] tracking-tight">
                From product concept to live ad in 4 steps.
              </h2>
              <p className="text-sm sm:text-base text-[#667085]">
                Say goodbye to weeks of video production logistics. Generate full-funnel creative assets with complete brand control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="business-card p-6 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-base font-bold text-[#17191D]">Add Product</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Upload high-res product photos, import your product URL, or specify key selling points and brand guidelines.
                </p>
              </div>

              {/* Step 2 */}
              <div className="business-card p-6 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-base font-bold text-[#17191D]">Create Campaign</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Select your audience, campaign goal, aspect ratio (16:9 widescreen, 9:16 vertical reels, 1:1 square), and tone.
                </p>
              </div>

              {/* Step 3 */}
              <div className="business-card p-6 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-base font-bold text-[#17191D]">Generate Creatives</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Next-generation video engines render cinematic shots while broadcast-grade multilingual voiceovers are synthesized seamlessly.
                </p>
              </div>

              {/* Step 4 */}
              <div className="business-card p-6 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center font-bold text-sm">
                  04
                </div>
                <h3 className="text-base font-bold text-[#17191D]">Export & Scale</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Export 1080p broadcast-ready MP4s, localized variations, or hand off directly to your team's Google Workspace.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. TEMPLATE SHOWCASE GALLERY (CURATED REAL AD TEMPLATES & PRESETS) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#F7F8FA] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
                  Curated Commercial Library
                </span>
                <h2 className="text-3xl font-extrabold text-[#17191D] tracking-tight">
                  High-converting ad presets for every vertical.
                </h2>
                <p className="text-sm text-[#667085]">
                  Start from proven commercial storyboards engineered for high retention, viral hooks, and product elevation across 9:16 and 16:9 formats.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex p-1 rounded-xl bg-[#E5E7EB]/70 border border-[#E5E7EB] flex-wrap">
                  <button
                    type="button"
                    onClick={() => setGalleryTab('vertical')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      galleryTab === 'vertical'
                        ? 'bg-white text-[#5145CD] shadow-xs'
                        : 'text-[#667085] hover:text-[#17191D]'
                    }`}
                  >
                    <span>⚡ 9:16 Viral Reels</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#EEF2FF] text-[#5145CD] font-mono">4</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGalleryTab('widescreen')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      galleryTab === 'widescreen'
                        ? 'bg-white text-[#5145CD] shadow-xs'
                        : 'text-[#667085] hover:text-[#17191D]'
                    }`}
                  >
                    <span>🎬 16:9 Commercials</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#EEF2FF] text-[#5145CD] font-mono">4</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGalleryTab('flagship')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      galleryTab === 'flagship'
                        ? 'bg-white text-[#5145CD] shadow-xs'
                        : 'text-[#667085] hover:text-[#17191D]'
                    }`}
                  >
                    <span>✨ 4K Flagship Spots</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#EEF2FF] text-[#5145CD] font-mono">5</span>
                  </button>
                </div>

                <Link
                  href="/templates"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#5145CD] hover:text-[#4338CA] transition-colors"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* TAB 1: 9:16 VIRAL SOCIAL HOOKS (THE 4 CLASSIC VERTICAL PRESETS) */}
            {galleryTab === 'vertical' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {VERTICAL_PRESETS.map((tmpl) => (
                  <VerticalPresetCard key={tmpl.id} preset={tmpl} />
                ))}
              </div>
            )}

            {/* TAB 2: 16:9 WIDESCREEN COMMERCIALS (THE 4 CLASSIC BRAND PRESETS) */}
            {galleryTab === 'widescreen' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {FEATURED_AD_TEMPLATES.map((tmpl) => (
                  <WidescreenPresetCard key={tmpl.id} preset={tmpl} />
                ))}
              </div>
            )}

            {/* TAB 3: 4K CINEMA FLAGSHIP SPOTS (THE 5 NEW SHOWCASE PRESETS) */}
            {galleryTab === 'flagship' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {FLAGSHIP_HERO_VIDEOS.map((tmpl) => (
                  <WidescreenPresetCard key={tmpl.id} preset={tmpl} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. TRANSPARENT PRICING & CREDIT STORE PREVIEW */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#FFFFFF] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
                Clear & Predictable
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17191D] tracking-tight">
                Simple plans. No hidden fees.
              </h2>
              <p className="text-sm sm:text-base text-[#667085]">
                Fixed credit pricing across all tools: 15 credits per video ad, 5 credits per product photo, 2 credits per voiceover clip.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Plan 1: Starter */}
              <div className="business-card p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#17191D]">Fluvia Basic</h3>
                    <p className="text-xs text-[#667085] mt-1">For creators testing video ad concepts</p>
                  </div>
                  <div className="text-3xl font-extrabold text-[#17191D]">
                    ₹999 <span className="text-xs font-normal text-[#667085]">/ month</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#667085]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 500 Credits monthly</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 1080p HD Video Exports</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Ultra HD Commercial Video Engine</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Standard Rate Limit</li>
                  </ul>
                </div>

                <Link
                  href="/checkout?plan=plan_starter"
                  className="w-full py-2.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#17191D] font-semibold text-xs text-center transition-colors block"
                >
                  Choose Basic
                </Link>
              </div>

              {/* Plan 2: Pro */}
              <div className="business-card p-6 space-y-6 flex flex-col justify-between border-[#C7D2FE] bg-[#F7F8FA] relative shadow-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#5145CD] text-white text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#17191D]">Fluvia Pro</h3>
                    <p className="text-xs text-[#667085] mt-1">For scaling brands and marketing teams</p>
                  </div>
                  <div className="text-3xl font-extrabold text-[#17191D]">
                    ₹2,499 <span className="text-xs font-normal text-[#667085]">/ month</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#667085]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 1,500 Credits monthly</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Priority generation queue</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> ElevenLabs Neural Voice HD</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Multi-variant aspect ratios</li>
                  </ul>
                </div>

                <Link
                  href="/checkout?plan=plan_creator"
                  className="w-full py-2.5 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs text-center transition-colors shadow-xs block"
                >
                  Choose Pro
                </Link>
              </div>

              {/* Plan 3: Max */}
              <div className="business-card p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#17191D]">Fluvia Max</h3>
                      <p className="text-xs text-[#667085] mt-1">For performance marketing power users</p>
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-[#17191D]">
                    ₹4,999 <span className="text-xs font-normal text-[#667085]">/ month</span>
                  </div>
                  <div className="p-2 rounded-md bg-[#EEF2FF] border border-[#C7D2FE] text-[11px] text-[#5145CD] font-medium flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Eligible for ₹570 OFF with code FIRST20</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#667085]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 3,500 Credits monthly</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Highest concurrency speed</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Brand kit & custom typography</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Dedicated account manager</li>
                  </ul>
                </div>

                <Link
                  href="/checkout?plan=plan_max&coupon=FIRST20"
                  className="w-full py-2.5 rounded-lg border border-[#5145CD] text-[#5145CD] hover:bg-[#EEF2FF] font-semibold text-xs text-center transition-colors block"
                >
                  Apply FIRST20 & Upgrade
                </Link>
              </div>
            </div>

            {/* Credit Top-Up Pack Banner */}
            <div className="mt-8 p-5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5145CD]">Need more credits?</span>
                <h4 className="text-sm font-bold text-[#17191D]">Scale Pack: 5,000 Credits</h4>
                <p className="text-xs text-[#667085]">Pre-tax ₹6,500 + 18% GST (₹1,170) = ₹7,670 Total. Never expires.</p>
              </div>
              <Link
                href="/checkout?pack=pack_5000"
                className="px-5 py-2.5 rounded-lg bg-[#17191D] hover:bg-[#000000] text-white font-semibold text-xs text-center transition-colors shrink-0"
              >
                Buy 5,000 Credits (₹6,500)
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#F7F8FA] border-b border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17191D]">
                Frequently asked questions
              </h2>
              <p className="text-xs sm:text-sm text-[#667085]">
                Everything you need to know about billing, generation credits, and commercial rights.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'How does generation credit pricing work?',
                  a: 'Every video ad generated costs exactly 15 credits. High-resolution product images cost 5 credits, and voiceovers cost 2 credits. If a generation job ever encounters a provider error, credits are automatically refunded to your wallet atomically.',
                },
                {
                  q: 'How do I use the FIRST20 coupon code?',
                  a: 'New creators receive the FIRST20 welcome code after completing registration. This coupon provides an instant ₹570 discount exclusively on the FLUVIA MAX subscription plan and is verified server-side at checkout.',
                },
                {
                  q: 'Do I own the commercial rights to generated ads?',
                  a: 'Yes. All video creatives, product images, and voiceover audio generated on Fluvia Flow come with full commercial rights for use across digital advertising platforms, television, and social media.',
                },
                {
                  q: 'Are taxes and GST included in invoices?',
                  a: 'All invoices and receipts strictly follow Indian tax regulations with full 18% GST itemization (CGST + SGST or IGST). Official vector PDF tax invoices are generated automatically after every successful transaction.',
                },
              ].map((item, idx) => (
                <div key={idx} className="business-card p-5 space-y-2">
                  <h4 className="text-sm font-bold text-[#17191D]">{item.q}</h4>
                  <p className="text-xs text-[#667085] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CALL TO ACTION SECTION */}
        {/* ========================================================================= */}
        <section className="py-16 bg-[#FFFFFF]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17191D] tracking-tight">
              Ready to elevate your ad creative production?
            </h2>
            <p className="text-sm text-[#667085] max-w-xl mx-auto">
              Join marketing teams generating high-ROI video commercials with Fluvia Flow.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-[#5145CD] hover:bg-[#4338CA] shadow-sm transition-all text-sm"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
