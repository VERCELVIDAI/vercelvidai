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
    id: 'plan_mythos_creator',
    name: 'Mythos Creator',
    description: 'For creators, bhakti channels, and social media storytellers building an audience.',
    priceInr: 799,
    priceAnnualInr: 639,
    billingInterval: 'month',
    creditsPerPeriod: 800,
    badge: 'Most Popular',
    accentTheme: 'pro',
    features: [
      '800 Mythos Credits every month (~50 full videos)',
      '1080p Full HD Watermark-Free MP4 Exports',
      'All 7 Mythology Art Styles & Custom Prompts',
      'All 4 Aspect Ratios (9:16, 4:5, 1:1, 16:9)',
      'ElevenLabs Multilingual Neural Voices (Hindi + English)',
      'Word-by-word Synced Karaoke Captions',
      'Character Bible (Save up to 10 characters)',
      'Licensed Devotional & Epic Music Library',
      'Full Commercial Monetization License',
      'Automated GST Tax Invoicing (18% ITC)',
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
    id: 'plan_mythos_pro',
    name: 'Mythos Studio Pro',
    description: 'For production studios, YouTube creators, and high-frequency devotional media brands.',
    priceInr: 1999,
    priceAnnualInr: 1599,
    billingInterval: 'month',
    creditsPerPeriod: 2500,
    badge: 'Studio Grade',
    accentTheme: 'max',
    features: [
      '2,500 Mythos Credits every month (~150 videos)',
      'Hero Scene Video Animation (Image-to-Video)',
      'Multi-Episode Series Manager (Ramayan/Mahabharat)',
      'Unlimited Character Bible with Reference Images',
      'Up to 60s Video Clips per Generation',
      'Priority Cloud Rendering Queue (No Waiting)',
      'Automated Viral Metadata Pack (Title, Tags, Thumbnails)',
      'Priority VIP WhatsApp & Email Support',
    ],
    entitlements: {
      maxResolution: '1080p',
      watermark: false,
      maxVideoLengthSec: 60,
      supportedModels: ['gemini-flash', 'flux-pro', 'elevenlabs-multilingual', 'seedance-i2v'],
      storageMb: 30000,
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
    description: 'Adds 200 credits to your wallet for ~12 mythology videos.',
  },
  {
    id: 'pack_mythos_500',
    name: 'Mythos Storyteller Pack',
    credits: 500,
    priceInr: 599,
    badge: 'Best Value',
    description: 'Adds 500 credits to your wallet for ~30 mythology videos.',
  },
  {
    id: 'pack_mythos_1200',
    name: 'Mythos Epic Pack',
    credits: 1200,
    priceInr: 1199,
    badge: 'Mega Creator',
    description: 'Adds 1,200 credits for complete series generation.',
  },
];
