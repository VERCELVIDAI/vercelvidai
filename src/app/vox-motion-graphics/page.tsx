import React from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { VoxMotionGraphicsStudio } from '@/components/studio/VoxMotionGraphicsStudio';

export const metadata: Metadata = {
  title: 'Vox AI Motion Graphics Generator | Fluvia VidAI',
  description:
    'Turn any topic, news item, or product photo into viral paper-collage explainer videos with living posters, torn edges, and broadcast-ready narrative beats.',
};

export default function VoxMotionGraphicsPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFE] text-[#17191D] flex flex-col justify-between">
      <Header />
      <main className="flex-1">
        <VoxMotionGraphicsStudio />
      </main>
      <Footer />
    </div>
  );
}
