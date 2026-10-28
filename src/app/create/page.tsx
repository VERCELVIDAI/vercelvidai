'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { TEMPLATES_DATA, VideoTemplate } from '@/lib/templates';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Mic,
  Sliders,
  Ratio,
  Clock,
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  Film,
  Download,
  ExternalLink,
  Copy,
  Check,
  History,
  X,
  ChevronRight,
  Info,
  ShieldCheck,
  Flame,
  LayoutGrid,
  Volume2,
} from 'lucide-react';

const MODELS = [
  { id: 'gemini-omni-1.1-flash', name: 'Google Gemini Omni 1.1 Flash', cost: 15, badge: 'Active Engine', active: true },
  { id: 'runway-gen3', name: 'Runway Gen-3 Alpha', cost: 50, badge: 'Coming Soon', active: false },
  { id: 'luma-ray', name: 'Luma Dream Machine Ray', cost: 40, badge: 'Coming Soon', active: false },
  { id: 'fluvia-cinematic-v1', name: 'Fluvia Cinematic Core', cost: 25, badge: 'Coming Soon', active: false },
  { id: 'gemini-3.1-flash-image', name: 'Google Gemini 3.1 Flash Image', cost: 5, badge: 'Official Google', active: true },
  { id: 'gemini-3-pro-image', name: 'Google Gemini 3 Pro Image (Ultra)', cost: 10, badge: 'Ultra', active: true },
  { id: 'fal-flux-pro', name: 'Flux 1.1 Pro Vision (Image)', cost: 5, badge: 'Photoreal', active: true },
  { id: 'eleven-multilingual', name: 'ElevenLabs Voice HD', cost: 2, badge: 'Voiceover', active: true },
];

// Curated high-conversion productive templates for quick load in the studio
const PRODUCTIVE_PRESETS = [
  'tmpl_19', // Enterprise Cloud Security & Zero-Trust Shield
  'tmpl_20', // AI Agent Swarm & Autonomous Workflow Orchestrator
  'tmpl_21', // Global B2B Fintech & Automated Cross-Border Settlements
  'tmpl_22', // High-Conversion Mobile App Showcase & Onboarding Reel
  'tmpl_23', // Real-Time Executive Analytics & Big Data Command Center
  'tmpl_24', // Spatial Computing & Holographic Glass AR Experience
  'tmpl_25', // Developer CLI & Serverless Container Infrastructure
  'tmpl_26', // Next-Gen Cloud AI Platform Feature Tour
  'tmpl_01', // Cinematic Hyper-Car Launch
  'tmpl_09', // High-Tech Smartphone Unboxing & Feature Reveal
];

function CreateWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial params
  const initialVoice = searchParams.get('voice') || '';
  const initialMode = (searchParams.get('mode') as any) || (initialVoice ? 'audio' : 'video');
  const initialPrompt = searchParams.get('prompt') || '';
  const initialModel = searchParams.get('modelId') || (initialMode === 'audio' ? 'eleven-multilingual' : 'gemini-omni-1.1-flash');
  const initialRatio = (searchParams.get('aspectRatio') as any) || '16:9';

  const [authData, setAuthData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'studio' | 'history' | 'templates'>('studio');
  const [mode, setMode] = useState<'video' | 'image' | 'audio' | 'script'>(initialMode);
  const [videoInputType, setVideoInputType] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [modelId, setModelId] = useState(initialModel);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>(initialRatio);
  const [durationSec, setDurationSec] = useState<number>(5);
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [negativePrompt, setNegativePrompt] = useState('');

  // Voiceover selection & preview state
  const [selectedVoice, setSelectedVoice] = useState<string>(initialVoice || 'Roger');
  const [availableVoices, setAvailableVoices] = useState<any[]>([
    { voiceId: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger - Casual & Resonant', gender: 'male', accent: 'american' },
    { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah - Reassuring & Confident', gender: 'female', accent: 'american' },
    { voiceId: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura - Enthusiast & Quirky', gender: 'female', accent: 'american' },
    { voiceId: 'JBFqnCBsd6RMkjVDRZzb', name: 'George - Warm Storyteller', gender: 'male', accent: 'british' },
    { voiceId: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel - Calm & Clear', gender: 'female', accent: 'american' },
    { voiceId: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi - Strong & Engaging', gender: 'female', accent: 'american' },
  ]);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [playingVoicePreview, setPlayingVoicePreview] = useState<string | null>(null);

  // Active Job & History State
  const [activeJob, setActiveJob] = useState<any>(null);
  const [userJobs, setUserJobs] = useState<any[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementApplied, setEnhancementApplied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedVids, setCopiedVids] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load available voices from ElevenLabs endpoint
  useEffect(() => {
    fetch('/api/ai/voice')
      .then((r) => r.json())
      .then((data) => {
        if (data.voices && Array.isArray(data.voices) && data.voices.length > 0) {
          setAvailableVoices(data.voices);
          if (initialVoice) {
            const found = data.voices.find(
              (v: any) =>
                v.name?.toLowerCase().includes(initialVoice.toLowerCase()) ||
                v.id === initialVoice ||
                v.voiceId === initialVoice
            );
            if (found) {
              setSelectedVoice(found.voiceId || found.id);
            }
          }
        }
      })
      .catch(() => {});
  }, [initialVoice]);

  // Load auth & pending draft
  useEffect(() => {
    if (!prompt) {
      try {
        const saved = localStorage.getItem('fluvia_pending_prompt') || localStorage.getItem('vidai_pending_prompt');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.prompt) setPrompt(parsed.prompt);
          if (parsed.mode) setMode(parsed.mode);
          if (parsed.aspectRatio) setAspectRatio(parsed.aspectRatio);
          if (parsed.modelId) setModelId(parsed.modelId);
          localStorage.removeItem('fluvia_pending_prompt');
          localStorage.removeItem('vidai_pending_prompt');
        }
      } catch (e) {}
    }

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d) router.push('/login?returnUrl=/create');
        else {
          setAuthData(d);
          fetchUserJobs();
        }
      });
  }, []);

  const fetchUserJobs = async () => {
    try {
      setIsLoadingJobs(true);
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setUserJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Failed to load user jobs', err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Poll active job while status is queued or processing
  useEffect(() => {
    if (!activeJob || activeJob.status === 'completed' || activeJob.status === 'failed') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${activeJob.id}`);
        if (res.ok) {
          const d = await res.json();
          setActiveJob(d.job);

          // Update user credits balance and history if completed or failed
          if (d.job.status === 'completed' || d.job.status === 'failed') {
            fetch('/api/auth/me')
              .then((r) => r.json())
              .then((fresh) => {
                if (fresh) setAuthData(fresh);
              });
            fetchUserJobs();
          }
        }
      } catch (e) {
        console.error(e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeJob]);

  const selectedModelObj = MODELS.find((m) => m.id === modelId) || MODELS[0];
  const estimatedCost =
    mode === 'video'
      ? 15
      : mode === 'image'
      ? (selectedModelObj.cost || 5)
      : mode === 'audio'
      ? 2
      : 15;

  // Handle Image Upload for Image-to-Video
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      setUploadedImagePreview(base64Data);
      setUploadedImageName(file.name);
      setReferenceImageUrl(base64Data);
      setVideoInputType('image');
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setUploadedImagePreview(null);
    setUploadedImageName(null);
    setReferenceImageUrl('');
    setVideoInputType('text');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Enhance prompt via Gemini AI Copilot
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Enter a prompt draft first before enhancing with Gemini.');
      return;
    }

    setIsEnhancing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance-prompt',
          prompt: prompt.trim(),
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (res.ok && data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
        if (data.suggestedAspectRatio) {
          const ratio = data.suggestedAspectRatio as any;
          if (['16:9', '9:16', '1:1', '4:3'].includes(ratio)) {
            setAspectRatio(ratio);
          }
        }
        setEnhancementApplied(true);
        setTimeout(() => setEnhancementApplied(false), 4000);
      } else {
        throw new Error(data.error || 'Could not enhance prompt');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gemini prompt enhancement unavailable.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Quick load template
  const handleLoadTemplate = (template: VideoTemplate) => {
    setPrompt(template.prompt);
    setMode('video');
    setModelId('gemini-omni-1.1-flash');
    if (template.aspect === '16:9' || template.aspect === '9:16' || template.aspect === '1:1') {
      setAspectRatio(template.aspect);
    }
    const dur = template.durationSec ?? 15;
    setDurationSec(dur <= 15 ? dur : 15);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-load template if provided in URL params
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam) {
      const found = TEMPLATES_DATA.find((t) => t.id === templateParam || t.slug === templateParam);
      if (found) {
        handleLoadTemplate(found);
      }
    }
  }, [searchParams]);

  // Copy prompt & handoff to Google Vids
  const handleCopyAndLaunchGoogleVids = () => {
    if (prompt.trim()) {
      navigator.clipboard.writeText(prompt);
    }
    setCopiedVids(true);
    setTimeout(() => setCopiedVids(false), 3500);
    window.open('https://workspace.google.com/intl/en_in/products/vids/?from=gafb-drive_6806271-def-en_in', '_blank');
  };

  const handleToggleVoicePreview = (previewUrl?: string, voiceId?: string) => {
    if (!previewUrl) return;
    if (playingVoicePreview === voiceId && previewAudio) {
      previewAudio.pause();
      setPlayingVoicePreview(null);
      return;
    }
    if (previewAudio) {
      previewAudio.pause();
    }
    const audio = new Audio(previewUrl);
    audio.play().catch(() => {});
    setPreviewAudio(audio);
    setPlayingVoicePreview(voiceId || null);
    audio.onended = () => {
      setPlayingVoicePreview(null);
    };
  };

  // Dispatch Generation to Backend
  const handleStartGeneration = async () => {
    if (!prompt.trim() && !referenceImageUrl) {
      setErrorMsg('Please enter a creative prompt or upload a reference frame.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Dedicated Voiceover Generation Handler via ElevenLabs
    if (mode === 'audio') {
      try {
        const res = await fetch('/api/ai/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: prompt.trim(),
            voiceId: selectedVoice,
            modelId: 'eleven_v4',
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to synthesize voiceover with ElevenLabs.');
        }

        const voiceJob = {
          id: `voice_${Date.now()}`,
          status: 'completed',
          modelId: 'eleven-multilingual',
          reservedCredits: 2,
          actualCredits: data.creditsDeducted || 2,
          progressPercent: 100,
          progressMessage: `Synthesized speech with ${availableVoices.find((v) => (v.voiceId || v.id) === selectedVoice)?.name || 'ElevenLabs Neural Engine'}`,
          output: {
            audioUrl: data.audioUrl,
            text: prompt.trim(),
          },
          createdAt: new Date().toISOString(),
        };

        setActiveJob(voiceJob);
        setUserJobs((prev) => [voiceJob, ...prev]);
        setActiveTab('studio');

        // Refresh credits balance immediately
        fetch('/api/auth/me')
          .then((r) => r.json())
          .then((fresh) => {
            if (fresh) setAuthData(fresh);
          });
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          prompt: prompt.trim(),
          modelId: 'gemini-omni-1.1-flash',
          aspectRatio,
          durationSec,
          negativePrompt: negativePrompt.trim(),
          referenceImageUrl: referenceImageUrl || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch generation job.');
      }

      setActiveJob(data.job);
      setActiveTab('studio');

      // Refresh credits balance immediately after reservation
      fetch('/api/auth/me')
        .then((r) => r.json())
        .then((fresh) => {
          if (fresh) setAuthData(fresh);
        });
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Video directly
  const handleDownloadVideo = (videoUrl: string, filename = 'fluvia-flow-creation.mp4') => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const credits = authData?.credits || { availableBalance: 0 };
  const hasEnoughCredits = credits.availableBalance >= estimatedCost;

  // Curate active productive templates
  const productiveTemplates = TEMPLATES_DATA.filter((t) =>
    PRODUCTIVE_PRESETS.includes(t.id)
  );

  return (
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden text-slate-100 bg-[#090A0D] relative">
      <Sidebar credits={credits} userRole={authData?.user?.role} />

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative">
        <DashboardHeader
          displayName={authData?.user?.displayName}
          avatarUrl={authData?.user?.avatarUrl}
          role={authData?.user?.role}
          credits={credits.availableBalance}
          workspaceName={authData?.workspace?.name}
        />

        <main className="flex-1 p-5 sm:p-8 max-w-7xl mx-auto w-full space-y-6 text-left">
          {/* Top Title & Studio Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/8">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-2xs">
                  Google Flow Studio
                </span>
                <span className="text-xs text-slate-400 font-medium">Google DeepMind (Veo & Gemini Omni Flash)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Google Flow — AI Video Creation Studio
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Generate high-fidelity AI video commercials, product reels, and SaaS demos in-app with real-time inference.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] rounded-xl border border-white/8 shadow-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('studio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'studio'
                    ? 'bg-white/[0.12] text-white border border-white/16 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-indigo-400" />
                <span>Studio Viewport</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'templates'
                    ? 'bg-white/[0.12] text-white border border-white/16 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Templates ({productiveTemplates.length})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('history');
                  fetchUserJobs();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-white/[0.12] text-white border border-white/16 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>History ({userJobs.length})</span>
              </button>
            </div>
          </div>

          {/* Error / Alert Banner */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {errorMsg.toLowerCase().includes('insufficient') && (
                  <Link
                    href="/pricing"
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs shadow-2xs"
                  >
                    Top Up Credits
                  </Link>
                )}
                <button
                  onClick={() => setErrorMsg(null)}
                  className="p-1 text-rose-400 hover:text-white rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: STUDIO VIEWPORT (MAIN CREATION WORKSPACE) */}
          {activeTab === 'studio' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: Composer Controls & Parameters (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Mode Selector */}
                <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] rounded-xl border border-white/8 text-xs shadow-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('video');
                      setModelId('gemini-omni-1.1-flash');
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      mode === 'video' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>AI Video (Gemini Omni)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('image');
                      setModelId('gemini-3.1-flash-image');
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      mode === 'image' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>AI Image (Gemini)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('audio');
                      setModelId('eleven-multilingual');
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      mode === 'audio' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voiceover HD</span>
                  </button>
                </div>

                {/* Video Generation Mode Toggle (Text-to-Video vs Image-to-Video) */}
                {mode === 'video' && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#11131A] border border-white/8 text-xs">
                    <span className="font-bold text-slate-300 pl-2">Input Workflow:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setVideoInputType('text')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          videoInputType === 'text'
                            ? 'bg-white/[0.12] text-white shadow-2xs border border-white/16'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Text-to-Video
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoInputType('image')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          videoInputType === 'image'
                            ? 'bg-white/[0.12] text-white shadow-2xs border border-white/16'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Image-to-Video
                      </button>
                    </div>
                  </div>
                )}

                {/* Image-to-Video Uploader Area */}
                {mode === 'video' && videoInputType === 'image' && (
                  <div className="p-4 rounded-2xl border border-white/8 bg-[#11131A] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-indigo-400" />
                        <span>Source Reference Frame</span>
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">PNG, JPG, WEBP • Max 10MB</span>
                    </div>

                    {!uploadedImagePreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/15 hover:border-indigo-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.04]"
                      >
                        <ImageIcon className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                        <p className="text-xs font-bold text-white">
                          Click to upload initial keyframe or drop image here
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Gemini Omni Flash will bring this image to life with cinematographic motion
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-video max-h-48 flex items-center justify-center group">
                        <img
                          src={uploadedImagePreview}
                          alt="Uploaded Keyframe"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={handleClearImage}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono border border-white/10">
                          {uploadedImageName}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Prompt Box & Gemini Enhancer */}
                <div className="p-5 rounded-2xl border border-white/8 bg-[#11131A] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      {mode === 'audio' ? (
                        <Mic className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>{mode === 'audio' ? 'Voiceover Narration Script' : 'Creative Direction Prompt'}</span>
                    </label>

                    {mode !== 'audio' && (
                      <button
                        type="button"
                        onClick={handleEnhancePrompt}
                        disabled={isEnhancing || !prompt.trim()}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-[11px] flex items-center gap-1 transition-all disabled:opacity-40 cursor-pointer"
                      >
                        {isEnhancing ? (
                          <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                        )}
                        <span>{isEnhancing ? 'Enhancing...' : 'Gemini AI Enhance'}</span>
                      </button>
                    )}
                  </div>

                  {enhancementApplied && (
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-200 text-[11px] font-semibold flex items-center gap-1.5 border border-indigo-500/40">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Prompt expanded with cinematic camera movement, lighting cues, and optical fidelity.</span>
                    </div>
                  )}

                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      mode === 'audio'
                        ? 'Enter narration text or script to synthesize with ElevenLabs (e.g. "Welcome to Fluvia Flow. Create studio-grade videos and hyperrealistic voiceovers in seconds.")...'
                        : videoInputType === 'image'
                        ? 'Describe camera motion and animation for your image (e.g. slow cinematic dolly push forward, volumetric lighting, gentle wind motion)...'
                        : 'Describe your video scene: subject, environment, lighting, camera motion, cinematic aesthetic (e.g. 16:9 4K commercial)...'
                    }
                    className="w-full bg-[#090A0D] text-slate-100 placeholder-slate-500 p-3.5 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm leading-relaxed resize-none shadow-inner"
                  />

                  {/* Quick Style Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">
                      Quick Tags:
                    </span>
                    {[
                      '3D Glassmorphism',
                      'Holographic Telemetry',
                      'Cinematic Drone Orbit',
                      'Volumetric Studio Light',
                      'Macro Detail 8K',
                      'SaaS Tech Explainer',
                      'Fintech Gold Glow',
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (!prompt.includes(tag)) {
                            setPrompt((prev) => (prev ? `${prev}, ${tag}` : tag));
                          }
                        }}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/8 text-[10px] font-medium transition-colors cursor-pointer"
                      >
                        +{tag}
                      </button>
                    ))}
                  </div>

                  {/* Negative Prompt */}
                  <div className="pt-2 border-t border-white/8">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Negative Prompt (Optional)
                    </label>
                    <input
                      type="text"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="blurry, low resolution, warped text, distorted hands, watermark..."
                      className="w-full bg-[#090A0D] text-slate-100 placeholder-slate-500 px-3 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>
                </div>

                {/* Model & Settings Parameters */}
                <div className="p-5 rounded-2xl border border-white/8 bg-[#11131A] space-y-4 text-xs shadow-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Model Selector */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-slate-300 uppercase font-bold">Active Engine</label>
                        <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30">
                          {mode === 'video' ? '15 Credits' : `${estimatedCost} Credits`}
                        </span>
                      </div>
                      <select
                        value={modelId}
                        onChange={(e) => setModelId(e.target.value)}
                        className="w-full bg-[#090A0D] text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 text-xs cursor-pointer font-bold"
                      >
                        {MODELS.map((m) => (
                          <option
                            key={m.id}
                            value={m.id}
                            disabled={!m.active}
                            className={`bg-[#11131A] ${m.active ? 'text-white font-bold' : 'text-slate-500 italic'}`}
                          >
                            {m.name} {!m.active ? '(Coming Soon)' : `(${m.cost} credits)`}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">
                        Fixed rate: 15 Credits for Gemini Omni video generations.
                      </p>
                    </div>

                    {/* Aspect Ratio OR Voice Selector */}
                    {mode === 'audio' ? (
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-slate-300 uppercase font-bold">Neural Voice Model</label>
                          <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                            ElevenLabs HD
                          </span>
                        </div>
                        <select
                          value={selectedVoice}
                          onChange={(e) => setSelectedVoice(e.target.value)}
                          className="w-full bg-[#090A0D] text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 text-xs cursor-pointer font-bold"
                        >
                          {availableVoices.map((v) => (
                            <option key={v.voiceId || v.id} value={v.voiceId || v.id} className="bg-[#11131A] text-white">
                              {v.name} ({v.gender || 'Neural'} • {v.accent || 'Natural'})
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-slate-300 uppercase font-bold mb-1.5">Aspect Ratio</label>
                        <div className="grid grid-cols-4 gap-1 bg-[#090A0D] p-1 rounded-xl border border-white/10 shadow-2xs">
                          {(['16:9', '9:16', '1:1', '4:3'] as const).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setAspectRatio(r)}
                              className={`py-1 rounded-lg font-bold transition-all cursor-pointer ${
                                aspectRatio === r
                                  ? 'bg-white/[0.14] text-white shadow-2xs border border-white/15'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Featured Voice Presets when in Audio Mode */}
                  {mode === 'audio' && (
                    <div className="pt-2 border-t border-white/8">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-slate-300 uppercase font-bold text-[11px]">Featured Voice Presets</label>
                        <span className="text-[10px] text-slate-400">Click card to select • speaker to preview</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableVoices.slice(0, 6).map((v) => {
                          const isSelected = selectedVoice === (v.voiceId || v.id) || selectedVoice === v.name;
                          return (
                            <div
                              key={v.voiceId || v.id}
                              onClick={() => setSelectedVoice(v.voiceId || v.id)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-indigo-500/20 border-indigo-500 shadow-2xs ring-1 ring-indigo-500 text-white'
                                  : 'bg-white/[0.04] border-white/8 hover:border-white/16 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-white text-xs truncate">
                                  {v.name.split('-')[0].trim()}
                                </span>
                                {v.previewUrl && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleVoicePreview(v.previewUrl, v.voiceId || v.id);
                                    }}
                                    title="Preview voice sample"
                                    className={`p-1 rounded-full transition-colors ${
                                      playingVoicePreview === (v.voiceId || v.id)
                                        ? 'bg-indigo-600 text-white animate-pulse'
                                        : 'hover:bg-white/10 text-indigo-400'
                                    }`}
                                  >
                                    <Volume2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 mt-1 capitalize font-medium">
                                {v.gender || 'Neural'} • {v.accent || 'Natural'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Duration Slider (if video mode) */}
                  {mode === 'video' && (
                    <div className="pt-2 border-t border-white/8">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-slate-300 uppercase font-bold">Duration: {durationSec} seconds</label>
                        <span className="text-[11px] text-slate-400 font-mono font-medium">Standard 5s / Extended 15s</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={15}
                        step={5}
                        value={durationSec}
                        onChange={(e) => setDurationSec(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 font-semibold">
                        <span>5s Standard</span>
                        <span>10s Commercial</span>
                        <span>15s Narrative</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Generation Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-white/8 bg-[#11131A] shadow-xl gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs text-slate-300 self-start sm:self-auto">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                      <span>Cost: <span className="text-indigo-400 font-black text-sm">{estimatedCost} Credits</span></span>
                    </div>
                    <span className="hidden sm:inline text-slate-600">•</span>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 font-mono">
                      <span>Available: <strong className="text-white font-semibold">{credits.availableBalance}</strong></span>
                      <span>→</span>
                      <span>After Render: <strong className="text-indigo-300 font-semibold">{Math.max(0, credits.availableBalance - estimatedCost)}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {!hasEnoughCredits && (
                      <Link
                        href="/pricing"
                        className="px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        Top Up
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleStartGeneration}
                      disabled={isSubmitting || (!prompt.trim() && !referenceImageUrl) || !hasEnoughCredits}
                      className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer border border-white/10"
                    >
                      {isSubmitting ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span>
                        {!hasEnoughCredits
                          ? 'Insufficient Credits'
                          : isSubmitting
                          ? 'Dispatching Inference...'
                          : 'Dispatch AI Generation'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Google Vids Alternative Option Card */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs space-y-2 text-slate-300">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        G
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">
                          Google Vids Studio Workspace (External Handoff)
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Google Vids operates as a web-first Google Workspace tool without a public developer API. Refine your prompt here, then launch Google Vids in 1 click.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAndLaunchGoogleVids}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer border border-white/10"
                    >
                      {copiedVids ? <Check className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                      <span>{copiedVids ? 'Copied & Opening...' : 'Copy & Open Vids'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded font-semibold border border-indigo-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>0 Fluvia Credits Charged for Google Vids handoff. All credits remain in your wallet.</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Active Job Status & Cinema Viewport (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-6 rounded-2xl border border-white/8 bg-[#11131A] min-h-[480px] flex flex-col justify-between shadow-2xl">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-4">
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <Film className="w-4 h-4 text-indigo-400" />
                        <span>Live Cinema Viewport</span>
                      </h3>
                      {activeJob && (
                        <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                          Job: {activeJob.id.slice(0, 8)}
                        </span>
                      )}
                    </div>

                    {/* Viewport Content State */}
                    {!activeJob ? (
                      <div className="py-24 text-center">
                        <Video className="w-12 h-12 text-indigo-400 mx-auto mb-3 animate-pulse" />
                        <h4 className="font-bold text-white text-sm">Studio Ready to Render</h4>
                        <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Enter your prompt or load one of our live productive templates on the left to dispatch a 15-credit generation.
                        </p>
                      </div>
                    ) : activeJob.status === 'queued' || activeJob.status === 'processing' ? (
                      <div className="py-16 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 border-2 border-indigo-500 border-t-transparent mx-auto animate-spin" />
                        <div>
                          <h4 className="font-bold text-white text-base">
                            {activeJob.status === 'queued' ? 'Dispatched to Queue' : 'Synthesizing Neural Frames'}
                          </h4>
                          <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
                            {activeJob.progressMessage || 'Processing latent motion tensors with Gemini Omni 1.1 Flash...'}
                          </p>
                        </div>

                        <div className="max-w-xs mx-auto">
                          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1 font-semibold">
                            <span>Inference Progress</span>
                            <span>{activeJob.progressPercent || 35}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
                              style={{ width: `${activeJob.progressPercent || 35}%` }}
                            />
                          </div>
                        </div>

                        <div className="text-[11px] font-mono text-indigo-300 bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30 inline-block font-bold">
                          Atomic Reservation: {activeJob.reservedCredits} credits locked
                        </div>
                      </div>
                    ) : activeJob.status === 'completed' ? (
                      <div className="space-y-4">
                        {/* Cinema Result Video / Image / Audio Player */}
                        <div className="aspect-video rounded-xl overflow-hidden bg-black relative border border-white/10 group shadow-xl">
                          {activeJob.output?.videoUrl ? (
                            <video
                              src={activeJob.output.videoUrl}
                              controls
                              autoPlay
                              loop
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : activeJob.output?.imageUrl ? (
                            <img
                              src={activeJob.output.imageUrl}
                              alt="Generated Image"
                              className="w-full h-full object-cover"
                            />
                          ) : activeJob.output?.audioUrl ? (
                            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#090A0D] via-[#11131A] to-[#151822] text-white text-center">
                              <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20">
                                <Volume2 className="w-7 h-7 text-amber-300 animate-pulse" />
                              </div>
                              <h4 className="text-sm font-bold text-amber-200 mb-1">ElevenLabs Neural Voiceover HD</h4>
                              <p className="text-xs text-slate-300 max-w-sm line-clamp-2 italic mb-4 font-serif">
                                &ldquo;{activeJob.output.text || prompt}&rdquo;
                              </p>
                              <audio
                                controls
                                src={activeJob.output.audioUrl}
                                className="w-full max-w-xs rounded-lg accent-amber-500"
                                autoPlay
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 p-4">
                              Generated media registered to timeline.
                            </div>
                          )}
                        </div>

                        {/* Success Settlement Badge */}
                        <div className="p-3 bg-[#151822] rounded-xl border border-indigo-500/30 text-xs space-y-1">
                          <div className="flex justify-between font-bold text-white">
                            <span className="flex items-center gap-1.5 text-indigo-300">
                              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                              <span>Generation Succeeded</span>
                            </span>
                            <span className="text-indigo-400 font-mono">
                              ✓ Settled {activeJob.actualCredits || 15} cr
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px]">
                            {activeJob.progressMessage || 'Rendered with high optical fidelity via Google Gemini Omni 1.1 Flash.'}
                          </p>
                        </div>

                        {/* Action Buttons: Download Video/Audio, Remix, Edit */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {activeJob.output?.videoUrl ? (
                            <button
                              type="button"
                              onClick={() => handleDownloadVideo(activeJob.output.videoUrl)}
                              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer transition-colors border border-white/10"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download MP4</span>
                            </button>
                          ) : activeJob.output?.audioUrl ? (
                            <button
                              type="button"
                              onClick={() => handleDownloadVideo(activeJob.output.audioUrl, 'fluvia-voiceover.mp3')}
                              className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20 cursor-pointer transition-colors border border-white/10"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download MP3</span>
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => {
                              if (activeJob.input?.prompt) setPrompt(activeJob.input.prompt);
                              if (activeJob.input?.aspectRatio) setAspectRatio(activeJob.input.aspectRatio);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                            <span>Remix Prompt</span>
                          </button>
                        </div>

                        {/* Editor CTA button */}
                        {activeJob.projectId && (
                          <Link
                            href={`/editor/${activeJob.projectId}`}
                            className="w-full py-2.5 bg-white/[0.08] hover:bg-white/[0.15] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition-all border border-white/10"
                          >
                            <Film className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Open in Studio Timeline Editor</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="py-16 text-center space-y-3">
                        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                        <h4 className="font-bold text-white text-base">Generation Failed</h4>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          {activeJob.errorMessage || 'An error occurred during GPU inference.'}
                        </p>
                        <div className="text-xs text-indigo-300 bg-indigo-500/20 p-2.5 rounded-lg border border-indigo-500/30 inline-block font-bold">
                          Compensating Refund Applied: +{activeJob.reservedCredits || 15} credits returned to wallet
                        </div>
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleStartGeneration}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                          >
                            Retry Generation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/8 text-[11px] text-slate-400 flex justify-between font-medium">
                    <span>Fluvia Flow GPU Inference Cluster</span>
                    <span>15 Cr / Render</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE TEMPLATES DISCOVERY GALLERY */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">Productive Business & SaaS Video Templates</h2>
                  <p className="text-xs text-slate-400">
                    Click any live template below to load its exact cinematic prompts, aspect ratio, and model settings into the studio.
                  </p>
                </div>
                <Link
                  href="/templates"
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <span>Explore Full Feed</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {productiveTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-3.5 rounded-2xl border border-white/8 bg-[#11131A] hover:bg-[#151822] hover:border-white/20 flex flex-col justify-between shadow-xl transition-all group"
                  >
                    <div>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3">
                        <img
                          src={template.thumbnail}
                          alt={template.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                          {template.aspect}
                        </span>
                        <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          15 Cr
                        </span>
                      </div>

                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block mb-1">
                        {template.category}
                      </span>
                      <h4 className="font-black text-sm text-white line-clamp-1 mb-1">
                        {template.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {template.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLoadTemplate(template)}
                      className="w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer border border-white/10"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Use This Template</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GENERATION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">Your Generation History</h2>
                  <p className="text-xs text-slate-400">
                    Review and download all video jobs rendered under your account.
                  </p>
                </div>
                <button
                  onClick={fetchUserJobs}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-bold text-white hover:bg-white/[0.1] shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3 text-slate-300" />
                  <span>Refresh</span>
                </button>
              </div>

              {isLoadingJobs ? (
                <div className="py-16 text-center">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Loading your generation history...</p>
                </div>
              ) : userJobs.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-white/8 bg-[#11131A] p-8">
                  <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="font-bold text-white text-sm">No Generations Dispatched Yet</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 mb-4">
                    Head to the Studio Viewport or choose a template to create your first AI video.
                  </p>
                  <button
                    onClick={() => setActiveTab('studio')}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl text-xs shadow"
                  >
                    Launch Studio
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-2xl border border-white/8 bg-[#11131A] hover:border-white/16 flex flex-col justify-between space-y-3 shadow-xl transition-all"
                    >
                      <div>
                        {/* Video / Image preview */}
                        <div className="aspect-video rounded-xl overflow-hidden bg-black relative border border-white/10 mb-2">
                          {job.output?.videoUrl ? (
                            <video
                              src={job.output.videoUrl}
                              controls
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : job.output?.imageUrl ? (
                            <img
                              src={job.output.imageUrl}
                              alt="Generated output"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                              {job.status === 'processing' ? 'Generating...' : job.status}
                            </div>
                          )}

                          <span
                            className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                              job.status === 'completed'
                                ? 'bg-indigo-600 text-white'
                                : job.status === 'failed'
                                ? 'bg-rose-600 text-white'
                                : 'bg-amber-500 text-white'
                            }`}
                          >
                            {job.status.toUpperCase()}
                          </span>

                          <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10">
                            {job.input?.aspectRatio || '16:9'}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-white line-clamp-2 leading-relaxed">
                          {job.input?.prompt || 'No prompt provided'}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                          <span>{job.actualCredits || job.estimatedCredits || 15} Credits</span>
                        </div>
                      </div>

                      {/* History actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/8">
                        {job.output?.videoUrl && (
                          <button
                            type="button"
                            onClick={() => handleDownloadVideo(job.output.videoUrl)}
                            className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setActiveJob(job);
                            setActiveTab('studio');
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 text-indigo-400" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (job.input?.prompt) setPrompt(job.input.prompt);
                            if (job.input?.aspectRatio) setAspectRatio(job.input.aspectRatio);
                            setActiveTab('studio');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 font-bold text-[11px] cursor-pointer"
                          title="Remix prompt"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CreateWorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white/70 text-slate-800 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CreateWorkspaceContent />
    </Suspense>
  );
}
