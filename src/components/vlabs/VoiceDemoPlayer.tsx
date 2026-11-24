'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Share2,
  Download,
  Sliders,
} from 'lucide-react';

interface VoiceSample {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  language: string;
  gender: 'male' | 'female';
  duration: string;
  durationSec: number;
  sampleAudioUrl: string;
  waveformPeaks: number[];
  tagline: string;
}

const VOICE_SAMPLES: VoiceSample[] = [
  {
    id: 'voice_in_male_1',
    name: 'Aarav Sharma',
    category: 'indian_male',
    categoryLabel: 'Indian Male Narrator',
    language: 'Hindi & English (Indian)',
    gender: 'male',
    duration: '0:12',
    durationSec: 12,
    sampleAudioUrl: '/media/audio/samples/aarav-narrator.mp3',
    waveformPeaks: [18, 42, 68, 85, 92, 70, 50, 65, 88, 95, 78, 60, 45, 75, 90, 82, 60, 40, 55, 30],
    tagline: 'Deep, resonant, authoritative corporate tone for presentations and documentaries.',
  },
  {
    id: 'voice_in_fem_1',
    name: 'Ananya Iyer',
    category: 'indian_female',
    categoryLabel: 'Indian Female Conversational',
    language: 'Hindi & English (Indian)',
    gender: 'female',
    duration: '0:14',
    durationSec: 14,
    sampleAudioUrl: '/media/audio/samples/ananya-conversational.mp3',
    waveformPeaks: [25, 55, 75, 80, 65, 85, 90, 70, 60, 85, 95, 75, 50, 70, 85, 65, 45, 60, 35, 20],
    tagline: 'Natural, warm and conversational. Perfect for explainer videos and audiobooks.',
  },
  {
    id: 'voice_cine_male_1',
    name: 'Marcus Vance',
    category: 'cinematic',
    categoryLabel: 'Cinematic Deep Voice',
    language: 'English (US Cinematic)',
    gender: 'male',
    duration: '0:11',
    durationSec: 11,
    sampleAudioUrl: '/media/audio/samples/marcus-cinematic.mp3',
    waveformPeaks: [40, 70, 95, 100, 90, 85, 75, 92, 98, 85, 70, 88, 96, 75, 55, 40, 65, 45, 30, 15],
    tagline: 'Thunderous, epic Hollywood trailer voice with deep chest resonance.',
  },
  {
    id: 'voice_adv_fem_1',
    name: 'Zara Sterling',
    category: 'advertisement',
    categoryLabel: 'Energetic Female Ad',
    language: 'Global English',
    gender: 'female',
    duration: '0:10',
    durationSec: 10,
    sampleAudioUrl: '/media/audio/samples/zara-ad.mp3',
    waveformPeaks: [30, 65, 88, 92, 98, 75, 85, 90, 95, 80, 65, 85, 90, 70, 55, 40, 60, 45, 25, 15],
    tagline: 'High-energy, punchy commercial voice for TikTok reels, drops & video ads.',
  },
  {
    id: 'voice_hindi_story_1',
    name: 'Devdutt Shastri',
    category: 'hindi_story',
    categoryLabel: 'Hindi Storytelling',
    language: 'Hindi (Devanagari)',
    gender: 'male',
    duration: '0:13',
    durationSec: 13,
    sampleAudioUrl: '/media/audio/samples/devdutt-story.mp3',
    waveformPeaks: [20, 45, 70, 85, 90, 75, 60, 80, 88, 92, 70, 55, 75, 85, 65, 50, 40, 30, 20, 10],
    tagline: 'Traditional Indian mythological katha narrator with emotional depth and grace.',
  },
  {
    id: 'voice_en_prof_1',
    name: 'Elena Rostova',
    category: 'english_prof',
    categoryLabel: 'English Professional',
    language: 'English (Neutral British)',
    gender: 'female',
    duration: '0:12',
    durationSec: 12,
    sampleAudioUrl: '/media/audio/samples/elena-corporate.mp3',
    waveformPeaks: [22, 50, 72, 85, 80, 68, 75, 88, 82, 70, 65, 78, 85, 60, 48, 55, 38, 28, 18, 10],
    tagline: 'Crisp, articulate executive presenter for financial summaries & news.',
  },
  {
    id: 'voice_doc_male_1',
    name: 'Sir David Sterling',
    category: 'documentary',
    categoryLabel: 'Documentary Narrator',
    language: 'English (Prestigious British)',
    gender: 'male',
    duration: '0:15',
    durationSec: 15,
    sampleAudioUrl: '/media/audio/samples/david-doc.mp3',
    waveformPeaks: [15, 35, 60, 75, 85, 90, 70, 65, 80, 88, 72, 58, 70, 82, 60, 45, 35, 25, 15, 10],
    tagline: 'BBC-style nature and history narrator with scholarly gravitas.',
  },
  {
    id: 'voice_yt_creator_1',
    name: 'Kabir Tech',
    category: 'youtube_creator',
    categoryLabel: 'YouTube Creator Voice',
    language: 'Hinglish (Modern)',
    gender: 'male',
    duration: '0:11',
    durationSec: 11,
    sampleAudioUrl: '/media/audio/samples/kabir-yt.mp3',
    waveformPeaks: [35, 70, 90, 95, 85, 75, 88, 92, 80, 70, 85, 90, 75, 60, 50, 40, 55, 35, 20, 10],
    tagline: 'Fast-paced, high-engagement tech reviewer and podcast host delivery.',
  },
];

export function VoiceDemoPlayer() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio instance
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration && audio.duration > 0) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setPlaybackProgress(progress);
        setCurrentTimeSec(Math.floor(audio.currentTime));
      }
    };

    const handleEnded = () => {
      setPlayingId(null);
      setPlaybackProgress(0);
      setCurrentTimeSec(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleTogglePlay = (sample: VoiceSample) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playingId === sample.id) {
      audio.pause();
      setPlayingId(null);
    } else {
      audio.src = sample.sampleAudioUrl;
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.warn('Audio play error:', err.message);
      });
      setPlayingId(sample.id);
      setPlaybackProgress(0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>, sample: VoiceSample) => {
    const audio = audioRef.current;
    if (!audio || playingId !== sample.id) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    if (audio.duration) {
      audio.currentTime = ratio * audio.duration;
      setPlaybackProgress(ratio * 100);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (newVol === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const filteredSamples = activeCategory === 'all'
    ? VOICE_SAMPLES
    : VOICE_SAMPLES.filter((s) => s.category === activeCategory);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Category Pills Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          All 8 Voice Styles
        </button>
        {VOICE_SAMPLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveCategory(s.category)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === s.category
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {s.categoryLabel}
          </button>
        ))}
      </div>

      {/* Grid of Voice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredSamples.map((sample) => {
          const isCurrentlyPlaying = playingId === sample.id;

          return (
            <div
              key={sample.id}
              className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl ${
                isCurrentlyPlaying
                  ? 'bg-emerald-950/40 border-emerald-500/80 shadow-xl shadow-emerald-950/50 ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              {/* Header Info */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {sample.categoryLabel}
                  </span>
                  <span className="text-[11px] font-mono font-medium text-slate-400">
                    {sample.duration}
                  </span>
                </div>

                <h4 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>{sample.name}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    ({sample.gender === 'male' ? 'M' : 'F'})
                  </span>
                </h4>
                <p className="text-xs text-emerald-400/90 font-medium mt-0.5">
                  {sample.language}
                </p>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed min-h-[36px]">
                  {sample.tagline}
                </p>
              </div>

              {/* Waveform Scrubber & Playback Controls */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <div
                  onClick={(e) => handleSeek(e, sample)}
                  className="h-10 w-full flex items-center gap-1 cursor-pointer group py-1 relative"
                  title="Click to seek"
                >
                  {sample.waveformPeaks.map((peak, idx) => {
                    const barProgress = (idx / sample.waveformPeaks.length) * 100;
                    const isPlayed = isCurrentlyPlaying && playbackProgress >= barProgress;

                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all duration-150 ${
                          isPlayed
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                            : isCurrentlyPlaying
                            ? 'bg-emerald-800/60'
                            : 'bg-slate-700/60 group-hover:bg-slate-600'
                        }`}
                        style={{
                          height: `${Math.max(15, peak)}%`,
                          transform: isCurrentlyPlaying ? `scaleY(${1 + (Math.sin(idx + Date.now() / 200) * 0.15)})` : 'scaleY(1)',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Bottom Control Bar */}
                <div className="flex items-center justify-between gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => handleTogglePlay(sample)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95 shadow-md ${
                      isCurrentlyPlaying
                        ? 'bg-emerald-400 text-black shadow-emerald-400/30'
                        : 'bg-white text-black hover:bg-emerald-300'
                    }`}
                    aria-label={isCurrentlyPlaying ? 'Pause sample' : 'Play sample'}
                  >
                    {isCurrentlyPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Volume Slider */}
                    <div className="flex items-center gap-1.5 text-slate-400 hover:text-white">
                      <button
                        type="button"
                        onClick={() => handleVolumeChange(isMuted ? 0.85 : 0)}
                        className="p-1 cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-14 h-1 accent-emerald-400 bg-slate-800 rounded cursor-pointer"
                        title="Volume"
                      />
                    </div>

                    {/* Download Sample Button */}
                    <a
                      href={sample.sampleAudioUrl}
                      download={`${sample.name.toLowerCase().replace(/\s+/g, '-')}-sample.mp3`}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Download sample audio"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
