import type { Metadata } from 'next';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Pricing Plans & AI Credit Packs',
  description:
    'Simple, transparent pricing for creators, studios and enterprises. Choose monthly or annual plans with generous AI video credits, 4K rendering, and commercial usage rights.',
  alternates: {
    canonical: `${BRAND.siteUrl}/pricing`,
  },
  openGraph: {
    title: 'Fluvia Flow Pricing — Subscription Plans & Generative Credit Packs',
    description:
      'Explore flexible pricing options for high-performance AI video and image creation. No hidden fees.',
    url: `${BRAND.siteUrl}/pricing`,
    images: [
      {
        url: BRAND.ogImageAbsolute,
        width: 1200,
        height: 630,
        alt: 'Fluvia Flow Pricing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fluvia Flow Pricing — Plans & Credit Packs',
    description: 'Explore flexible pricing options for AI video and image creation.',
    images: [BRAND.ogImageAbsolute],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
