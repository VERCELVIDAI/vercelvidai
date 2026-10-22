// ==============================================================================
// FLUVIA FLOW - TEMPLATE MARKETPLACE DATA & ENGINE
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
  'Product Commercials',
  'Ecommerce Ads',
  'Instagram Reels',
  'YouTube Shorts',
  'YouTube Explainers',
  'UGC-Style Ads',
  'Brand Films',
  'Cinematic Videos',
  'Educational Content',
  'Real Estate',
  'Food & Beverage',
  'Fashion & Beauty',
  'Festival Campaigns',
  'Corporate Videos',
] as const;

export type TemplateCategory = typeof TEMPLATE_CATEGORIES[number];

export const TEMPLATES_DATA: VideoTemplate[] = [
  {
    id: 'tmpl_01',
    slug: 'viral-luxury-product-reel',
    title: 'Viral Luxury Sportswear Reel',
    category: 'Instagram Reels',
    aspect: '9:16',
    aspectLabel: '9:16 Vertical',
    durationSec: 15,
    duration: '15s',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-tying-his-running-shoes-42352-large.mp4',
    description: 'High-energy sportswear commercial engineered for Instagram Reels and TikTok with rapid 3-second kinetic typography hooks.',
    badge: 'Trending',
    tags: ['#Sportswear', '#Reels', '#Kinetic', '#Footwear', '#ViralHook'],
    aiModelsUsed: ['Runway Gen-3 Alpha', 'ElevenLabs Voice v2', 'Flux Realism'],
    estimatedCredits: 45,
    scenes: [
      { time: '0:00 - 0:04', title: 'Macro Friction Hook', desc: 'Slow motion shoe lace pull with sub-bass impact' },
      { time: '0:04 - 0:10', title: 'Action Sprint & Tech', desc: 'Urban dynamic glide through city street at golden hour' },
      { time: '0:10 - 0:15', title: 'Brand Lockup & CTA', desc: '3D metallic logo explosion with promo code overlay' },
    ],
  },
  {
    id: 'tmpl_02',
    slug: 'daily-tech-breakdown-shorts',
    title: 'Daily AI & Tech Breakdown',
    category: 'YouTube Shorts',
    aspect: '9:16',
    aspectLabel: '9:16 Vertical',
    durationSec: 20,
    duration: '20s',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-41589-large.mp4',
    description: 'Bite-sized viral tech news format with floating code subtitles, terminal highlights, and automated voice narration.',
    badge: 'Hot',
    tags: ['#TechNews', '#YouTubeShorts', '#Coding', '#AI', '#FacelessChannel'],
    aiModelsUsed: ['Luma Dream Machine', 'OpenAI Whisper', 'ElevenLabs Adam'],
    estimatedCredits: 50,
    scenes: [
      { time: '0:00 - 0:05', title: 'The Provocation', desc: 'Bold curiosity question with flashing yellow keyword highlights' },
      { time: '0:05 - 0:14', title: 'Code Evidence', desc: 'Terminal typing simulation with floating architecture diagram' },
      { time: '0:14 - 0:20', title: 'Subscribe Trigger', desc: 'Animated YouTube bell notification and pinned comment CTA' },
    ],
  },
  {
    id: 'tmpl_03',
    slug: 'luxury-fragrance-cinematic-ad',
    title: 'Luxury Botanical Fragrance Ad',
    category: 'Product Commercials',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 18,
    duration: '18s',
    thumbnail: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-perfume-bottle-and-flowers-42354-large.mp4',
    description: 'Broadcast-quality 4K perfume commercial with volumetric glass refractions, botanical mist simulations, and orchestral strings.',
    badge: 'Featured',
    tags: ['#Perfume', '#Cinematic', '#Luxury', '#Commercial', '#Botanical'],
    aiModelsUsed: ['Runway Gen-3 Alpha', 'Flux Pro Studio', 'Fluvia Audio Core'],
    estimatedCredits: 60,
    scenes: [
      { time: '0:00 - 0:06', title: 'Atmospheric Dawn', desc: 'Glass flacon emerging from soft botanical morning mist' },
      { time: '0:06 - 0:12', title: 'Raw Botanicals', desc: 'Artisanal jasmine petals floating across clear mineral water' },
      { time: '0:12 - 0:18', title: 'Signature Reveal', desc: 'Golden rim lighting catching engraved brand monogram' },
    ],
  },
  {
    id: 'tmpl_04',
    slug: 'saas-explainer-walkthrough',
    title: 'SaaS Platform Feature Tour',
    category: 'YouTube Explainers',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 30,
    duration: '30s',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-charts-41964-large.mp4',
    description: 'Modern software product launch teaser with timeline highlights, animated dashboard metrics, and enterprise CTAs.',
    tags: ['#SaaS', '#Explainer', '#B2B', '#SoftwareLaunch', '#Dashboard'],
    aiModelsUsed: ['ElevenLabs Voice v2', 'Fluvia Motion Graphics', 'Flux 1.1'],
    estimatedCredits: 75,
    scenes: [
      { time: '0:00 - 0:08', title: 'Workflow Problem', desc: 'Visual chaos of tabs and spreadsheets with warning badge' },
      { time: '0:08 - 0:20', title: 'The Unified Solution', desc: 'Smooth camera pan into modern dark-mode analytics view' },
      { time: '0:20 - 0:30', title: 'Free Trial Callout', desc: 'Enterprise trust badges and 14-day free trial button' },
    ],
  },
  {
    id: 'tmpl_05',
    slug: 'high-converting-ugc-hook',
    title: 'High-Converting UGC Unboxing',
    category: 'UGC-Style Ads',
    aspect: '9:16',
    aspectLabel: '9:16 Vertical',
    durationSec: 22,
    duration: '22s',
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-makeup-in-front-of-a-mirror-39824-large.mp4',
    description: 'Authentic selfie-style product discovery and honest first-impression testimonial designed for TikTok & Meta Ads.',
    badge: 'High ROI',
    tags: ['#UGC', '#Testimonial', '#TikTokAds', '#MetaAds', '#BeautyReview'],
    aiModelsUsed: ['Hedra Avatar', 'ElevenLabs Conversational', 'Flux LoRA'],
    estimatedCredits: 55,
    scenes: [
      { time: '0:00 - 0:05', title: 'Stop-The-Scroll', desc: 'Face close-up holding box: "I tested this so you don\'t have to"' },
      { time: '0:05 - 0:15', title: 'Texture & Routine', desc: 'Application in front of mirror with natural soft daylight' },
      { time: '0:15 - 0:22', title: 'Discount Urgent CTA', desc: 'Screen recording showing 20% discount checkout code' },
    ],
  },
  {
    id: 'tmpl_06',
    slug: 'corporate-headquarters-showcase',
    title: 'Corporate Architecture & Culture',
    category: 'Corporate Videos',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 25,
    duration: '25s',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-modern-office-with-glass-walls-and-stairs-41846-large.mp4',
    description: 'Polished company culture profile showcasing high-tech office spaces, architectural glass atriums, and visionary leadership.',
    tags: ['#Corporate', '#Architecture', '#Recruiting', '#Culture', '#Investors'],
    aiModelsUsed: ['Runway Gen-3 Alpha', 'ElevenLabs Narration', 'Flux Dev'],
    estimatedCredits: 65,
    scenes: [
      { time: '0:00 - 0:07', title: 'Architectural Flythrough', desc: 'Glass facade reflection transitioning into modern collaborative atrium' },
      { time: '0:07 - 0:17', title: 'Focus & Innovation', desc: 'Team reviewing holographic blueprints with ambient lighting' },
      { time: '0:17 - 0:25', title: 'Global Mission', desc: 'World map connection nodes with corporate slogan' },
    ],
  },
  {
    id: 'tmpl_07',
    slug: 'gourmet-culinary-artisan-spot',
    title: 'Artisan Gourmet Restaurant Reel',
    category: 'Food & Beverage',
    aspect: '9:16',
    aspectLabel: '9:16 Vertical',
    durationSec: 15,
    duration: '15s',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-fresh-salad-with-vegetables-and-olive-oil-42356-large.mp4',
    description: 'Sizzling food commercial with macro olive oil drizzles, fresh herb sprinkles, and mouthwatering restaurant branding.',
    badge: 'Trending',
    tags: ['#Foodie', '#Restaurant', '#Culinary', '#Gourmet', '#Reels'],
    aiModelsUsed: ['Luma Dream Machine', 'Flux Realism', 'Fluvia Audio Effects'],
    estimatedCredits: 40,
    scenes: [
      { time: '0:00 - 0:04', title: 'Macro Drizzle', desc: 'Virgin olive oil glistening over garden vegetables in 120fps' },
      { time: '0:04 - 0:10', title: 'Chef Plating', desc: 'Tweezers placing microgreens with chef signature stamp' },
      { time: '0:10 - 0:15', title: 'Reservation Call', desc: 'Table reservation link with weekend tasting menu badge' },
    ],
  },
  {
    id: 'tmpl_08',
    slug: 'luxury-penthouse-real-estate',
    title: 'Ultra-Luxury Penthouse Tour',
    category: 'Real Estate',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 28,
    duration: '28s',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-drone-footage-of-a-modern-residential-building-42357-large.mp4',
    description: 'Cinematic drone fly-in and architectural walk-through for high-net-worth real estate developments and penthouse listings.',
    badge: 'Featured',
    tags: ['#RealEstate', '#LuxuryHome', '#Architecture', '#Drone', '#Penthouse'],
    aiModelsUsed: ['Runway Gen-3 Alpha', 'Flux Pro', 'ElevenLabs Narration'],
    estimatedCredits: 70,
    scenes: [
      { time: '0:00 - 0:08', title: 'Skyline Drone Approach', desc: 'Golden hour drone glide over rooftop infinity pool' },
      { time: '0:08 - 0:18', title: 'Marble Interior', desc: 'Calacatta marble kitchen island with floor-to-ceiling glass windows' },
      { time: '0:18 - 0:28', title: 'Private Tour Booking', desc: 'Listing price, square footage stats, and private viewing link' },
    ],
  },
  {
    id: 'tmpl_09',
    slug: 'fintech-credit-card-commercial',
    title: 'Next-Gen Metal Card Commercial',
    category: 'Ecommerce Ads',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 16,
    duration: '16s',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-credit-card-and-using-a-laptop-41838-large.mp4',
    description: 'Tactile black titanium credit card floating in zero-gravity with laser engraving sparks and cashback perks.',
    tags: ['#Fintech', '#Banking', '#CreditCard', '#MotionDesign', '#Ecommerce'],
    aiModelsUsed: ['Luma Dream Machine', 'Flux 1.1 Pro', 'Fluvia Audio FX'],
    estimatedCredits: 45,
    scenes: [
      { time: '0:00 - 0:05', title: 'Zero Gravity Flip', desc: 'Matte black metal card rotating with neon purple rim lighting' },
      { time: '0:05 - 0:11', title: 'Instant Tap & Pay', desc: 'Contactless wave with glowing confirmation checkmark' },
      { time: '0:11 - 0:16', title: 'Zero Annual Fee', desc: 'Exclusive welcome bonus and instant digital card issue' },
    ],
  },
  {
    id: 'tmpl_10',
    slug: 'streetwear-fashion-lookbook',
    title: 'Tokyo Streetwear Motion Lookbook',
    category: 'Fashion & Beauty',
    aspect: '9:16',
    aspectLabel: '9:16 Vertical',
    durationSec: 18,
    duration: '18s',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-stylish-girl-dancing-in-the-street-42350-large.mp4',
    description: 'Cyberpunk Tokyo street aesthetic with glitch transitions, neon Japanese typography, and oversized streetwear fits.',
    badge: 'Trending',
    tags: ['#Streetwear', '#Fashion', '#Cyberpunk', '#Lookbook', '#TikTok'],
    aiModelsUsed: ['Runway Gen-3', 'Flux Realism', 'Fluvia Audio Core'],
    estimatedCredits: 50,
    scenes: [
      { time: '0:00 - 0:05', title: 'Neon Rain Strobe', desc: 'Reflective windbreaker catching neon shop reflections' },
      { time: '0:05 - 0:12', title: 'Kinetic Outfit Cuts', desc: 'Rapid 0.5s beat-matched cuts through four collection colorways' },
      { time: '0:12 - 0:18', title: 'Limited Drop Timer', desc: 'Drop countdown clock with shop link sticker' },
    ],
  },
  {
    id: 'tmpl_11',
    slug: 'artisan-coffee-roastery-film',
    title: 'Single-Origin Coffee Story',
    category: 'Brand Films',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 24,
    duration: '24s',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-beans-falling-in-slow-motion-42355-large.mp4',
    description: 'Documentary-style brand film exploring high-altitude Ethiopian coffee bean roasting, sensory notes, and barista craftsmanship.',
    tags: ['#Coffee', '#BrandFilm', '#SlowMotion', '#Artisan', '#Documentary'],
    aiModelsUsed: ['Runway Gen-3 Alpha', 'ElevenLabs Voice v2', 'Flux Dev'],
    estimatedCredits: 60,
    scenes: [
      { time: '0:00 - 0:08', title: 'Slow-Mo Bean Drop', desc: 'Dark roasted beans cascading in 1000fps with deep acoustic guitar' },
      { time: '0:08 - 0:16', title: 'Espresso Extraction', desc: 'Crema swirling into ceramic handmade cup' },
      { time: '0:16 - 0:24', title: 'Monthly Subscription', desc: 'Eco bag packaging with freshly roasted date stamp' },
    ],
  },
  {
    id: 'tmpl_12',
    slug: 'festival-holiday-promo-blast',
    title: 'Festive Flash Sale Campaign',
    category: 'Festival Campaigns',
    aspect: '1:1',
    aspectLabel: '1:1 Square',
    durationSec: 15,
    duration: '15s',
    thumbnail: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-credit-card-and-using-a-laptop-41838-large.mp4',
    description: 'Sparkling festive celebration with golden confetti bursts, ribbon unboxing, and limited-time holiday gift discounts.',
    badge: 'New',
    tags: ['#HolidaySale', '#Festival', '#SquareVideo', '#InstagramFeed', '#GiftGuide'],
    aiModelsUsed: ['Luma Dream Machine', 'Flux Pro', 'ElevenLabs Voice'],
    estimatedCredits: 40,
    scenes: [
      { time: '0:00 - 0:05', title: 'Golden Spark Burst', desc: 'Gift box lid popping open with volumetric festive lights' },
      { time: '0:05 - 0:10', title: 'Top 3 Gift Bundles', desc: 'Three bestselling items carousel with strikethrough prices' },
      { time: '0:10 - 0:15', title: 'Free Express Shipping', desc: 'Guaranteed delivery before the holiday weekend badge' },
    ],
  },
  {
    id: 'tmpl_13',
    slug: 'masterclass-educational-explainer',
    title: 'Masterclass Topic Introduction',
    category: 'Educational Content',
    aspect: '16:9',
    aspectLabel: '16:9 Landscape',
    durationSec: 32,
    duration: '32s',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-modern-office-with-glass-walls-and-stairs-41846-large.mp4',
    description: 'Authoritative online course curriculum opener with chapter breakdowns, expert speaker lockup, and learning takeaways.',
    tags: ['#Education', '#Course', '#Masterclass', '#Learning', '#Explainer'],
    aiModelsUsed: ['ElevenLabs Studio', 'Runway Gen-3', 'Flux Dev'],
    estimatedCredits: 80,
    scenes: [
      { time: '0:00 - 0:08', title: 'Topic Hook', desc: 'The paradigm shift explained with conceptual 3D animation' },
      { time: '0:08 - 0:20', title: 'Module Breakdown', desc: 'Three numbered lesson pillars with animated step counters' },
      { time: '0:20 - 0:32', title: 'Enroll Now CTA', desc: 'Certificate of completion badge and student enrollment button' },
    ],
  },
  {
    id: 'tmpl_14',
    slug: 'sunset-skate-urban-lifestyle',
    title: 'Golden Hour Urban Skate Reel',
    category: 'Cinematic Videos',
    aspect: '9:16',
    aspectLabel: '9:16 Vertical',
    durationSec: 16,
    duration: '16s',
    thumbnail: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&auto=format&fit=crop&q=80',
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-young-man-skateboarding-at-sunset-42351-large.mp4',
    description: 'Sun-drenched anamorphic street film following an urban skater down coastal avenues at sunset with lo-fi beats.',
    badge: 'Trending',
    tags: ['#Skate', '#Sunset', '#GoldenHour', '#Cinematic', '#Lifestyle'],
    aiModelsUsed: ['Runway Gen-3 Alpha', 'Flux Pro', 'Fluvia Lo-Fi Engine'],
    estimatedCredits: 45,
    scenes: [
      { time: '0:00 - 0:05', title: 'Low Angle Glide', desc: 'Wheels carving asphalt with warm lens flares hitting the lens' },
      { time: '0:05 - 0:11', title: 'Kickflip in 60fps', desc: 'Slow motion trick execution against ocean horizon' },
      { time: '0:11 - 0:16', title: 'Brand Aesthetic Seal', desc: 'Minimalist white typography watermark with sound fade' },
    ],
  },
];

export function getAllTemplates(): VideoTemplate[] {
  return TEMPLATES_DATA;
}

export function getTemplateBySlug(slug: string): VideoTemplate | undefined {
  return TEMPLATES_DATA.find((t) => t.slug === slug);
}

export function getRelatedTemplates(currentSlug: string, count = 3): VideoTemplate[] {
  return TEMPLATES_DATA.filter((t) => t.slug !== currentSlug).slice(0, count);
}

export function getTemplatesByCategory(category: string): VideoTemplate[] {
  if (category === 'All Templates') return TEMPLATES_DATA;
  if (category === 'Trending') return TEMPLATES_DATA.filter((t) => t.badge === 'Trending' || t.badge === 'Hot');
  return TEMPLATES_DATA.filter((t) => t.category === category);
}
