import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { HeroComposer } from '@/components/home/HeroComposer';
import { HeroVisual } from '@/components/home/HeroVisual';
import { FeaturedTemplateCarousel } from '@/components/home/FeaturedTemplateCarousel';
import { BRAND } from '@/lib/brand';
import {
  Sparkles,
  ArrowRight,
  Video,
  Image as ImageIcon,
  Mic,
  Scissors,
  Wand2,
  FileText,
  Sliders,
  CheckCircle2,
  Layers,
  ChevronRight,
  HelpCircle,
  Zap,
  Film,
  Megaphone,
  Camera,
  Play,
  Share2,
} from 'lucide-react';

const CREATIVE_SHOWCASE_ITEMS = [
  {
    id: 'showcase-1',
    title: 'Cyberpunk Runner — Rain Reflections',
    category: 'Cinematic',
    aspect: '21:9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-running-through-the-city-at-sunset-41662-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
    modelBadge: 'Fluvia Cinematic HD',
    camera: 'Tracking shot',
  },
  {
    id: 'showcase-2',
    title: 'Aura Lumina — Luxury Fragrance Reveal',
    category: 'Commercial',
    aspect: '16:9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-perfume-bottle-and-flowers-42354-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    modelBadge: 'Runway Gen-3',
    camera: 'Dolly in',
  },
  {
    id: 'showcase-3',
    title: 'Pacific Coastline Golden Hour Glide',
    category: 'Drone Aerial',
    aspect: '16:9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sun-setting-over-the-ocean-1175-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    modelBadge: 'Luma Ray',
    camera: 'Aerial movement',
  },
  {
    id: 'showcase-4',
    title: 'Tokyo Streetwear Motion Lookbook',
    category: 'Fashion',
    aspect: '9:16',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-stylish-girl-dancing-in-the-street-42350-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    modelBadge: 'Flux 1.1 Pro Vision',
    camera: 'Orbit',
  },
  {
    id: 'showcase-5',
    title: 'Gourmet Sizzle Macro Patty Promo',
    category: 'Commercial',
    aspect: '9:16',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-burger-falling-apart-in-slow-motion-42861-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    modelBadge: 'Runway Gen-3',
    camera: 'Dolly in',
  },
  {
    id: 'showcase-6',
    title: 'Urban Skater Sunset Golden Anamorphic',
    category: 'Cinematic',
    aspect: '9:16',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-young-man-skateboarding-at-sunset-42351-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&auto=format&fit=crop&q=80',
    modelBadge: 'Fluvia Cinematic HD',
    camera: 'Handheld',
  },
];

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text-primary)',
      }}
    >
      <Header />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Higgsfield Aesthetic) */}
        {/* ========================================================================= */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden text-center">
          {/* Ambient Lighting Spheres */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-violet-600/25 via-indigo-600/15 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-cyan-300 mb-8 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Powered by Google Gemini & Multi-Model Inference</span>
              <span className="text-white/30">•</span>
              <span className="text-zinc-300">Runway, Luma & Fluvia Core</span>
            </div>

            {/* Official Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.05] uppercase">
              Your imagination.{' '}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                In motion.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Create cinematic videos, striking visuals and campaign-ready content with AI — all inside one creative studio.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-xl shadow-violet-600/30 transition-all text-sm uppercase tracking-wider group"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#gallery"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-zinc-200 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 transition-colors text-sm"
              >
                <span>Explore Creations</span>
              </Link>
            </div>

            {/* Functional Prompt Composer */}
            <div className="mt-12">
              <HeroComposer />
            </div>

            {/* Cinema Studio Viewport */}
            <HeroVisual />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. PRODUCTION STUDIOS SHOWCASE (Phase 4 & 6 & 7) */}
        {/* ========================================================================= */}
        <section className="py-24 border-t border-white/[0.08] bg-[#07090F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[11px] uppercase tracking-widest text-cyan-400 font-mono font-bold mb-3 block">
                Fluvia Flow Studios
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Specialized Environments for Every Creative Workflow
              </h2>
              <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
                Move seamlessly from raw concept to scripted storyboard, camera choreographies, and timeline finishing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Studio 1: Cinema Studio */}
              <Link
                href="/studios/cinema"
                className="p-8 rounded-3xl bg-[#0D101A] border border-white/[0.08] hover:border-cyan-400/50 transition-all group flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/20 flex items-center justify-center">
                    <Film className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Cinema Studio
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono font-bold border border-cyan-500/20">
                      Director
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Camera trajectory controls (Dolly, Orbit, Crane, Handheld), 35mm anamorphic optical simulation, and Kodak 2383 color grading.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-cyan-400">
                  <span>Open Cinema Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Studio 2: Marketing Studio */}
              <Link
                href="/studios/marketing"
                className="p-8 rounded-3xl bg-[#0D101A] border border-white/[0.08] hover:border-violet-500/50 transition-all group flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                      Marketing Studio
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 font-mono font-bold border border-violet-500/20">
                      Brand & Ecom
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Product commercials, viral UGC hooks, ecom showcases, and platform-tailored ad briefs engineered with Gemini Marketing Copilot.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-violet-400">
                  <span>Open Marketing Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Studio 3: Storyboard Studio */}
              <Link
                href="/studios/storyboard"
                className="p-8 rounded-3xl bg-[#0D101A] border border-white/[0.08] hover:border-indigo-500/50 transition-all group flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Storyboard Studio
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono font-bold border border-indigo-500/20">
                      Gemini Copilot
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Automated multi-shot scene sequencing, timing breakdown, narration voiceover sync, and seamless export to the Creative Canvas.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-indigo-400">
                  <span>Open Storyboard Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PLAYABLE VIDEO & IMAGE GALLERY (Phase 5) */}
        {/* ========================================================================= */}
        <section id="gallery" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-cyan-400 font-mono font-bold mb-2 block">
                Creator Gallery
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Playable Video Showcase & Presets
              </h2>
              <p className="text-xs text-zinc-400 mt-2">
                Hover to preview video motion. Click any preset to replicate lighting, camera motion, and aesthetics.
              </p>
            </div>
            <Link
              href="/templates"
              className="mt-4 md:mt-0 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider"
            >
              <span>Explore All Templates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CREATIVE_SHOWCASE_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-[#0D101A] border border-white/[0.08] overflow-hidden group hover:border-cyan-400/40 transition-all flex flex-col justify-between"
              >
                {/* Playable Video Card Container */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <video
                    src={item.videoUrl}
                    poster={item.posterUrl}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-zinc-200 border border-white/10">
                      {item.aspect} • {item.camera}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-600/80 backdrop-blur-md text-white">
                      {item.modelBadge}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">{item.category}</span>
                    <h3 className="font-bold text-white text-sm mt-1 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <Link
                      href={`/create?prompt=${encodeURIComponent(item.title)}&mode=video`}
                      className="text-zinc-300 hover:text-white font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Use Preset</span>
                    </Link>
                    <Link
                      href="/studios/cinema"
                      className="text-cyan-400 hover:underline font-bold"
                    >
                      Open in Studio →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. FEATURED TEMPLATES CAROUSEL */}
        {/* ========================================================================= */}
        <FeaturedTemplateCarousel />

        {/* ========================================================================= */}
        {/* 5. PRICING & CREDIT MONETIZATION (Phase 13) */}
        {/* ========================================================================= */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-widest text-violet-400 font-mono font-bold mb-3 block">
              Transparent Credit-Based Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Pay in INR with Full Flexibility
            </h2>
            <p className="mt-4 text-zinc-400 text-sm">
              Official PayU India Hosted Checkout & UPI integration. Instant GST tax invoicing & settlement receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                name: 'Free Explorer',
                price: '₹0',
                period: 'forever',
                credits: '60 credits / month',
                features: ['720p Exports', 'Standard Models', 'Watermarked', '1 GB Storage'],
                cta: 'Start Free',
                popular: false,
                href: '/signup',
              },
              {
                name: 'Starter Creator',
                price: '₹999',
                period: 'per month',
                credits: '500 credits / month',
                features: ['1080p HD Exports', 'No Watermark', 'Runway & Fluvia Core', '10 GB Cloud Storage'],
                cta: 'Upgrade to Starter',
                popular: false,
                href: '/pricing',
              },
              {
                name: 'Pro Creator',
                price: '₹2,499',
                period: 'per month',
                credits: '1,600 credits / month',
                features: ['4K Ultra HD Exports', 'Runway Gen-3 & Luma Ray', 'Gemini Storyboards', '50 GB Cloud Storage'],
                cta: 'Get Pro Creator',
                popular: true,
                href: '/pricing',
              },
              {
                name: 'Studio Agency',
                price: '₹6,999',
                period: 'per month',
                credits: '5,000 credits / month',
                features: ['Full Multi-Model Access', 'Dedicated GPU Rendering', '250 GB Storage', 'Multi-Brand Kits'],
                cta: 'Get Studio Agency',
                popular: false,
                href: '/pricing',
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl bg-[#0D101A] border flex flex-col justify-between relative ${
                  plan.popular ? 'border-cyan-400 shadow-xl shadow-cyan-500/20' : 'border-white/[0.08]'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-white text-base">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-zinc-400">/{plan.period}</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-cyan-300 bg-cyan-950/40 p-2 rounded-xl border border-cyan-800/40">
                    {plan.credits}
                  </div>

                  <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.href}
                  className={`mt-8 w-full py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all ${
                    plan.popular
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. FAQ SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-white/[0.08] bg-[#07090F]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[11px] uppercase tracking-widest text-violet-400 font-mono font-bold mb-2 block">FAQ</span>
              <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'What makes Fluvia Flow different from ordinary video generators?',
                  a: 'Fluvia Flow unites specialized studios: Cinema Studio (camera movement paths & optical emulation), Marketing Studio (viral hook generator & commercial briefs), and Storyboard Studio powered by Google Gemini AI, combined with our non-linear Creative Canvas timeline editor.',
                },
                {
                  q: 'How does the Google Gemini integration work?',
                  a: 'Fluvia Flow uses official Google Gen AI SDK models on the server to enrich simple user prompts, write commercial video scripts, and generate structured JSON storyboards with camera directions and shotlists.',
                },
                {
                  q: 'How do generation credits work?',
                  a: 'Every generation reserves credits atomically based on the chosen model and duration. Standard 5-second Fluvia HD renders take 25 credits. If a generation fails, credits are immediately refunded.',
                },
                {
                  q: 'Can I pay using Indian Payment Methods (UPI, Netbanking, Cards)?',
                  a: 'Yes! Fluvia Flow supports direct INR billing through official PayU India Hosted Checkout, allowing UPI, debit/credit cards, and corporate netbanking with automatic GST invoices and receipts.',
                },
                {
                  q: 'Do I own commercial rights to videos created on Fluvia Flow?',
                  a: 'Yes! All content generated on paid plans carries full commercial usage rights for marketing, advertising, YouTube monetization, and client deliverables.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#0D101A] border border-white/[0.08]">
                  <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{item.q}</span>
                  </h3>
                  <p className="mt-2.5 text-xs text-zinc-400 pl-6 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. FINAL CALL TO ACTION */}
        {/* ========================================================================= */}
        <section className="py-24 relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
              Ready to create your next cinematic masterpiece?
            </h2>
            <p className="text-base text-zinc-300 max-w-xl mx-auto">
              Join thousands of creators, agencies, and brands producing high-impact videos in minutes with Fluvia Flow.
            </p>
            <div className="pt-6">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-xl shadow-violet-600/30 text-sm uppercase tracking-wider"
              >
                <span>Get Started with Free Credits</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
