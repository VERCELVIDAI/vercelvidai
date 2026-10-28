import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { BRAND } from '@/lib/brand';
import {
  Sparkles,
  ArrowRight,
  Video,
  Image as ImageIcon,
  Mic,
  Sliders,
  CheckCircle2,
  Layers,
  ChevronRight,
  HelpCircle,
  Zap,
  Film,
  Camera,
  Play,
  RotateCcw,
  Volume2,
  ExternalLink,
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
    <div className="min-h-screen flex flex-col transition-colors duration-200 text-slate-100 bg-[#090A0D]">
      <Header />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC DIRECTOR'S CANVAS HERO (REPLACING GENERIC SAAS HERO) */}
        {/* ========================================================================= */}
        <section className="relative pt-8 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-b from-[#0E1015] via-[#090A0D] to-[#090A0D]">
          {/* Ambient Lighting Spheres */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-cyan-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Headline and Studio Badge */}
            <div className="text-center max-w-4xl mx-auto space-y-4 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold text-slate-300 backdrop-blur-md shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                <span className="text-white">Google Flow Creative Studio</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-medium">Google DeepMind (Veo & Gemini Omni Flash)</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
                Bring your stories to life with our{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  AI creative studio.
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Try Fluvia Flow, the ultimate AI for creatives. Transform ideas into reality using advanced generative models for cinematic video, images, and custom creative tools.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/25 transition-all text-xs uppercase tracking-wider group border border-white/10"
                >
                  <span>Launch Flow Studio (15 cr)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 shadow-2xs transition-colors text-xs"
                >
                  <Film className="w-4 h-4 text-indigo-400" />
                  <span>Curated Templates (24)</span>
                </Link>
              </div>
            </div>

            {/* WIDESCREEN CINEMATIC SHOWCASE STAGE */}
            <div className="relative rounded-3xl border border-white/10 bg-[#0E1015] overflow-hidden shadow-2xl p-2 sm:p-4 max-w-5xl mx-auto">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <video
                  src="/media/templates/tmpl-05-automotive-film.mp4"
                  poster="/media/templates/poster-vid-05-automotive.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Director Framing Watermarks */}
                <div className="absolute inset-4 pointer-events-none border border-white/10 rounded-xl flex flex-col justify-between p-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                    <span>4K CINEMA MASTER • 24 FPS</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-600/80 text-white">GEMINI OMNI FLASH (15 CR)</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>CAMERA: ANAMORPHIC TRACKING DOLLY</span>
                    <span>FLUVIA FLOW CINEMA ENGINE</span>
                  </div>
                </div>
              </div>

              {/* Quick Interactive Prompt Bar below the canvas */}
              <div className="mt-3 p-3 rounded-2xl bg-[#090A0D] border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-300 font-mono text-[11px] truncate">
                    "Ultra-luxury midnight chronograph watch, dramatic studio reflections, liquid metal ripple..."
                  </span>
                </div>

                <Link
                  href="/create?prompt=Ultra-luxury%20midnight%20chronograph%20watch%20floating%20in%20zero-gravity%2C%20dramatic%20studio%20reflections&mode=video"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow"
                >
                  <span>Remix in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THE 4 PILLARS OF GOOGLE FLOW ARCHITECTURE */}
        {/* ========================================================================= */}
        <section id="pillars" className="py-20 border-t border-white/8 bg-[#0B0C10] text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-[11px] uppercase tracking-widest text-indigo-400 font-mono font-bold mb-2 block">
                Google Flow Creative Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                An Infinite Canvas for Every Story
              </h2>
              <p className="mt-3 text-slate-400 text-xs sm:text-sm leading-relaxed">
                Move beyond disconnected prompt windows. Flow unites text-to-video, frame interpolation, character consistency, and bespoke workflow apps into one seamless studio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Pillar 1: Text-to-Video */}
              <div className="p-5 rounded-3xl border border-white/8 bg-[#11131A] hover:border-white/20 hover:bg-[#151822] flex flex-col justify-between space-y-4 shadow-xl transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <Video className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      Text to Video
                    </h3>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                      15 cr
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Powered by Google Gemini Omni 1.1 Flash. Full programmatic camera motion control including Dolly, Orbit, Tracking, and Crane shots.
                  </p>
                </div>
                <Link
                  href="/create?mode=video"
                  className="pt-3 border-t border-white/8 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300"
                >
                  <span>Open Video Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Pillar 2: Frames-to-Video */}
              <div className="p-5 rounded-3xl border border-white/8 bg-[#11131A] hover:border-white/20 hover:bg-[#151822] flex flex-col justify-between space-y-4 shadow-xl transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      Frames to Video
                    </h3>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                      Keyframes
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Provide a starting frame or image reference. Flow generates fluid transitions while preserving lighting, subject anatomy, and narrative continuity.
                  </p>
                </div>
                <Link
                  href="/create?mode=video"
                  className="pt-3 border-t border-white/8 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300"
                >
                  <span>Upload Keyframes</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Pillar 3: ElevenLabs Voiceover HD */}
              <div className="p-5 rounded-3xl border border-white/8 bg-[#11131A] hover:border-white/20 hover:bg-[#151822] flex flex-col justify-between space-y-4 shadow-xl transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      Neural Voiceover HD
                    </h3>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                      2 cr
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    ElevenLabs Multilingual v4 synthesis with 40+ professional voices (Roger, Sarah, Laura, George) and instant MP3 master audio downloads.
                  </p>
                </div>
                <Link
                  href="/create?mode=audio"
                  className="pt-3 border-t border-white/8 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300"
                >
                  <span>Open Voice Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Pillar 4: Google Vids Workspace */}
              <div className="p-5 rounded-3xl border border-white/8 bg-[#11131A] hover:border-white/20 hover:bg-[#151822] flex flex-col justify-between space-y-4 shadow-xl transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      Google Vids Handoff
                    </h3>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold border border-blue-500/30">
                      0 cr Free
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Collaborate with Google Workspace teams. Refine your cinematic storyboard in Fluvia, then launch into Google Vids with zero credits deducted.
                  </p>
                </div>
                <Link
                  href="/create?mode=vids"
                  className="pt-3 border-t border-white/8 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300"
                >
                  <span>Launch Google Vids</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. AGENCY COMMERCIAL REELS SHOWCASE */}
        {/* ========================================================================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-indigo-400 font-mono font-bold mb-2 block">
                Google Flow Showcase
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Cinematic Reels & Commercial Presets
              </h2>
              <p className="text-xs text-slate-400 mt-2">
                Curated advertising agency work. Click any preset to launch directly into the Flow Studio with exact prompt, camera movement, and aspect ratio.
              </p>
            </div>
            <Link
              href="/templates"
              className="mt-4 md:mt-0 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider"
            >
              <span>Explore All 24 Templates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CREATIVE_SHOWCASE_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/8 bg-[#11131A] hover:border-white/20 hover:bg-[#151822] overflow-hidden group hover:shadow-2xl transition-all flex flex-col justify-between"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-white border border-white/15">
                      {item.aspect} • {item.camera}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600/90 backdrop-blur-md text-white border border-indigo-400/30">
                      {item.modelBadge}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/70 text-indigo-300 border border-indigo-400/30">
                      {item.credits}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">{item.category}</span>
                    <h3 className="font-bold text-white text-sm mt-1 group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-white/8 flex items-center justify-between text-xs">
                    <Link
                      href={`/create?prompt=${encodeURIComponent(item.title)}&mode=video`}
                      className="text-slate-300 hover:text-white font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Use Preset</span>
                    </Link>
                    <Link
                      href="/create?mode=video"
                      className="text-indigo-400 hover:text-indigo-300 font-bold"
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
        {/* 4. PRICING & CREDIT MONETIZATION (0% GST & PAYU COMPLIANT) */}
        {/* ========================================================================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/8 text-left">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-widest text-indigo-400 font-mono font-bold mb-2 block">
              Transparent Credit-Based Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Simple Plans in INR with Instant Settlement
            </h2>
            <p className="mt-3 text-slate-400 text-xs sm:text-sm">
              Official PayU India Hosted Checkout & UPI integration. Instant billing invoicing & official settlement receipts with 0% GST.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
                className={`p-6 rounded-3xl border flex flex-col justify-between relative shadow-xl transition-all ${
                  plan.popular ? 'bg-[#131520] border-indigo-500 ring-2 ring-indigo-500/30 shadow-indigo-500/15' : 'bg-[#11131A] border-white/8 hover:border-white/16'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-white/20">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-white text-base">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400">/{plan.period}</span>
                  </div>
                  <div className="mt-2 text-xs font-bold text-indigo-300 bg-white/[0.04] p-2 rounded-xl border border-white/8 font-mono">
                    {plan.credits}
                  </div>

                  <ul className="mt-5 space-y-2.5 text-xs text-slate-400">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.href}
                  className={`mt-6 w-full py-2.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 border border-white/10'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. FAQ SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-white/8 bg-[#0B0C10] text-left">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-[11px] uppercase tracking-widest text-indigo-400 font-mono font-bold mb-2 block">FAQ</span>
              <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
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
                <div key={idx} className="p-4 rounded-2xl border border-white/8 bg-[#11131A] shadow-lg">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{item.q}</span>
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 pl-6 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. FINAL CALL TO ACTION */}
        {/* ========================================================================= */}
        <section className="py-20 relative overflow-hidden text-center bg-gradient-to-b from-[#0B0C10] to-[#090A0D]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Bring your stories to life today.
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Join creators producing high-impact cinematic videos, images, and voiceovers with Fluvia Flow.
            </p>
            <div className="pt-4">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/25 text-xs uppercase tracking-wider border border-white/10"
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
