'use client';

import React, { useState } from 'react';
import {
  Mic,
  Volume2,
  Music,
  Play,
  Pause,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Sliders,
  CheckCircle2,
  Loader2,
  Upload,
} from 'lucide-react';
import { MYTH_VOICES, MYTH_BGM_TRACKS } from '@/lib/mythology/constants';
import { MythScene, MythAudioTrack } from '@/lib/mythology/types';

interface Step5VoiceProps {
  voiceId: string;
  bgmMoodId: string;
  scenes: MythScene[];
  audioTrack?: MythAudioTrack;
  onChangeVoice: (voiceId: string) => void;
  onChangeBgm: (bgmId: string) => void;
  onUpdateAudioTrack: (track: MythAudioTrack) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step5Voice({
  voiceId,
  bgmMoodId,
  scenes,
  audioTrack,
  onChangeVoice,
  onChangeBgm,
  onUpdateAudioTrack,
  onNext,
  onPrev,
}: Step5VoiceProps) {
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [bgmVolume, setBgmVolume] = useState(20); // 20% ducking

  const fullNarrationText = scenes.map((s) => s.narration).filter(Boolean).join(' ');

  const handleGenerateVoice = async () => {
    if (!fullNarrationText) {
      alert('No narration text found in scenes.');
      return;
    }

    setIsGeneratingVoice(true);
    try {
      const res = await fetch('/api/mythology/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: fullNarrationText,
          voiceId,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to synthesize voice');
      }

      onUpdateAudioTrack({
        audioUrl: data.audioUrl,
        durationSec: data.durationSec,
        voiceId: data.voiceId,
        timestamps: data.timestamps || [],
      });
    } catch (err: any) {
      alert(`Voice synthesis error: ${err.message}`);
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const togglePlayAudio = (url: string) => {
    if (playingPreview === url) {
      setPlayingPreview(null);
    } else {
      setPlayingPreview(url);
      const audio = new Audio(url);
      audio.play().catch(() => {});
      audio.onended = () => setPlayingPreview(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent p-5 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Mic className="w-3.5 h-3.5" />
            Step 5: Voiceover, Timestamps & Sacred Music
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Add divine voiceover & licensed background score
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Word-level timestamps lock captions and scene transitions tightly to spoken words.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateVoice}
          disabled={isGeneratingVoice || !fullNarrationText}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isGeneratingVoice ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Synthesizing Voice...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{audioTrack ? 'Regenerate Voice' : 'Synthesize Voiceover'}</span>
            </>
          )}
        </button>
      </div>

      {/* Voiceover Status Card */}
      {audioTrack && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                Synchronized Neural Voiceover Ready
              </span>
              <span className="text-[11px] text-slate-500">
                Duration: {audioTrack.durationSec}s • {audioTrack.timestamps?.length || 0} words timestamped
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => togglePlayAudio(audioTrack.audioUrl)}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            {playingPreview === audioTrack.audioUrl ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>Preview Audio</span>
          </button>
        </div>
      )}

      {/* Multilingual Voice Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Mic className="w-4 h-4 text-amber-500" />
          Select Neural Narrator
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MYTH_VOICES.map((v) => {
            const isSelected = voiceId === v.id;
            return (
              <div
                key={v.id}
                onClick={() => onChangeVoice(v.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/5 ring-2 ring-amber-500 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {v.name}
                    </span>
                    {v.badge && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full">
                        {v.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                    {v.language} • {v.gender}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {v.style}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayAudio(v.sampleUrl);
                    }}
                    className="p-1.5 rounded-lg border text-slate-600 hover:text-amber-500 flex items-center gap-1 text-[11px] font-bold"
                  >
                    {playingPreview === v.sampleUrl ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                    <span>Voice Sample</span>
                  </button>

                  {isSelected && (
                    <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Licensed Background Music & Volume Ducking */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-indigo-500" />
              Licensed Background Music
            </h3>
            <p className="text-xs text-slate-500">
              Automatic speech volume ducking lowers music volume during spoken dialogue.
            </p>
          </div>

          {/* Ducking Slider */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Ducking: {bgmVolume}%
            </span>
            <input
              type="range"
              min="5"
              max="50"
              value={bgmVolume}
              onChange={(e) => setBgmVolume(Number(e.target.value))}
              className="w-20 accent-indigo-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MYTH_BGM_TRACKS.map((track) => {
            const isSelected = bgmMoodId === track.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => onChangeBgm(track.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {track.name}
                </div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                  {track.mood}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to Timeline & Captions</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
