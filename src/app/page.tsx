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
    videoUrl: '/media/login/login-hero-preview.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
    modelBadge: 'Fluvia Cinematic HD',
    camera: 'Tracking shot',
  },
  {
    id: 'showcase-2',
    title: 'Aura Lumina — Luxury Fragrance Reveal',
    category: 'Commercial',
    aspect: '16:9',
    videoUrl: '/media/templates/tmpl-02-luxury-perfume.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    modelBadge: 'Runway Gen-3',
    camera: 'Dolly in',
  },
  {
    id: 'showcase-3',
    title: 'Pacific Coastline Golden Hour Glide',
    category: 'Drone Aerial',
    aspect: '16:9',
    videoUrl: '/media/templates/tmpl-06-travel-reel.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    modelBadge: 'Luma Ray',
    camera: 'Aerial movement',
  },
  {
    id: 'showcase-4',
    title: 'Tokyo Streetwear Motion Lookbook',
    category: 'Fashion',
    aspect: '9:16',
    videoUrl: '/media/templates/tmpl-04-fashion-campaign.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    modelBadge: 'Flux 1.1 Pro Vision',
    camera: 'Orbit',
  },
  {
    id: 'showcase-5',
    title: 'Gourmet Sizzle Macro Patty Promo',
    category: 'Commercial',
    aspect: '9:16',
    videoUrl: '/media/templates/tmpl-07-food-commercial.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    modelBadge: 'Runway Gen-3',
    camera: 'Dolly in',
  },
  {
    id: 'showcase-6',
    title: 'Urban Skater Sunset Golden Anamorphic',
    category: 'Cinematic',
    aspect: '9:16',
    videoUrl: '/media/templates/tmpl-14-instagram-reel.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&auto=format&fit=crop&q=80',
    modelBadge: 'Fluvia Cinematic HD',
    camera: 'Handheld',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 text-[#17211D]">
      <Header />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (White + Emerald Green + Soft Pink Glassmorphism) */}
        {/* ========================================================================= */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden text-center">
          {/* Ambient Lighting Spheres */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-pink-400/15 rounded-full blur-[140px] pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-emerald-500/25 text-xs font-semibold text-emerald-800 mb-8 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Powered by Google Gemini & Multi-Model Inference</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Runway, Luma & Fluvia Core</span>
            </div>

            {/* Official Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#17211D] max-w-5xl mx-auto leading-[1.05] uppercase">
              Your imagination.{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-pink-600 bg-clip-text text-transparent">
                In motion.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Create cinematic videos, striking visuals and campaign-ready content with AI — all inside one creative studio.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 shadow-xl shadow-emerald-500/25 transition-all text-sm uppercase tracking-wider group"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#gallery"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-slate-700 bg-white/80 hover:bg-white border border-emerald-500/20 shadow-sm transition-colors text-sm"
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
        {/* 2. PRODUCTION STUDIOS SHOWCASE */}
        {/* ========================================================================= */}
        <section className="py-24 border-t border-emerald-500/15 bg-emerald-50/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[11px] uppercase tracking-widest text-emerald-700 font-mono font-bold mb-3 block">
                Fluvia Flow Studios
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#17211D] tracking-tight">
                Specialized Environments for Every Creative Workflow
              </h2>
              <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                Move seamlessly from raw concept to scripted storyboard, camera choreographies, and timeline finishing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Studio 1: Cinema Studio */}
              <Link
                href="/studios/cinema"
                className="p-8 rounded-3xl glass-card border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-xl transition-all group flex flex-col justify-between space-y-6 relative overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center">
                    <Film className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#17211D] group-hover:text-emerald-700 transition-colors">
                      Cinema Studio
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-300">
                      Director
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Camera trajectory controls (Dolly, Orbit, Crane, Handheld), 35mm anamorphic optical simulation, and Kodak 2383 color grading.
                  </p>
                </div>
                <div className="pt-4 border-t border-emerald-500/15 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Open Cinema Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Studio 2: Marketing Studio */}
              <Link
                href="/studios/marketing"
                className="p-8 rounded-3xl glass-card border border-emerald-500/20 hover:border-pink-500/40 hover:shadow-xl transition-all group flex flex-col justify-between space-y-6 relative overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 border border-pink-300 flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#17211D] group-hover:text-pink-600 transition-colors">
                      Marketing Studio
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-mono font-bold border border-pink-300">
                      Brand & Ecom
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Product commercials, viral UGC hooks, ecom showcases, and platform-tailored ad briefs engineered with Gemini Marketing Copilot.
                  </p>
                </div>
                <div className="pt-4 border-t border-emerald-500/15 flex items-center justify-between text-xs font-bold text-pink-600">
                  <span>Open Marketing Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Studio 3: Storyboard Studio */}
              <Link
                href="/studios/storyboard"
                className="p-8 rounded-3xl glass-card border border-emerald-500/20 hover:border-teal-500/40 hover:shadow-xl transition-all group flex flex-col justify-between space-y-6 relative overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 border border-teal-300 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-teal-700" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#17211D] group-hover:text-teal-700 transition-colors">
                      Storyboard Studio
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-mono font-bold border border-teal-300">
                      Gemini Copilot
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automated multi-shot scene sequencing, timing breakdown, narration voiceover sync, and seamless export to the Creative Canvas.
                  </p>
                </div>
                <div className="pt-4 border-t border-emerald-500/15 flex items-center justify-between text-xs font-bold text-teal-700">
                  <span>Open Storyboard Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PLAYABLE VIDEO & IMAGE GALLERY */}
        {/* ========================================================================= */}
        <section id="gallery" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-emerald-700 font-mono font-bold mb-2 block">
                Creator Gallery
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17211D] tracking-tight">
                Playable Video Showcase & Presets
              </h2>
              <p className="text-xs text-slate-600 mt-2">
                Hover to preview video motion. Click any preset to replicate lighting, camera motion, and aesthetics.
              </p>
            </div>
            <Link
              href="/templates"
              className="mt-4 md:mt-0 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider"
            >
              <span>Explore All Templates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CREATIVE_SHOWCASE_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl glass-card border border-emerald-500/20 overflow-hidden group hover:border-emerald-500/40 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Playable Video Card Container */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
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
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {item.aspect} • {item.camera}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600/90 backdrop-blur-md text-white">
                      {item.modelBadge}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold">{item.category}</span>
                    <h3 className="font-bold text-[#17211D] text-sm mt-1 group-hover:text-emerald-700 transition-colors">
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
                      href="/studios/cinema"
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
              Pay in INR with Full Flexibility
            </h2>
            <p className="mt-4 text-slate-600 text-sm">
              Official PayU India Hosted Checkout & UPI integration. Instant billing invoicing & settlement receipts.
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
                name: 'Fluvia Basic',
                price: '₹999',
                period: 'per month',
                credits: '500 credits / month',
                features: ['1080p HD Exports', 'No Watermark', 'Runway & Fluvia Core', '10 GB Cloud Storage'],
                cta: 'Upgrade to Basic',
                popular: false,
                href: '/pricing',
              },
              {
                name: 'Fluvia Pro',
                price: '₹2,499',
                period: 'per month',
                credits: '1,600 credits / month',
                features: ['4K Ultra HD Exports', 'Runway Gen-3 & Luma Ray', 'Gemini Storyboards', '50 GB Cloud Storage'],
                cta: 'Get Fluvia Pro',
                popular: true,
                href: '/pricing',
              },
              {
                name: 'Fluvia Teams',
                price: '₹9,999',
                period: 'per month',
                credits: '10,000 credits / month',
                features: ['Full Multi-Model Access', '10 Member Team Seats', '500 GB Storage', 'Custom Billing Invoicing'],
                cta: 'Get Fluvia Teams',
                popular: false,
                href: '/pricing',
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl glass-card border flex flex-col justify-between relative shadow-lg ${
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
                      : 'bg-white/80 hover:bg-emerald-50 text-[#17211D] border border-emerald-500/20'
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
                  a: 'Yes! Fluvia Flow supports direct INR billing through official PayU India Hosted Checkout, allowing UPI, debit/credit cards, and corporate netbanking with automatic invoices and receipts.',
                },
                {
                  q: 'Do I own commercial rights to videos created on Fluvia Flow?',
                  a: 'Yes! All content generated on paid plans carries full commercial usage rights for marketing, advertising, YouTube monetization, and client deliverables.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl glass-card border border-emerald-500/20 shadow-sm">
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
        <section className="py-24 relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black text-[#17211D] tracking-tight uppercase">
              Ready to create your next cinematic masterpiece?
            </h2>
            <p className="text-base text-slate-600 max-w-xl mx-auto">
              Join thousands of creators, agencies, and brands producing high-impact videos in minutes with Fluvia Flow.
            </p>
            <div className="pt-6">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 shadow-xl shadow-emerald-500/25 text-sm uppercase tracking-wider"
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
