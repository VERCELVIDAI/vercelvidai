'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mic,
  Video,
  Copy,
  Wand2,
  Library,
  History,
  Settings,
  BookOpen,
  FileAudio,
  Play,
  Pause,
  Download,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sliders,
  ChevronDown,
  Layers,
  ArrowRight,
  Upload,
  RefreshCw,
  Search,
  Lock,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

export type StudioTool =
  | 'tts'
  | 'dubbing'
  | 'voice-cloning'
  | 'voice-design'
  | 'voices'
  | 'audiobooks'
  | 'transcription'
  | 'history'
  | 'settings';

interface VlabsStudioAppProps {
  initialTool?: StudioTool;
}

export function VlabsStudioApp({ initialTool = 'tts' }: VlabsStudioAppProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTool, setActiveTool] = useState<StudioTool>(initialTool);
  const [user, setUser] = useState<any>(null);
  const [licenceInfo, setLicenceInfo] = useState<any>(null);
  const [isLoadingLicence, setIsLoadingLicence] = useState(true);

  // Available Voices
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('voice_in_male_1');

  // Text-To-Speech Workspace State
  const [ttsText, setTtsText] = useState<string>(
    'Welcome to Fluvia vLabs. Create studio-grade AI voiceovers, clone authorized voices, and translate videos into 15+ languages with unprecedented realism.'
  );
  const [ttsLanguage, setTtsLanguage] = useState<string>('Hindi & English');
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(0);
  const [stability, setStability] = useState<number>(0.75);
  const [similarity, setSimilarity] = useState<number>(0.85);
  const [styleExaggeration, setStyleExaggeration] = useState<number>(0.2);
  const [outputFormat, setOutputFormat] = useState<'wav' | 'mp3'>('wav');
  const [selectedModel, setSelectedModel] = useState<string>('vlabs-neural-hd');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Bottom Audio Player State
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>('/media/audio/samples/aarav-narrator.mp3');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Voice Cloning Form State
  const [cloneName, setCloneName] = useState<string>('');
  const [cloneDesc, setCloneDesc] = useState<string>('');
  const [cloneGender, setCloneGender] = useState<'male' | 'female'>('male');
  const [cloneConsent, setCloneConsent] = useState<boolean>(false);
  const [isCloning, setIsCloning] = useState<boolean>(false);

  // Voice Design Form State
  const [designPrompt, setDesignPrompt] = useState<string>(
    'A deep, warm Indian male documentary narrator with confident, cinematic delivery.'
  );
  const [designGender, setDesignGender] = useState<'male' | 'female' | 'neutral'>('male');
  const [isDesigning, setIsDesigning] = useState<boolean>(false);
  const [designedVoiceResult, setDesignedVoiceResult] = useState<any>(null);

  // Video Dubbing State
  const [dubbingTitle, setDubbingTitle] = useState<string>('Marketing Campaign Video Dub');
  const [dubSourceLang, setDubSourceLang] = useState<string>('English');
  const [dubTargetLang, setDubTargetLang] = useState<string>('Hindi');
  const [dubPreserveBg, setDubPreserveBg] = useState<boolean>(true);
  const [isDubbing, setIsDubbing] = useState<boolean>(false);
  const [dubbingResult, setDubbingResult] = useState<any>(null);

  // History State
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  // Fetch initial auth & licence status
  useEffect(() => {
    fetch('/api/vlabs/licence/status')
      .then((res) => res.json())
      .then((data) => {
        setLicenceInfo(data);
      })
      .catch(() => {})
      .finally(() => setIsLoadingLicence(false));

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});

    // Fetch voices
    fetch('/api/vlabs/voices')
      .then((res) => res.json())
      .then((data) => {
        if (data.voices && data.voices.length > 0) {
          setVoices(data.voices);
          setSelectedVoiceId(data.voices[0].id);
        }
      })
      .catch(() => {});

    // Fetch history
    fetch('/api/vlabs/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.generations) setHistoryItems(data.generations);
      })
      .catch(() => {});
  }, []);

  // Sync Audio player element
  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration && audio.duration > 0) {
        setPlaybackProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setPlaybackProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const toggleAudioPlay = (url?: string) => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    if (url && url !== currentAudioUrl) {
      setCurrentAudioUrl(url);
      audio.src = url;
      audio.playbackRate = playbackSpeed;
      audio.play().catch(() => {});
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = newSpeed;
    }
  };

  const handleAudioSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioPlayerRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setPlaybackProgress(ratio * 100);
  };

  // Generate TTS Handler
  const handleGenerateTTS = async () => {
    if (!ttsText.trim()) {
      setErrorMessage('Please enter text to generate speech.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');
    setSuccessMessage('');
    setGenerationProgress(20);

    const progressTimer = setInterval(() => {
      setGenerationProgress((p) => (p < 85 ? p + 15 : p));
    }, 300);

    try {
      const res = await fetch('/api/vlabs/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ttsText,
          voiceId: selectedVoiceId,
          language: ttsLanguage,
          format: outputFormat,
          speed,
          pitch,
          stability,
          similarity,
          style: styleExaggeration,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      clearInterval(progressTimer);
      setGenerationProgress(100);

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Speech generation failed');
      }

      setGeneratedAudioUrl(data.audioUrl);
      setCurrentAudioUrl(data.audioUrl);
      setSuccessMessage(
        `Generated ${data.durationSec}s audio (${data.fileSizeKb} KB) with ${data.voiceName}!`
      );
      toggleAudioPlay(data.audioUrl);

      // Refresh history
      fetch('/api/vlabs/history')
        .then((r) => r.json())
        .then((d) => {
          if (d.generations) setHistoryItems(d.generations);
        });
    } catch (err: any) {
      clearInterval(progressTimer);
      setErrorMessage(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  // Voice Cloning Handler
  const handleCreateClone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneConsent) {
      setErrorMessage('You must confirm authorization and legal consent before cloning a voice.');
      return;
    }
    if (!cloneName.trim()) {
      setErrorMessage('Please provide a name for the cloned voice.');
      return;
    }

    setIsCloning(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/vlabs/voice-cloning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceName: cloneName,
          voiceDescription: cloneDesc,
          gender: cloneGender,
          consentConfirmed: cloneConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cloning failed');

      setSuccessMessage(`Voice "${data.voice.name}" created successfully and added to your voice library!`);
      setCloneName('');
      setCloneDesc('');
      setCloneConsent(false);

      // Refresh voice list
      fetch('/api/vlabs/voices')
        .then((r) => r.json())
        .then((d) => {
          if (d.voices) setVoices(d.voices);
        });
    } catch (err: any) {
      setErrorMessage(err.message || 'Voice cloning failed.');
    } finally {
      setIsCloning(false);
    }
  };

  // Voice Design Handler
  const handleDesignVoice = async () => {
    if (!designPrompt.trim()) {
      setErrorMessage('Please describe the voice you want to design.');
      return;
    }

    setIsDesigning(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/vlabs/voice-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: designPrompt,
          genderPreference: designGender,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Voice design analysis failed');

      setDesignedVoiceResult(data.designedVoice);
      setSuccessMessage(`Voice profile "${data.designedVoice.name}" designed! Listen to the preview below.`);
      if (data.designedVoice.previewAudioUrl) {
        toggleAudioPlay(data.designedVoice.previewAudioUrl);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Voice design failed.');
    } finally {
      setIsDesigning(false);
    }
  };

  // Video Dubbing Handler
  const handleRunDubbing = async () => {
    setIsDubbing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/vlabs/dubbing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: dubbingTitle,
          sourceLang: dubSourceLang,
          targetLang: dubTargetLang,
          preserveBackgroundAudio: dubPreserveBg,
          action: 'translate',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Video dubbing failed');

      setDubbingResult(data);
      setSuccessMessage('AI Video Dubbing completed successfully! Audio track and SRT subtitles are ready.');
      if (data.outputAudioUrl) {
        toggleAudioPlay(data.outputAudioUrl);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Dubbing processing failed.');
    } finally {
      setIsDubbing(false);
    }
  };

  const selectedVoice = voices.find((v) => v.id === selectedVoiceId) || voices[0] || {
    name: 'Aarav Sharma',
    gender: 'male',
    language: 'Hindi & English',
    category: 'indian',
    description: 'Deep authoritative corporate voice.',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05070B] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black">
      {/* Top Application Bar */}
      <header className="h-16 border-b border-slate-800/80 bg-[#070A0F]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-4 sm:gap-6">
          <Logo size="sm" />
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-1 rounded-md">
              FLUVIA vLABS
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Studio Workspace
            </span>
          </div>
        </div>

        {/* Licence & User Actions */}
        <div className="flex items-center gap-3">
          {licenceInfo?.hasActiveLicence ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Licence Active: {licenceInfo.remainingDays} Days</span>
            </div>
          ) : (
            <Link
              href="/pricing?tab=vlabs"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 text-black text-xs font-black shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Get Licence (From ₹1,799/mo)</span>
            </Link>
          )}

          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Studio Body (3-Column Layout: Left Sidebar + Center Workspace + Right Sidebar) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR: NAVIGATION MODULES */}
        {/* ========================================================================= */}
        <aside className="w-56 lg:w-64 border-r border-slate-800/80 bg-[#070A0F] p-3 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Voice Production
            </div>

            <button
              type="button"
              onClick={() => setActiveTool('tts')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTool === 'tts'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Text to Speech</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('dubbing')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTool === 'dubbing'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video Dubbing</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-500/30">
                AI
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('voice-cloning')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTool === 'voice-cloning'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Copy className="w-4 h-4" />
              <span>Voice Cloning</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                Auth
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('voice-design')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTool === 'voice-design'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>Voice Design</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('voices')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTool === 'voices'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Library className="w-4 h-4" />
              <span>Voice Library</span>
            </button>

            <div className="pt-4 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Projects & Storage
            </div>

            <button
              type="button"
              onClick={() => setActiveTool('history')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTool === 'history'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Generation History</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTool === 'settings'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Studio Settings</span>
            </button>
          </div>

          {/* Quick Licence Card in Sidebar */}
          <div className="p-3.5 rounded-2xl bg-[#0B1017] border border-slate-800 text-xs space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-[11px]">vLabs Licence</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {licenceInfo?.hasActiveLicence ? 'ACTIVE' : 'PREVIEW'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {licenceInfo?.hasActiveLicence
                ? `12/24/60-mo access enabled with full commercial rights.`
                : 'Sample generation active. Get a licence for full HD access.'}
            </p>
            <Link
              href="/pricing?tab=vlabs"
              className="block text-center py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30 transition-colors"
            >
              Manage Licence
            </Link>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* CENTER WORKSPACE: ACTIVE TOOL INTERFACE */}
        {/* ========================================================================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#05070B] pb-28">
          {/* Messages Alert */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TOOL 1: TEXT TO SPEECH */}
          {activeTool === 'tts' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <Mic className="w-5 h-5 text-emerald-400" />
                    <span>AI Text to Speech Studio</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Generate natural, emotionally-nuanced voiceovers with fine-tuned pitch and cadence.
                  </p>
                </div>

                {/* Model Tag */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Engine:</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white px-3 py-1.5 cursor-pointer"
                  >
                    <option value="vlabs-neural-hd">vLabs Studio Neural HD</option>
                    <option value="eleven_multilingual_v2">Eleven Multilingual v2</option>
                    <option value="gemini-audio">Google Gemini 3.8 Audio</option>
                  </select>
                </div>
              </div>

              {/* Text Input Editor */}
              <div className="rounded-2xl bg-[#090D14] border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span>Target Language:</span>
                    <select
                      value={ttsLanguage}
                      onChange={(e) => setTtsLanguage(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-md text-xs font-bold text-emerald-400 px-2 py-1"
                    >
                      <option value="Hindi & English">Hindi & English (Indian)</option>
                      <option value="Hindi">Hindi (Devanagari)</option>
                      <option value="English">English (Global)</option>
                      <option value="Bengali">Bengali (বাংলা)</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Marathi">Marathi (मराठी)</option>
                      <option value="Spanish">Spanish (Español)</option>
                      <option value="French">French (Français)</option>
                      <option value="German">German (Deutsch)</option>
                    </select>
                  </div>
                  <span className="font-mono">{ttsText.length} / 50,000 chars</span>
                </div>

                <textarea
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  rows={8}
                  placeholder="Enter or paste your script here..."
                  className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed font-sans"
                />

                {/* Progress bar when generating */}
                {isGenerating && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                      <span>Synthesizing voice audio...</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Action bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Active Voice:</span>
                    <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md">
                      {selectedVoice.name} ({selectedVoice.language})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={handleGenerateTTS}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:opacity-95 text-black font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating Audio...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 fill-current" />
                          <span>Generate Speech</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sample Quick Snippets */}
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Script Templates
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setTtsText(
                        'Welcome to our tech review! Today we are exploring the revolutionary AI voice production platform that transforms content creation.'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                  >
                    Tech YouTube Intro
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setTtsText(
                        'Yugon yugon se chali aa rahi pauranik kathaon mein, dharm aur satya ki vijay ki kahani suniye ab Fluvia vLabs ke saath.'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                  >
                    Hindi Mythology Katha
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setTtsText(
                        'Stop scrolling! Here is the secret to scaling your brand with high-converting video ads in 2026. Try it now.'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                  >
                    E-Commerce Ad Hook
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 2: VIDEO DUBBING */}
          {activeTool === 'dubbing' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Video className="w-5 h-5 text-teal-400" />
                  <span>AI Video Dubbing Studio</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Translate video dialogue with multi-speaker detection, timeline synchronization, and SRT subtitle exports.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#090D14] border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Source Language
                    </label>
                    <select
                      value={dubSourceLang}
                      onChange={(e) => setDubSourceLang(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl text-xs text-white p-2.5 font-bold"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                      <option value="German">German</option>
                      <option value="Japanese">Japanese</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Target Dubbed Language
                    </label>
                    <select
                      value={dubTargetLang}
                      onChange={(e) => setDubTargetLang(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl text-xs text-emerald-400 p-2.5 font-bold"
                    >
                      <option value="Hindi">Hindi (Devanagari)</option>
                      <option value="English">English</option>
                      <option value="Bengali">Bengali</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="preserveBg"
                    checked={dubPreserveBg}
                    onChange={(e) => setDubPreserveBg(e.target.checked)}
                    className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                  />
                  <label htmlFor="preserveBg" className="text-xs text-slate-300 font-medium cursor-pointer">
                    Preserve original background score & ambient sound effects (Stem Isolation)
                  </label>
                </div>

                <button
                  type="button"
                  disabled={isDubbing}
                  onClick={handleRunDubbing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-black font-black text-sm shadow-lg shadow-teal-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isDubbing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Dubbed Speech & Subtitles...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" />
                      <span>Start AI Video Dubbing</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dubbing Output Details */}
              {dubbingResult && (
                <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                      Dubbing Complete
                    </span>
                    <span className="text-[11px] text-slate-400">100% Synchronized</span>
                  </div>

                  <p className="text-xs text-slate-200">
                    Dubbed audio track successfully rendered. You can preview the track or download the synchronized SRT subtitles.
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => toggleAudioPlay(dubbingResult.outputAudioUrl)}
                      className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Dubbed Audio</span>
                    </button>

                    {dubbingResult.srtUrl && (
                      <a
                        href={dubbingResult.srtUrl}
                        download="dubbed_subtitles.srt"
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download SRT Subtitles</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TOOL 3: VOICE CLONING (STRICT CONSENT GUARANTEE) */}
          {activeTool === 'voice-cloning' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Copy className="w-5 h-5 text-rose-400" />
                  <span>Authorized Voice Cloning</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Create a custom speech synthesis clone from your own voice recordings with strict anti-impersonation security.
                </p>
              </div>

              <form onSubmit={handleCreateClone} className="p-6 rounded-2xl bg-[#090D14] border border-slate-800 space-y-5">
                {/* Mandatory Consent Box */}
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-black text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    <span>Mandatory Legal & Ethical Consent</span>
                  </div>
                  <p className="text-[11px] text-rose-200/90 leading-relaxed">
                    Fluvia vLabs enforces zero-tolerance against fraudulent voice cloning, unauthorized celebrity impersonation, or deceptive spoofing. You must verify that you are the authorized speaker or possess explicit written legal authority.
                  </p>
                  <label className="flex items-start gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cloneConsent}
                      onChange={(e) => setCloneConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-rose-500 rounded cursor-pointer"
                    />
                    <span className="text-xs text-white font-bold">
                      I solemnly affirm that I am the authorized owner of this voice or possess explicit written legal consent to clone this voice.
                    </span>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Voice Persona Name *
                    </label>
                    <input
                      type="text"
                      value={cloneName}
                      onChange={(e) => setCloneName(e.target.value)}
                      placeholder="e.g. My Personal Narrator Voice"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl text-xs text-white p-3 font-semibold focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Voice Description
                    </label>
                    <input
                      type="text"
                      value={cloneDesc}
                      onChange={(e) => setCloneDesc(e.target.value)}
                      placeholder="e.g. Warm conversational tone for my YouTube videos"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl text-xs text-white p-3 font-semibold focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Gender
                      </label>
                      <select
                        value={cloneGender}
                        onChange={(e) => setCloneGender(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl text-xs text-white p-2.5 font-bold"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Audio Quality Check
                      </label>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Ready (Studio Sample)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCloning || !cloneConsent}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-sm shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isCloning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Validating & Training Voice Clone...</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Create Authorized Voice Clone</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TOOL 4: AI VOICE DESIGN */}
          {activeTool === 'voice-design' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-pink-400" />
                  <span>AI Voice Design</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Describe a voice in natural language. Our neural sound design engine analyzes tone, accent, age, and timber.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#090D14] border border-slate-800 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Describe your desired voice
                  </label>
                  <textarea
                    value={designPrompt}
                    onChange={(e) => setDesignPrompt(e.target.value)}
                    rows={4}
                    placeholder="e.g. Create a deep Indian male documentary narrator with a confident, warm and cinematic delivery."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white p-3 font-medium focus:outline-none focus:border-pink-400"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold text-slate-300">Gender Tendency:</label>
                  <div className="flex items-center gap-2">
                    {(['male', 'female', 'neutral'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setDesignGender(g)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold capitalize cursor-pointer ${
                          designGender === g
                            ? 'bg-pink-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isDesigning}
                  onClick={handleDesignVoice}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isDesigning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Designing Acoustics...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Synthesize & Preview Designed Voice</span>
                    </>
                  )}
                </button>
              </div>

              {/* Design Result */}
              {designedVoiceResult && (
                <div className="p-5 rounded-2xl bg-pink-950/30 border border-pink-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-white">
                      {designedVoiceResult.name}
                    </h3>
                    <span className="text-[10px] font-mono text-pink-400 font-bold bg-pink-950 px-2 py-0.5 rounded">
                      ACOUSTICS MAPPED
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {designedVoiceResult.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-400 font-mono">
                    <div>Tone: <span className="text-white font-bold">{designedVoiceResult.characteristics?.tone}</span></div>
                    <div>Style: <span className="text-white font-bold">{designedVoiceResult.characteristics?.style}</span></div>
                    <div>Age: <span className="text-white font-bold">{designedVoiceResult.characteristics?.ageGroup}</span></div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => toggleAudioPlay(designedVoiceResult.previewAudioUrl)}
                      className="px-4 py-2 rounded-lg bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Listen to Preview</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TOOL 5: VOICE LIBRARY */}
          {activeTool === 'voices' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Library className="w-5 h-5 text-emerald-400" />
                  <span>Voice Library Catalog</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Explore studio-grade voices across Indian regional dialects and international languages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {voices.map((v) => (
                  <div
                    key={v.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      selectedVoiceId === v.id
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">
                        {v.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{v.gender}</span>
                    </div>

                    <h4 className="text-sm font-black text-white">{v.name}</h4>
                    <p className="text-xs text-emerald-300 font-medium">{v.language}</p>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{v.description}</p>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => toggleAudioPlay(v.sampleAudioUrl)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                        title="Preview voice"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVoiceId(v.id);
                          setActiveTool('tts');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          selectedVoiceId === v.id
                            ? 'bg-emerald-500 text-black font-black'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                        }`}
                      >
                        {selectedVoiceId === v.id ? 'Selected' : 'Use Voice'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOOL 6: GENERATION HISTORY */}
          {activeTool === 'history' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-400" />
                  <span>Generation History</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Access your previously generated voiceovers, audio projects, and download master files.
                </p>
              </div>

              {historyItems.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                  <Mic className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400 font-medium">No voice generations yet.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTool('tts')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
                  >
                    Create Your First Voiceover
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#090D14] border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                          <span className="font-bold text-emerald-400">{item.voiceName}</span>
                          <span>•</span>
                          <span>{item.durationSec}s</span>
                          <span>•</span>
                          <span>{new Date(item.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <p className="text-xs text-white truncate font-medium">{item.title}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleAudioPlay(item.audioUrl)}
                          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-pointer"
                          title="Play generation"
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </button>

                        <a
                          href={item.audioUrl}
                          download={`vlabs-${item.id}.wav`}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                          title="Download audio"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TOOL 7: STUDIO SETTINGS & LICENCE STATUS */}
          {activeTool === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-400" />
                  <span>Studio & Licence Settings</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage your Fluvia vLabs production licence, connected AI engines, and export preferences.
                </p>
              </div>

              {/* Licence Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#0a1518] to-teal-950/60 border border-emerald-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                    FLUVIA vLABS PRODUCTION LICENCE
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    licenceInfo?.hasActiveLicence
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}>
                    {licenceInfo?.hasActiveLicence ? 'LICENCE ACTIVE' : 'PREVIEW MODE'}
                  </span>
                </div>

                {licenceInfo?.licence ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Plan Tier:</span>
                      <span className="font-bold text-white uppercase">{licenceInfo.licence.planId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Duration:</span>
                      <span className="font-bold text-white">{licenceInfo.licence.durationMonths} Months</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Remaining:</span>
                      <span className="font-bold text-emerald-400">{licenceInfo.remainingDays} Days</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Expires:</span>
                      <span className="font-bold text-white">
                        {new Date(licenceInfo.licence.expirationDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-300">
                    No active long-term licence found. You are currently in Preview Mode with sample outputs.
                  </p>
                )}

                <div className="pt-2">
                  <Link
                    href="/pricing?tab=vlabs"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-black text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <span>{licenceInfo?.hasActiveLicence ? 'Renew or Upgrade Licence' : 'Get 1, 2 or 5 Years Licence'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ========================================================================= */}
        {/* RIGHT SIDEBAR: ACOUSTIC PARAMETERS & VOICE DETAILS */}
        {/* ========================================================================= */}
        <aside className="w-72 lg:w-80 border-l border-slate-800/80 bg-[#070A0F] p-5 space-y-6 shrink-0 overflow-y-auto hidden md:block">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Selected Voice Info
            </span>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white">{selectedVoice.name}</h4>
                <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-950 px-2 py-0.5 rounded">
                  {selectedVoice.category}
                </span>
              </div>
              <p className="text-xs text-slate-400">{selectedVoice.description}</p>
            </div>
          </div>

          {/* Voice Tuning Sliders */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Acoustic Controls
            </span>

            {/* Speaking Speed */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Speaking Speed</span>
                <span className="font-mono text-emerald-400 font-bold">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 accent-emerald-400 rounded cursor-pointer"
              />
            </div>

            {/* Voice Pitch */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Pitch Modulation</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {pitch > 0 ? `+${pitch}` : pitch}
                </span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 accent-emerald-400 rounded cursor-pointer"
              />
            </div>

            {/* Voice Stability */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Stability</span>
                <span className="font-mono text-emerald-400 font-bold">{Math.round(stability * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={stability}
                onChange={(e) => setStability(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 accent-emerald-400 rounded cursor-pointer"
              />
            </div>

            {/* Similarity Boost */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Clarity & Similarity</span>
                <span className="font-mono text-emerald-400 font-bold">{Math.round(similarity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={similarity}
                onChange={(e) => setSimilarity(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 accent-emerald-400 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Export Settings */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Master Format
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOutputFormat('wav')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  outputFormat === 'wav'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                WAV (Lossless)
              </button>
              <button
                type="button"
                onClick={() => setOutputFormat('mp3')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  outputFormat === 'mp3'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                MP3 (320 kbps)
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM PERSISTENT AUDIO PLAYER BAR */}
      {/* ========================================================================= */}
      <footer className="fixed bottom-0 left-0 right-0 h-20 border-t border-slate-800/90 bg-[#070A0F]/95 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4 z-40">
        <audio ref={audioPlayerRef} src={currentAudioUrl} preload="auto" />

        {/* Left: Play/Pause + Track info */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 max-w-[280px] sm:max-w-xs shrink-0">
          <button
            type="button"
            onClick={() => toggleAudioPlay()}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <div className="min-w-0">
            <h5 className="text-xs font-bold text-white truncate">
              {selectedVoice.name} — Master Audio
            </h5>
            <p className="text-[11px] text-emerald-400/90 truncate font-mono">
              {isPlaying ? 'Playing Studio Audio' : 'Paused'} • {selectedVoice.language}
            </p>
          </div>
        </div>

        {/* Center: Interactive Audio Waveform / Scrubber */}
        <div className="flex-1 max-w-2xl hidden md:flex flex-col justify-center gap-1.5">
          <div
            onClick={handleAudioSeek}
            className="h-8 w-full flex items-center gap-1 cursor-pointer group py-1"
            title="Click to seek"
          >
            {Array.from({ length: 48 }).map((_, idx) => {
              const barProgress = (idx / 48) * 100;
              const isPlayed = playbackProgress >= barProgress;
              const pseudoHeight = 25 + Math.sin(idx * 0.4) * 20 + (idx % 3 === 0 ? 15 : 0);

              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    isPlayed
                      ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                      : isPlaying
                      ? 'bg-emerald-900/60'
                      : 'bg-slate-700/60 group-hover:bg-slate-600'
                  }`}
                  style={{
                    height: `${pseudoHeight}%`,
                    transform: isPlaying ? `scaleY(${1 + Math.sin(idx + Date.now() / 200) * 0.2})` : 'scaleY(1)',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Speed, Volume & Download */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Playback speed switcher */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
            {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSpeedChange(s)}
                className={`px-1.5 py-0.5 rounded cursor-pointer font-bold ${
                  playbackSpeed === s ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="items-center gap-1.5 hidden sm:flex text-slate-400 hover:text-white">
            <button
              type="button"
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (audioPlayerRef.current) {
                  audioPlayerRef.current.volume = nextMute ? 0 : volume;
                }
              }}
              className="p-1 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                setIsMuted(val === 0);
                if (audioPlayerRef.current) audioPlayerRef.current.volume = val;
              }}
              className="w-16 h-1 accent-emerald-400 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          {/* Download Audio */}
          <a
            href={currentAudioUrl}
            download="fluvia-vlabs-studio-master.wav"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
            title="Download Audio Master"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
