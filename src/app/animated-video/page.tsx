import { Metadata } from 'next';
import { AnimatedVideoLanding } from '@/components/animated-video/AnimatedVideoLanding';

export const metadata: Metadata = {
  title: 'AI Animated Video Maker — Turn Any Idea Into Video | Fluvia Flow',
  description:
    'Pick a style, generate an AI script in Hindi or English, and export vertical 9:16 animated videos for YouTube Shorts, Reels, and TikTok with open JSON workflow.',
};

export default function AnimatedVideoPage() {
  return <AnimatedVideoLanding initialStyle="mythology" />;
}
