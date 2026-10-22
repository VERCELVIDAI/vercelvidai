/**
 * ==============================================================================
 * FLUVIA FLOW — CENTRALIZED BRAND CONFIGURATION & METADATA
 * ==============================================================================
 * Shared source of truth for product name, identity, copy, links, and styling.
 */

export const BRAND = {
  name: 'Fluvia Flow',
  shortName: 'Fluvia',
  legalName: 'Fluvia Flow Technologies Inc.',
  tagline: 'Your imagination. In motion.',
  description:
    'Create cinematic videos, striking visuals and campaign-ready content with AI — all inside one unified creative studio.',
  domain: 'fluviaflow.ai',
  supportEmail: 'support@fluviaflow.ai',
  contactEmail: 'hello@fluviaflow.ai',
  billingEmail: 'billing@fluviaflow.ai',
  twitterHandle: '@fluviaflow',
  githubOrg: 'fluviaflow',

  // SEO & Social
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://fluviaflow.ai',
  ogImage: '/images/fluvia-og.jpg',

  // Studios taxonomy
  studios: [
    {
      id: 'cinema',
      name: 'Cinema Studio',
      slug: '/studios/cinema',
      badge: 'Director Grade',
      description: 'Camera motion controls, anamorphic lenses, lighting cues & storyboard sequences.',
      icon: 'Film',
    },
    {
      id: 'marketing',
      name: 'Marketing Studio',
      slug: '/studios/marketing',
      badge: 'Brand & Ecom',
      description: 'Product commercials, UGC ads, campaign hooks & platform-optimized briefs.',
      icon: 'Megaphone',
    },
    {
      id: 'storyboard',
      name: 'Storyboard Studio',
      slug: '/studios/storyboard',
      badge: 'Gemini Copilot',
      description: 'AI-assisted scene outlines, visual prompt sequences, shot lists & timing.',
      icon: 'Layers',
    },
    {
      id: 'canvas',
      name: 'Creative Canvas',
      slug: '/editor',
      badge: 'Multi-Track',
      description: 'Non-linear multi-track video timeline, audio mixing, subtitles & direct export.',
      icon: 'Sliders',
    },
  ],

  // Creative Tools taxonomy
  tools: [
    { name: 'Text-to-Video', slug: '/create?mode=video', category: 'video', badge: 'Ultra' },
    { name: 'Image-to-Video', slug: '/create?mode=video&preset=i2v', category: 'video', badge: 'Motion' },
    { name: 'AI Image Synthesis', slug: '/create?mode=image', category: 'image', badge: 'Flux Pro' },
    { name: 'Script-to-Video', slug: '/studios/storyboard', category: 'story', badge: 'Gemini' },
    { name: 'AI Voice & Narration', slug: '/create?mode=audio', category: 'audio', badge: 'ElevenLabs' },
    { name: 'Product Commercials', slug: '/studios/marketing', category: 'marketing', badge: 'Hot' },
    { name: 'Video Upscaling', slug: '/create?mode=video&upscale=4k', category: 'video', badge: '4K HD' },
  ],

  // Navigation Links
  navigation: {
    public: [
      { label: 'Create', href: '/create' },
      { label: 'Cinema Studio', href: '/studios/cinema' },
      { label: 'Marketing Studio', href: '/studios/marketing' },
      { label: 'Templates', href: '/templates' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
} as const;

export type BrandConfig = typeof BRAND;
