import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { VlabsStudioApp } from '@/components/vlabs/studio/VlabsStudioApp';

export const metadata: Metadata = {
  title: 'Voice Library Catalog — Fluvia vLabs',
  description: 'Search and preview studio-grade voices across Indian and global languages.',
};

export default function VlabsVoicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070B] flex items-center justify-center text-emerald-400">Loading Voice Library...</div>}>
      <VlabsStudioApp initialTool="voices" />
    </Suspense>
  );
}
