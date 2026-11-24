import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { VlabsStudioApp } from '@/components/vlabs/studio/VlabsStudioApp';

export const metadata: Metadata = {
  title: 'Studio Settings & Licence Status — Fluvia vLabs',
  description: 'Manage your Fluvia vLabs production licence and export preferences.',
};

export default function VlabsSettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070B] flex items-center justify-center text-emerald-400">Loading Settings...</div>}>
      <VlabsStudioApp initialTool="settings" />
    </Suspense>
  );
}
