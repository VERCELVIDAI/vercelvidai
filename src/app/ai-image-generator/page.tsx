import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { GeminiImageStudio } from '@/components/studio/GeminiImageStudio';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function AIImageGeneratorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#17191D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-left">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-xs font-bold text-[#5145CD] mb-4 shadow-2xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>Google Gemini Imagen & Flux 1.1 Pro Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#17191D] tracking-tight">
            Gemini AI Image Studio
          </h1>
          <p className="mt-3 text-sm sm:text-lg text-[#667085]">
            Generate ultra-high-fidelity concept art, luxury commercial advertisements, and product renderings powered by Google Gemini AI.
          </p>
        </div>

        {/* Embedded Interactive Gemini Image Studio */}
        <div className="mb-16">
          <GeminiImageStudio />
        </div>

        {/* Gallery of High Fidelity Visuals */}
        <div className="my-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#17191D] mb-8 text-center">
            Curated High-Fidelity Generations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Cybernetic Running Footwear',
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80',
                aspect: 'Product Render (1:1)',
              },
              {
                title: 'Abstract Holographic Gradient',
                image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
                aspect: 'Digital Art (16:9)',
              },
              {
                title: 'High-Tech SaaS Interface Glass',
                image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80',
                aspect: 'Macro Photography (16:9)',
              },
              {
                title: 'Editorial Luxury Cosmetic',
                image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000&auto=format&fit=crop&q=80',
                aspect: 'Commercial (9:16)',
              },
              {
                title: 'Futuristic Architectural Atrium',
                image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
                aspect: 'Architecture (16:9)',
              },
              {
                title: 'Deep Space Cosmic Nebula',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80',
                aspect: 'Cinema (16:9)',
              },
            ].map((card, idx) => (
              <div key={idx} className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden group shadow-xs hover:border-[#5145CD]/40 transition-all">
                <div className="aspect-square relative overflow-hidden bg-[#17191D]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <Link
                      href={`/create?mode=video&ref=${encodeURIComponent(card.image)}`}
                      className="w-full py-2 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                    >
                      <span>Animate to Video</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <h4 className="font-bold text-[#17191D] text-sm">{card.title}</h4>
                  <span className="text-[11px] text-[#667085] font-mono font-medium">{card.aspect}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
