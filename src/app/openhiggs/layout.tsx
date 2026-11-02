import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OpenHiggs Studio — 38 Open-Source AI Models | FLUVIA FLOW',
  description:
    'Generate cinematic AI video and high-resolution images across 38 open-source foundation models including Seedance 2.5, Kling 3.0, Soul Cinema, Wan, and Flux.',
  keywords: [
    'OpenHiggs',
    'OpenHiggsfield',
    'Higgsfield alternative',
    'open source AI video',
    'Seedance 2.5',
    'Kling 3.0',
    'Soul Cinema',
    'AI media composer',
  ],
  openGraph: {
    title: 'OpenHiggs Studio — 38 Models in One Prompt Bar',
    description:
      'Universal prompt bar, per-model controls, start/end frames, and open-source generative video pipeline on FLUVIA FLOW.',
    images: [{ url: '/model-icons/kling.svg', width: 1200, height: 630 }],
  },
};

export default function OpenHiggsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
