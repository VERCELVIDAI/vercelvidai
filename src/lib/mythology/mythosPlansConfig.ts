import { Plan } from '../types';

export interface MythosCreditCostConfig {
  scriptAndIdeas: number;
  imagePerScene: number;
  voiceover30s: number;
  heroSceneAnimation: number;
  standardVideoExport: number;
}

export const MYTHOS_CREDIT_COSTS: MythosCreditCostConfig = {
  scriptAndIdeas: 2,
  imagePerScene: 2,
  voiceover30s: 4,
  heroSceneAnimation: 12,
  standardVideoExport: 0, // Included in scene generation
};

export function calculateMythosProjectCredits(params: {
  scenesCount: number;
  hasVoiceover?: boolean;
  animatedHeroScenesCount?: number;
}): number {
  const scriptCost = MYTHOS_CREDIT_COSTS.scriptAndIdeas;
  const imagesCost = (params.scenesCount || 5) * MYTHOS_CREDIT_COSTS.imagePerScene;
  const voiceCost = params.hasVoiceover ? MYTHOS_CREDIT_COSTS.voiceover30s : 0;
  const animCost = (params.animatedHeroScenesCount || 0) * MYTHOS_CREDIT_COSTS.heroSceneAnimation;
  return scriptCost + imagesCost + voiceCost + animCost;
}

export const MYTHOS_PLANS: Plan[] = [
  {
    id: 'plan_mythos_free',
    name: 'Mythos Explorer',
    description: 'Free trial to experience AI mythology storytelling for Shorts & Reels.',
    priceInr: 0,
    priceAnnualInr: 0,
    billingInterval: 'month',
    creditsPerPeriod: 50,
    badge: 'Free Trial',
    accentTheme: 'pro',
    features: [
      '50 Welcome Mythos Credits',
      '1 Watermarked 30s Mythology Video',
      '3 Core Art Styles (Classical, Pahari, Stone)',
      'Hindi & English Narration Preview',
      '720p Video Export with Fluvia Watermark',
      'Public Domain Epic Story Library',
    ],
    entitlements: {
      maxResolution: '720p',
      watermark: true,
      maxVideoLengthSec: 30,
      supportedModels: ['gemini-flash', 'flux-fast'],
      storageMb: 500,
      priorityQueue: false,
      commercialLicense: false,
    },
    isActive: true,
  },
  {
    id: 'plan_mythos_10',
    name: 'Mythos 10 Videos',
    description: 'Ideal for devotional channels and creators posting weekly mythology stories.',
    priceInr: 5100,
    priceAnnualInr: 4080,
    billingInterval: 'month',
    creditsPerPeriod: 200,
    badge: '10 Videos / Mo',
    accentTheme: 'pro',
    features: [
      '10 Full Mythology Videos per month (200 credits)',
      '1080p Full HD Watermark-Free MP4 Exports',
      'All 7 Mythology Art Styles & Custom Prompts',
      'ElevenLabs Multilingual Neural Voices (Hindi + English)',
      'Word-by-word Synced Karaoke Captions in Devanagari',
      'Licensed Temple Shankh, Flute & War Drums BGM',
      'Full Commercial Rights for YouTube & Instagram Reels',
      'Automated GST Tax Invoicing (18% ITC Included)',
    ],
    entitlements: {
      maxResolution: '1080p',
      watermark: false,
      maxVideoLengthSec: 45,
      supportedModels: ['gemini-flash', 'flux-pro', 'elevenlabs-multilingual'],
      storageMb: 10000,
      priorityQueue: true,
      commercialLicense: true,
    },
    isActive: true,
  },
  {
    id: 'plan_mythos_20',
    name: 'Mythos Special Creator (20 Videos)',
    description: 'Special creator plan with 20 videos, 4K upscale, hero scene animations & character consistency.',
    priceInr: 7999,
    priceAnnualInr: 6399,
    billingInterval: 'month',
    creditsPerPeriod: 450,
    badge: 'Special Plan • 20 Videos',
    accentTheme: 'max',
    features: [
      '20 Full Mythology Videos per month (450 credits)',
      '1080p Full HD Watermark-Free + 4K AI Upscale',
      'Hero Scene Video Animations (Image-to-Video Engine)',
      'Character Bible Lock (Rama, Krishna, Shiva, Hanuman)',
      'All 7 Art Styles + Custom Deity Prompt Engine',
      'ElevenLabs HD Voices with Emotion Pacing',
      'Word-by-word Synced Karaoke in Noto Sans Devanagari',
      '1-Click Viral Social Metadata Pack (Hooks & Hashtags)',
      'Priority GPU Cloud Render Queue',
      'Automated GST Tax Invoicing (18% ITC Included)',
    ],
    entitlements: {
      maxResolution: '1080p',
      watermark: false,
      maxVideoLengthSec: 60,
      supportedModels: ['gemini-flash', 'flux-pro', 'elevenlabs-multilingual', 'seedance-i2v'],
      storageMb: 25000,
      priorityQueue: true,
      commercialLicense: true,
    },
    isActive: true,
  },
  {
    id: 'plan_mythos_50',
    name: 'Mythos Studio Scale (50 Videos)',
    description: 'High-volume production tier for media houses, devotional studios, and daily channels.',
    priceInr: 16999,
    priceAnnualInr: 13599,
    billingInterval: 'month',
    creditsPerPeriod: 1200,
    badge: 'Studio Scale • 50 Videos',
    accentTheme: 'max',
    features: [
      '50 Full Mythology Videos per month (1,200 credits)',
      'Up to 60s per video with multi-character dialogues',
      'Multi-Episode Epic Series Manager (Ramayan/Mahabharat)',
      'Unlimited Character Bible with Reference Image Anchoring',
      'Dedicated High-Speed Cloud Render Cluster',
      'Full Commercial Agency & Broadcast Monetization License',
      'Automated GST Tax Invoicing (18% ITC Included)',
      'VIP Priority WhatsApp & Direct Video Architect Support',
    ],
    entitlements: {
      maxResolution: '1080p',
      watermark: false,
      maxVideoLengthSec: 60,
      supportedModels: ['gemini-flash', 'flux-pro', 'elevenlabs-multilingual', 'seedance-i2v'],
      storageMb: 60000,
      priorityQueue: true,
      commercialLicense: true,
    },
    isActive: true,
  },
];

export const MYTHOS_ADDON_PACKS = [
  {
    id: 'pack_mythos_200',
    name: 'Mythos Boost Pack',
    credits: 200,
    priceInr: 299,
    badge: 'Quick Top-up',
    description: 'Adds 200 credits to your wallet for ~10 mythology videos.',
  },
  {
    id: 'pack_mythos_500',
    name: 'Mythos Storyteller Pack',
    credits: 500,
    priceInr: 599,
    badge: 'Best Value',
    description: 'Adds 500 credits to your wallet for ~25 mythology videos.',
  },
  {
    id: 'pack_mythos_1200',
    name: 'Mythos Epic Pack',
    credits: 1200,
    priceInr: 1199,
    badge: 'Mega Creator',
    description: 'Adds 1,200 credits for complete series generation (~60 videos).',
  },
];
