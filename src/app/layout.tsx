import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeContext';
import { FluviaMotionBackground } from '@/components/brand/FluviaMotionBackground';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: BRAND.description,
  keywords: [
    'Fluvia Flow',
    'AI Video Generator',
    'Cinematic AI',
    'Text to Video',
    'Image to Video',
    'Cinema Studio',
    'Marketing Studio',
    'Storyboard Studio',
    'Gemini AI Studio',
    'Video Editor',
  ],
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
    url: BRAND.siteUrl,
    siteName: BRAND.name,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" data-theme="light" suppressHydrationWarning>
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
                  // Permanent Migration to Fluvia Emerald Light Theme
                  localStorage.setItem('fluvia_theme', 'light');
                  localStorage.setItem('fluvia_color_theme', 'fluvia-emerald');
                  localStorage.removeItem('vidai_theme');
                  localStorage.removeItem('vidai_color_theme');
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.setAttribute('data-color-theme', 'fluvia-emerald');
                  document.documentElement.style.colorScheme = 'light';
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen text-[#17211D] bg-white relative selection:bg-emerald-100 selection:text-emerald-900"
      >
        <FluviaMotionBackground />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
