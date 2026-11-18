import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { PdfToolsHub } from '@/components/pdf/PdfToolsHub';
import { FileText, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free PDF Tools Suite — Edit, Compress, Merge & Convert PDF | Fluvia Flow',
  description:
    'Edit PDF documents, compress file sizes by up to 70%, merge multiple PDFs, extract pages, and convert JPG/PNG images to PDF. 100% private, client-side vector processing.',
  keywords: [
    'pdf editor',
    'compress pdf',
    'merge pdf',
    'split pdf',
    'image to pdf',
    'free pdf tools',
    'watermark pdf',
    'rotate pdf',
    'fluvia flow',
  ],
};

export default function PdfToolsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#17191D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 mb-4 shadow-2xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>New Creative Studio • 100% Free & In-Browser Private</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#17191D] tracking-tight">
            Creative & Utility PDF Suite
          </h1>

          <p className="mt-3 text-sm sm:text-lg text-[#667085] max-w-2xl mx-auto">
            Edit text, add custom watermarks, compress bloated documents, merge contracts, and convert photos into pristine vector PDFs without privacy compromises.
          </p>
        </div>

        {/* Embedded PDF Tools Hub */}
        <div className="w-full">
          <PdfToolsHub />
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Are my PDF documents uploaded to external servers?',
                a: 'No. Fluvia Flow PDF Engine operates entirely within your browser using WebAssembly and pure client-side PDF vector libraries. Your sensitive business, legal, or personal documents are never transmitted over the internet or stored on our servers.',
              },
              {
                q: 'How does the PDF Compressor shrink file sizes?',
                a: 'The compressor strips redundant cross-reference tables, deduplicates fonts, removes lingering edit revisions, and cleans up document metadata streams while preserving crisp vector text and image resolutions.',
              },
              {
                q: 'Can I add watermarks and custom page numbers?',
                a: 'Yes. With the PDF Editor, you can stamp diagonal or horizontal watermarks (e.g., CONFIDENTIAL, DRAFT), set custom opacity, and apply automatic multi-page numbering (Page X of Y) with a single click.',
              },
              {
                q: 'Is there any daily limit or subscription required?',
                a: 'The PDF Tools Suite is completely free for all users with unlimited conversions, zero watermarks forced on output, and no artificial delays.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs"
              >
                <h3 className="font-bold text-sm text-slate-900 mb-1.5">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
