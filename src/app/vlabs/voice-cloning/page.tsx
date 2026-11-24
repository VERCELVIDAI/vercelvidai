import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { VlabsStudioApp } from '@/components/vlabs/studio/VlabsStudioApp';

export const metadata: Metadata = {
  title: 'Authorized AI Voice Cloning — Fluvia vLabs',
  description: 'Clone your authorized voice with strict consent safeguards and anti-impersonation security.',
};

export default function VlabsVoiceCloningPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070B] flex items-center justify-center text-emerald-400">Loading Voice Cloning...</div>}>
      <VlabsStudioApp initialTool="voice-cloning" />
    </Suspense>
  );
}
