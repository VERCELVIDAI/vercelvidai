import { MetadataRoute } from 'next';
import { BRAND } from '@/lib/brand';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = BRAND.siteUrl;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/editor/', '/dashboard/', '/checkout', '/payment/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
