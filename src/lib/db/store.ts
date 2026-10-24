import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import {
  UserProfile,
  Workspace,
  WorkspaceMember,
  Project,
  Asset,
  GenerationJob,
  CreditAccount,
  CreditLedgerEntry,
  Plan,
  Subscription,
  Payment,
  CreditPack,
  AIProvider,
  AIModel,
  Template,
  BrandKit,
  RenderJob,
  WebhookEvent,
  AuditLog,
  SupportTicket,
  JobStatus,
  CreditTransactionType,
  PayUPaymentOrder,
  Invoice,
  PaymentReceipt,
  CreditNote,
  SupplierLegalDetails,
  Coupon,
  CouponRedemption,
} from '../types';

interface DatabaseSchema {
  profiles: UserProfile[];
  passwords: Record<string, string>; // userId -> hashedPassword/plaintext dev
  workspaces: Workspace[];
  workspaceMembers: WorkspaceMember[];
  projects: Project[];
  assets: Asset[];
  generationJobs: GenerationJob[];
  creditAccounts: Record<string, CreditAccount>; // userId -> account
  creditLedger: CreditLedgerEntry[];
  plans: Plan[];
  subscriptions: Subscription[];
  payments: Payment[];
  creditPacks: CreditPack[];
  aiProviders: AIProvider[];
  aiModels: AIModel[];
  templates: Template[];
  brandKits: BrandKit[];
  renderJobs: RenderJob[];
  webhookEvents: WebhookEvent[];
  auditLogs: AuditLog[];
  supportTickets: SupportTicket[];
  payuOrders: PayUPaymentOrder[];
  invoices: Invoice[];
  receipts: PaymentReceipt[];
  creditNotes: CreditNote[];
  billingSettings: SupplierLegalDetails;
  coupons: Coupon[];
  couponRedemptions: CouponRedemption[];
  passwordResetTokens?: Record<string, { token: string; expiresAt: string; email: string }>;
  templateLikes?: Record<string, string[]>;
  creatorFollows?: Record<string, string[]>;
  publishedTemplates?: any[];
}

// Determine writable data directory (handles Vercel / serverless read-only filesystem gracefully)
const isServerless = process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
const BUNDLED_DB_FILE = path.join(process.cwd(), 'data', 'database.json');
const DATA_DIR = isServerless ? path.join(os.tmpdir(), 'vidai-data') : path.join(process.cwd(), 'data');
const DB_FILE = isServerless ? path.join(DATA_DIR, 'database.json') : path.join(process.cwd(), 'data', 'database.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (isServerless && !fs.existsSync(DB_FILE) && fs.existsSync(BUNDLED_DB_FILE)) {
      try {
        fs.copyFileSync(BUNDLED_DB_FILE, DB_FILE);
      } catch (copyErr) {
        // Fallback: will initialize in-memory
      }
    }
  } catch (err) {
    // Read-only filesystem fallback
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${derivedKey}`;
}

export function verifyPasswordHash(plainText: string, storedHashOrPlain: string): boolean {
  if (!storedHashOrPlain || !plainText) return false;
  if (storedHashOrPlain.startsWith('scrypt:')) {
    const parts = storedHashOrPlain.split(':');
    if (parts.length !== 3) return false;
    const salt = parts[1];
    const hashHex = parts[2];
    const derivedKey = crypto.scryptSync(plainText, salt, 64).toString('hex');
    const hashBuf = Buffer.from(hashHex, 'hex');
    const derivedBuf = Buffer.from(derivedKey, 'hex');
    if (hashBuf.length !== derivedBuf.length) return false;
    return crypto.timingSafeEqual(hashBuf, derivedBuf);
  }
  // Plaintext fallback for legacy / pre-seeded data
  return storedHashOrPlain === plainText;
}

function getInitialDatabase(): DatabaseSchema {
  const now = new Date().toISOString();

  const demoUserId = 'usr_creator_demo_1';
  const adminUserId = 'usr_admin_master_1';
  const demoWorkspaceId = 'ws_creator_demo_1';
  const adminWorkspaceId = 'ws_admin_master_1';

  return {
    profiles: [
      {
        id: demoUserId,
        email: 'creator@vidai.io',
        displayName: 'Aria Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'creator',
        onboardingData: {
          primaryUseCase: 'ecommerce',
          experienceLevel: 'intermediate',
          socialPlatforms: ['Instagram', 'YouTube Shorts', 'TikTok'],
          videoTypes: ['Product Commercials', 'Social Media Reels'],
          completed: true,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: adminUserId,
        email: 'admin@vidai.io',
        displayName: 'System Administrator',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
        createdAt: now,
        updatedAt: now,
      },
    ],
    passwords: {
      [demoUserId]: hashPassword('Demo1234!'),
      [adminUserId]: hashPassword('Admin1234!'),
    },
    workspaces: [
      {
        id: demoWorkspaceId,
        ownerId: demoUserId,
        name: 'Aria’s Creative Studio',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: adminWorkspaceId,
        ownerId: adminUserId,
        name: 'Fluvia Global Ops',
        createdAt: now,
        updatedAt: now,
      },
    ],
    workspaceMembers: [
      { workspaceId: demoWorkspaceId, userId: demoUserId, role: 'owner', joinedAt: now },
      { workspaceId: adminWorkspaceId, userId: adminUserId, role: 'owner', joinedAt: now },
    ],
    creditAccounts: {
      [demoUserId]: {
        userId: demoUserId,
        availableBalance: 350,
        reservedBalance: 0,
        updatedAt: now,
      },
      [adminUserId]: {
        userId: adminUserId,
        availableBalance: 99999,
        reservedBalance: 0,
        updatedAt: now,
      },
    },
    creditLedger: [
      {
        id: 'cld_welcome_1',
        userId: demoUserId,
        transactionType: 'signup_bonus',
        amount: 100,
        balanceAfter: 100,
        idempotencyKey: 'welcome_grant_' + demoUserId,
        metadata: { note: 'Initial signup allowance' },
        createdAt: now,
      },
      {
        id: 'cld_starter_boost_1',
        userId: demoUserId,
        transactionType: 'purchase',
        amount: 250,
        balanceAfter: 350,
        idempotencyKey: 'starter_pack_' + demoUserId,
        metadata: { packName: 'Starter Creator Pack' },
        createdAt: now,
      },
    ],
    plans: [
      {
        id: 'plan_free',
        name: 'Free Explorer',
        priceInr: 0,
        billingInterval: 'month',
        creditsPerPeriod: 60,
        entitlements: {
          maxResolution: '720p',
          watermark: true,
          maxVideoLengthSec: 30,
          supportedModels: ['vidai-cinematic-v1', 'fal-flux-pro', 'gemini-3.1-flash-image'],
          storageMb: 1000,
          brandKitsAllowed: 1,
        },
        isActive: true,
      },
      {
        id: 'plan_starter',
        name: 'Fluvia Basic',
        description: 'For beginners and occasional creators getting started with cinematic AI.',
        priceInr: 999,
        priceAnnualInr: 799,
        billingInterval: 'month',
        creditsPerPeriod: 500,
        category: 'individual',
        accentTheme: 'basic',
        features: [
          '500 Credits every month',
          '1080p Full HD Exports',
          'Watermark-free rendering',
          '60s Max Clip Duration',
          'Fluvia Cinematic & Flux Fast',
          '10 GB Cloud Storage',
          'Standard Community Support',
        ],
        entitlements: {
          maxResolution: '1080p',
          watermark: false,
          maxVideoLengthSec: 60,
          supportedModels: ['fluvia-cinematic-v1', 'fal-flux-pro', 'gemini-3.1-flash-image', 'gemini-3-pro-image', 'eleven-multilingual'],
          storageMb: 10000,
          brandKitsAllowed: 2,
          seatsAllowed: 1,
          commercialLicense: true,
          apiAccess: false,
          supportLevel: 'standard',
        },
        isActive: true,
      },
      {
        id: 'plan_creator',
        name: 'Fluvia Pro',
        description: 'For regular creators and freelancers who produce frequent video content.',
        priceInr: 2499,
        priceAnnualInr: 1999,
        billingInterval: 'month',
        creditsPerPeriod: 1600,
        category: 'individual',
        badge: 'Recommended',
        accentTheme: 'pro',
        features: [
          '1,600 Credits every month',
          '4K Ultra HD Exports',
          'Runway Gen-3 & Fluvia Cinema',
          'Priority GPU rendering queue',
          'Multi-track timeline video editor',
          '5 Brand Kits (Logos, Fonts, Colors)',
          '50 GB Cloud Storage',
          'Priority VIP Assistance',
        ],
        entitlements: {
          maxResolution: '4k',
          watermark: false,
          maxVideoLengthSec: 180,
          supportedModels: ['fluvia-cinematic-v1', 'runway-gen3', 'luma-ray', 'fal-flux-pro', 'gemini-3.1-flash-image', 'gemini-3-pro-image', 'eleven-multilingual'],
          storageMb: 50000,
          priorityQueue: true,
          brandKitsAllowed: 5,
          seatsAllowed: 1,
          commercialLicense: true,
          apiAccess: false,
          supportLevel: 'priority',
        },
        isActive: true,
      },
      {
        id: 'plan_max',
        name: 'Fluvia Max',
        description: 'For professional creators, advertisers and intensive AI workflows.',
        priceInr: 4999,
        priceAnnualInr: 3999,
        billingInterval: 'month',
        creditsPerPeriod: 4000,
        category: 'individual',
        badge: 'Power Studio',
        accentTheme: 'max',
        features: [
          '4,000 Credits every month',
          '4K 60fps Cinema Master exports',
          'Dedicated GPU priority lane',
          'Gemini Storyboard & Director Mode',
          'All flagship & beta AI models',
          '15 Brand Kits & custom presets',
          '150 GB Cloud Storage',
          'Expedited 2-hour SLA Support',
        ],
        entitlements: {
          maxResolution: '4k',
          watermark: false,
          maxVideoLengthSec: 360,
          supportedModels: ['all'],
          storageMb: 150000,
          priorityQueue: true,
          brandKitsAllowed: 15,
          seatsAllowed: 1,
          commercialLicense: true,
          apiAccess: true,
          supportLevel: 'priority',
        },
        isActive: true,
      },
      {
        id: 'plan_business',
        name: 'Fluvia Teams',
        description: 'For agencies, businesses and collaborative creative teams.',
        priceInr: 9999,
        priceAnnualInr: 7999,
        billingInterval: 'month',
        creditsPerPeriod: 10000,
        category: 'business',
        badge: 'Agencies & Teams',
        accentTheme: 'teams',
        features: [
          '10,000 Credits every month',
          'Multi-seat team workspace (Up to 10)',
          'Shared credit wallet & asset pool',
          '4K 60fps Cinema Master exports',
          'Unlimited Brand Kits & templates',
          '500 GB High-Speed Storage',
          'Dedicated Account Manager',
          'Custom GST invoicing & SLA',
        ],
        entitlements: {
          maxResolution: '4k',
          watermark: false,
          maxVideoLengthSec: 600,
          supportedModels: ['all'],
          storageMb: 500000,
          priorityQueue: true,
          brandKitsAllowed: 50,
          seatsAllowed: 10,
          commercialLicense: true,
          apiAccess: true,
          supportLevel: 'dedicated',
        },
        isActive: true,
      },
    ],
    subscriptions: [
      {
        id: 'sub_demo_creator',
        userId: demoUserId,
        planId: 'plan_creator',
        providerSubscriptionId: 'sub_rzp_mock_live_123',
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        createdAt: now,
      },
    ],
    creditPacks: [
      { id: 'pack_500', name: '500 Credits Boost', priceInr: 499, creditAmount: 500, isActive: true },
      { id: 'pack_1200', name: '1,200 Credits Studio', priceInr: 999, creditAmount: 1200, isActive: true },
      { id: 'pack_3500', name: '3,500 Credits Scale', priceInr: 2499, creditAmount: 3500, isActive: true },
      { id: 'pack_10000', name: '10,000 Credits Agency', priceInr: 5999, creditAmount: 10000, isActive: true },
    ],
    aiProviders: [
      { id: 'fluvia_core', name: 'Fluvia Neural Engine (High Speed)', providerType: 'multimodal', configurationStatus: 'configured', isActive: true },
      { id: 'gemini', name: 'Google Gemini 1.5/2.0 Flash & Pro', providerType: 'text', configurationStatus: 'configured', isActive: true },
      { id: 'runway', name: 'Runway Gen-3 Alpha', providerType: 'video', configurationStatus: 'configured', isActive: true },
      { id: 'luma', name: 'Luma Dream Machine Ray', providerType: 'video', configurationStatus: 'configured', isActive: true },
      { id: 'fal_ai', name: 'Fal.ai Fast Media Engine', providerType: 'multimodal', configurationStatus: 'configured', isActive: true },
      { id: 'elevenlabs', name: 'ElevenLabs Neural Voices', providerType: 'audio', configurationStatus: 'configured', isActive: true },
      { id: 'openai', name: 'OpenAI GPT-4o Script Engine', providerType: 'text', configurationStatus: 'configured', isActive: true },
    ],
    aiModels: [
      {
        id: 'fluvia-cinematic-v1',
        providerId: 'fluvia_core',
        modelIdentifier: 'fluvia-cinematic-v1',
        displayName: 'Fluvia Cinematic HD',
        mediaType: 'video',
        capabilities: {
          resolutions: ['720p', '1080p', '4k'],
          aspectRatios: ['16:9', '9:16', '1:1', '21:9'],
          maxDuration: 15,
        },
        costConfiguration: { unitCostUsd: 0.05 },
        creditPricing: { costCredits: 25 },
        isActive: true,
      },
      {
        id: 'vidai-cinematic-v1',
        providerId: 'fluvia_core',
        modelIdentifier: 'fluvia-cinematic-v1',
        displayName: 'Fluvia Cinematic HD (Legacy)',
        mediaType: 'video',
        capabilities: {
          resolutions: ['720p', '1080p'],
          aspectRatios: ['16:9', '9:16', '1:1'],
          maxDuration: 10,
        },
        costConfiguration: { unitCostUsd: 0.05 },
        creditPricing: { costCredits: 25 },
        isActive: true,
      },
      {
        id: 'runway-gen3',
        providerId: 'runway',
        modelIdentifier: 'gen3-alpha-turbo',
        displayName: 'Runway Gen-3 Alpha Turbo',
        mediaType: 'video',
        capabilities: {
          resolutions: ['1080p', '4k'],
          aspectRatios: ['16:9', '9:16'],
          maxDuration: 15,
        },
        costConfiguration: { unitCostUsd: 0.2 },
        creditPricing: { costCredits: 50 },
        isActive: true,
      },
      {
        id: 'luma-ray',
        providerId: 'luma',
        modelIdentifier: 'ray-v2-production',
        displayName: 'Luma Dream Machine Ray',
        mediaType: 'video',
        capabilities: {
          resolutions: ['1080p'],
          aspectRatios: ['16:9', '9:16', '1:1'],
          maxDuration: 10,
        },
        costConfiguration: { unitCostUsd: 0.15 },
        creditPricing: { costCredits: 40 },
        isActive: true,
      },
      {
        id: 'fal-flux-pro',
        providerId: 'fal_ai',
        modelIdentifier: 'fal-ai/flux-pro-v1',
        displayName: 'Flux 1.1 Pro Vision',
        mediaType: 'image',
        capabilities: {
          resolutions: ['1024x1024', '1920x1080', '1080x1920'],
          aspectRatios: ['1:1', '16:9', '9:16'],
        },
        costConfiguration: { unitCostUsd: 0.02 },
        creditPricing: { costCredits: 5 },
        isActive: true,
      },
      {
        id: 'gemini-3.1-flash-image',
        providerId: 'gemini',
        modelIdentifier: 'gemini-3.1-flash-image',
        displayName: 'Gemini 3.1 Flash Image',
        mediaType: 'image',
        capabilities: {
          resolutions: ['1024x1024', '1920x1080', '1080x1920'],
          aspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
        },
        costConfiguration: { unitCostUsd: 0.02 },
        creditPricing: { costCredits: 5 },
        isActive: true,
      },
      {
        id: 'gemini-3-pro-image',
        providerId: 'gemini',
        modelIdentifier: 'gemini-3-pro-image',
        displayName: 'Gemini 3 Pro Image (Ultra)',
        mediaType: 'image',
        capabilities: {
          resolutions: ['1024x1024', '1920x1080', '1080x1920', '2048x2048'],
          aspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
        },
        costConfiguration: { unitCostUsd: 0.04 },
        creditPricing: { costCredits: 10 },
        isActive: true,
      },
      {
        id: 'eleven-multilingual',
        providerId: 'elevenlabs',
        modelIdentifier: 'eleven_turbo_v2_5',
        displayName: 'ElevenLabs Neural Voice HD',
        mediaType: 'voice',
        capabilities: {
          languages: ['en', 'hi', 'es', 'fr', 'de', 'ja'],
          emotions: ['neutral', 'excited', 'whispering', 'dramatic'],
        },
        costConfiguration: { unitCostUsd: 0.01 },
        creditPricing: { costCredits: 10 },
        isActive: true,
      },
    ],
    templates: [
      {
        id: 'tmpl_1',
        slug: 'instagram-reels-ecommerce',
        title: 'Viral Luxury Product Reel',
        category: 'Instagram Reels',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        templateData: {
          aspectRatio: '9:16',
          duration: 15,
          music: 'energetic-beat',
          scenes: [
            { text: 'Engineered for Performance', duration: 5, mediaUrl: '/media/templates/tmpl-01-cinematic-product.mp4' },
            { text: 'Ultralight Ergonomic Design', duration: 5, mediaUrl: '/media/login/login-hero-preview.mp4' },
            { text: 'Claim 30% Off Today', duration: 5, mediaUrl: '/media/templates/tmpl-14-instagram-reel.mp4' },
          ],
        },
        isPublished: true,
      },
      {
        id: 'tmpl_2',
        slug: 'youtube-shorts-tech',
        title: 'Daily AI & Tech Breakdown',
        category: 'YouTube Shorts',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        templateData: {
          aspectRatio: '9:16',
          duration: 20,
          music: 'lo-fi-tech',
          scenes: [
            { text: 'The AI Breakthrough Nobody Saw Coming', duration: 6, mediaUrl: '/media/templates/tmpl-09-tech-product.mp4' },
            { text: 'Here is what it means for creators', duration: 7, mediaUrl: '/media/templates/tmpl-13-yt-explainer.mp4' },
            { text: 'Follow for daily breakdowns', duration: 7, mediaUrl: '/media/templates/tmpl-12-yt-intro.mp4' },
          ],
        },
        isPublished: true,
      },
      {
        id: 'tmpl_3',
        slug: 'cinematic-luxury-perfume',
        title: 'Cinematic Perfume Commercial',
        category: 'Product Commercials',
        thumbnailUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
        templateData: {
          aspectRatio: '16:9',
          duration: 18,
          music: 'ambient-orchestral',
          scenes: [
            { text: 'Elegance in Every Breath', duration: 6, mediaUrl: '/media/templates/tmpl-02-luxury-perfume.mp4' },
            { text: 'Crafted in Grasse, France', duration: 6, mediaUrl: '/media/templates/tmpl-06-travel-reel.mp4' },
            { text: 'Fluvia Flow Signature Collection', duration: 6, mediaUrl: '/media/templates/tmpl-07-food-commercial.mp4' },
          ],
        },
        isPublished: true,
      },
      {
        id: 'tmpl_4',
        slug: 'saas-explainer-flow',
        title: 'SaaS Product Walkthrough',
        category: 'Explainer Videos',
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        templateData: {
          aspectRatio: '16:9',
          duration: 30,
          scenes: [
            { text: 'Build faster with AI Workflows', duration: 10 },
            { text: 'Collaborate in real time', duration: 10 },
            { text: 'Deploy worldwide instantly', duration: 10 },
          ],
        },
        isPublished: true,
      },
      {
        id: 'tmpl_5',
        slug: 'ugc-testimonial-unboxing',
        title: 'High-Converting UGC Hook',
        category: 'UGC Ads',
        thumbnailUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
        templateData: {
          aspectRatio: '9:16',
          duration: 25,
          scenes: [
            { text: 'Wait! Do not buy that until you see this', duration: 6 },
            { text: 'Here is what surprised me most', duration: 9 },
            { text: 'Link in bio with my 20% code', duration: 10 },
          ],
        },
        isPublished: true,
      },
      {
        id: 'tmpl_6',
        slug: 'youtube-longform-opener',
        title: 'Cinematic YouTube Channel Intro',
        category: 'YouTube Videos',
        thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
        templateData: {
          aspectRatio: '16:9',
          duration: 12,
          scenes: [
            { text: 'Welcome to the Next Era', duration: 6 },
            { text: 'Subscribe for Weekly Masterclasses', duration: 6 },
          ],
        },
        isPublished: true,
      },
    ],
    brandKits: [
      {
        id: 'bk_demo_1',
        workspaceId: demoWorkspaceId,
        name: 'Fluvia Flow Signature Kit',
        colors: ['#0B0C10', '#8B5CF6', '#38BDF8', '#FFFFFF'],
        fonts: ['Inter', 'Outfit', 'Cinzel'],
        guidelinesText: 'Modern, high-energy tech visual aesthetic with violet rim lighting and dynamic pacing.',
      },
    ],
    projects: [
      {
        id: 'prj_demo_reel_1',
        workspaceId: demoWorkspaceId,
        ownerId: demoUserId,
        title: 'Cyberpunk Runner — Summer Commercial',
        description: 'Cinematic futuristic footwear reveal teaser for Instagram & YouTube Shorts.',
        mediaType: 'video',
        status: 'completed',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        isFavorite: true,
        timeline: {
          durationSec: 15,
          aspectRatio: '9:16',
          resolution: '1080p',
          backgroundColor: '#090A0F',
          tracks: [
            { id: 'trk_video_1', type: 'video', name: 'Primary Video' },
            { id: 'trk_text_1', type: 'text', name: 'Subtitles & Titles' },
            { id: 'trk_audio_1', type: 'audio', name: 'Background Beat' },
          ],
          clips: [
            {
              id: 'clp_v1',
              trackId: 'trk_video_1',
              type: 'video',
              title: 'Opening Footwear Shot',
              sourceUrl: '/media/templates/tmpl-01-cinematic-product.mp4',
              startTimeSec: 0,
              durationSec: 5,
              volume: 1,
            },
            {
              id: 'clp_v2',
              trackId: 'trk_video_1',
              type: 'video',
              title: 'Urban Sprint Cinematic',
              sourceUrl: '/media/login/login-hero-preview.mp4',
              startTimeSec: 5,
              durationSec: 5,
              volume: 1,
            },
            {
              id: 'clp_v3',
              trackId: 'trk_video_1',
              type: 'video',
              title: 'Hero Brand Lockup',
              sourceUrl: '/media/templates/tmpl-14-instagram-reel.mp4',
              startTimeSec: 10,
              durationSec: 5,
              volume: 1,
            },
            {
              id: 'clp_t1',
              trackId: 'trk_text_1',
              type: 'text',
              title: 'Headline Hook',
              text: 'STEP INTO TOMORROW',
              startTimeSec: 1,
              durationSec: 3.5,
              style: { fontSize: 32, color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.6)', positionY: 80 },
            },
            {
              id: 'clp_t2',
              trackId: 'trk_text_1',
              type: 'text',
              title: 'CTA Text',
              text: 'GET 30% OFF NOW',
              startTimeSec: 10.5,
              durationSec: 4,
              style: { fontSize: 36, color: '#38BDF8', backgroundColor: 'rgba(11,12,16,0.8)', positionY: 75 },
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prj_demo_explainer_2',
        workspaceId: demoWorkspaceId,
        ownerId: demoUserId,
        title: 'AI Video Marketing Playbook',
        description: 'Landscape YouTube explainer for marketing teams.',
        mediaType: 'video',
        status: 'draft',
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        isFavorite: false,
        timeline: {
          durationSec: 30,
          aspectRatio: '16:9',
          resolution: '1080p',
          tracks: [
            { id: 'trk_v', type: 'video', name: 'Main Video Track' },
            { id: 'trk_t', type: 'text', name: 'Key Points' },
          ],
          clips: [
            {
              id: 'clp_2_1',
              trackId: 'trk_v',
              type: 'video',
              title: 'Studio Workspace',
              sourceUrl: '/media/templates/tmpl-09-tech-product.mp4',
              startTimeSec: 0,
              durationSec: 12,
            },
          ],
        },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: now,
      },
    ],
    assets: [
      {
        id: 'ast_sample_1',
        workspaceId: demoWorkspaceId,
        ownerId: demoUserId,
        name: 'Cyberpunk Sneaker 3D Render.png',
        assetType: 'image',
        storageKey: 'assets/demo/sneaker_render.png',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80',
        mimeType: 'image/png',
        fileSize: 1450230,
        createdAt: now,
      },
      {
        id: 'ast_sample_2',
        workspaceId: demoWorkspaceId,
        ownerId: demoUserId,
        name: 'Brand Audio Theme - Synthwave.mp3',
        assetType: 'audio',
        storageKey: 'assets/demo/synthwave_theme.mp3',
        url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3',
        mimeType: 'audio/mpeg',
        fileSize: 3200100,
        createdAt: now,
      },
    ],
    generationJobs: [
      {
        id: 'job_sample_completed_1',
        userId: demoUserId,
        workspaceId: demoWorkspaceId,
        projectId: 'prj_demo_reel_1',
        providerId: 'vidai_core',
        modelId: 'vidai-cinematic-v1',
        status: 'completed',
        progressPercent: 100,
        progressMessage: 'Rendering completed successfully',
        input: {
          prompt: 'Ultra-cinematic slow motion close up of high-tech futuristic athletic running sneakers with violet neon accents on wet asphalt city street at night.',
          aspectRatio: '9:16',
          durationSec: 5,
          resolution: '1080p',
        },
        output: {
          videoUrl: '/media/templates/tmpl-01-cinematic-product.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
          isDemoSimulated: true,
        },
        estimatedCredits: 25,
        reservedCredits: 25,
        actualCredits: 25,
        providerRequestId: 'req_vidai_demo_8829',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3540000).toISOString(),
        completedAt: new Date(Date.now() - 3540000).toISOString(),
      },
    ],
    payments: [
      {
        id: 'pay_starter_1',
        userId: demoUserId,
        orderId: 'order_rzp_mock_123',
        providerPaymentId: 'pay_rzp_mock_456',
        amountInr: 999,
        currency: 'INR',
        status: 'success',
        paymentType: 'subscription',
        createdAt: now,
      },
    ],
    renderJobs: [],
    webhookEvents: [],
    auditLogs: [
      {
        id: 'aud_1',
        actorId: demoUserId,
        action: 'PROJECT_CREATED',
        resourceType: 'project',
        resourceId: 'prj_demo_reel_1',
        createdAt: now,
      },
    ],
    supportTickets: [
      {
        id: 'tkt_1',
        userId: demoUserId,
        userEmail: 'creator@vidai.io',
        subject: 'Inquiry regarding 4K 60fps export presets',
        category: 'Feature Request',
        status: 'in_progress',
        priority: 'medium',
        createdAt: now,
        updatedAt: now,
      },
    ],
    payuOrders: [],
    invoices: [],
    receipts: [],
    creditNotes: [],
    coupons: [
      {
        id: 'cpn_free100',
        code: 'FREE100',
        description: '100% Full Discount - Instant Free Checkout',
        discountType: 'percentage',
        discountValue: 100,
        usageLimit: 10000,
        perUserLimit: 10,
        usageCount: 0,
        isActive: true,
        createdBy: 'usr_admin_master_1',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'cpn_creator100',
        code: 'CREATOR100',
        description: '100% Free VIP Creator Pass - All Plans & Packs',
        discountType: 'percentage',
        discountValue: 100,
        usageLimit: 10000,
        perUserLimit: 10,
        usageCount: 0,
        isActive: true,
        createdBy: 'usr_admin_master_1',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'cpn_fluviavip',
        code: 'FLUVIAVIP',
        description: 'VIP 100% Discount - Free Creative Credits',
        discountType: 'percentage',
        discountValue: 100,
        usageLimit: 10000,
        perUserLimit: 10,
        usageCount: 0,
        isActive: true,
        createdBy: 'usr_admin_master_1',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'cpn_welcome10',
        code: 'WELCOME10',
        description: '10% Welcome Discount for creators',
        discountType: 'percentage',
        discountValue: 10,
        minimumOrderValue: 499,
        maxDiscount: 1000,
        usageLimit: 1000,
        perUserLimit: 1,
        usageCount: 0,
        isActive: true,
        createdBy: 'usr_admin_master_1',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'cpn_save20',
        code: 'SAVE20',
        description: 'Save 20% on any subscription plan or credit pack',
        discountType: 'percentage',
        discountValue: 20,
        maxDiscount: 500,
        minimumOrderValue: 499,
        usageLimit: 500,
        perUserLimit: 2,
        usageCount: 0,
        isActive: true,
        createdBy: 'usr_admin_master_1',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'cpn_fluvia100',
        code: 'FLUVIA100',
        description: 'Flat INR 100 off on all orders above INR 499',
        discountType: 'fixed',
        discountValue: 100,
        minimumOrderValue: 499,
        usageLimit: 200,
        perUserLimit: 1,
        usageCount: 0,
        isActive: true,
        createdBy: 'usr_admin_master_1',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'cpn_teams500',
        code: 'TEAMS500',
        description: 'Flat INR 500 off on Fluvia Teams or Studio Packs',
        discountType: 'fixed',
        discountValue: 500,
        minimumOrderValue: 2000,
        applicableTypes: ['subscription', 'credit_pack'],
        usageLimit: 100,
        perUserLimit: 1,
        usageCount: 0,
        isActive: true,
        createdBy: 'usr_admin_master_1',
        createdAt: now,
        updatedAt: now,
      },
    ],
    couponRedemptions: [],
    billingSettings: {
      legalName: 'Fluvia Flow Technologies Private Limited',
      tradeName: 'Fluvia Flow',
      registeredAddress: 'Level 4, Horizon Creative Hub, Connaught Place, New Delhi 110001',
      state: 'Delhi',
      gstin: '07AAAAA0000A1Z5',
      pan: 'AAAAA0000A',
      supportEmail: 'billing@fluviaflow.ai',
      website: 'https://fluviaflow.ai',
      isGstRegistered: true,
    },
  };
}

class Store {
  private db: DatabaseSchema | null = null;
  private lastMtime: number = 0;

  private ensureCollections(schema: DatabaseSchema): void {
    if (!schema.passwords) schema.passwords = {};

    // Ensure primary demo and admin accounts exist for both Fluvia Flow and legacy domains
    const defaultAccounts = [
      {
        id: 'usr_creator_demo_1',
        email: 'creator@fluviaflow.ai',
        displayName: 'Aria Vance',
        role: 'creator' as const,
        pass: 'Demo1234!',
      },
      {
        id: 'usr_creator_demo_1',
        email: 'creator@vidai.io',
        displayName: 'Aria Vance',
        role: 'creator' as const,
        pass: 'Demo1234!',
      },
      {
        id: 'usr_admin_master_1',
        email: 'admin@fluviaflow.ai',
        displayName: 'System Administrator',
        role: 'admin' as const,
        pass: 'Admin1234!',
      },
      {
        id: 'usr_admin_master_1',
        email: 'admin@vidai.io',
        displayName: 'System Administrator',
        role: 'admin' as const,
        pass: 'Admin1234!',
      },
    ];

    const now = new Date().toISOString();
    for (const acc of defaultAccounts) {
      const cleanEmail = acc.email.toLowerCase().trim();
      let p = schema.profiles.find((x) => x.email?.toLowerCase().trim() === cleanEmail);
      if (!p) {
        p = {
          id: acc.id,
          email: cleanEmail,
          displayName: acc.displayName,
          role: acc.role,
          createdAt: now,
          updatedAt: now,
        };
        schema.profiles.push(p);
      }
      const hashed = hashPassword(acc.pass);
      schema.passwords[p.id] = schema.passwords[p.id] || hashed;
      schema.passwords[cleanEmail] = schema.passwords[cleanEmail] || hashed;

      if (!schema.creditAccounts[p.id]) {
        schema.creditAccounts[p.id] = {
          userId: p.id,
          availableBalance: 350,
          reservedBalance: 0,
          updatedAt: now,
        };
      }
    }

    if (schema.profiles) {
      for (const p of schema.profiles) {
        if (p.email && p.id && schema.passwords[p.id]) {
          const emailKey = p.email.trim().toLowerCase();
          if (!schema.passwords[emailKey]) {
            schema.passwords[emailKey] = schema.passwords[p.id];
          }
        }
      }
    }
    if (!schema.payuOrders) schema.payuOrders = [];
    if (!schema.invoices) schema.invoices = [];
    if (!schema.receipts) schema.receipts = [];
    if (!schema.creditNotes) schema.creditNotes = [];
    if (!schema.passwordResetTokens) schema.passwordResetTokens = {};
    if (!schema.coupons) {
      const now = new Date().toISOString();
      schema.coupons = [
        {
          id: 'cpn_free100',
          code: 'FREE100',
          description: '100% Full Discount - Instant Free Checkout',
          discountType: 'percentage',
          discountValue: 100,
          usageLimit: 10000,
          perUserLimit: 10,
          usageCount: 0,
          isActive: true,
          createdBy: 'usr_admin_master_1',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'cpn_creator100',
          code: 'CREATOR100',
          description: '100% Free VIP Creator Pass - All Plans & Packs',
          discountType: 'percentage',
          discountValue: 100,
          usageLimit: 10000,
          perUserLimit: 10,
          usageCount: 0,
          isActive: true,
          createdBy: 'usr_admin_master_1',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'cpn_fluviavip',
          code: 'FLUVIAVIP',
          description: 'VIP 100% Discount - Free Creative Credits',
          discountType: 'percentage',
          discountValue: 100,
          usageLimit: 10000,
          perUserLimit: 10,
          usageCount: 0,
          isActive: true,
          createdBy: 'usr_admin_master_1',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'cpn_welcome10',
          code: 'WELCOME10',
          description: '10% Welcome Discount for creators',
          discountType: 'percentage',
          discountValue: 10,
          minimumOrderValue: 499,
          maxDiscount: 1000,
          usageLimit: 1000,
          perUserLimit: 1,
          usageCount: 0,
          isActive: true,
          createdBy: 'usr_admin_master_1',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'cpn_save20',
          code: 'SAVE20',
          description: 'Save 20% on any subscription plan or credit pack',
          discountType: 'percentage',
          discountValue: 20,
          maxDiscount: 500,
          minimumOrderValue: 499,
          usageLimit: 500,
          perUserLimit: 2,
          usageCount: 0,
          isActive: true,
          createdBy: 'usr_admin_master_1',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'cpn_fluvia100',
          code: 'FLUVIA100',
          description: 'Flat INR 100 off on all orders above INR 499',
          discountType: 'fixed',
          discountValue: 100,
          minimumOrderValue: 499,
          usageLimit: 200,
          perUserLimit: 1,
          usageCount: 0,
          isActive: true,
          createdBy: 'usr_admin_master_1',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'cpn_teams500',
          code: 'TEAMS500',
          description: 'Flat INR 500 off on Fluvia Teams or Studio Packs',
          discountType: 'fixed',
          discountValue: 500,
          minimumOrderValue: 2000,
          applicableTypes: ['subscription', 'credit_pack'],
          usageLimit: 100,
          perUserLimit: 1,
          usageCount: 0,
          isActive: true,
          createdBy: 'usr_admin_master_1',
          createdAt: now,
          updatedAt: now,
        },
      ];
    }
    if (!schema.couponRedemptions) schema.couponRedemptions = [];
    if (!schema.billingSettings) {
      schema.billingSettings = {
        legalName: 'Fluvia Flow Technologies Private Limited',
        tradeName: 'Fluvia Flow',
        registeredAddress: 'Level 4, Horizon Creative Hub, Connaught Place, New Delhi 110001',
        state: 'Delhi',
        gstin: '07AAAAA0000A1Z5',
        pan: 'AAAAA0000A',
        supportEmail: 'billing@fluviaflow.ai',
        website: 'https://fluviaflow.ai',
        isGstRegistered: true,
      };
    }
  }

  public forceReload(): DatabaseSchema {
    this.db = null;
    this.lastMtime = 0;
    return this.load();
  }

  private load(): DatabaseSchema {
    ensureDataDir();

    let fileMtime = 0;
    try {
      if (fs.existsSync(DB_FILE)) {
        fileMtime = fs.statSync(DB_FILE).mtimeMs;
      }
    } catch (e) {}

    // Return in-memory cache ONLY IF file exists, has valid mtime, and exactly matches our last loaded mtime
    if (this.db && fileMtime > 0 && this.lastMtime > 0 && fileMtime === this.lastMtime) {
      return this.db;
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.db = JSON.parse(raw);
        this.lastMtime = fileMtime || fs.statSync(DB_FILE).mtimeMs;
        this.ensureCollections(this.db!);
        return this.db!;
      } catch (err) {
        console.warn('[DBStore] Error reading primary db file, trying fallback:', err);
      }
    }

    if (fs.existsSync(BUNDLED_DB_FILE)) {
      try {
        const raw = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
        this.db = JSON.parse(raw);
        this.lastMtime = fs.statSync(BUNDLED_DB_FILE).mtimeMs;
        this.ensureCollections(this.db!);
        return this.db!;
      } catch (err) {}
    }

    const initial = getInitialDatabase();
    this.save(initial);
    this.db = initial;
    return this.db;
  }

  private save(data: DatabaseSchema): void {
    this.db = data;
    try {
      ensureDataDir();
      const content = JSON.stringify(data, null, 2);
      let written = false;

      // 1. Try atomic rename via temp file
      try {
        const tempFile = `${DB_FILE}.${Date.now()}.${Math.random().toString(36).substring(2, 7)}.tmp`;
        fs.writeFileSync(tempFile, content, 'utf-8');
        try {
          fs.renameSync(tempFile, DB_FILE);
          written = true;
        } catch {
          // On Windows, renameSync can fail with EPERM/EBUSY if the destination file is open
          try {
            fs.copyFileSync(tempFile, DB_FILE);
            written = true;
          } catch {}
          try { fs.unlinkSync(tempFile); } catch {}
        }
      } catch {}

      // 2. Direct write fallback if atomic rename/copy encountered permission or locking lock
      if (!written) {
        fs.writeFileSync(DB_FILE, content, 'utf-8');
      }

      try {
        this.lastMtime = fs.statSync(DB_FILE).mtimeMs;
      } catch (e) {}
    } catch (err) {
      console.warn('[DBStore] Read-only or restricted filesystem; state safely preserved in memory:', err);
    }
  }

  // ==========================================
  // USERS & AUTH
  // ==========================================
  getProfileById(id: string): UserProfile | undefined {
    if (!id) return undefined;
    const clean = id.trim();
    return this.load().profiles.find((p) => p.id === clean);
  }

  getProfileByEmail(email: string): UserProfile | undefined {
    if (!email) return undefined;
    const normalized = email.trim().toLowerCase();
    return this.load().profiles.find((p) => (p.email || '').trim().toLowerCase() === normalized);
  }

  hasPassword(userIdOrEmail: string): boolean {
    if (!userIdOrEmail) return false;
    const db = this.load();
    const cleanKey = userIdOrEmail.trim().toLowerCase();
    if (db.passwords && (db.passwords[userIdOrEmail] || db.passwords[cleanKey])) return true;
    const profile = db.profiles.find((p) => p.id === userIdOrEmail || (p.email && p.email.trim().toLowerCase() === cleanKey));
    if (profile) {
      return Boolean(db.passwords && (db.passwords[profile.id] || (profile.email && db.passwords[profile.email.trim().toLowerCase()])));
    }
    return false;
  }

  verifyPassword(userIdOrEmail: string, plainText: string): boolean {
    if (!userIdOrEmail || !plainText) return false;
    const db = this.load();
    const cleanKey = userIdOrEmail.trim().toLowerCase();

    let stored = db.passwords[userIdOrEmail] || db.passwords[cleanKey];

    if (!stored) {
      const profile = db.profiles.find(
        (p) => p.id === userIdOrEmail || (p.email && p.email.trim().toLowerCase() === cleanKey)
      );
      if (profile) {
        stored = db.passwords[profile.id] || (profile.email && db.passwords[profile.email.trim().toLowerCase()]);
      }
    }

    if (!stored) return false;
    const isValid = verifyPasswordHash(plainText, stored);
    // If authenticated via legacy plaintext password, upgrade in-place to salted scrypt
    if (isValid && !stored.startsWith('scrypt:')) {
      const hashed = hashPassword(plainText);
      db.passwords[userIdOrEmail] = hashed;
      if (cleanKey.includes('@')) db.passwords[cleanKey] = hashed;
      this.save(db);
    }
    return isValid;
  }

  getPasswordHash(userIdOrEmail: string): string | undefined {
    if (!userIdOrEmail) return undefined;
    const db = this.load();
    const cleanKey = userIdOrEmail.trim().toLowerCase();
    let stored = db.passwords[userIdOrEmail] || db.passwords[cleanKey];
    if (!stored) {
      const profile = db.profiles.find(
        (p) => p.id === userIdOrEmail || (p.email && p.email.trim().toLowerCase() === cleanKey)
      );
      if (profile) {
        stored = db.passwords[profile.id] || (profile.email && db.passwords[profile.email.trim().toLowerCase()]);
      }
    }
    return stored;
  }

  rehydrateFromVault(data: {
    userId: string;
    email: string;
    displayName?: string;
    role?: 'creator' | 'admin' | 'enterprise';
    passwordHash?: string;
    workspaceId?: string;
    createdAt?: string;
  }): { profile: UserProfile; workspace: Workspace } {
    const db = this.load();
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanDisplayName = (data.displayName || '').trim() || cleanEmail.split('@')[0] || 'Creator';
    const now = data.createdAt || new Date().toISOString();

    let profile = db.profiles.find((p) => p.id === data.userId || (p.email && p.email.toLowerCase() === cleanEmail));
    if (!profile) {
      profile = {
        id: data.userId,
        email: cleanEmail,
        displayName: cleanDisplayName,
        role: (data.role as any) || 'creator',
        createdAt: now,
        updatedAt: new Date().toISOString(),
      };
      db.profiles.push(profile);
    } else {
      if (data.displayName && !profile.displayName) profile.displayName = cleanDisplayName;
      if (data.role && !profile.role) profile.role = data.role as any;
    }

    if (data.passwordHash) {
      db.passwords[profile.id] = data.passwordHash;
      db.passwords[cleanEmail] = data.passwordHash;
    }

    const ws = this.ensureUserWorkspace(profile.id, profile.displayName);

    if (!db.creditAccounts[profile.id]) {
      db.creditAccounts[profile.id] = {
        userId: profile.id,
        availableBalance: 100,
        reservedBalance: 0,
        updatedAt: now,
      };
      db.creditLedger.push({
        id: 'cld_' + Math.random().toString(36).substring(2, 12),
        userId: profile.id,
        transactionType: 'signup_bonus',
        amount: 100,
        balanceAfter: 100,
        idempotencyKey: `vault_signup_${profile.id}`,
        metadata: { note: 'Welcome allowance' },
        createdAt: now,
      });
    }

    this.save(db);
    return { profile, workspace: ws };
  }

  rehydrateFromSession(data: {
    userId: string;
    email: string;
    role: 'creator' | 'admin' | 'enterprise';
    workspaceId?: string;
  }): { profile: UserProfile; workspace: Workspace } {
    return this.rehydrateFromVault({
      userId: data.userId,
      email: data.email,
      role: data.role,
      workspaceId: data.workspaceId,
    });
  }

  createProfile(params: { email: string; displayName: string; passwordPlainText: string; role?: 'creator' | 'admin' }): { profile: UserProfile; workspace: Workspace } {
    const db = this.load();
    const now = new Date().toISOString();
    const userId = 'usr_' + Math.random().toString(36).substring(2, 10);
    const workspaceId = 'ws_' + Math.random().toString(36).substring(2, 10);
    const cleanEmail = (params.email || '').trim().toLowerCase();
    const cleanDisplayName = (params.displayName || '').trim();

    const profile: UserProfile = {
      id: userId,
      email: cleanEmail,
      displayName: cleanDisplayName,
      role: params.role || 'creator',
      createdAt: now,
      updatedAt: now,
    };

    const workspace: Workspace = {
      id: workspaceId,
      ownerId: userId,
      name: `${cleanDisplayName}'s Studio`,
      createdAt: now,
      updatedAt: now,
    };

    const member: WorkspaceMember = {
      workspaceId,
      userId,
      role: 'owner',
      joinedAt: now,
    };

    // Credit account with 100 free credits
    const creditAccount: CreditAccount = {
      userId,
      availableBalance: 100,
      reservedBalance: 0,
      updatedAt: now,
    };

    const ledgerEntry: CreditLedgerEntry = {
      id: 'cld_' + Math.random().toString(36).substring(2, 12),
      userId,
      transactionType: 'signup_bonus',
      amount: 100,
      balanceAfter: 100,
      idempotencyKey: `signup_grant_${userId}`,
      metadata: { note: 'Welcome signup allowance' },
      createdAt: now,
    };

    const hashedPassword = hashPassword(params.passwordPlainText);
    db.profiles.push(profile);
    db.passwords[userId] = hashedPassword;
    db.passwords[cleanEmail] = hashedPassword; // Dual-index for immediate lookup
    db.workspaces.push(workspace);
    db.workspaceMembers.push(member);
    db.creditAccounts[userId] = creditAccount;
    db.creditLedger.push(ledgerEntry);

    this.save(db);
    return { profile, workspace };
  }

  syncSupabaseProfile(params: {
    userId: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
    role?: 'creator' | 'admin' | 'enterprise';
    authProvider?: string;
  }): { profile: UserProfile; workspace: Workspace } {
    const db = this.load();
    const cleanEmail = (params.email || '').trim().toLowerCase();
    const cleanDisplayName = (params.displayName || '').trim() || cleanEmail.split('@')[0] || 'Creator';
    const now = new Date().toISOString();

    // Check if profile exists by ID or by email
    let profile = db.profiles.find((p) => p.id === params.userId || p.email.toLowerCase() === cleanEmail);

    if (profile) {
      profile.id = params.userId; // Ensure exact Supabase user UUID
      profile.email = cleanEmail;
      if (params.displayName) profile.displayName = cleanDisplayName;
      if (params.avatarUrl) profile.avatarUrl = params.avatarUrl;
      if (params.role) profile.role = params.role as any;
      profile.updatedAt = now;
    } else {
      profile = {
        id: params.userId,
        email: cleanEmail,
        displayName: cleanDisplayName,
        avatarUrl: params.avatarUrl,
        role: (params.role as any) || 'creator',
        createdAt: now,
        updatedAt: now,
      };
      db.profiles.push(profile);
    }

    // Ensure Workspace exists
    let workspace = db.workspaces.find((w) => w.ownerId === params.userId);
    if (!workspace) {
      const workspaceId = 'ws_' + params.userId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
      workspace = {
        id: workspaceId,
        ownerId: params.userId,
        name: `${cleanDisplayName}'s Studio`,
        createdAt: now,
        updatedAt: now,
      };
      db.workspaces.push(workspace);

      db.workspaceMembers.push({
        workspaceId,
        userId: params.userId,
        role: 'owner',
        joinedAt: now,
      });
    }

    // Ensure Credit Account exists with 100 free credits
    if (!db.creditAccounts[params.userId]) {
      db.creditAccounts[params.userId] = {
        userId: params.userId,
        availableBalance: 100,
        reservedBalance: 0,
        updatedAt: now,
      };

      db.creditLedger.push({
        id: 'cld_' + Math.random().toString(36).substring(2, 12),
        userId: params.userId,
        transactionType: 'signup_bonus',
        amount: 100,
        balanceAfter: 100,
        idempotencyKey: `supabase_signup_${params.userId}`,
        metadata: { note: 'Supabase welcome allowance' },
        createdAt: now,
      });
    }

    this.save(db);
    return { profile, workspace };
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile {
    const db = this.load();
    const idx = db.profiles.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('User not found');
    db.profiles[idx] = {
      ...db.profiles[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save(db);
    return db.profiles[idx];
  }

  deleteProfile(id: string): boolean {
    const db = this.load();
    const profile = db.profiles.find((p) => p.id === id);
    db.profiles = db.profiles.filter((p) => p.id !== id);
    delete db.passwords[id];
    if (profile?.email) {
      delete db.passwords[profile.email.trim().toLowerCase()];
    }
    delete db.creditAccounts[id];
    db.projects = db.projects.filter((p) => p.ownerId !== id);
    db.assets = db.assets.filter((a) => a.ownerId !== id);
    db.generationJobs = db.generationJobs.filter((g) => g.userId !== id);
    this.save(db);
    return true;
  }

  getAllProfiles(): UserProfile[] {
    return this.load().profiles;
  }

  getProfileByGoogleId(googleId: string): UserProfile | undefined {
    return this.load().profiles.find((p) => p.googleId === googleId);
  }

  createGoogleProfile(params: {
    googleId: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  }): { profile: UserProfile; workspace: Workspace } {
    const db = this.load();
    const normalizedEmail = params.email.toLowerCase().trim();

    // 1. Existing user with this Google ID
    const byGoogle = db.profiles.find((p) => p.googleId === params.googleId);
    if (byGoogle) {
      const ws = this.ensureUserWorkspace(byGoogle.id, byGoogle.displayName);
      return { profile: byGoogle, workspace: ws };
    }

    // 2. Existing user by email — link Google account without duplicating or resetting credits
    const byEmail = db.profiles.find((p) => p.email.toLowerCase() === normalizedEmail);
    if (byEmail) {
      byEmail.googleId = params.googleId;
      byEmail.authProvider = byEmail.authProvider || 'google';
      byEmail.emailVerified = true;
      if (params.avatarUrl && !byEmail.avatarUrl) {
        byEmail.avatarUrl = params.avatarUrl;
      }
      byEmail.updatedAt = new Date().toISOString();
      this.save(db);
      const ws = this.ensureUserWorkspace(byEmail.id, byEmail.displayName);
      return { profile: byEmail, workspace: ws };
    }

    // 3. New Google User
    const now = new Date().toISOString();
    const userId = 'usr_' + Math.random().toString(36).substring(2, 10);
    const workspaceId = 'ws_' + Math.random().toString(36).substring(2, 10);

    const profile: UserProfile = {
      id: userId,
      email: normalizedEmail,
      displayName: params.displayName || normalizedEmail.split('@')[0],
      avatarUrl: params.avatarUrl,
      role: 'creator',
      authProvider: 'google',
      googleId: params.googleId,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    };

    const workspace: Workspace = {
      id: workspaceId,
      ownerId: userId,
      name: `${profile.displayName}'s Studio`,
      createdAt: now,
      updatedAt: now,
    };

    const member: WorkspaceMember = {
      workspaceId,
      userId,
      role: 'owner',
      joinedAt: now,
    };

    // Award welcome credits ONCE
    const creditAccount: CreditAccount = {
      userId,
      availableBalance: 100,
      reservedBalance: 0,
      updatedAt: now,
    };

    const ledgerEntry: CreditLedgerEntry = {
      id: 'cld_' + Math.random().toString(36).substring(2, 12),
      userId,
      transactionType: 'signup_bonus',
      amount: 100,
      balanceAfter: 100,
      idempotencyKey: `google_signup_grant_${userId}`,
      metadata: { note: 'Welcome Google signup allowance' },
      createdAt: now,
    };

    db.profiles.push(profile);
    db.workspaces.push(workspace);
    db.workspaceMembers.push(member);
    db.creditAccounts[userId] = creditAccount;
    db.creditLedger.push(ledgerEntry);

    this.save(db);
    return { profile, workspace };
  }

  // ==========================================
  // PASSWORD RECOVERY WORKFLOW
  // ==========================================
  createPasswordResetToken(email: string): { token: string; expiresAt: string; resetLink: string } | null {
    const db = this.load();
    const user = this.getProfileByEmail(email);
    if (!user) return null;

    if (!db.passwordResetTokens) {
      db.passwordResetTokens = {};
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour validity

    db.passwordResetTokens[user.id] = {
      token,
      expiresAt,
      email: user.email,
    };

    this.save(db);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    return { token, expiresAt, resetLink };
  }

  verifyPasswordResetToken(email: string, token: string): boolean {
    const db = this.load();
    if (!db.passwordResetTokens) return false;

    const user = this.getProfileByEmail(email);
    if (!user) return false;

    const record = db.passwordResetTokens[user.id];
    if (!record) return false;

    if (record.token !== token) return false;
    if (new Date(record.expiresAt).getTime() < Date.now()) return false;

    return true;
  }

  resetPasswordWithToken(email: string, token: string, newPasswordPlainText: string): boolean {
    const db = this.load();
    if (!this.verifyPasswordResetToken(email, token)) return false;

    const user = this.getProfileByEmail(email);
    if (!user) return false;

    const hashed = hashPassword(newPasswordPlainText);
    db.passwords[user.id] = hashed;
    if (user.email) {
      db.passwords[user.email.trim().toLowerCase()] = hashed;
    }
    delete db.passwordResetTokens![user.id];
    user.updatedAt = new Date().toISOString();
    this.save(db);

    return true;
  }

  // ==========================================
  // WORKSPACES
  // ==========================================
  ensureUserWorkspace(userId: string, displayName?: string): Workspace {
    const db = this.load();
    const memberships = db.workspaceMembers.filter((m) => m.userId === userId).map((m) => m.workspaceId);
    const existing = db.workspaces.find((w) => memberships.includes(w.id));
    if (existing) return existing;

    const now = new Date().toISOString();
    const workspaceId = 'ws_' + Math.random().toString(36).substring(2, 10);
    const user = db.profiles.find((p) => p.id === userId);
    const name = displayName || user?.displayName || 'Personal';

    const workspace: Workspace = {
      id: workspaceId,
      ownerId: userId,
      name: `${name}'s Studio`,
      createdAt: now,
      updatedAt: now,
    };

    const member: WorkspaceMember = {
      workspaceId,
      userId,
      role: 'owner',
      joinedAt: now,
    };

    db.workspaces.push(workspace);
    db.workspaceMembers.push(member);
    this.save(db);
    return workspace;
  }

  getUserWorkspaces(userId: string): Workspace[] {
    const db = this.load();
    const memberships = db.workspaceMembers.filter((m) => m.userId === userId).map((m) => m.workspaceId);
    const workspaces = db.workspaces.filter((w) => memberships.includes(w.id));
    if (workspaces.length === 0) {
      const user = db.profiles.find((p) => p.id === userId);
      if (user) {
        return [this.ensureUserWorkspace(userId, user.displayName)];
      }
    }
    return workspaces;
  }

  getWorkspaceById(id: string): Workspace | undefined {
    return this.load().workspaces.find((w) => w.id === id);
  }

  // ==========================================
  // CREDIT WALLET & ATOMIC TRANSACTIONS (SECTION 13)
  // ==========================================
  getCreditAccount(userId: string): CreditAccount {
    const db = this.load();
    if (!db.creditAccounts[userId]) {
      const now = new Date().toISOString();
      db.creditAccounts[userId] = {
        userId,
        availableBalance: 100,
        reservedBalance: 0,
        updatedAt: now,
      };
      this.save(db);
    }
    return db.creditAccounts[userId];
  }

  getCreditLedger(userId: string): CreditLedgerEntry[] {
    return this.load()
      .creditLedger.filter((c) => c.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Atomically reserve credits before starting a generation job.
   * Throws error if available balance is insufficient.
   */
  reserveCredits(userId: string, amount: number, jobId?: string): CreditAccount {
    const db = this.load();
    const account = db.creditAccounts[userId] || {
      userId,
      availableBalance: 0,
      reservedBalance: 0,
      updatedAt: new Date().toISOString(),
    };

    if (account.availableBalance < amount) {
      throw new Error(`Insufficient credits. Required: ${amount}, Available: ${account.availableBalance}`);
    }

    account.availableBalance -= amount;
    account.reservedBalance += amount;
    account.updatedAt = new Date().toISOString();
    db.creditAccounts[userId] = account;

    const ledgerEntry: CreditLedgerEntry = {
      id: 'cld_' + Math.random().toString(36).substring(2, 12),
      userId,
      transactionType: 'generation_reserve',
      amount: -amount,
      balanceAfter: account.availableBalance,
      relatedJobId: jobId,
      idempotencyKey: jobId ? `reserve_${jobId}` : undefined,
      metadata: { reservedAmount: amount },
      createdAt: new Date().toISOString(),
    };
    db.creditLedger.push(ledgerEntry);

    this.save(db);
    return account;
  }

  /**
   * Settle reserved credits when a job completes.
   * If actual is less than reserved, refund the difference.
   */
  settleCredits(userId: string, jobId: string, reservedAmount: number, actualAmount: number): CreditAccount {
    const db = this.load();
    const account = db.creditAccounts[userId];
    if (!account) throw new Error('Credit account not found');

    const refundDifference = reservedAmount - actualAmount;
    account.reservedBalance = Math.max(0, account.reservedBalance - reservedAmount);

    if (refundDifference > 0) {
      account.availableBalance += refundDifference;
    }

    account.updatedAt = new Date().toISOString();
    db.creditAccounts[userId] = account;

    const ledgerEntry: CreditLedgerEntry = {
      id: 'cld_' + Math.random().toString(36).substring(2, 12),
      userId,
      transactionType: 'generation_settle',
      amount: -actualAmount,
      balanceAfter: account.availableBalance,
      relatedJobId: jobId,
      idempotencyKey: `settle_${jobId}`,
      metadata: { reserved: reservedAmount, actual: actualAmount, refunded: refundDifference },
      createdAt: new Date().toISOString(),
    };
    db.creditLedger.push(ledgerEntry);

    this.save(db);
    return account;
  }

  /**
   * Compensating refund if a generation fails or is cancelled.
   */
  refundCredits(userId: string, amount: number, reason: string, jobId?: string): CreditAccount {
    const db = this.load();
    const account = db.creditAccounts[userId];
    if (!account) throw new Error('Credit account not found');

    account.availableBalance += amount;
    if (account.reservedBalance >= amount) {
      account.reservedBalance -= amount;
    }
    account.updatedAt = new Date().toISOString();
    db.creditAccounts[userId] = account;

    const ledgerEntry: CreditLedgerEntry = {
      id: 'cld_' + Math.random().toString(36).substring(2, 12),
      userId,
      transactionType: 'refund',
      amount: amount,
      balanceAfter: account.availableBalance,
      relatedJobId: jobId,
      idempotencyKey: jobId ? `refund_${jobId}_${Date.now()}` : undefined,
      metadata: { reason },
      createdAt: new Date().toISOString(),
    };
    db.creditLedger.push(ledgerEntry);

    this.save(db);
    return account;
  }

  /**
   * Add credits via payment or subscription with idempotency check.
   */
  addCredits(
    userId: string,
    amount: number,
    transactionType: CreditTransactionType,
    paymentId?: string,
    idempotencyKey?: string,
    metadata?: Record<string, any>
  ): CreditAccount {
    const db = this.load();
    if (idempotencyKey) {
      const existing = db.creditLedger.find((l) => l.idempotencyKey === idempotencyKey);
      if (existing) {
        return db.creditAccounts[userId]; // already processed idempotently
      }
    }

    const account = db.creditAccounts[userId] || {
      userId,
      availableBalance: 0,
      reservedBalance: 0,
      updatedAt: new Date().toISOString(),
    };

    account.availableBalance += amount;
    account.updatedAt = new Date().toISOString();
    db.creditAccounts[userId] = account;

    const ledgerEntry: CreditLedgerEntry = {
      id: 'cld_' + Math.random().toString(36).substring(2, 12),
      userId,
      transactionType,
      amount,
      balanceAfter: account.availableBalance,
      paymentId,
      idempotencyKey,
      metadata,
      createdAt: new Date().toISOString(),
    };
    db.creditLedger.push(ledgerEntry);

    this.save(db);
    return account;
  }

  // ==========================================
  // PROJECTS (SECTION 7 & 11)
  // ==========================================
  getProjects(workspaceId: string, filter?: { mediaType?: string; status?: string; favoriteOnly?: boolean }): Project[] {
    let list = this.load().projects.filter((p) => p.workspaceId === workspaceId && !p.deletedAt);
    if (filter?.mediaType && filter.mediaType !== 'all') {
      list = list.filter((p) => p.mediaType === filter.mediaType);
    }
    if (filter?.status && filter.status !== 'all') {
      list = list.filter((p) => p.status === filter.status);
    }
    if (filter?.favoriteOnly) {
      list = list.filter((p) => p.isFavorite);
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getProjectById(id: string): Project | undefined {
    return this.load().projects.find((p) => p.id === id && !p.deletedAt);
  }

  createProject(params: {
    workspaceId: string;
    ownerId: string;
    title: string;
    description?: string;
    mediaType?: 'video' | 'image' | 'audio' | 'script';
    timeline?: any;
    thumbnailUrl?: string;
  }): Project {
    const db = this.load();
    const now = new Date().toISOString();
    const id = 'prj_' + Math.random().toString(36).substring(2, 11);

    const project: Project = {
      id,
      workspaceId: params.workspaceId,
      ownerId: params.ownerId,
      title: params.title || 'Untitled Project',
      description: params.description || '',
      mediaType: params.mediaType || 'video',
      status: 'draft',
      thumbnailUrl: params.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
      timeline: params.timeline || {
        durationSec: 15,
        aspectRatio: '16:9',
        resolution: '1080p',
        tracks: [
          { id: 'trk_v1', type: 'video', name: 'Video 1' },
          { id: 'trk_t1', type: 'text', name: 'Text & Titles' },
          { id: 'trk_a1', type: 'audio', name: 'Audio' },
        ],
        clips: [],
      },
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };

    db.projects.push(project);
    this.save(db);
    return project;
  }

  updateProject(id: string, updates: Partial<Project>): Project {
    const db = this.load();
    const idx = db.projects.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Project not found');

    db.projects[idx] = {
      ...db.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save(db);
    return db.projects[idx];
  }

  duplicateProject(id: string, newOwnerId?: string): Project {
    const db = this.load();
    const original = db.projects.find((p) => p.id === id);
    if (!original) throw new Error('Project not found');

    const now = new Date().toISOString();
    const copy: Project = {
      ...JSON.parse(JSON.stringify(original)),
      id: 'prj_' + Math.random().toString(36).substring(2, 11),
      title: `${original.title} (Copy)`,
      ownerId: newOwnerId || original.ownerId,
      createdAt: now,
      updatedAt: now,
    };
    db.projects.push(copy);
    this.save(db);
    return copy;
  }

  deleteProject(id: string): boolean {
    const db = this.load();
    const project = db.projects.find((p) => p.id === id);
    if (!project) return false;
    project.deletedAt = new Date().toISOString();
    this.save(db);
    return true;
  }

  // ==========================================
  // GENERATION JOBS (SECTION 10)
  // ==========================================
  createGenerationJob(params: {
    userId: string;
    workspaceId: string;
    projectId?: string;
    providerId: string;
    modelId: string;
    input: any;
    estimatedCredits: number;
  }): GenerationJob {
    const db = this.load();
    const now = new Date().toISOString();
    const id = 'job_' + Math.random().toString(36).substring(2, 12);

    // Atomically reserve the credits
    this.reserveCredits(params.userId, params.estimatedCredits, id);

    const job: GenerationJob = {
      id,
      userId: params.userId,
      workspaceId: params.workspaceId,
      projectId: params.projectId,
      providerId: params.providerId,
      modelId: params.modelId,
      status: 'queued',
      progressPercent: 5,
      progressMessage: 'Job queued and dispatched to AI inference pipeline...',
      input: params.input,
      estimatedCredits: params.estimatedCredits,
      reservedCredits: params.estimatedCredits,
      actualCredits: 0,
      createdAt: now,
      updatedAt: now,
    };

    db.generationJobs.push(job);
    this.save(db);
    return job;
  }

  updateJobStatus(
    id: string,
    status: JobStatus,
    updates: {
      progressPercent?: number;
      progressMessage?: string;
      output?: any;
      actualCredits?: number;
      errorCode?: string;
      errorMessage?: string;
      providerRequestId?: string;
    }
  ): GenerationJob {
    const db = this.load();
    const job = db.generationJobs.find((j) => j.id === id);
    if (!job) throw new Error('Job not found');

    const previousStatus = job.status;
    job.status = status;
    job.updatedAt = new Date().toISOString();

    if (updates.progressPercent !== undefined) job.progressPercent = updates.progressPercent;
    if (updates.progressMessage) job.progressMessage = updates.progressMessage;
    if (updates.output) job.output = updates.output;
    if (updates.providerRequestId) job.providerRequestId = updates.providerRequestId;
    if (updates.errorCode) job.errorCode = updates.errorCode;
    if (updates.errorMessage) job.errorMessage = updates.errorMessage;

    if (status === 'completed' && previousStatus !== 'completed') {
      job.completedAt = new Date().toISOString();
      job.actualCredits = updates.actualCredits ?? job.estimatedCredits;
      this.settleCredits(job.userId, job.id, job.reservedCredits, job.actualCredits);
    } else if ((status === 'failed' || status === 'cancelled') && previousStatus !== 'failed' && previousStatus !== 'cancelled') {
      // Compensating refund
      this.refundCredits(job.userId, job.reservedCredits, `Job ${status}: ${updates.errorMessage || 'Execution halted'}`, job.id);
    }

    this.save(db);
    return job;
  }

  getJobById(id: string): GenerationJob | undefined {
    return this.load().generationJobs.find((j) => j.id === id);
  }

  getUserJobs(userId: string): GenerationJob[] {
    return this.load()
      .generationJobs.filter((j) => j.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllJobs(): GenerationJob[] {
    return this.load()
      .generationJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ==========================================
  // ASSETS (SECTION 12)
  // ==========================================
  getAssets(workspaceId: string): Asset[] {
    return this.load()
      .assets.filter((a) => a.workspaceId === workspaceId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAssetById(id: string): Asset | undefined {
    return this.load().assets.find((a) => a.id === id);
  }

  createAsset(asset: Omit<Asset, 'id' | 'createdAt'>): Asset {
    const db = this.load();
    const id = 'ast_' + Math.random().toString(36).substring(2, 11);
    const newAsset: Asset = {
      ...asset,
      id,
      createdAt: new Date().toISOString(),
    };
    db.assets.push(newAsset);
    this.save(db);
    return newAsset;
  }

  deleteAsset(id: string): boolean {
    const db = this.load();
    db.assets = db.assets.filter((a) => a.id !== id);
    this.save(db);
    return true;
  }

  // ==========================================
  // BRAND KITS
  // ==========================================
  getBrandKits(workspaceId: string): BrandKit[] {
    return this.load().brandKits.filter((b) => b.workspaceId === workspaceId);
  }

  updateBrandKit(id: string, updates: Partial<BrandKit>): BrandKit {
    const db = this.load();
    const idx = db.brandKits.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Brand kit not found');
    db.brandKits[idx] = { ...db.brandKits[idx], ...updates };
    this.save(db);
    return db.brandKits[idx];
  }

  // ==========================================
  // PLANS, SUBSCRIPTIONS & PAYMENTS (SECTION 14)
  // ==========================================
  getPlans(): Plan[] {
    return this.load().plans.filter((p) => p.isActive);
  }

  getPlanById(id: string): Plan | undefined {
    return this.load().plans.find((p) => p.id === id || (id === 'plan_basic' && p.id === 'plan_starter') || (id === 'plan_teams' && p.id === 'plan_business'));
  }

  updatePlan(planId: string, updates: Partial<Plan>): Plan {
    const db = this.load();
    const idx = db.plans.findIndex((p) => p.id === planId);
    if (idx === -1) {
      throw new Error(`Plan ${planId} not found`);
    }
    db.plans[idx] = {
      ...db.plans[idx],
      ...updates,
      entitlements: {
        ...db.plans[idx].entitlements,
        ...(updates.entitlements || {}),
      },
    };
    this.save(db);
    return db.plans[idx];
  }

  getCreditPacks(): CreditPack[] {
    return this.load().creditPacks.filter((p) => p.isActive);
  }

  getCreditPackById(id: string): CreditPack | undefined {
    return this.load().creditPacks.find((p) => p.id === id);
  }

  updateCreditPack(packId: string, updates: Partial<CreditPack>): CreditPack {
    const db = this.load();
    const idx = db.creditPacks.findIndex((p) => p.id === packId);
    if (idx === -1) {
      throw new Error(`Credit pack ${packId} not found`);
    }
    db.creditPacks[idx] = { ...db.creditPacks[idx], ...updates };
    this.save(db);
    return db.creditPacks[idx];
  }

  getUserSubscription(userId: string): { subscription?: Subscription; plan?: Plan } {
    const db = this.load();
    const sub = db.subscriptions.find((s) => s.userId === userId && s.status === 'active');
    if (!sub) return {};
    const plan = db.plans.find((p) => p.id === sub.planId);
    return { subscription: sub, plan };
  }

  createSubscription(params: Omit<Subscription, 'id' | 'createdAt'>): Subscription {
    const db = this.load();
    const id = 'sub_' + Math.random().toString(36).substring(2, 11);
    const newSub: Subscription = {
      ...params,
      id,
      createdAt: new Date().toISOString(),
    };
    db.subscriptions.push(newSub);
    this.save(db);
    return newSub;
  }

  createPayment(payment: Omit<Payment, 'id' | 'createdAt'>): Payment {
    const db = this.load();
    const id = 'pay_' + Math.random().toString(36).substring(2, 11);
    const newPayment: Payment = {
      ...payment,
      id,
      createdAt: new Date().toISOString(),
    };
    db.payments.push(newPayment);
    this.save(db);
    return newPayment;
  }

  getAllPayments(): Payment[] {
    return this.load().payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ==========================================
  // PROVIDERS & MODELS (SECTION 9)
  // ==========================================
  getProviders(): AIProvider[] {
    return this.load().aiProviders;
  }

  getModels(): AIModel[] {
    return this.load().aiModels.filter((m) => m.isActive);
  }

  getModelById(id: string): AIModel | undefined {
    return this.load().aiModels.find((m) => m.id === id);
  }

  // ==========================================
  // TEMPLATES
  // ==========================================
  getTemplates(category?: string): Template[] {
    const list = this.load().templates.filter((t) => t.isPublished);
    if (category && category !== 'All') {
      return list.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }
    return list;
  }

  getTemplateBySlug(slug: string): Template | undefined {
    return this.load().templates.find((t) => t.slug === slug);
  }

  // ==========================================
  // DISCOVERY ENGAGEMENT & SOCIAL INTERACTIONS
  // ==========================================
  getTemplateLikes(): Record<string, string[]> {
    const db = this.load();
    return db.templateLikes || {};
  }

  getTemplateLikeCount(templateId: string, baseCount = 0): number {
    const db = this.load();
    const likes = db.templateLikes?.[templateId] || [];
    return baseCount + likes.length;
  }

  isTemplateLiked(templateId: string, userId: string): boolean {
    if (!userId) return false;
    const db = this.load();
    const likes = db.templateLikes?.[templateId] || [];
    return likes.includes(userId);
  }

  toggleTemplateLike(templateId: string, userId: string, baseCount = 0): { liked: boolean; likeCount: number } {
    const db = this.load();
    if (!db.templateLikes) db.templateLikes = {};
    if (!db.templateLikes[templateId]) db.templateLikes[templateId] = [];

    const index = db.templateLikes[templateId].indexOf(userId);
    let liked = false;
    if (index === -1) {
      db.templateLikes[templateId].push(userId);
      liked = true;
    } else {
      db.templateLikes[templateId].splice(index, 1);
      liked = false;
    }
    this.save(db);
    return {
      liked,
      likeCount: baseCount + db.templateLikes[templateId].length,
    };
  }

  getCreatorFollows(): Record<string, string[]> {
    const db = this.load();
    return db.creatorFollows || {};
  }

  isFollowingCreator(creatorId: string, userId: string): boolean {
    if (!userId) return false;
    const db = this.load();
    const followers = db.creatorFollows?.[creatorId] || [];
    return followers.includes(userId);
  }

  toggleFollowCreator(creatorId: string, userId: string): { following: boolean; followerCount: number } {
    const db = this.load();
    if (!db.creatorFollows) db.creatorFollows = {};
    if (!db.creatorFollows[creatorId]) db.creatorFollows[creatorId] = [];

    const index = db.creatorFollows[creatorId].indexOf(userId);
    let following = false;
    if (index === -1) {
      db.creatorFollows[creatorId].push(userId);
      following = true;
    } else {
      db.creatorFollows[creatorId].splice(index, 1);
      following = false;
    }
    this.save(db);
    return {
      following,
      followerCount: db.creatorFollows[creatorId].length,
    };
  }

  getPublishedTemplates(): any[] {
    const db = this.load();
    return db.publishedTemplates || [];
  }

  publishCustomTemplate(params: any): any {
    const db = this.load();
    if (!db.publishedTemplates) db.publishedTemplates = [];
    const id = `tmpl_pub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newTemplate = {
      id,
      slug: (params.title || 'custom-template').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: params.title,
      description: params.description || '',
      prompt: params.prompt,
      category: params.category || 'Product Commercial',
      aspect: params.aspect || '16:9',
      aspectLabel: params.aspect === '9:16' ? '9:16 Vertical' : params.aspect === '1:1' ? '1:1 Square' : '16:9 Landscape',
      durationSec: params.durationSec || 15,
      duration: `${params.durationSec || 15}s`,
      thumbnail: params.thumbnail || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      videoPreview: params.videoPreview || '/media/templates/tmpl-01-cinematic-product.mp4',
      badge: 'New',
      tags: params.tags || ['#FluviaCommunity', '#AIVideo', '#CustomTemplate'],
      aiModelsUsed: ['Fluvia Cinematic v1', 'Gemini Flash'],
      estimatedCredits: 25,
      creatorId: params.creatorId || 'usr_creator',
      creatorName: params.creatorName || '@creative_mind',
      creatorAvatar: params.creatorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      likesCount: 1,
      createdAt: new Date().toISOString(),
      scenes: [
        { time: '0:00 - 0:05', title: 'Opening Scene', desc: params.prompt ? params.prompt.slice(0, 80) : 'Opening visual' },
        { time: '0:05 - 0:15', title: 'Dynamic Climax & CTA', desc: 'Fluid particle transition with logo reveal' },
      ],
    };
    db.publishedTemplates.unshift(newTemplate);
    this.save(db);
    return newTemplate;
  }

  // ==========================================
  // AUDIT LOGS & TICKETS
  // ==========================================
  logAudit(actorId: string | undefined, action: string, resourceType: string, resourceId: string, metadata?: any): void {
    const db = this.load();
    const entry: AuditLog = {
      id: 'aud_' + Math.random().toString(36).substring(2, 12),
      actorId,
      action,
      resourceType,
      resourceId,
      metadata,
      createdAt: new Date().toISOString(),
    };
    db.auditLogs.push(entry);
    this.save(db);
  }

  getAuditLogs(): AuditLog[] {
    return this.load().auditLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getSupportTickets(userId?: string): SupportTicket[] {
    const db = this.load();
    if (userId) {
      return db.supportTickets.filter((t) => t.userId === userId);
    }
    return db.supportTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createSupportTicket(params: { userId: string; userEmail?: string; subject: string; category: string; priority?: 'low' | 'medium' | 'high' }): SupportTicket {
    const db = this.load();
    const now = new Date().toISOString();
    const ticket: SupportTicket = {
      id: 'tkt_' + Math.random().toString(36).substring(2, 9),
      userId: params.userId,
      userEmail: params.userEmail,
      subject: params.subject,
      category: params.category,
      status: 'open',
      priority: params.priority || 'medium',
      createdAt: now,
      updatedAt: now,
    };
    db.supportTickets.push(ticket);
    this.save(db);
    return ticket;
  }

  // ==========================================
  // WEBHOOK IDEMPOTENCY
  // ==========================================
  logWebhookEvent(params: { eventId?: string; eventType: string; payload: any }): boolean {
    const db = this.load();
    const eventId = params.eventId || `wh_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    if (db.webhookEvents.some((w) => w.id === eventId)) {
      return false; // Already processed (replay attack or duplicate callback)
    }
    const entry: WebhookEvent = {
      id: eventId,
      eventId,
      provider: 'razorpay',
      eventType: params.eventType,
      payload: params.payload,
      processingStatus: 'processed',
      receivedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    };
    db.webhookEvents.push(entry);
    this.save(db);
    return true;
  }

  isWebhookProcessed(eventId: string): boolean {
    return this.load().webhookEvents.some((w) => w.id === eventId);
  }

  // ==========================================
  // BILLING SETTINGS & SUPPLIER CONFIG
  // ==========================================
  getBillingSettings(): SupplierLegalDetails {
    return this.load().billingSettings;
  }

  updateBillingSettings(updates: Partial<SupplierLegalDetails>): SupplierLegalDetails {
    const db = this.load();
    db.billingSettings = { ...db.billingSettings, ...updates };
    this.save(db);
    return db.billingSettings;
  }

  // ==========================================
  // PAYU PAYMENT ORDERS
  // ==========================================
  createPayUOrder(params: Omit<PayUPaymentOrder, 'id' | 'createdAt' | 'updatedAt'>): PayUPaymentOrder {
    const db = this.load();
    const now = new Date().toISOString();
    const id = 'ord_payu_' + Math.random().toString(36).substring(2, 11);

    const order: PayUPaymentOrder = {
      ...params,
      id,
      createdAt: now,
      updatedAt: now,
    };

    db.payuOrders.push(order);
    this.save(db);
    return order;
  }

  getPayUOrderById(id: string): PayUPaymentOrder | undefined {
    return this.load().payuOrders.find((o) => o.id === id);
  }

  getPayUOrderByTxnid(txnid: string): PayUPaymentOrder | undefined {
    return this.load().payuOrders.find((o) => o.txnid === txnid);
  }

  updatePayUOrder(id: string, updates: Partial<PayUPaymentOrder>): PayUPaymentOrder {
    const db = this.load();
    const idx = db.payuOrders.findIndex((o) => o.id === id || o.txnid === id);
    if (idx === -1) throw new Error('PayU payment order not found');

    db.payuOrders[idx] = {
      ...db.payuOrders[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save(db);
    return db.payuOrders[idx];
  }

  getPayUOrders(userId?: string, workspaceId?: string): PayUPaymentOrder[] {
    let list = this.load().payuOrders;
    if (userId) {
      list = list.filter((o) => o.userId === userId);
    }
    if (workspaceId) {
      list = list.filter((o) => o.workspaceId === workspaceId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllPayUOrders(): PayUPaymentOrder[] {
    return this.load().payuOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ==========================================
  // INVOICES & SEQUENTIAL NUMBERING
  // ==========================================
  getNextInvoiceNumber(): string {
    const db = this.load();
    const year = new Date().getFullYear();
    const count = (db.invoices?.length || 0) + 1;
    return `INV-${year}-${count.toString().padStart(4, '0')}`;
  }

  createInvoice(params: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Invoice {
    const db = this.load();
    const now = new Date().toISOString();
    const id = 'inv_' + Math.random().toString(36).substring(2, 11);

    const invoice: Invoice = {
      ...params,
      id,
      createdAt: now,
      updatedAt: now,
    };

    db.invoices.push(invoice);
    this.save(db);
    return invoice;
  }

  getInvoiceById(id: string): Invoice | undefined {
    return this.load().invoices.find((i) => i.id === id);
  }

  getInvoiceByNumber(invoiceNumber: string): Invoice | undefined {
    return this.load().invoices.find((i) => i.invoiceNumber.toLowerCase() === invoiceNumber.toLowerCase());
  }

  getInvoices(userId?: string, workspaceId?: string): Invoice[] {
    let list = this.load().invoices;
    if (userId) {
      list = list.filter((i) => i.userId === userId);
    }
    if (workspaceId) {
      list = list.filter((i) => i.workspaceId === workspaceId);
    }
    return list.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }

  getAllInvoices(): Invoice[] {
    return this.load().invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }

  // ==========================================
  // PAYMENT RECEIPTS & SEQUENTIAL NUMBERING
  // ==========================================
  getNextReceiptNumber(): string {
    const db = this.load();
    const year = new Date().getFullYear();
    const count = (db.receipts?.length || 0) + 1;
    return `RCP-${year}-${count.toString().padStart(4, '0')}`;
  }

  createReceipt(params: Omit<PaymentReceipt, 'id' | 'createdAt'>): PaymentReceipt {
    const db = this.load();
    const now = new Date().toISOString();
    const id = 'rcp_' + Math.random().toString(36).substring(2, 11);

    const receipt: PaymentReceipt = {
      ...params,
      id,
      createdAt: now,
    };

    db.receipts.push(receipt);
    this.save(db);
    return receipt;
  }

  getReceiptById(id: string): PaymentReceipt | undefined {
    return this.load().receipts.find((r) => r.id === id);
  }

  getReceiptByNumber(receiptNumber: string): PaymentReceipt | undefined {
    return this.load().receipts.find((r) => r.receiptNumber.toLowerCase() === receiptNumber.toLowerCase());
  }

  getReceipts(userId?: string, workspaceId?: string): PaymentReceipt[] {
    let list = this.load().receipts;
    if (userId) {
      list = list.filter((r) => r.userId === userId);
    }
    if (workspaceId) {
      list = list.filter((r) => r.workspaceId === workspaceId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllReceipts(): PaymentReceipt[] {
    return this.load().receipts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ==========================================
  // CREDIT NOTES & ADJUSTMENTS
  // ==========================================
  getNextCreditNoteNumber(): string {
    const db = this.load();
    const year = new Date().getFullYear();
    const count = (db.creditNotes?.length || 0) + 1;
    return `CN-${year}-${count.toString().padStart(4, '0')}`;
  }

  createCreditNote(params: Omit<CreditNote, 'id' | 'createdAt'>): CreditNote {
    const db = this.load();
    const now = new Date().toISOString();
    const id = 'cn_' + Math.random().toString(36).substring(2, 11);

    const creditNote: CreditNote = {
      ...params,
      id,
      createdAt: now,
    };

    db.creditNotes.push(creditNote);
    this.save(db);
    return creditNote;
  }

  getCreditNotes(userId?: string): CreditNote[] {
    let list = this.load().creditNotes;
    if (userId) {
      list = list.filter((c) => c.userId === userId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ==========================================
  // DISCOUNT COUPONS & REDEMPTIONS
  // ==========================================
  getCoupons(): Coupon[] {
    return this.load().coupons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getCouponById(id: string): Coupon | undefined {
    return this.load().coupons.find((c) => c.id === id);
  }

  getCouponByCode(code: string): Coupon | undefined {
    const normalized = (code || '').trim().toUpperCase();
    return this.load().coupons.find((c) => c.code.toUpperCase() === normalized);
  }

  createCoupon(params: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Coupon {
    const db = this.load();
    const now = new Date().toISOString();
    const code = params.code.trim().toUpperCase();

    if (db.coupons.some((c) => c.code.toUpperCase() === code)) {
      throw new Error(`Coupon code '${code}' already exists.`);
    }

    const id = 'cpn_' + Math.random().toString(36).substring(2, 11);
    const coupon: Coupon = {
      ...params,
      id,
      code,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    db.coupons.push(coupon);
    this.save(db);
    return coupon;
  }

  updateCoupon(id: string, updates: Partial<Coupon>): Coupon {
    const db = this.load();
    const idx = db.coupons.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Coupon not found');

    if (updates.code) {
      const newCode = updates.code.trim().toUpperCase();
      if (db.coupons.some((c) => c.id !== id && c.code.toUpperCase() === newCode)) {
        throw new Error(`Coupon code '${newCode}' is already taken.`);
      }
      updates.code = newCode;
    }

    db.coupons[idx] = {
      ...db.coupons[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save(db);
    return db.coupons[idx];
  }

  deleteCoupon(id: string): boolean {
    const db = this.load();
    const idx = db.coupons.findIndex((c) => c.id === id);
    if (idx === -1) return false;

    db.coupons.splice(idx, 1);
    this.save(db);
    return true;
  }

  getCouponRedemptions(couponId?: string): CouponRedemption[] {
    let list = this.load().couponRedemptions;
    if (couponId) {
      list = list.filter((r) => r.couponId === couponId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getUserCouponRedemptions(userId: string, couponId?: string): CouponRedemption[] {
    let list = this.load().couponRedemptions.filter((r) => r.userId === userId);
    if (couponId) {
      list = list.filter((r) => r.couponId === couponId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  reserveCouponRedemption(params: {
    couponId: string;
    couponCode: string;
    userId: string;
    orderId?: string;
    txnid?: string;
    discountAmount: number;
    originalAmount: number;
    finalAmount: number;
    paymentType: 'subscription' | 'credit_pack';
    itemPlanOrPackId: string;
  }): CouponRedemption {
    const db = this.load();
    const now = new Date().toISOString();
    const id = 'red_' + Math.random().toString(36).substring(2, 11);

    // Cancel any previous pending reservation for the same order/txnid
    if (params.txnid) {
      db.couponRedemptions = db.couponRedemptions.filter(
        (r) => !(r.txnid === params.txnid && r.status === 'reserved')
      );
    }

    const redemption: CouponRedemption = {
      id,
      couponId: params.couponId,
      couponCode: params.couponCode.toUpperCase(),
      userId: params.userId,
      orderId: params.orderId,
      txnid: params.txnid,
      discountAmount: params.discountAmount,
      originalAmount: params.originalAmount,
      finalAmount: params.finalAmount,
      paymentType: params.paymentType,
      itemPlanOrPackId: params.itemPlanOrPackId,
      status: 'reserved',
      createdAt: now,
    };

    db.couponRedemptions.push(redemption);
    this.save(db);
    return redemption;
  }

  completeCouponRedemption(txnid: string, orderId?: string): { success: boolean; redemption?: CouponRedemption } {
    const db = this.load();
    const now = new Date().toISOString();

    const redemption = db.couponRedemptions.find(
      (r) => (r.txnid === txnid || (orderId && r.orderId === orderId))
    );

    if (!redemption) {
      return { success: false };
    }

    // Idempotency: if already completed, do not increment again
    if (redemption.status === 'completed') {
      return { success: true, redemption };
    }

    redemption.status = 'completed';
    redemption.completedAt = now;

    // Atomically increment usage count on the coupon
    const coupon = db.coupons.find((c) => c.id === redemption.couponId);
    if (coupon) {
      coupon.usageCount = (coupon.usageCount || 0) + 1;
      coupon.updatedAt = now;
    }

    this.save(db);
    return { success: true, redemption };
  }

  cancelCouponRedemption(txnid: string): void {
    const db = this.load();
    const redemption = db.couponRedemptions.find((r) => r.txnid === txnid && r.status === 'reserved');
    if (redemption) {
      redemption.status = 'cancelled';
      this.save(db);
    }
  }
}

export const dbStore = new Store();
