import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { VlabsStudioApp } from '@/components/vlabs/studio/VlabsStudioApp';

export const metadata: Metadata = {
  title: 'Fluvia vLabs Studio — AI Audio Production & Video Dubbing',
  description: 'Produce high-fidelity AI voiceovers, dub videos, clone authorized voices and design custom vocal personas.',
};

export default function VlabsStudioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070B] flex items-center justify-center text-emerald-400">Loading Studio...</div>}>
      <VlabsStudioApp initialTool="tts" />
    </Suspense>
  );
}
