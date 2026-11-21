import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'AI Mythology Video Maker — Hindi & English Reels | Fluvia Flow',
  description:
    'Turn Ramayana, Mahabharata & Puranic stories into narrated, captioned vertical videos for Reels, Shorts & YouTube with AI. Hindi voiceover, word-synced subtitles & 1080p HD export.',
  keywords: [
    'mythology video maker',
    'hindi mythology video maker',
    'ai ramayan video generator',
    'mahabharat story video maker',
    'bhakti reels maker',
    'ai pauranik katha video',
    'sanatan dharma video creator',
    'mythology shorts generator',
  ],
  alternates: {
    canonical: 'https://www.fluviaflow.online/mythology',
    languages: {
      'en-IN': 'https://www.fluviaflow.online/mythology',
      'hi-IN': 'https://www.fluviaflow.online/mythology?lang=hi',
    },
  },
  openGraph: {
    title: 'AI Mythology Video Maker — Fluvia Mythos Studio',
    description:
      'Transform epic mythology stories into cinematic vertical videos with authentic Indian art styles, neural Hindi/English voices, and synced captions.',
    url: 'https://www.fluviaflow.online/mythology',
    siteName: 'Fluvia Flow',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&h=630&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Fluvia Flow AI Mythology Video Creator',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Mythology Video Maker — Fluvia Mythos Studio',
    description: 'Create viral mythology reels and shorts in minutes with AI voiceover and Devanagari captions.',
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&h=630&auto=format&fit=crop&q=80'],
  },
};

export default function MythologyLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Fluvia Mythos — AI Mythology Video Creator',
        operatingSystem: 'All',
        applicationCategory: 'MultimediaApplication',
        offers: {
          '@type': 'Offer',
          price: '799',
          priceCurrency: 'INR',
          description: 'Mythos Creator Plan with 800 monthly credits and 1080p watermark-free exports',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How does Fluvia Mythos create mythology videos?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Fluvia Mythos takes your story concept or scripture reference, drafts an engaging structured script with viral hooks, paints scenes in 7 classical art styles, generates synchronized neural voiceover in Hindi or English, and exports word-by-word captioned vertical MP4 videos ready for Reels and Shorts.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are the videos suitable for YouTube Shorts and Instagram Reels monetization?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, paid plans (Mythos Creator and Pro) include a full commercial monetization license, licensed devotional and epic background music, and 1080p Full HD watermark-free exports.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
