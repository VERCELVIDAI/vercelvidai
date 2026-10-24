import type { Metadata } from 'next';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Explore AI Video Templates & Discovery Feed',
  description:
    'Discover trending cinematic AI video templates, prompts, and creative presets across automotive, commercials, anime, 3D, and organic food.',
  alternates: {
    canonical: `${BRAND.siteUrl}/explore`,
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
