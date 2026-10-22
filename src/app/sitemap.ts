import { MetadataRoute } from 'next';
import { BRAND } from '@/lib/brand';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BRAND.siteUrl;
  const now = new Date();

  const routes = [
    '',
    '/studios/cinema',
    '/studios/marketing',
    '/studios/storyboard',
    '/create',
    '/editor',
    '/templates',
    '/models',
    '/pricing',
    '/features',
    '/ai-video-generator',
    '/ai-image-generator',
    '/ai-voice-generator',
    '/ai-avatar-generator',
    '/use-cases',
    '/use-cases/marketing',
    '/use-cases/youtube',
    '/use-cases/ecommerce',
    '/use-cases/social-media',
    '/blog',
    '/help',
    '/contact',
    '/privacy',
    '/terms',
    '/refund-policy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
