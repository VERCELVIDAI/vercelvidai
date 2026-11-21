import { Metadata } from 'next';
import { AnimatedVideoStudio } from '@/components/animated-video/AnimatedVideoStudio';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';

export const metadata: Metadata = {
  title: 'AI Animated Video Maker Studio | Fluvia Flow',
  description:
    'Turn stories into scene-by-scene JSON, configure Indian voices, and render vertical MP4 videos for Reels and Shorts.',
};

export default function MythologyStudioPage() {
  return (
    <div className="min-h-screen bg-[#090A11] text-slate-100 flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <AnimatedVideoStudio initialStyleId="mythology" />
      </main>
      <Footer />
    </div>
  );
}
