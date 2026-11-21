import { Metadata } from 'next';
import { MythologyStudioStepper } from '@/components/mythology/MythologyStudioStepper';

export const metadata: Metadata = {
  title: 'Mythology Video Creator Studio | Fluvia Flow',
  description: 'Turn epic sacred stories into vertical video reels with AI voiceover and captions.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MythologyStudioPage() {
  return <MythologyStudioStepper />;
}
