import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vidai.io';
  const now = new Date();

  const routes = [
    '',
    '/features',
    '/ai-video-generator',
    '/ai-image-generator',
    '/ai-voice-generator',
    '/ai-avatar-generator',
    '/templates',
    '/models',
    '/pricing',
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
