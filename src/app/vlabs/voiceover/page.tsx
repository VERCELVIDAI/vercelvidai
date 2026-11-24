import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { VlabsStudioApp } from '@/components/vlabs/studio/VlabsStudioApp';

export const metadata: Metadata = {
  title: 'AI Text to Speech Studio — Fluvia vLabs',
  description: 'Convert text to natural human speech with emotion, speed and pitch controls in 15+ languages.',
};

export default function VlabsVoiceoverPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070B] flex items-center justify-center text-emerald-400">Loading TTS Studio...</div>}>
      <VlabsStudioApp initialTool="tts" />
    </Suspense>
  );
}
