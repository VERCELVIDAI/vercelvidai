import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { HeroComposer } from '@/components/home/HeroComposer';
import { Image as ImageIcon, Sparkles, ArrowRight, Wand2, Palette, Shield } from 'lucide-react';

export default function AIImageGeneratorPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-600/10 border border-sky-500/20 text-xs font-semibold text-sky-400 mb-4">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Flux 1.1 Pro & Ultra-Resolution AI Images</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            AI Image Studio
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-300">
            Generate photorealistic concept art, ecommerce product mockups, and YouTube thumbnails with prompt comprehension.
          </p>
        </div>

        {/* Embedded Interactive Composer */}
        <div className="mb-20">
          <HeroComposer />
        </div>

        {/* Gallery of Flux Generated Visuals */}
        <div className="my-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
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
              <div key={idx} className="rounded-2xl glass-panel border border-white/10 overflow-hidden group">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <Link
                      href={`/create?mode=video&ref=${encodeURIComponent(card.image)}`}
                      className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5"
                    >
                      <span>Animate to Video</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white text-sm">{card.title}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{card.aspect}</span>
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
