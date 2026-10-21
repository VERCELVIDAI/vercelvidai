import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { HeroComposer } from '@/components/home/HeroComposer';
import { HeroVisual } from '@/components/home/HeroVisual';
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
  Globe2,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
          {/* Subtle background glow spheres */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-sky-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-medium text-violet-300 mb-8 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Next-Generation AI Creative Studio</span>
              <span className="text-white/40">•</span>
              <span className="text-slate-300">Runway, Luma, Flux & Vidai Core</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
              Your ideas.{' '}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                Extraordinary videos.
              </span>{' '}
              Powered by AI.
            </h1>

            {/* Supporting Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Create cinematic videos, scroll-stopping ads and social content from a simple prompt — all in one creative workspace.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/create"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 shadow-xl shadow-violet-600/30 transition-all text-base group"
              >
                <span>Create Your First Video</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/templates"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-200 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 transition-colors text-base"
              >
                <span>Explore Templates</span>
              </Link>
            </div>

            {/* Interactive Prompt Composer */}
            <div className="mt-12">
              <HeroComposer />
            </div>

            {/* Visual Studio Showcase */}
            <HeroVisual />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. PRODUCTION WORKFLOW SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-white/[0.06] bg-[#0B0C12]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">
                Simple 5-Step Pipeline
              </h2>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                From spark of an idea to finished render in minutes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                {
                  step: '01',
                  title: 'Describe the idea',
                  desc: 'Input a prompt, paste a YouTube script, or upload a product reference photograph.',
                },
                {
                  step: '02',
                  title: 'Set creative direction',
                  desc: 'Choose your foundation model, aspect ratio, camera motion, voice, and visual tone.',
                },
                {
                  step: '03',
                  title: 'Generate & review',
                  desc: 'Our unified dispatcher synthesizes scenes with temporal consistency and realistic motion.',
                },
                {
                  step: '04',
                  title: 'Edit in studio',
                  desc: 'Trim clips, reorder tracks, add animated subtitles, color grade, and mix soundtrack audio.',
                },
                {
                  step: '05',
                  title: 'Export & publish',
                  desc: 'Download pristine 1080p or 4K master files formatted for YouTube, TikTok, and Instagram.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl glass-panel border border-white/[0.08] relative group hover:border-violet-500/40 transition-all"
                >
                  <span className="text-3xl font-black text-violet-500/30 group-hover:text-violet-400 transition-colors">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. FEATURE SHOWCASE */}
        {/* ========================================================================= */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-sky-400 font-semibold mb-3">
              Comprehensive AI Toolkit
            </h2>
            <p className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              One unified creative workspace for all your media
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Video,
                title: 'Text-to-Video',
                desc: 'Cinematic physics-aware motion synthesis from plain English prompts.',
                link: '/ai-video-generator',
                color: 'text-violet-400 bg-violet-600/20',
              },
              {
                icon: ImageIcon,
                title: 'Image-to-Video',
                desc: 'Bring static product shots and character illustrations to life with camera panning and dynamic angles.',
                link: '/ai-video-generator',
                color: 'text-sky-400 bg-sky-600/20',
              },
              {
                icon: FileText,
                title: 'Script-to-Video',
                desc: 'Transform raw scripts or article URLs into full storyboards with synchronized AI voiceovers.',
                link: '/create',
                color: 'text-indigo-400 bg-indigo-600/20',
              },
              {
                icon: Wand2,
                title: 'AI Commercials & Ads',
                desc: 'Generate high-CTR promotional advertisements tailored specifically for Meta, TikTok, and YouTube.',
                link: '/use-cases/marketing',
                color: 'text-pink-400 bg-pink-600/20',
              },
              {
                icon: Mic,
                title: 'Voiceovers & Subtitles',
                desc: 'Ultra-realistic neural voices in 29+ languages with auto-transcription and animated caption styling.',
                link: '/ai-voice-generator',
                color: 'text-amber-400 bg-amber-600/20',
              },
              {
                icon: Scissors,
                title: 'Full Video Editor',
                desc: 'Multi-track timeline, trim, split, overlays, background music ducking, and 4K exports.',
                link: '/dashboard',
                color: 'text-emerald-400 bg-emerald-600/20',
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <Link
                  key={i}
                  href={feat.link}
                  className="p-6 rounded-2xl glass-panel border border-white/[0.08] hover:border-violet-500/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-5`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-violet-400 group-hover:text-violet-300">
                    <span>Explore Workflow</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. TEMPLATE GALLERY PREVIEW */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-white/[0.06] bg-[#07080D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <h2 className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-2">
                  Ready-to-Use Templates
                </h2>
                <p className="text-3xl font-bold text-white tracking-tight">
                  Launch viral formats in seconds
                </p>
              </div>
              <Link
                href="/templates"
                className="mt-4 md:mt-0 text-sm font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                <span>View all 100+ templates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Viral Product Showcase Reel',
                  category: 'Instagram Reels (9:16)',
                  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
                  slug: 'instagram-reels-ecommerce',
                },
                {
                  title: 'Daily Tech Breakdown Short',
                  category: 'YouTube Shorts (9:16)',
                  image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
                  slug: 'youtube-shorts-tech',
                },
                {
                  title: 'Luxury Fragrance Cinematic Ad',
                  category: 'Commercials (16:9)',
                  image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
                  slug: 'cinematic-luxury-perfume',
                },
              ].map((tmpl, idx) => (
                <Link
                  key={idx}
                  href={`/templates/${tmpl.slug}`}
                  className="rounded-2xl glass-panel border border-white/[0.08] overflow-hidden group hover:border-violet-500/40 transition-all flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={tmpl.image}
                      alt={tmpl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-violet-300 bg-violet-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-violet-500/30">
                      {tmpl.category}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="font-bold text-white group-hover:text-violet-300 transition-colors">
                      {tmpl.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>Instant AI Remake</span>
                      <span className="text-violet-400 font-medium group-hover:underline">Use Template →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. PRICING PREVIEW */}
        {/* ========================================================================= */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">
              Transparent Credit-Based Pricing
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Pay in INR with complete flexibility
            </p>
            <p className="mt-4 text-slate-400 text-sm">
              No hidden fees. Full Razorpay INR integration. Unused credits rollover with active plans.
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
                features: ['1080p HD Exports', 'No Watermark', 'Runway & Vidai Core', '10 GB Cloud Storage'],
                cta: 'Upgrade to Starter',
                popular: false,
                href: '/pricing',
              },
              {
                name: 'Pro Creator',
                price: '₹2,499',
                period: 'per month',
                credits: '1,600 credits / month',
                features: ['4K Ultra HD Exports', 'Runway Gen-3 & Luma Ray', 'Priority Queue', '50 GB Cloud Storage'],
                cta: 'Get Pro Creator',
                popular: true,
                href: '/pricing',
              },
              {
                name: 'Studio Agency',
                price: '₹6,999',
                period: 'per month',
                credits: '5,000 credits / month',
                features: ['Full Multi-Model Access', 'Dedicated Rendering Cluster', '250 GB Storage', 'Multiple Brand Kits'],
                cta: 'Get Studio Agency',
                popular: false,
                href: '/pricing',
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl glass-panel border flex flex-col justify-between relative ${
                  plan.popular ? 'border-violet-500 shadow-xl shadow-violet-600/20' : 'border-white/[0.08]'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400">/{plan.period}</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-violet-400 bg-violet-950/60 p-2 rounded-lg border border-violet-800/40">
                    {plan.credits}
                  </div>

                  <ul className="mt-6 space-y-3 text-xs text-slate-300">
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
                  className={`mt-8 w-full py-2.5 rounded-xl text-center text-sm font-semibold transition-all ${
                    plan.popular
                      ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30'
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
        {/* 6. FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-white/[0.06] bg-[#07080C]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-2">FAQ</h2>
              <p className="text-3xl font-bold text-white">Frequently Asked Questions</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'What makes Vercel Vidai different from standard video generators?',
                  a: 'Vercel Vidai combines a multi-model AI dispatcher (Vidai Core, Runway Gen-3, Luma Ray, Flux 1.1 Pro) with a real multi-track timeline video editor in one seamless workflow. You can generate, re-order, trim, add subtitles, and grade colors without hopping between multiple tools.',
                },
                {
                  q: 'How do generation credits work?',
                  a: 'Every generation reserves credits atomically based on the chosen model and duration. Standard 5-second Vidai HD renders take 25 credits. If a generation fails for any reason, credits are immediately and automatically refunded to your ledger.',
                },
                {
                  q: 'Can I pay using Indian Payment Methods (UPI, Netbanking, Cards)?',
                  a: 'Yes! Vercel Vidai supports direct INR billing through official Razorpay checkout, allowing UPI, credit cards, debit cards, and corporate netbanking.',
                },
                {
                  q: 'What happens if external AI providers have outages or credentials are missing?',
                  a: 'Vercel Vidai features a reliable Demo Mode architecture with clear UI badging. When external API keys are not supplied, the platform honestly indicates Demo Mode rather than presenting false generation claims.',
                },
                {
                  q: 'Do I own the commercial rights to videos created on Vercel Vidai?',
                  a: 'Yes! All content generated on paid plans carries full commercial usage rights for marketing, advertising, YouTube monetization, and client deliverables.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl glass-panel border border-white/[0.08]">
                  <h3 className="font-semibold text-white text-base flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>{item.q}</span>
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-400 pl-6 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. FINAL CALL TO ACTION */}
        {/* ========================================================================= */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to create your next viral masterpiece?
            </h2>
            <p className="mt-4 text-lg text-slate-300 max-w-xl mx-auto">
              Join thousands of creators, agencies, and brands producing high-impact videos in minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-violet-600/30 text-base"
              >
                <span>Get Started with 100 Free Credits</span>
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
