import type { Metadata } from 'next';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Contact & Support',
  description:
    'Get in touch with the Fluvia Flow team for questions, enterprise inquiries, partnership opportunities, or technical support.',
  alternates: {
    canonical: `${BRAND.siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Fluvia Flow — Support & Enterprise Inquiries',
    description: 'Get in touch with our creative technology specialists and support team.',
    url: `${BRAND.siteUrl}/contact`,
    images: [{ url: BRAND.ogImageAbsolute, width: 1200, height: 630 }],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
