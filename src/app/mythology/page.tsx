import { Metadata } from 'next';
import { AnimatedVideoLanding } from '@/components/animated-video/AnimatedVideoLanding';

export const metadata: Metadata = {
  title: 'AI Animated Video Maker — Turn Ideas into Videos | Fluvia Flow',
  description:
    'Generate scene-by-scene JSON scripts with Gemini AI, select voices, preview vertical 9:16 animations, and export MP4 videos. Includes Mythology, Comic Art, Flat Vector, and more.',
};

export default function MythologyPage() {
  return <AnimatedVideoLanding initialStyle="mythology" />;
}
