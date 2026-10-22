// ==============================================================================
// FLUVIA FLOW - 18 CINEMATIC AI VIDEO TEMPLATES & TEMPLATE MARKETPLACE ENGINE
// ==============================================================================

export interface TemplateScene {
  time: string;
  title: string;
  desc: string;
}

export interface VideoTemplate {
  id: string;
  slug: string;
  title: string;
  category: string;
  aspect: '9:16' | '16:9' | '1:1';
  aspectLabel: string;
  durationSec: number;
  duration: string;
  thumbnail: string;
  videoPreview: string;
  description: string;
  badge?: 'Trending' | 'Hot' | 'New' | 'Featured' | 'High ROI';
  tags: string[];
  scenes: TemplateScene[];
  aiModelsUsed: string[];
  estimatedCredits: number;
}

export const TEMPLATE_CATEGORIES = [
  'All Templates',
  'Trending',
  'Cinematic Product Commercial',
  'Luxury Perfume Advertisement',
  'Skincare Product Reel',
  'Fashion Campaign',
  'Automotive Cinematic Film',
  'Travel Cinematic Reel',
  'Food Commercial',
  'Real Estate Showcase',
  'Tech Product Launch',
  'Ecommerce Product Ad',
  'UGC-Style Product Promotion',
  'YouTube Intro',
  'YouTube Explainer',
  'Instagram Reel',
  'Festival Promotional Video',
  'Brand Story',
  'Fitness Promotion',
  'Corporate Presentation Video',
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export const TEMPLATES_DATA: VideoTemplate[] = [
  {
    id: 'tmpl_01',
    slug: 'cinematic-product-commercial',
    title: 'Aura Chrono Minimalist Watch',
    category: 'Cinematic Product Commercial',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 15,
    duration: '15s',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-01-cinematic-product.mp4',
    description: 'Precision macro lighting sweeping across ceramic timepiece bevels with cinematic depth of field and ambient soundscape.',
    badge: 'Trending',
    tags: ['#ProductCommercial', '#Luxury', '#MacroLens', '#3DRender', '#Cinematic'],
    aiModelsUsed: ['Gemini 2.5 Flash Storyboard', 'Flux Pro Studio', 'Fluvia Audio Core'],
    estimatedCredits: 45,
    scenes: [
      { time: '0:00 - 0:05', title: 'Macro Bevel Sweep', desc: 'Symmetrical slow dolly across sapphire glass face' },
      { time: '0:05 - 0:10', title: 'Gear Assembly Detach', desc: 'Exploded internal mechanical gears with gold accent lighting' },
      { time: '0:10 - 0:15', title: 'Monogram Lockup & CTA', desc: 'Branded typography lockup with release date' },
    ],
  },
  {
    id: 'tmpl_02',
    slug: 'luxury-perfume-advertisement',
    title: 'Botanique Rare Elixir',
    category: 'Luxury Perfume Advertisement',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 18,
    duration: '18s',
    thumbnail: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-02-luxury-perfume.mp4',
    description: 'Broadcast-quality 4K perfume film with volumetric mist refractions, floating jasmine petals, and orchestral string swell.',
    badge: 'Featured',
    tags: ['#Perfume', '#Luxury', '#VolumetricFog', '#Botanical', '#HighFashion'],
    aiModelsUsed: ['Runway Gen-3 Alpha', 'Gemini Storyboard', 'Flux 1.1 Pro'],
    estimatedCredits: 60,
    scenes: [
      { time: '0:00 - 0:06', title: 'Morning Mist Emergence', desc: 'Glass flacon backlit by dawn rim lighting' },
      { time: '0:06 - 0:12', title: 'Botanical Vortex', desc: 'Organic petals swirling through mineral droplets' },
      { time: '0:12 - 0:18', title: 'Signature Silhouette', desc: 'Golden monogram embossed into dark silk pedestal' },
    ],
  },
  {
    id: 'tmpl_03',
    slug: 'skincare-product-reel',
    title: 'HydraGlow Moisture Serum Reel',
    category: 'Skincare Product Reel',
    aspect: '9:16',
    aspectLabel: '9:16 Vertical',
    durationSec: 15,
    duration: '15s',
    thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-03-skincare-reel.mp4',
    description: 'Clean aesthetic vertical beauty reel showcasing hydrating micro-droplets, before/after glass skin sheen, and ingredient badges.',
    badge: 'Hot',
    tags: ['#Skincare', '#BeautyReel', '#Hydration', '#CleanAesthetic', '#Glow'],
    aiModelsUsed: ['ElevenLabs Voice v2', 'Flux Realism', 'Fluvia Motion'],
    estimatedCredits: 40,
    scenes: [
      { time: '0:00 - 0:04', title: 'Texture Swatch Hook', desc: 'Viscous serum drop landing on illuminated mirror surface' },
      { time: '0:04 - 0:10', title: 'Active Ingredients Callout', desc: 'Hyaluronic acid 2% and Niacinamide floating pills' },
      { time: '0:10 - 0:15', title: 'Skin Radiance & Shop Now', desc: 'Glowing natural complexion with swipe-up link' },
    ],
  },
  {
    id: 'tmpl_04',
    slug: 'fashion-campaign',
    title: 'Avant-Garde Milan Runways',
    category: 'Fashion Campaign',
    aspect: '9:16',
    aspectLabel: '9:16 Vertical',
    durationSec: 20,
    duration: '20s',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-04-fashion-campaign.mp4',
    description: 'High-contrast editorial runway campaign featuring flowing silhouettes, brutalist concrete architecture, and kinetic motion cuts.',
    badge: 'Featured',
    tags: ['#Fashion', '#Editorial', '#Runway', '#HauteCouture', '#KineticCuts'],
    aiModelsUsed: ['Runway Gen-3 Alpha', 'Gemini Flash Director', 'Flux Studio'],
    estimatedCredits: 55,
    scenes: [
      { time: '0:00 - 0:06', title: 'Architectural Shadow Walk', desc: 'Model silhouette emerging from sharp architectural beam' },
      { time: '0:06 - 0:14', title: 'Fabric Dynamics', desc: 'Silk organza floating in slow motion under strobe light' },
      { time: '0:14 - 0:20', title: 'Collection Signature', desc: 'Editorial typography reveal with autumn preview date' },
    ],
  },
  {
    id: 'tmpl_05',
    slug: 'automotive-cinematic-film',
    title: 'Apex GT Pure Electric Reveal',
    category: 'Automotive Cinematic Film',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 25,
    duration: '25s',
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-05-automotive-film.mp4',
    description: 'Anamorphic automotive film with low tracking shots across rain-slicked mountain passes and aerodynamic carbon highlights.',
    badge: 'Trending',
    tags: ['#Automotive', '#EV', '#Anamorphic', '#DroneTracking', '#Supercar'],
    aiModelsUsed: ['Luma Dream Machine', 'Flux Pro', 'Fluvia SFX Engine'],
    estimatedCredits: 70,
    scenes: [
      { time: '0:00 - 0:08', title: 'Alpine Switchback Glide', desc: 'Low-slung headlights slicing through blue twilight mist' },
      { time: '0:08 - 0:18', title: 'Aero Aero Wake & Caliper', desc: 'Carbon ceramic brakes glowing orange into high-speed corner' },
      { time: '0:18 - 0:25', title: 'Power Stats & Reservation', desc: '0-100 km/h in 2.1s metric overlay with preorder CTA' },
    ],
  },
  {
    id: 'tmpl_06',
    slug: 'travel-cinematic-reel',
    title: 'Nordic Fjords Expedition',
    category: 'Travel Cinematic Reel',
    aspect: '9:16',
    aspectLabel: '9:16 Vertical',
    durationSec: 15,
    duration: '15s',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-06-travel-reel.mp4',
    description: 'Immersive vertical travel diary with emerald water reflections, drone descents through glacial valleys, and warm ambient travel music.',
    badge: 'Hot',
    tags: ['#TravelReel', '#Nordic', '#Drone', '#Wanderlust', '#Nature'],
    aiModelsUsed: ['ElevenLabs Voice', 'Flux Realism', 'Fluvia Audio Core'],
    estimatedCredits: 40,
    scenes: [
      { time: '0:00 - 0:05', title: 'Glacial Reflection Dive', desc: 'Drone plunging toward mirror-calm fjord water' },
      { time: '0:05 - 0:10', title: 'Cliffside Perspective', desc: 'Solo hiker framed against monumental granite peak' },
      { time: '0:10 - 0:15', title: 'Itinerary Teaser', desc: 'GPS coordinates and seasonal booking badge' },
    ],
  },
  {
    id: 'tmpl_07',
    slug: 'food-commercial',
    title: 'Artisanal Neapolitan Pizza',
    category: 'Food Commercial',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 15,
    duration: '15s',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-07-food-commercial.mp4',
    description: 'Sensory gastronomy ad featuring wood-fired blistered crusts, molten fior di latte stretch, and fresh basil sizzle.',
    tags: ['#FoodCommercial', '#Gastronomy', '#MacroFood', '#Culinary', '#SlowMo'],
    aiModelsUsed: ['Flux Realism', 'Gemini Storyboard', 'Fluvia Motion'],
    estimatedCredits: 45,
    scenes: [
      { time: '0:00 - 0:05', title: 'Wood Fire Embers', desc: 'Flames licking stone hearth oven at 900 degrees' },
      { time: '0:05 - 0:10', title: 'The Cheese Pull Hook', desc: 'Macro pull showing stretching bubbling buffalo mozzarella' },
      { time: '0:10 - 0:15', title: 'Location & Delivery Order', desc: 'Store address and instant delivery app buttons' },
    ],
  },
  {
    id: 'tmpl_08',
    slug: 'real-estate-showcase',
    title: 'Bel Air Architectural Sanctuary',
    category: 'Real Estate Showcase',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 30,
    duration: '30s',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-08-real-estate.mp4',
    description: 'Architectural walk-through of modern luxury estate highlighting infinity pools, travertine marble, and seamless glass walls.',
    badge: 'Featured',
    tags: ['#RealEstate', '#Architecture', '#LuxuryLiving', '#DroneTour', '#PropertyAd'],
    aiModelsUsed: ['Luma Dream Machine', 'ElevenLabs Adam', 'Fluvia Audio'],
    estimatedCredits: 65,
    scenes: [
      { time: '0:00 - 0:08', title: 'Sunset Pool Horizon', desc: 'Golden hour drone drift across cantilevered infinity edge' },
      { time: '0:08 - 0:20', title: 'Great Room Volume', desc: 'Double-height ceilings and automated glass pocket doors' },
      { time: '0:20 - 0:30', title: 'Broker Details & Price', desc: 'Listing price, square footage, and contact agent overlay' },
    ],
  },
  {
    id: 'tmpl_09',
    slug: 'tech-product-launch',
    title: 'Quantum Neural Earbuds Launch',
    category: 'Tech Product Launch',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 20,
    duration: '20s',
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-09-tech-product.mp4',
    description: 'Futuristic silicon launch film detailing spatial soundwaves, titanium casing, and lossless wireless transmission.',
    badge: 'High ROI',
    tags: ['#TechLaunch', '#Earbuds', '#3DExploded', '#AudioTech', '#Hardware'],
    aiModelsUsed: ['Runway Gen-3', 'Gemini Flash', 'Flux Studio'],
    estimatedCredits: 55,
    scenes: [
      { time: '0:00 - 0:06', title: 'Floating Acoustic Pod', desc: 'Matte black case sliding open with cyan LED indicator' },
      { time: '0:06 - 0:14', title: 'Acoustic Driver Diagram', desc: 'Beryllium diaphragm pulsing with visible sound ripples' },
      { time: '0:14 - 0:20', title: 'Specs & Preorder Window', desc: '48h battery life metric with Early Bird reservation link' },
    ],
  },
  {
    id: 'tmpl_10',
    slug: 'ecommerce-product-ad',
    title: 'Ergonomic Aero Backpack Ad',
    category: 'Ecommerce Product Ad',
    aspect: '1:1',
    aspectLabel: '1:1 Square',
    durationSec: 15,
    duration: '15s',
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-10-ecommerce-ad.mp4',
    description: 'Optimized square social ad built for Meta and Pinterest feeds with water-resistant fabric test and multi-compartment packing hook.',
    badge: 'High ROI',
    tags: ['#Ecommerce', '#SquareAd', '#Backpack', '#MetaAds', '#Conversion'],
    aiModelsUsed: ['Fluvia Motion Graphics', 'Flux Realism', 'ElevenLabs Voice'],
    estimatedCredits: 35,
    scenes: [
      { time: '0:00 - 0:04', title: 'Water Repellency Test', desc: 'High-speed water beads rolling off ballistic nylon weave' },
      { time: '0:04 - 0:10', title: 'Organized Compartments', desc: '16-inch laptop and accessories slotting into dedicated pouches' },
      { time: '0:10 - 0:15', title: 'Discount Code & Buy', desc: '20% off coupon code highlight with Shop Now button' },
    ],
  },
  {
    id: 'tmpl_11',
    slug: 'ugc-style-product-promotion',
    title: 'Honest Skincare Morning Routine UGC',
    category: 'UGC-Style Product Promotion',
    aspect: '9:16',
    aspectLabel: '9:16 Vertical',
    durationSec: 22,
    duration: '22s',
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-11-ugc-promo.mp4',
    description: 'Native selfie-camera review with natural bathroom lighting, animated captions, and genuine creator testimonial for TikTok Ads.',
    badge: 'Trending',
    tags: ['#UGC', '#TikTokAds', '#CreatorStyle', '#HonestReview', '#ViralHook'],
    aiModelsUsed: ['ElevenLabs Voice', 'OpenAI Whisper', 'Fluvia Motion'],
    estimatedCredits: 40,
    scenes: [
      { time: '0:00 - 0:05', title: 'The Hook: "Stop doing this"', desc: 'Creator holding product to camera with animated warning badge' },
      { time: '0:05 - 0:15', title: 'Real Application Proof', desc: 'Smoothing texture onto cheek with instant skin glow effect' },
      { time: '0:15 - 0:22', title: 'Comment Hook & Pinned Link', desc: 'Callout to link in bio with discount guarantee' },
    ],
  },
  {
    id: 'tmpl_12',
    slug: 'youtube-intro',
    title: 'Cyberpunk Neon Channel Intro',
    category: 'YouTube Intro',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 10,
    duration: '10s',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-12-yt-intro.mp4',
    description: 'High-impact 10-second YouTube channel branding intro with chromatic glitch transitions, bass drop, and animated subscribe banner.',
    badge: 'New',
    tags: ['#YouTubeIntro', '#Branding', '#GlitchVFX', '#BassDrop', '#CreatorToolkit'],
    aiModelsUsed: ['Fluvia SFX Engine', 'Flux Studio', 'Gemini Flash'],
    estimatedCredits: 25,
    scenes: [
      { time: '0:00 - 0:04', title: 'Glow Glitch Build-Up', desc: 'Neon particles accelerating into center vortex' },
      { time: '0:04 - 0:08', title: 'Channel Name Shockwave', desc: 'Logo slam with screen shake and sub-bass impact' },
      { time: '0:08 - 0:10', title: 'Subscribe & Bell Ring', desc: 'Interactive animated subscribe button tap' },
    ],
  },
  {
    id: 'tmpl_13',
    slug: 'youtube-explainer',
    title: 'Autonomous AI Agents Architecture',
    category: 'YouTube Explainer',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 30,
    duration: '30s',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-13-yt-explainer.mp4',
    description: 'Educational YouTube breakdown with 3D node graphs, terminal command prompts, clean narration, and chapter markers.',
    badge: 'Featured',
    tags: ['#Explainer', '#YouTube', '#TechEducation', '#AIAgents', '#MotionGraphics'],
    aiModelsUsed: ['ElevenLabs Adam', 'Gemini Flash Script', 'Fluvia Motion'],
    estimatedCredits: 60,
    scenes: [
      { time: '0:00 - 0:08', title: 'The Problem Statement', desc: 'Animated node chart showing workflow bottleneck' },
      { time: '0:08 - 0:20', title: 'Neural Agent Orchestration', desc: 'Autonomous tasks communicating via color-coded streams' },
      { time: '0:20 - 0:30', title: 'Summary & Code Repository', desc: 'GitHub repository callout and subscribe card' },
    ],
  },
  {
    id: 'tmpl_14',
    slug: 'instagram-reel',
    title: 'Hyper-Kinetic Workout Motivation Reel',
    category: 'Instagram Reel',
    aspect: '9:16',
    aspectLabel: '9:16 Vertical',
    durationSec: 15,
    duration: '15s',
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-14-instagram-reel.mp4',
    description: 'Fast-paced vertical reel synched to hard-hitting drum beats with chalk powder explosions, deadlift power moves, and bold captions.',
    badge: 'Trending',
    tags: ['#InstagramReel', '#Fitness', '#Motivation', '#KineticType', '#Workout'],
    aiModelsUsed: ['Fluvia Audio Core', 'Flux Realism', 'Runway Gen-3'],
    estimatedCredits: 40,
    scenes: [
      { time: '0:00 - 0:04', title: 'Chalk Cloud Clap', desc: 'Explosive chalk dust slow-motion with bass hit' },
      { time: '0:04 - 0:10', title: 'Intensity Reps & Cuts', desc: 'Fast rhythmic cuts tracking barbell ascent' },
      { time: '0:10 - 0:15', title: 'Motivational Mantra', desc: '"Day One or One Day" kinetic typography lockup' },
    ],
  },
  {
    id: 'tmpl_15',
    slug: 'festival-promotional-video',
    title: 'Aurora Electronic Music Festival',
    category: 'Festival Promotional Video',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 20,
    duration: '20s',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-15-festival-promo.mp4',
    description: 'Electric festival aftermovie teaser with lasers sweeping over euphoric crowds, mainstage pyrotechnics, and headliner reveals.',
    badge: 'Hot',
    tags: ['#Festival', '#EDM', '#Lasers', '#Aftermovie', '#EventPromo'],
    aiModelsUsed: ['Runway Gen-3', 'Fluvia SFX Engine', 'Flux Pro'],
    estimatedCredits: 55,
    scenes: [
      { time: '0:00 - 0:06', title: 'Mainstage Pyro Drop', desc: 'Massive fireworks burst lighting ocean of dancing fans' },
      { time: '0:06 - 0:14', title: 'Headliner Lineup Scroll', desc: 'Laser graphics drawing DJ names across stadium' },
      { time: '0:14 - 0:20', title: 'Early Bird Ticket Alert', desc: 'Countdown clock and Tier 1 ticket release date' },
    ],
  },
  {
    id: 'tmpl_16',
    slug: 'brand-story',
    title: 'Artisanal Roastery Origin Story',
    category: 'Brand Story',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 35,
    duration: '35s',
    thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-16-brand-story.mp4',
    description: 'Heartfelt cinematic narrative chronicling organic coffee farmers, traditional copper roasters, and sustainable fair-trade practices.',
    badge: 'Featured',
    tags: ['#BrandStory', '#Documentary', '#CoffeeRoastery', '#Sustainability', '#Cinematic'],
    aiModelsUsed: ['Gemini Storyboard', 'ElevenLabs Voice v2', 'Flux Realism'],
    estimatedCredits: 75,
    scenes: [
      { time: '0:00 - 0:10', title: 'Highland Mist Harvesting', desc: 'Sunlight filtering through coffee cherries in cloud forest' },
      { time: '0:10 - 0:22', title: 'The Master Roasting Craft', desc: 'Beans tumbling inside glowing cast-iron drum with steam' },
      { time: '0:22 - 0:35', title: 'Mission & Heritage Seal', desc: 'Founder voiceover with 100% fair-trade guarantee badge' },
    ],
  },
  {
    id: 'tmpl_17',
    slug: 'fitness-promotion',
    title: 'Pulse Studio HIIT Membership Drive',
    category: 'Fitness Promotion',
    aspect: '9:16',
    aspectLabel: '9:16 Vertical',
    durationSec: 18,
    duration: '18s',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-17-fitness-promo.mp4',
    description: 'High-energy studio showcase featuring neon boutique lighting, heart-rate monitor displays, and a 7-day free trial campaign.',
    badge: 'High ROI',
    tags: ['#FitnessPromo', '#GymStudio', '#HIIT', '#MembershipDrive', '#SpecialOffer'],
    aiModelsUsed: ['Fluvia Motion Graphics', 'Flux Realism', 'ElevenLabs Voice'],
    estimatedCredits: 40,
    scenes: [
      { time: '0:00 - 0:05', title: 'Studio Ambience & Beat', desc: 'Neon red lighting pulsing with synchronized rowers' },
      { time: '0:05 - 0:12', title: 'Trainer Coaching & Metrics', desc: 'Heart rate zones displayed on smart studio screens' },
      { time: '0:12 - 0:18', title: 'First Week Free Pass', desc: 'Claim free 7-day trial pass with QR code overlay' },
    ],
  },
  {
    id: 'tmpl_18',
    slug: 'corporate-presentation-video',
    title: 'Enterprise ESG Annual Impact Report',
    category: 'Corporate Presentation Video',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 30,
    duration: '30s',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    videoPreview: '/media/templates/tmpl-18-corporate-presentation.mp4',
    description: 'Polished executive video presentation with clean glassmorphism data cards, solar farm drone footage, and stakeholder milestones.',
    badge: 'New',
    tags: ['#Corporate', '#ESGReport', '#Enterprise', '#ExecutiveBrief', '#Sustainability'],
    aiModelsUsed: ['Gemini Flash Script', 'ElevenLabs Voice v2', 'Fluvia Motion'],
    estimatedCredits: 60,
    scenes: [
      { time: '0:00 - 0:08', title: 'Carbon Neutrality Progress', desc: 'Clean kinetic chart showing 42% emissions reduction' },
      { time: '0:08 - 0:20', title: 'Global Clean Infrastructure', desc: 'Cinematic drone sweep across offshore wind installations' },
      { time: '0:20 - 0:30', title: 'CEO Closing Statement', desc: 'Executive signature with downloadable PDF report link' },
    ],
  },
];

export function getTemplateById(id: string): VideoTemplate | undefined {
  return TEMPLATES_DATA.find((t) => t.id === id);
}

export function getTemplateBySlug(slug: string): VideoTemplate | undefined {
  return TEMPLATES_DATA.find((t) => t.slug === slug);
}

export function getRelatedTemplates(currentSlug: string, count = 3): VideoTemplate[] {
  const current = getTemplateBySlug(currentSlug);
  if (!current) return TEMPLATES_DATA.slice(0, count);

  const sameCategory = TEMPLATES_DATA.filter(
    (t) => t.slug !== currentSlug && t.category === current.category
  );

  if (sameCategory.length >= count) {
    return sameCategory.slice(0, count);
  }

  const remainder = TEMPLATES_DATA.filter(
    (t) => t.slug !== currentSlug && t.category !== current.category
  );

  return [...sameCategory, ...remainder].slice(0, count);
}
