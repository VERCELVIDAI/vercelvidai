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
      color: 'text-[#F05BCE] bg-[#F05BCE]/15 border border-[#F05BCE]/30',
      badge: 'High Conversion',
    },
    {
      title: 'YouTube & Shorts Creators',
      desc: 'Produce faceless documentary videos, daily shorts, explainer tutorials, and cinematic channel openers with zero camera equipment.',
      href: '/use-cases/youtube',
      icon: Youtube,
      color: 'text-[#F05BCE] bg-[#F05BCE]/15 border border-[#F05BCE]/30',
      badge: 'Viral Growth',
    },
    {
      title: 'E-commerce & Brands',
      desc: 'Turn still catalog product photos into 3D spinning commercial reels, unboxings, and Amazon storefront promo videos.',
      href: '/use-cases/ecommerce',
      icon: ShoppingBag,
      color: 'text-[#F05BCE] bg-[#F05BCE]/15 border border-[#F05BCE]/30',
      badge: 'Product Sales',
    },
    {
      title: 'Social Media Agencies',
      desc: 'Manage multiple client brand kits, batch-schedule weekly vertical reels, and maintain aesthetic consistency effortlessly.',
      href: '/use-cases/social-media',
      icon: Share2,
      color: 'text-[#F05BCE] bg-[#F05BCE]/15 border border-[#F05BCE]/30',
      badge: 'Agency Workflows',
    },
  ];

  return (
    <div className="min-h-screen bg-[#100A12] text-[#F5EAF4] flex flex-col text-left">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F05BCE]/15 border border-[#F05BCE]/30 text-xs font-semibold text-[#F05BCE] mb-4 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#F05BCE]" />
            <span>Tailored Workflows</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F5EAF4] tracking-tight">
            Built for Every Modern Creative Need
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#A99AAA]">
            Explore how creators, marketing teams, agencies, and brands supercharge production speed with Fluvia Flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <Link
                key={i}
                href={uc.href}
                className="p-8 rounded-3xl bg-[#211522] border border-[#39233B] hover:border-[#F05BCE]/40 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${uc.color} flex items-center justify-center`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-[#F05BCE] bg-[#F05BCE]/15 px-3 py-1 rounded-full border border-[#F05BCE]/30 font-mono">
                      {uc.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#F5EAF4] group-hover:text-[#F05BCE] transition-colors">
                    {uc.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#A99AAA] leading-relaxed">{uc.desc}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#39233B] flex items-center justify-between text-xs font-semibold text-[#F05BCE] group-hover:brightness-125">
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
