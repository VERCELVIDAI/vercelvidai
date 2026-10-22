import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeContext';
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedMode = localStorage.getItem('fluvia_theme') || localStorage.getItem('vidai_theme');
                  var savedColor = localStorage.getItem('fluvia_color_theme') || localStorage.getItem('vidai_color_theme') || 'midnight-violet';
                  var mode = 'dark';
                  if (savedMode === 'light') {
                    mode = 'light';
                  } else if (savedMode === 'system') {
                    mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(mode);
                  document.documentElement.setAttribute('data-theme', mode);
                  document.documentElement.setAttribute('data-color-theme', savedColor);
                  document.documentElement.style.colorScheme = mode;
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen transition-colors duration-200"
        style={{
          backgroundColor: 'var(--app-bg)',
          color: 'var(--app-text-primary)',
        }}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
