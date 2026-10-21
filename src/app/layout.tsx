import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="dark">
      <body className="antialiased bg-[#090A0F] text-slate-100 min-h-screen selection:bg-violet-600/30 selection:text-violet-200">
        {children}
      </body>
    </html>
  );
}
