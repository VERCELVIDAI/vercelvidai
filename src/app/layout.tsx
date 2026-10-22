import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeContext';

export const metadata: Metadata = {
  title: 'Vercel Vidai — Next-Gen AI Video Creation Platform',
  description: 'Turn ideas, scripts, and prompts into cinema-grade videos, commercials, Reels, and YouTube Shorts with the unified AI creative studio.',
  keywords: ['AI Video Generator', 'Text to Video', 'AI Commercials', 'Script to Video', 'Video Editor', 'Vercel Vidai'],
  openGraph: {
    title: 'Vercel Vidai — Premium AI Video Studio',
    description: 'Transform simple prompts into cinematic videos and high-converting advertisements.',
    url: 'https://vidai.io',
    siteName: 'Vercel Vidai',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vercel Vidai — AI Video Creation',
    description: 'Create cinematic videos, viral reels, and product ads with unified AI workflows.',
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
                  var savedMode = localStorage.getItem('vidai_theme');
                  var savedColor = localStorage.getItem('vidai_color_theme') || 'midnight-violet';
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
