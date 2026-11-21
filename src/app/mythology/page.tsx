'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Palette,
  Mic,
  Subtitles,
  Download,
  Languages,
  Shield,
  Coins,
  ChevronDown,
  Star,
  Film,
  Zap,
} from 'lucide-react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { MYTH_ART_STYLES, PURANIC_STORY_PRESETS } from '@/lib/mythology/constants';
import { MythologyPlayerModal } from '@/components/mythology/MythologyPlayerModal';
import { CULTURAL_DISCLAIMER_TEXT, CULTURAL_DISCLAIMER_HINDI } from '@/lib/mythology/moderation';

export default function MythologyLandingPage() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [activePlayerVideo, setActivePlayerVideo] = useState<{
    isOpen: boolean;
    title: string;
    videoUrl: string;
    source?: string;
  }>({
    isOpen: false,
    title: '',
    videoUrl: '',
  });

  const isHindi = lang === 'hi';

  const SAMPLE_REELS = [
    {
      id: 'reel_1',
      title: isHindi ? 'हनुमान जी और संजीवनी पर्वत' : 'Hanuman Leaps for Sanjeevani',
      source: 'Valmiki Ramayana, Yuddha Kanda',
      style: 'Classical Oil Realism',
      posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      videoUrl: '/demos/vidai-astronaut-spacewalk.mp4',
      badge: 'Trending #1',
    },
    {
      id: 'reel_2',
      title: isHindi ? 'कुरुक्षेत्र: श्रीकृष्ण का विराट स्वरूप' : 'Krishna Unveils the Cosmic Viswaroopa',
      source: 'Mahabharata, Bhishma Parva',
      style: 'Cinematic Epic 8K',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      videoUrl: '/demos/vidai-cyberpunk-superbike.mp4',
      badge: 'Most Shared',
    },
    {
      id: 'reel_3',
      title: isHindi ? 'भगवान नृसिंह का खंभे से प्राकट्य' : 'Lord Narasimha Shatters the Pillar',
      source: 'Srimad Bhagavata Purana',
      style: 'Tanjore Gold Leaf',
      posterUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
      videoUrl: '/demos/vidai-jungle-expedition.mp4',
      badge: 'Viral Hook',
    },
    {
      id: 'reel_4',
      title: isHindi ? 'भगवान शिव का आनंद तांडव' : 'Shiva’s Cosmic Tandava Dance',
      source: 'Shiva Purana',
      style: 'Dark Fantasy Mythos',
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      videoUrl: '/demos/vidai-snow-avalanche.mp4',
      badge: 'Staff Pick',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      <Header />

      {/* Language Switcher Float */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHindi ? 'फ्लुविया माइथोस — पौराणिक वीडियो स्टूडियो' : 'Introducing Fluvia Mythos Studio for Creators & Bhakti Channels'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                lang === 'en' ? 'bg-amber-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-black'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                lang === 'hi' ? 'bg-amber-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-black'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-amber-600/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{isHindi ? 'एआई पौराणिक वीडियो क्रिएटर' : 'AI Mythology Video Creator'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            {isHindi ? (
              <>
                रामायण व महाभारत की कथाओं से बनाएं{' '}
                <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 bg-clip-text text-transparent">
                  वायरल रील्स व शॉर्ट्स
                </span>
              </>
            ) : (
              <>
                Turn Sacred Mythology into{' '}
                <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 bg-clip-text text-transparent">
                  Viral Vertical Videos
                </span>{' '}
                in Minutes
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isHindi
              ? 'शास्त्रीय भारतीय चित्रकला (राजा रवि वर्मा व तंजौर शैली), हिंदी में दिव्य वाणी, और देवनागरी में स्वतः सिंक किए गए आकर्षक कैप्शन।'
              : 'Prompt to structured script, authentic Raja Ravi Varma & Tanjore art styles, resonant Hindi voiceover, and word-by-word Devanagari captions ready for Reels & Shorts.'}
          </p>

          {/* Hero CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/mythology/studio"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
            >
              <span>{isHindi ? 'मुफ्त में वीडियो बनाएं' : 'Create Mythology Video Free'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/mythology/pricing"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-base transition-colors flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{isHindi ? 'प्लान्स व मूल्य' : 'View Mythos Plans'}</span>
            </Link>
          </div>

          {/* Feature Highlights Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {isHindi ? 'हिंदी व अंग्रेजी वाणी' : 'Hindi & English Narration'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {isHindi ? '7 शास्त्रीय कला शैलियाँ' : '7 Authentic Art Styles'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {isHindi ? '1080p वॉटरमार्क-फ्री' : '1080p HD Watermark-Free'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {isHindi ? '18% जीएसटी इनपुट क्रेडिट' : '18% GST Input Credit'}
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Sample Showcase (4 Viral Reels) */}
      <section className="py-12 bg-slate-50/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                {isHindi ? 'लाइव वीडियो उदाहरण' : 'Real Studio Outputs'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {isHindi ? 'देखें कैसी बनती हैं पौराणिक वीडियो रील्स' : 'Watch Viral Reels Created on Fluvia Mythos'}
              </h2>
            </div>

            <Link
              href="/mythology/studio"
              className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>{isHindi ? 'स्टूडियो में खुद बनाएं' : 'Make one yourself in Studio'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {SAMPLE_REELS.map((reel) => (
              <div
                key={reel.id}
                onClick={() =>
                  setActivePlayerVideo({
                    isOpen: true,
                    title: reel.title,
                    videoUrl: reel.videoUrl,
                    source: reel.source,
                  })
                }
                className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-900 shadow-lg cursor-pointer border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all hover:scale-[1.02]"
              >
                <img
                  src={reel.posterUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                  {reel.badge}
                </span>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-4 inset-x-4 text-white space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                    {reel.style}
                  </span>
                  <h3 className="text-sm font-bold leading-snug line-clamp-2">
                    {reel.title}
                  </h3>
                  <span className="text-[11px] text-slate-300 block line-clamp-1">
                    {reel.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 Art Styles Interactive Showcase */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {isHindi ? 'विशिष्ट कला शैलियाँ' : 'Artistic Heritage'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {isHindi ? '7 प्रामाणिक पौराणिक चित्रकला शैलियाँ' : '7 Curated Sacred Art Styles'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isHindi
                ? 'प्रत्येक शैली को प्राचीन शास्त्रों और ऐतिहासिक भारतीय चित्रकला परंपराओं के आधार पर विशेष रूप से तैयार किया गया है।'
                : 'Each style is calibrated with battle-tested prompt engineering and negative filters to reflect authentic sacred traditions.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MYTH_ART_STYLES.map((style) => (
              <div
                key={style.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-amber-500/50 transition-all"
              >
                <div className="h-40 w-full overflow-hidden relative">
                  <img
                    src={style.previewImage}
                    alt={style.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {style.badge && (
                    <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                      {style.badge}
                    </span>
                  )}
                  <span className="absolute bottom-2 left-3 text-[11px] font-bold text-white/90">
                    {style.era}
                  </span>
                </div>

                <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {style.name}
                    </h3>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                      {style.nameHindi}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>
                  </div>

                  <Link
                    href={`/mythology/studio?style=${style.id}`}
                    className="pt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{isHindi ? 'इस शैली में बनाएं' : 'Use this art style'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Step Creation Workflow */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {isHindi ? 'कार्यप्रणाली' : 'Studio Engine'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {isHindi ? 'कथा से संपूर्ण वीडियो: 7 सरल चरण' : 'From Story Idea to Viral Reel in 7 Steps'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: isHindi ? 'कथा चयन व वायरल विचार' : 'Story Selection & Viral Ideas',
                desc: isHindi
                  ? 'रामायण, महाभारत या पुराणों से प्रसंग चुनें अथवा एआई से 10 वायरल हुक विचार प्राप्त करें।'
                  : 'Pick from our Puranic library or let the AI suggest 10 high-curiosity viral hooks.',
                icon: BookOpen,
              },
              {
                step: '02',
                title: isHindi ? 'संरचित पटकथा निर्माण' : 'Structured Scene Scripting',
                desc: isHindi
                  ? 'प्रत्येक दृश्य का 3-सेकंड हुक स्कोर, वाणी, ऑन-स्क्रीन टेक्स्ट व कैमरा मूवमेंट तय करें।'
                  : 'Generates narration, bold captions, camera directions and sound effect cues per scene.',
                icon: Film,
              },
              {
                step: '03',
                title: isHindi ? 'पात्र और कला शैली (Character Bible)' : 'Character Bible & Art Style',
                desc: isHindi
                  ? 'पात्रों के वस्त्र, अस्त्र, वाहन व रंग तय करें ताकि सभी दृश्यों में एकरूपता बनी रहे।'
                  : 'Lock character appearance, divine weapons, and attire consistently across all scenes.',
                icon: Palette,
              },
              {
                step: '04',
                title: isHindi ? 'भव्य दृश्य एवं पैरालैक्स' : 'Scene Imagery & Parallax Motion',
                desc: isHindi
                  ? 'उच्च-रिज़ॉल्यूशन छवियां बनाएं, दीया स्पार्क्स व पवित्र धुंध के साथ जीवंत बनाएं।'
                  : 'Renders 9:16 vertical art with Ken Burns motion, diya sparks, and sacred temple mist.',
                icon: Sparkles,
              },
              {
                step: '05',
                title: isHindi ? 'दिव्य वाणी व पृष्ठभूमि संगीत' : 'Neural Voice & Sacred Score',
                desc: isHindi
                  ? 'एकादश लैब्स (ElevenLabs) की हिंदी/अंग्रेजी वाणी और लाइसेंस प्राप्त भक्ति संगीत।'
                  : 'ElevenLabs neural Hindi/English narration with licensed devotional flute & war drums.',
                icon: Mic,
              },
              {
                step: '06',
                title: isHindi ? 'देवनागरी सिंक कैप्शन' : 'Devanagari Karaoke Captions',
                desc: isHindi
                  ? 'शब्द-दर-शब्द सिंक कैप्शन, ताकि संस्कृत व हिंदी की मात्राएं कभी गलत न टूटें।'
                  : 'Word-by-word highlighted captions in Noto Sans Devanagari with zero broken matras.',
                icon: Subtitles,
              },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-sm">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-xl font-black text-slate-300 dark:text-slate-700 font-mono">
                      {st.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview Banner */}
      <section className="py-16 sm:py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            {isHindi ? 'सरल व पारदर्शी मूल्य' : 'Simple Pricing'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {isHindi ? 'फ्लुविया माइथोस प्लान्स' : 'Fluvia Mythos Creator Plans'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {isHindi
              ? 'मुफ्त परीक्षण से शुरुआत करें अथवा क्रिएटर प्लान लेकर 1080p वॉटरमार्क-मुक्त वीडियो बनाएं।'
              : 'Start free with 1 watermarked trial video, or upgrade to Mythos Creator at ₹799/month for watermark-free 1080p Full HD exports.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/mythology/pricing"
              className="px-8 py-3.5 rounded-2xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-black text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2"
            >
              <span>{isHindi ? 'सभी प्लान्स व फीचर्स देखें' : 'Compare Plans & Pricing'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/mythology/studio"
              className="px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span>{isHindi ? 'मुफ्त स्टूडियो खोलें' : 'Open Free Studio'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Cultural Respect Pledge */}
      <section className="py-12 bg-amber-500/5 border-t border-amber-500/20 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>{isHindi ? 'सांस्कृतिक मर्यादा व सम्मान का संकल्प' : 'Cultural Respect & Sacred Integrity Pledge'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isHindi ? CULTURAL_DISCLAIMER_HINDI : CULTURAL_DISCLAIMER_TEXT}
          </p>
        </div>
      </section>

      {/* Video Modal */}
      <MythologyPlayerModal
        isOpen={activePlayerVideo.isOpen}
        onClose={() => setActivePlayerVideo({ ...activePlayerVideo, isOpen: false })}
        title={activePlayerVideo.title}
        videoUrl={activePlayerVideo.videoUrl}
        source={activePlayerVideo.source}
      />

      <Footer />
    </div>
  );
}
