import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { VlabsStudioApp } from '@/components/vlabs/studio/VlabsStudioApp';

export const metadata: Metadata = {
  title: 'Generation History — Fluvia vLabs',
  description: 'View and download previously rendered voiceovers and dubbing projects.',
};

export default function VlabsHistoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070B] flex items-center justify-center text-emerald-400">Loading History...</div>}>
      <VlabsStudioApp initialTool="history" />
    </Suspense>
  );
}
