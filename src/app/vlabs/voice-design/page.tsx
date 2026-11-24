import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { VlabsStudioApp } from '@/components/vlabs/studio/VlabsStudioApp';

export const metadata: Metadata = {
  title: 'AI Voice Design — Fluvia vLabs',
  description: 'Design custom vocal personas from natural language descriptions with AI acoustic mapping.',
};

export default function VlabsVoiceDesignPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070B] flex items-center justify-center text-emerald-400">Loading Voice Design...</div>}>
      <VlabsStudioApp initialTool="voice-design" />
    </Suspense>
  );
}
