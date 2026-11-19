import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { PdfToolsHub, PdfToolId } from '@/components/pdf/PdfToolsHub';
import { Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    tool: string;
  };
}

const TOOL_TITLES: Record<string, { title: string; desc: string; toolId: PdfToolId }> = {
  editor: {
    title: 'PDF Editor — Add Text, Watermark & Page Controls',
    desc: 'Edit PDF documents directly in your browser. Add vector text, stamp confidential watermarks, and reorder pages.',
    toolId: 'editor',
  },
  compress: {
    title: 'Custom PDF Compressor — Set Target Size (100KB, 200KB, 500KB) & Quality',
    desc: 'Compress PDF documents to custom target file sizes, adjust DPI, convert to B&W/Grayscale, or optimize vector streams. 100% In-Browser Private.',
    toolId: 'compressor',
  },
  compressor: {
    title: 'Custom PDF Compressor — Set Target Size (100KB, 200KB, 500KB) & Quality',
    desc: 'Compress PDF documents to custom target file sizes, adjust DPI, convert to B&W/Grayscale, or optimize vector streams. 100% In-Browser Private.',
    toolId: 'compressor',
  },
  merge: {
    title: 'Merge PDF — Combine Multiple Files into One Document',
    desc: 'Join multiple PDF documents, contracts, and receipts into one ordered master PDF.',
    toolId: 'merge',
  },
  split: {
    title: 'Split PDF — Extract Custom Pages & Ranges',
    desc: 'Extract individual pages, chapters, or custom ranges from bulky PDF books and documents.',
    toolId: 'split',
  },
  'image-to-pdf': {
    title: 'Image to PDF — Convert JPG & PNG Photos into PDF',
    desc: 'Convert multiple images into a high-resolution, aligned PDF document with customizable margins.',
    toolId: 'image-to-pdf',
  },
};

export function generateStaticParams() {
  return [
    { tool: 'editor' },
    { tool: 'compress' },
    { tool: 'compressor' },
    { tool: 'merge' },
    { tool: 'split' },
    { tool: 'image-to-pdf' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const toolKey = params.tool.toLowerCase();
  const info = TOOL_TITLES[toolKey];
  if (!info) {
    return { title: 'PDF Tool | Fluvia Flow' };
  }
  return {
    title: `${info.title} | Fluvia Flow`,
    description: info.desc,
  };
}

export default function SubPdfToolPage({ params }: Props) {
  const toolKey = params.tool.toLowerCase();
  const info = TOOL_TITLES[toolKey];

  if (!info) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#17191D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 mb-4 shadow-2xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>100% Free & In-Browser Private</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17191D] tracking-tight">
            {info.title.split('—')[0].trim()}
          </h1>

          <p className="mt-3 text-sm sm:text-lg text-[#667085] max-w-2xl mx-auto">
            {info.desc}
          </p>
        </div>

        <div className="w-full">
          <PdfToolsHub initialTool={info.toolId} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
