import type { Metadata } from 'next';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Video Templates & Preset Timelines',
  description:
    'Explore 26+ cinematic AI video templates for enterprise SaaS, fintech commercials, luxury brand films, mobile reels, and cloud tech campaigns.',
  alternates: {
    canonical: `${BRAND.siteUrl}/templates`,
  },
  openGraph: {
    title: 'Fluvia Flow Video Templates — Pre-built Timelines Ready for Remix',
    description:
      'Browse professional multi-track video templates for enterprise SaaS, product showcases, fintech commercials, and social reels.',
    url: `${BRAND.siteUrl}/templates`,
    images: [
      {
        url: BRAND.ogImageAbsolute,
        width: 1200,
        height: 630,
        alt: 'Fluvia Flow Video Templates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fluvia Flow Video Templates',
    description: 'Explore 26+ cinematic video templates ready for instant remix.',
    images: [BRAND.ogImageAbsolute],
  },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
