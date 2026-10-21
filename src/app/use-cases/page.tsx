import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { TrendingUp, Youtube, ShoppingBag, Share2, ArrowRight, Sparkles } from 'lucide-react';

export default function UseCasesIndexPage() {
  const useCases = [
    {
      title: 'Performance Marketing & Ads',
      desc: 'Scale high-converting ad variations for Facebook, Instagram, TikTok, and YouTube with kinetic captions and psychological hooks.',
      href: '/use-cases/marketing',
      icon: TrendingUp,
      color: 'text-pink-400 bg-pink-600/20',
      badge: 'High Conversion',
    },
    {
      title: 'YouTube & Shorts Creators',
      desc: 'Produce faceless documentary videos, daily shorts, explainer tutorials, and cinematic channel openers with zero camera equipment.',
      href: '/use-cases/youtube',
      icon: Youtube,
      color: 'text-red-400 bg-red-600/20',
      badge: 'Viral Growth',
    },
    {
      title: 'E-commerce & Brands',
      desc: 'Turn still catalog product photos into 3D spinning commercial reels, unboxings, and Amazon storefront promo videos.',
      href: '/use-cases/ecommerce',
      icon: ShoppingBag,
      color: 'text-amber-400 bg-amber-600/20',
      badge: 'Product Sales',
    },
    {
      title: 'Social Media Agencies',
      desc: 'Manage multiple client brand kits, batch-schedule weekly vertical reels, and maintain aesthetic consistency effortlessly.',
      href: '/use-cases/social-media',
      icon: Share2,
      color: 'text-purple-400 bg-purple-600/20',
      badge: 'Agency Workflows',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-xs font-semibold text-violet-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tailored Workflows</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Built for Every Modern Creative Need
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Explore how creators, marketing teams, agencies, and brands supercharge production speed with Vercel Vidai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <Link
                key={i}
                href={uc.href}
                className="p-8 rounded-2xl glass-panel border border-white/10 hover:border-violet-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${uc.color} flex items-center justify-center`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-violet-300 bg-violet-950/80 px-2.5 py-1 rounded-full border border-violet-500/30">
                      {uc.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">
                    {uc.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">{uc.desc}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-violet-400 group-hover:text-violet-300">
                  <span>Explore Use Case Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
