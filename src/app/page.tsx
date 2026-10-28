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
  Palette,
  Workflow,
  Cpu,
} from 'lucide-react';

const CREATIVE_SHOWCASE_ITEMS = [
  {
    id: 'showcase-1',
    title: 'AeroGT Hypercar Launch Film — Twilight Alpine Ridge',
    category: 'Cinematic Automotive',
    aspect: '16:9',
    videoUrl: '/media/templates/tmpl-05-automotive-film.mp4',
    posterUrl: '/media/templates/poster-vid-05-automotive.jpg',
    modelBadge: 'Google Gemini Omni Flash',
    credits: '15 cr',
    camera: 'Tracking dolly',
  },
  {
    id: 'showcase-2',
    title: "Aura Privée — L'Élixir Noir Luxury Perfume",
    category: 'Product Commercial',
    aspect: '1:1',
    videoUrl: '/media/templates/tmpl-02-luxury-perfume.mp4',
    posterUrl: '/media/templates/poster-vid-01-perfume.jpg',
    modelBadge: 'Google Gemini Omni Flash',
    credits: '15 cr',
    camera: 'Macro orbit',
  },
  {
    id: 'showcase-3',
    title: 'Neon Shibuya Cyberpunk Night Drive',
    category: 'Social Media Reel',
    aspect: '9:16',
    videoUrl: '/media/templates/tmpl-14-instagram-reel.mp4',
    posterUrl: '/media/templates/poster-vid-04-fashion.jpg',
    modelBadge: 'Google Gemini Omni Flash',
    credits: '15 cr',
    camera: 'Handheld dynamic',
  },
  {
    id: 'showcase-4',
    title: 'Torched Wagyu A5 Culinary Mastery',
    category: 'Food & Beverage',
    aspect: '9:16',
    videoUrl: '/media/templates/tmpl-07-food-commercial.mp4',
    posterUrl: '/media/templates/poster-vid-07-food.jpg',
    modelBadge: 'Google Gemini Omni Flash',
    credits: '15 cr',
    camera: 'Slow clock dolly',
  },
  {
    id: 'showcase-5',
    title: 'Pacific Coastline Golden Hour Aerial Glide',
    category: 'Drone Cinematic',
    aspect: '16:9',
    videoUrl: '/media/templates/tmpl-06-travel-reel.mp4',
    posterUrl: '/media/templates/poster-vid-06-travel.jpg',
    modelBadge: 'Google Gemini Omni Flash',
    credits: '15 cr',
    camera: 'Aerial drone flight',
  },
  {
    id: 'showcase-6',
    title: 'High-Speed Urban Runner — Rain Reflections',
    category: 'Commercial Film',
    aspect: '16:9',
    videoUrl: '/media/login/login-hero-preview.mp4',
    posterUrl: '/media/login/thumb-cyberpunk.jpg',
    modelBadge: 'Google Gemini Omni Flash',
    credits: '15 cr',
    camera: 'Low-angle tracking',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 text-[#17211D] bg-white">
      <Header />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. GOOGLE FLOW HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden text-center bg-gradient-to-b from-emerald-50/40 via-white to-white">
          {/* Ambient Lighting Spheres */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-emerald-300/10 rounded-full blur-[140px] pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Google Flow Studio Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-emerald-500/30 text-xs font-bold text-emerald-800 mb-8 backdrop-blur-md shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google Flow Studio</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">Powered by Google DeepMind (Veo & Gemini Omni Flash)</span>
            </div>

            {/* Official Google Flow Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#17211D] max-w-5xl mx-auto leading-[1.08]">
              Bring your stories to life with our{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                AI creative studio.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
              Try Fluvia Flow, the ultimate AI for creatives. Transform ideas into reality using advanced generative models for cinematic video, images, and custom creative tools.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-xl shadow-emerald-500/25 transition-all text-sm uppercase tracking-wider group"
              >
                <span>Launch Flow Studio (15 cr)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#pillars"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-slate-700 bg-white hover:bg-emerald-50/60 border border-emerald-500/20 shadow-2xs transition-colors text-sm"
              >
                <span>Explore Capabilities</span>
              </Link>
            </div>

            {/* Functional Google Flow Prompt Composer */}
            <div className="mt-12">
              <HeroComposer />
            </div>

            {/* Google Flow Scene Builder & Neural Viewport */}
            <HeroVisual />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THE 4 PILLARS OF GOOGLE FLOW ARCHITECTURE */}
        {/* ========================================================================= */}
        <section id="pillars" className="py-24 border-t border-emerald-500/15 bg-emerald-50/25 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[11px] uppercase tracking-widest text-emerald-700 font-mono font-bold mb-3 block">
                Google Flow Creative Architecture
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#17211D] tracking-tight">
                An Infinite Canvas for Every Story
              </h2>
              <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                Move beyond disconnected prompt windows. Flow unites text-to-video, frame interpolation, character consistency, and bespoke workflow apps into one seamless studio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pillar 1: Text-to-Video */}
              <div className="p-6 rounded-3xl glass-card border border-emerald-500/20 bg-white/95 flex flex-col justify-between space-y-5 hover:border-emerald-500/50 hover:shadow-lg transition-all group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center">
                    <Video className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#17211D] group-hover:text-emerald-700 transition-colors">
                      Text to Video
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-300">
                      15 cr
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Powered by Google Gemini Omni 1.1 Flash. Full programmatic camera motion control including Dolly, Orbit, Tracking, and Crane shots.
                  </p>
                </div>
                <Link
                  href="/create?mode=video"
                  className="pt-3 border-t border-emerald-500/15 flex items-center justify-between text-xs font-bold text-emerald-700"
                >
                  <span>Open Video Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Pillar 2: Frames-to-Video */}
              <div className="p-6 rounded-3xl glass-card border border-emerald-500/20 bg-white/95 flex flex-col justify-between space-y-5 hover:border-emerald-500/50 hover:shadow-lg transition-all group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 border border-teal-300 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-teal-700" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#17211D] group-hover:text-teal-700 transition-colors">
                      Frames to Video
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-mono font-bold border border-teal-300">
                      Keyframes
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Provide a starting frame, ending frame, or both. Flow generates fluid transitions while preserving lighting, subject anatomy, and narrative continuity.
                  </p>
                </div>
                <Link
                  href="/create?mode=video"
                  className="pt-3 border-t border-emerald-500/15 flex items-center justify-between text-xs font-bold text-teal-700"
                >
                  <span>Upload Keyframes</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Pillar 3: Ingredients & Consistent Characters */}
              <div className="p-6 rounded-3xl glass-card border border-emerald-500/20 bg-white/95 flex flex-col justify-between space-y-5 hover:border-emerald-500/50 hover:shadow-lg transition-all group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#17211D] group-hover:text-emerald-700 transition-colors">
                      Consistency Locker
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-300">
                      Ingredients
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Lock character facial structures, brand color schemes, and physical product styling across whole multi-shot scenes without visual drift.
                  </p>
                </div>
                <Link
                  href="/dashboard/brand-kit"
                  className="pt-3 border-t border-emerald-500/15 flex items-center justify-between text-xs font-bold text-emerald-700"
                >
                  <span>Manage Ingredients</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Pillar 4: Custom Tools Builder */}
              <div className="p-6 rounded-3xl glass-card border border-emerald-500/20 bg-white/95 flex flex-col justify-between space-y-5 hover:border-emerald-500/50 hover:shadow-lg transition-all group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 border border-slate-300 flex items-center justify-center">
                    <Sliders className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#17211D] group-hover:text-emerald-700 transition-colors">
                      Custom Tools
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono font-bold border border-slate-300">
                      No-Code
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Describe custom creative tools in natural language. Powered by Gemini, Flow generates bespoke mini-apps, filters, and remixable studio widgets.
                  </p>
                </div>
                <Link
                  href="/editor"
                  className="pt-3 border-t border-emerald-500/15 flex items-center justify-between text-xs font-bold text-slate-800"
                >
                  <span>Build Tools</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PLAYABLE VIDEO & IMAGE GALLERY (FLOW SHOWCASE) */}
        {/* ========================================================================= */}
        <section id="gallery" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-emerald-700 font-mono font-bold mb-2 block">
                Google Flow Showcase
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17211D] tracking-tight">
                Cinematic Reels & Commercial Presets
              </h2>
              <p className="text-xs text-slate-600 mt-2">
                Hover to play full video motion. Click any preset to launch directly into the Flow Studio with exact prompt, camera movement, and aspect ratio.
              </p>
            </div>
            <Link
              href="/templates"
              className="mt-4 md:mt-0 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider"
            >
              <span>Explore All 24 Templates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CREATIVE_SHOWCASE_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl glass-card border border-emerald-500/20 bg-white/95 overflow-hidden group hover:border-emerald-500/40 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Playable Video Card Container */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
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
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white border border-white/15">
                      {item.aspect} • {item.camera}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600/90 backdrop-blur-md text-white">
                      {item.modelBadge}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-emerald-300 border border-emerald-400/30">
                      {item.credits}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold">{item.category}</span>
                    <h3 className="font-bold text-[#17211D] text-sm mt-1 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-emerald-500/15 flex items-center justify-between text-xs">
                    <Link
                      href={`/create?prompt=${encodeURIComponent(item.title)}&mode=video`}
                      className="text-slate-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Use Preset</span>
                    </Link>
                    <Link
                      href="/create?mode=video"
                      className="text-emerald-700 hover:underline font-bold"
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
        {/* 5. PRICING & CREDIT MONETIZATION */}
        {/* ========================================================================= */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-emerald-500/15 text-left">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-widest text-emerald-700 font-mono font-bold mb-3 block">
              Transparent Credit-Based Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#17211D] tracking-tight">
              Simple Plans in INR with Instant Settlement
            </h2>
            <p className="mt-4 text-slate-600 text-sm">
              Official PayU India Hosted Checkout & UPI integration. Instant billing invoicing & official settlement receipts with 0% GST.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                name: 'Free Explorer',
                price: '₹0',
                period: 'forever',
                credits: '60 credits / month',
                features: ['720p Video Exports', 'Gemini Omni Flash Engine', 'Standard Rate Limit', '1 GB Cloud Storage'],
                cta: 'Start Free',
                popular: false,
                href: '/signup',
              },
              {
                name: 'Fluvia Basic',
                price: '₹999',
                period: 'per month',
                credits: '500 credits / month',
                features: ['1080p HD Video Exports', '15 Credits Per Video Rule', 'ElevenLabs HD Voice (2 cr)', '10 GB Cloud Storage'],
                cta: 'Upgrade to Basic',
                popular: false,
                href: '/pricing',
              },
              {
                name: 'Fluvia Pro',
                price: '₹2,499',
                period: 'per month',
                credits: '1,600 credits / month',
                features: ['4K Ultra HD Exports', 'Priority Gemini Queue', 'Scene Builder Timeline', '50 GB Cloud Storage'],
                cta: 'Get Fluvia Pro',
                popular: true,
                href: '/pricing',
              },
              {
                name: 'Fluvia Teams',
                price: '₹9,999',
                period: 'per month',
                credits: '10,000 credits / month',
                features: ['Full Studio Multi-Model', '10 Team Member Seats', '500 GB Storage', 'Dedicated Billing & Invoices'],
                cta: 'Get Fluvia Teams',
                popular: false,
                href: '/pricing',
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl glass-card border bg-white flex flex-col justify-between relative shadow-lg ${
                  plan.popular ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/10' : 'border-emerald-500/20'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-[#17211D] text-base">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#17211D]">{plan.price}</span>
                    <span className="text-xs text-slate-500">/{plan.period}</span>
                  </div>
                  <div className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    {plan.credits}
                  </div>

                  <ul className="mt-6 space-y-3 text-xs text-slate-600">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.href}
                  className={`mt-8 w-full py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all ${
                    plan.popular
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-white hover:bg-emerald-50 text-[#17211D] border border-emerald-500/20'
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
        <section className="py-20 border-t border-emerald-500/15 bg-emerald-50/20 text-left">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[11px] uppercase tracking-widest text-emerald-700 font-mono font-bold mb-2 block">FAQ</span>
              <h2 className="text-3xl font-bold text-[#17211D]">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'What is Google Flow / Fluvia Flow?',
                  a: 'Fluvia Flow is an advanced AI creative studio designed for filmmakers, designers, and creators to generate cinematic video, photorealistic images, voiceover audio, and bespoke creative workflows with Google Gemini and ElevenLabs.',
                },
                {
                  q: 'How does video generation pricing work?',
                  a: 'Video generation is strictly fixed at 15 credits per video powered by Google Gemini Omni 1.1 Flash. If a generation ever fails, credits are automatically refunded to your wallet atomically.',
                },
                {
                  q: 'Can I generate voiceovers and character dialogues?',
                  a: 'Yes! Fluvia Flow integrates ElevenLabs Neural Voiceover HD at 2 credits per synthesis with 40+ professional voices (Roger, Sarah, Laura, George) and over 29 supported languages.',
                },
                {
                  q: 'What is the Google Vids Studio integration?',
                  a: 'Google Vids Studio Workspace is available directly with 0 Fluvia credits charged, enabling enterprise storyboard handoff and collaborative video editing across Google Workspace.',
                },
                {
                  q: 'Do I get official invoices and receipts?',
                  a: 'Yes. Every plan purchase generates an official PDF Tax Invoice and Payment Receipt with 0% GST compliance and PayU India verification records, downloadable anytime in your Purchase History.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl glass-card border border-emerald-500/20 shadow-2xs bg-white">
                  <h3 className="font-bold text-[#17211D] text-sm flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item.q}</span>
                  </h3>
                  <p className="mt-2.5 text-xs text-slate-600 pl-6 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. FINAL CALL TO ACTION */}
        {/* ========================================================================= */}
        <section className="py-24 relative overflow-hidden text-center bg-gradient-to-t from-emerald-50/50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black text-[#17211D] tracking-tight">
              Bring your stories to life today.
            </h2>
            <p className="text-base text-slate-600 max-w-xl mx-auto">
              Join thousands of creators producing high-impact cinematic videos, images, and voiceovers with Fluvia Flow.
            </p>
            <div className="pt-6">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-xl shadow-emerald-500/25 text-sm uppercase tracking-wider"
              >
                <span>Launch Flow Studio (15 cr)</span>
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
