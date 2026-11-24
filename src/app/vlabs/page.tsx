import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ThreeAudioVisualizer } from '@/components/vlabs/ThreeAudioVisualizer';
import { VoiceDemoPlayer } from '@/components/vlabs/VoiceDemoPlayer';
import {
  Mic,
  Video,
  Copy,
  Wand2,
  Globe,
  BookOpen,
  FileAudio,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Headphones,
  Sliders,
  Layers,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Fluvia vLabs – AI Voiceover, Voice Cloning & Video Dubbing Studio',
  description:
    'Create natural AI voiceovers, clone authorized voices, dub videos and generate multilingual speech with Fluvia vLabs. Explore professional AI audio production.',
  keywords: [
    'AI voiceover generator',
    'AI voice generator',
    'Hindi AI voice generator',
    'AI video dubbing',
    'AI voice cloning',
    'Text to speech online',
    'Multilingual voiceover',
    'AI audiobook generator',
    'Professional voiceover software',
    'Fluvia vLabs',
  ],
  alternates: {
    canonical: 'https://fluviaflow.online/vlabs',
  },
  openGraph: {
    title: 'Fluvia vLabs – AI Voiceover, Voice Cloning & Video Dubbing Studio',
    description:
      'Create natural AI voiceovers, clone authorized voices, dub videos and generate multilingual speech with Fluvia vLabs. Explore professional AI audio production.',
    url: 'https://fluviaflow.online/vlabs',
    siteName: 'Fluvia Flow',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fluvia vLabs – AI Voiceover, Voice Cloning & Video Dubbing Studio',
    description:
      'Create natural AI voiceovers, clone authorized voices, dub videos and generate multilingual speech with Fluvia vLabs.',
  },
};

export default function VlabsLandingPage() {
  const supportedLanguages = [
    { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { name: 'English', native: 'English (Indian / US / UK)', flag: '🌐' },
    { name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
    { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
    { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
    { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { name: 'French', native: 'Français', flag: '🇫🇷' },
    { name: 'German', native: 'Deutsch', flag: '🇩🇪' },
    { name: 'Arabic', native: 'العربية', flag: '🇦🇪' },
    { name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  ];

  const features = [
    {
      title: 'A. AI Text to Speech',
      description:
        'Transform written scripts into expressive, human-quality audio with customizable pitch, speed, emotional cadence, and multi-model routing.',
      icon: Mic,
      color: 'emerald',
      cta: 'Open TTS Studio',
      href: '/vlabs/voiceover',
    },
    {
      title: 'B. AI Video Dubbing',
      description:
        'Automatically translate video dialogue into 15+ languages with multi-speaker detection, timeline speech synchronization, and SRT subtitle export.',
      icon: Video,
      color: 'teal',
      cta: 'Start Dubbing',
      href: '/vlabs/dubbing',
    },
    {
      title: 'C. Instant Voice Cloning',
      description:
        'Clone authorized voices with strict consent safeguards. Upload reference audio or record via microphone for instant personal speech synthesis.',
      icon: Copy,
      color: 'cyan',
      cta: 'Clone a Voice',
      href: '/vlabs/voice-cloning',
    },
    {
      title: 'D. AI Voice Design',
      description:
        'Describe any voice in natural language—tone, age, timbre, and accent. Our neural engine creates a custom voice persona tailored to your vision.',
      icon: Wand2,
      color: 'pink',
      cta: 'Design a Voice',
      href: '/vlabs/voice-design',
    },
    {
      title: 'E. Multilingual Narration',
      description:
        'Produce native-sounding narrations across Indian regional and international languages without robotic accents or unnatural pauses.',
      icon: Globe,
      color: 'emerald',
      cta: 'Explore Accents',
      href: '/vlabs/voices',
    },
    {
      title: 'F. Audiobook Generation',
      description:
        'Long-form audio synthesis with chapter management, natural paragraph pacing, character assignment, and lossless WAV mastering.',
      icon: BookOpen,
      color: 'teal',
      cta: 'Build Audiobooks',
      href: '/vlabs/studio',
    },
    {
      title: 'G. Speech Transcription',
      description:
        'High-accuracy audio and video speech-to-text with automatic punctuation, speaker diarization, and timestamped SRT/VTT exports.',
      icon: FileAudio,
      color: 'cyan',
      cta: 'Transcribe Media',
      href: '/vlabs/studio',
    },
    {
      title: 'H. Multi-Speaker Voice Production',
      description:
        'Assign distinct voices to conversations, interviews, dramas, and mythological series with automated timeline balance and mastering.',
      icon: Users,
      color: 'pink',
      cta: 'Multi-Speaker Studio',
      href: '/vlabs/studio',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Select Your Voice',
      desc: 'Choose from 8+ specialized voice categories, cloned profiles, or design a custom vocal persona.',
    },
    {
      num: '02',
      title: 'Enter Text or Upload Media',
      desc: 'Paste your script, document, or upload a video file for translation and dubbing.',
    },
    {
      num: '03',
      title: 'Customize Voice & Language',
      desc: 'Fine-tune emotion, speaking speed, pitch, stability, and target language with real-time preview.',
    },
    {
      num: '04',
      title: 'Generate & Download',
      desc: 'Render studio-grade WAV/MP3 audio or dubbed video with full commercial monetization rights.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070A0F] text-white selection:bg-emerald-400 selection:text-black">
      {/* Background Animated Neon Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-1/6 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-rose-500/10 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <Header />

      <main className="flex-1 relative z-10">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Copy & CTAs */}
              <div className="lg:col-span-7 text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-black tracking-wider uppercase shadow-lg shadow-emerald-950/50">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
                  <span>FLUVIA vLABS STUDIO</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
                  Give Every Word <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-rose-400">
                    a Studio Voice.
                  </span>
                </h1>

                <p className="text-base sm:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl">
                  Generate lifelike AI voiceovers, clone authorized voices, translate videos and create studio-quality dubbing in minutes with Fluvia vLabs.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                  <Link
                    href="/vlabs/studio"
                    className="px-8 py-4 rounded-xl text-sm sm:text-base font-black text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Explore vLabs Studio</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <a
                    href="#samples"
                    className="px-8 py-4 rounded-xl text-sm sm:text-base font-bold text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Headphones className="w-4 h-4 text-emerald-400" />
                    <span>Listen to Voice Samples</span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-400 font-medium flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>15+ Indian & Global Languages</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Strict Consent Safeguards</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Commercial Monetization Rights</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive 3D Audio Visualizer */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <ThreeAudioVisualizer className="w-full max-w-[500px]" isPlaying={true} />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* VOICE DEMONSTRATION SECTION */}
        {/* ========================================================================= */}
        <section id="samples" className="py-20 bg-[#080D14] border-b border-slate-800/80 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
              INTERACTIVE DEMONSTRATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
              Hear The Studio Difference
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mt-2 font-medium">
              Real interactive voice samples rendered with genuine human intonation and emotion across genres.
            </p>

            <VoiceDemoPlayer />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FEATURE SHOWCASE */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-teal-400 bg-teal-950/60 border border-teal-500/30 px-3 py-1 rounded-full">
              PRODUCTION CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
              The Complete AI Audio Suite
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 font-medium">
              Everything required to produce professional audiobooks, commercial ads, multilingual video dubbing, and custom branded voices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-3xl p-6 bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between group shadow-xl backdrop-blur-xl"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-black text-white tracking-tight mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <Link
                    href={feat.href}
                    className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-between group/link"
                  >
                    <span>{feat.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#080D14] border-t border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-950/60 border border-rose-500/30 px-3 py-1 rounded-full">
                SIMPLE WORKFLOW
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
                From Text to Broadcast in 4 Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((st) => (
                <div
                  key={st.num}
                  className="rounded-3xl p-6 bg-slate-900/50 border border-slate-800/80 relative"
                >
                  <span className="text-3xl font-black font-mono text-emerald-400/40">
                    {st.num}
                  </span>
                  <h4 className="text-lg font-black text-white mt-2 mb-2">
                    {st.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SUPPORTED LANGUAGES SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
              GLOBAL REACH
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
              Supported Studio Languages
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 font-medium">
              Authentic accents and native phonetics across Indian regional and major world languages.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
            {supportedLanguages.map((lang) => (
              <div
                key={lang.name}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3 hover:border-emerald-500/40 transition-colors"
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="min-w-0">
                  <h5 className="text-xs font-black text-white truncate">{lang.name}</h5>
                  <p className="text-[11px] text-slate-400 truncate">{lang.native}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FINAL CALL TO ACTION */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-gradient-to-b from-[#080D14] to-[#040609] border-t border-slate-800 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              READY FOR PRODUCTION
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Your Next Voice Project <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-rose-400">
                Starts Here.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
              Join thousands of creators, media studios, and agencies generating studio-quality voiceovers and dubbing with Fluvia vLabs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/vlabs/studio"
                className="w-full sm:w-auto px-9 py-4 rounded-xl text-base font-black text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Fluvia vLabs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/pricing?tab=vlabs"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Licence Plans (From ₹1,799/mo)</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
