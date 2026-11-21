'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  FileText,
  Palette,
  Image as ImageIcon,
  Mic,
  Subtitles,
  Download,
  Save,
  CheckCircle2,
  Clock,
  Coins,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { Step1Story } from './steps/Step1Story';
import { Step2Script } from './steps/Step2Script';
import { Step3Characters } from './steps/Step3Characters';
import { Step4Visuals } from './steps/Step4Visuals';
import { Step5Voice } from './steps/Step5Voice';
import { Step6Timeline } from './steps/Step6Timeline';
import { Step7Export } from './steps/Step7Export';
import { MythProject, MythScene, MythCharacter, MythAudioTrack } from '@/lib/mythology/types';
import { calculateMythosProjectCredits } from '@/lib/mythology/mythosPlansConfig';
import { CULTURAL_DISCLAIMER_TEXT } from '@/lib/mythology/moderation';

const STEPS = [
  { step: 1, label: 'Story', icon: BookOpen },
  { step: 2, label: 'Script', icon: FileText },
  { step: 3, label: 'Characters & Style', icon: Palette },
  { step: 4, label: 'Visuals', icon: ImageIcon },
  { step: 5, label: 'Voice & Sound', icon: Mic },
  { step: 6, label: 'Timeline & Captions', icon: Subtitles },
  { step: 7, label: 'Export & Share', icon: Download },
];

interface StepperProps {
  initialProject?: MythProject;
}

export function MythologyStudioStepper({ initialProject }: StepperProps) {
  const [project, setProject] = useState<MythProject>(() => {
    if (initialProject) return initialProject;
    return {
      id: `myth_draft_${Date.now()}`,
      userId: 'guest_creator',
      workspaceId: 'ws_guest',
      title: 'Untold Story of Kurukshetra',
      storyConcept: 'The moment Lord Krishna revealed the cosmic Viswaroopa to Arjuna in the middle of Kurukshetra.',
      sourceNote: 'Mahabharata, Bhishma Parva, Chapter 11',
      culture: 'hindu_epic',
      language: 'hi',
      targetDurationSec: 30,
      tone: 'devotional',
      artStyleId: 'classical_oil_painting',
      voiceId: 'voice_devotional_hindi_m',
      bgmMoodId: 'bgm_vedic_flute',
      characterBible: [],
      scenes: [],
      status: 'draft',
      currentStep: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [currentStep, setCurrentStep] = useState<number>(project.currentStep || 1);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');

  // Auto-save draft whenever project changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setIsSaving(true);
        const res = await fetch('/api/mythology/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...project, currentStep }),
        });
        if (res.ok) {
          setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (err) {
        console.warn('Auto-save notice:', err);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [project, currentStep]);

  const updateProject = (updates: Partial<MythProject>) => {
    setProject((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
  };

  const estimatedCredits = calculateMythosProjectCredits({
    scenesCount: project.scenes.length || 5,
    hasVoiceover: Boolean(project.audioTrack),
    animatedHeroScenesCount: project.scenes.filter((s) => s.isHeroSceneAnimated).length,
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-slate-950 flex flex-col font-sans">
      {/* Top Studio Command Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand & Back to Studio Hub */}
        <div className="flex items-center gap-3">
          <Link
            href="/mythology"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Mythology Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Mythology Studio
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <input
                type="text"
                value={project.title}
                onChange={(e) => updateProject({ title: e.target.value })}
                className="text-sm font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 outline-none px-1"
                placeholder="Name your epic..."
              />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Auto-saved: {lastSavedTime}
              </span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                {project.language === 'hi' ? 'हिंदी (Hindi)' : project.language === 'hi-en' ? 'Hinglish' : 'English'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Credits counter & Cultural Respect Notice */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-bold">
            <Coins className="w-3.5 h-3.5" />
            <span>Estimated Cost: ~{estimatedCredits} cr</span>
          </div>

          <Link
            href="/mythology/dashboard"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            My Dashboard
          </Link>
        </div>
      </header>

      {/* Stepper Navigation Bar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 overflow-x-auto no-scrollbar">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 min-w-[700px]">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;

            return (
              <React.Fragment key={s.step}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(s.step)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                      : isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isActive
                        ? 'bg-white text-amber-600'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.step}
                  </span>
                  <span>{s.label}</span>
                </button>

                {idx < STEPS.length - 1 && (
                  <div className="w-6 h-[2px] bg-slate-200 dark:bg-slate-800 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentStep === 1 && (
          <Step1Story
            storyConcept={project.storyConcept}
            sourceNote={project.sourceNote || ''}
            culture={project.culture}
            language={project.language}
            targetDurationSec={project.targetDurationSec}
            tone={project.tone}
            onChange={(fields) => updateProject(fields)}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2Script
            scenes={project.scenes}
            hookStrengthScore={project.viralPack?.suggestedTitles ? 92 : 88}
            storyConcept={project.storyConcept}
            sourceNote={project.sourceNote}
            culture={project.culture}
            language={project.language}
            targetDurationSec={project.targetDurationSec}
            tone={project.tone}
            artStyleId={project.artStyleId}
            characterBible={project.characterBible}
            onUpdateScenes={(scenes) => updateProject({ scenes })}
            onNext={() => setCurrentStep(3)}
            onPrev={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3Characters
            artStyleId={project.artStyleId}
            characterBible={project.characterBible}
            onChangeStyle={(artStyleId) => updateProject({ artStyleId })}
            onUpdateCharacters={(characterBible) => updateProject({ characterBible })}
            onNext={() => setCurrentStep(4)}
            onPrev={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4Visuals
            scenes={project.scenes}
            artStyleId={project.artStyleId}
            characterBible={project.characterBible}
            onUpdateScenes={(scenes) => updateProject({ scenes })}
            onNext={() => setCurrentStep(5)}
            onPrev={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <Step5Voice
            voiceId={project.voiceId}
            bgmMoodId={project.bgmMoodId}
            scenes={project.scenes}
            audioTrack={project.audioTrack}
            onChangeVoice={(voiceId) => updateProject({ voiceId })}
            onChangeBgm={(bgmMoodId) => updateProject({ bgmMoodId })}
            onUpdateAudioTrack={(audioTrack) => updateProject({ audioTrack })}
            onNext={() => setCurrentStep(6)}
            onPrev={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 6 && (
          <Step6Timeline
            scenes={project.scenes}
            audioTrack={project.audioTrack}
            onNext={() => setCurrentStep(7)}
            onPrev={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 7 && (
          <Step7Export
            project={project}
            onPrev={() => setCurrentStep(6)}
            onRestart={() => setCurrentStep(1)}
          />
        )}

        {/* Cultural Respect Footer Disclaimer */}
        <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 max-w-2xl mx-auto flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{CULTURAL_DISCLAIMER_TEXT}</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
