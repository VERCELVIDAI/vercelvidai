import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { VlabsStudioApp } from '@/components/vlabs/studio/VlabsStudioApp';

export const metadata: Metadata = {
  title: 'AI Video Dubbing Studio — Fluvia vLabs',
  description: 'Translate and dub video dialogue across languages with multi-speaker detection and SRT subtitle sync.',
};

export default function VlabsDubbingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070B] flex items-center justify-center text-emerald-400">Loading Dubbing Studio...</div>}>
      <VlabsStudioApp initialTool="dubbing" />
    </Suspense>
  );
}
