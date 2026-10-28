import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeContext';
import { FluviaMotionBackground } from '@/components/brand/FluviaMotionBackground';
import { BRAND } from '@/lib/brand';

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: BRAND.title,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: [
    'Fluvia Flow',
    'AI Video Generator',
    'Cinematic AI Videos',
    'AI Image Generator',
    'Text to Video',
    'Image to Video',
    'Farm Fresh Video Templates',
    'Cinema Studio',
    'Marketing Studio',
    'Storyboard Studio',
    'Creative Studio',
  ],
  alternates: {
    canonical: `${BRAND.siteUrl}/`,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: BRAND.title,
    description: BRAND.description,
    url: `${BRAND.siteUrl}/`,
    siteName: BRAND.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: BRAND.ogImageAbsolute,
        width: 1200,
        height: 630,
        alt: 'Fluvia Flow — Your imagination. In motion. AI Video & Creative Studio',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND.title,
    description: BRAND.description,
    images: [BRAND.ogImageAbsolute],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-theme="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Permanent Dark Cinematic Kling AI Studio Theme
                  localStorage.setItem('fluvia_theme', 'dark');
                  localStorage.setItem('fluvia_color_theme', 'kling-obsidian');
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.setAttribute('data-color-theme', 'kling-obsidian');
                  document.documentElement.style.colorScheme = 'dark';
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen text-slate-100 bg-[#090A0D] relative selection:bg-indigo-500/30 selection:text-white"
      >
        <FluviaMotionBackground />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
