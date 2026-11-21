'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Languages,
  Clock,
  Compass,
  FileCheck2,
  ChevronRight,
  Flame,
  CheckCircle2,
  Lightbulb,
  X,
  Loader2,
} from 'lucide-react';
import { PURANIC_STORY_PRESETS } from '@/lib/mythology/constants';
import { PuranicStoryPreset, MythologyCulture, MythologyTone, MythologyLanguage } from '@/lib/mythology/types';

interface Step1StoryProps {
  storyConcept: string;
  sourceNote: string;
  culture: MythologyCulture;
  language: MythologyLanguage;
  targetDurationSec: 15 | 30 | 45 | 60;
  tone: MythologyTone;
  onChange: (fields: Partial<{
    storyConcept: string;
    sourceNote: string;
    culture: MythologyCulture;
    language: MythologyLanguage;
    targetDurationSec: 15 | 30 | 45 | 60;
    tone: MythologyTone;
  }>) => void;
  onNext: () => void;
}

export function Step1Story({
  storyConcept,
  sourceNote,
  culture,
  language,
  targetDurationSec,
  tone,
  onChange,
  onNext,
}: Step1StoryProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isIdeasModalOpen, setIsIdeasModalOpen] = useState(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [viralIdeas, setViralIdeas] = useState<Array<{ title: string; hook: string; source: string; summary: string }>>([]);

  const handleSelectPreset = (preset: PuranicStoryPreset) => {
    setSelectedPresetId(preset.id);
    onChange({
      storyConcept: language === 'hi' ? `${preset.titleHindi}: ${preset.summary}` : `${preset.title}: ${preset.summary}`,
      sourceNote: preset.source,
      culture: preset.culture,
      tone: preset.defaultTone,
    });
  };

  const fetchViralIdeas = async () => {
    setIsIdeasModalOpen(true);
    setIsGeneratingIdeas(true);
    try {
      const res = await fetch('/api/mythology/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ culture, tone, language, topic: storyConcept.slice(0, 50) }),
      });
      const data = await res.json();
      if (data.ideas && data.ideas.length > 0) {
        setViralIdeas(data.ideas);
      }
    } catch (err) {
      console.error('Failed to fetch viral ideas:', err);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleSelectIdea = (idea: { title: string; hook: string; source: string; summary: string }) => {
    onChange({
      storyConcept: `${idea.title}. ${idea.summary}`,
      sourceNote: idea.source,
    });
    setIsIdeasModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent p-6 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Step 1: Choose Your Sacred Story
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            What mythology legend will you bring to life?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Type your own custom mythology concept or pick an epic from the Ramayana, Mahabharata, Puranas, or world legends.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchViralIdeas}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Lightbulb className="w-4 h-4" />
          <span>10 Viral Ideas</span>
        </button>
      </div>

      {/* Main Story Concept Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            Story Concept or Prompt <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-slate-500">{storyConcept.length} / 1,000 chars</span>
        </div>
        <textarea
          rows={4}
          value={storyConcept}
          onChange={(e) => onChange({ storyConcept: e.target.value })}
          placeholder="e.g. Lord Hanuman flying over the storming ocean with the glowing Sanjeevani mountain on his palm to heal Lakshmana..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm leading-relaxed"
        />
      </div>

      {/* Source Note & Attribution Field */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-indigo-500" />
          Named Tradition & Scripture Source Note
          <span className="text-xs font-normal text-slate-500">(Maintains cultural fidelity)</span>
        </label>
        <input
          type="text"
          value={sourceNote}
          onChange={(e) => onChange({ sourceNote: e.target.value })}
          placeholder="e.g. Valmiki Ramayana, Yuddha Kanda, Sarga 74 (Gita Press Edition)"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Puranic Story Presets Carousel / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            1-Click Popular Epic Presets
          </h3>
          <span className="text-xs text-slate-500">Pick to auto-populate script & characters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PURANIC_STORY_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 shadow-md ring-1 ring-amber-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/50'
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-amber-500 absolute top-3 right-3" />
                )}
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {preset.source}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {language === 'hi' ? preset.titleHindi : preset.title}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {preset.summary}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Options Row: Language, Duration, Tone */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Language */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-amber-500" />
            Video Narration Language
          </label>
          <select
            value={language}
            onChange={(e) => onChange({ language: e.target.value as MythologyLanguage })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="hi">हिंदी (Pure Hindi Devanagari)</option>
            <option value="en">English (Cinematic English)</option>
            <option value="hi-en">Hinglish (Viral Social Format)</option>
          </select>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Target Video Length
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {([15, 30, 45, 60] as const).map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => onChange({ targetDurationSec: dur })}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  targetDurationSec === dur
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            Storytelling Tone
          </label>
          <select
            value={tone}
            onChange={(e) => onChange({ tone: e.target.value as MythologyTone })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="devotional">Devotional & Sacred (भक्तिमय)</option>
            <option value="epic">Epic & Heroic (भव्य महाकाव्य)</option>
            <option value="kids_moral">Kids & Moral Tale (पंचतंत्र/बोधकथा)</option>
            <option value="educational">Educational & Historical (ज्ञानवर्धक)</option>
            <option value="dark_fantasy">Dark Fantasy Mythos (गहन व रहस्यमयी)</option>
          </select>
        </div>
      </div>

      {/* 10 Viral Ideas Modal */}
      {isIdeasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-amber-500/30">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-amber-500/5">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  10 Viral Mythology Hooks for Reels & Shorts
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsIdeasModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
              {isGeneratingIdeas ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                  <p className="text-sm font-medium">Summoning viral mythology ideas...</p>
                </div>
              ) : (
                viralIdeas.map((idea, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/60 bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-500/5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        {idea.source}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {idea.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium italic">
                        &quot;{idea.hook}&quot;
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectIdea(idea)}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      Use This Idea
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 1 Actions */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!storyConcept || storyConcept.trim().length < 5}
          className="px-6 py-3 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to Script Engine</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
