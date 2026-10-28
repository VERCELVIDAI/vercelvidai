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
  Maximize2,
  Eye,
  Camera,
  Layers,
  Settings2,
  Share2,
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

const PRODUCTIVE_PRESETS = [
  'tmpl_19',
  'tmpl_20',
  'tmpl_21',
  'tmpl_22',
  'tmpl_23',
  'tmpl_24',
  'tmpl_25',
  'tmpl_26',
  'tmpl_01',
  'tmpl_09',
];

const CAMERA_PRESETS = [
  { label: 'Dolly In', promptAdd: ', slow cinematic dolly push-in, shallow depth of field' },
  { label: 'Orbit 360', promptAdd: ', smooth 360 orbital camera rotation, studio rim lighting' },
  { label: 'Drone Glide', promptAdd: ', sweeping aerial drone tracking shot, golden hour illumination' },
  { label: 'Low-Angle Tracking', promptAdd: ', dynamic low-angle speed tracking shot, anamorphic lens flare' },
  { label: 'Macro Texture', promptAdd: ', extreme macro lens detail, controlled specular reflections' },
];

function CreateWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial query parameters
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

  // Inspector panel drawer toggle (for compact workspace)
  const [inspectorOpen, setInspectorOpen] = useState(true);

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
      } catch {}
    }

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setAuthData(data);
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

  const handleApplyCameraPreset = (preset: typeof CAMERA_PRESETS[0]) => {
    if (!prompt.includes(preset.label)) {
      setPrompt((prev) => `${prev.trim()}${preset.promptAdd}`);
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

  const productiveTemplates = TEMPLATES_DATA.filter((t) =>
    PRODUCTIVE_PRESETS.includes(t.id)
  );

  return (
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden text-[#F5EAF4] bg-[#100A12] relative">
      {/* Studio Nav Rail */}
      <Sidebar credits={credits} userRole={authData?.user?.role} />

      {/* Main Studio Viewport */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#100A12]">
        <DashboardHeader
          displayName={authData?.user?.displayName}
          avatarUrl={authData?.user?.avatarUrl}
          role={authData?.user?.role}
          credits={credits.availableBalance}
          workspaceName={authData?.workspace?.name}
        />

        {/* Studio Top Command Bar */}
        <div className="sticky top-0 z-20 px-4 sm:px-6 py-2.5 bg-[#100A12]/95 backdrop-blur-xl border-b border-[#39233B] flex items-center justify-between gap-4">
          {/* Left: Mode Switcher Pills */}
          <div className="flex items-center gap-1 p-1 bg-[#211522] rounded-xl border border-[#39233B]">
            <button
              type="button"
              onClick={() => {
                setMode('video');
                setModelId('gemini-omni-1.1-flash');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'video'
                  ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-[#100A12] font-black shadow-sm'
                  : 'text-[#A99AAA] hover:text-[#F5EAF4]'
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'image'
                  ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-[#100A12] font-black shadow-sm'
                  : 'text-[#A99AAA] hover:text-[#F5EAF4]'
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'audio'
                  ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-[#100A12] font-black shadow-sm'
                  : 'text-[#A99AAA] hover:text-[#F5EAF4]'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voiceover HD</span>
            </button>
          </div>

          {/* Right: Studio Mode Tabs & Inspector Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-[#211522] rounded-xl border border-[#39233B] text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('studio')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'studio'
                    ? 'bg-[#100A12] text-[#F5EAF4] border border-[#39233B] shadow-xs'
                    : 'text-[#A99AAA] hover:text-[#F5EAF4]'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-[#F05BCE]" />
                <span className="hidden sm:inline">Studio Viewport</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'templates'
                    ? 'bg-[#100A12] text-[#F5EAF4] border border-[#39233B] shadow-xs'
                    : 'text-[#A99AAA] hover:text-[#F5EAF4]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#F05BCE]" />
                <span className="hidden sm:inline">Live Templates ({productiveTemplates.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('history');
                  fetchUserJobs();
                }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[#100A12] text-[#F5EAF4] border border-[#39233B] shadow-xs'
                    : 'text-[#A99AAA] hover:text-[#F5EAF4]'
                }`}
              >
                <History className="w-3.5 h-3.5 text-[#F05BCE]" />
                <span className="hidden sm:inline">History ({userJobs.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setInspectorOpen(!inspectorOpen)}
              title={inspectorOpen ? 'Hide Parameters Inspector' : 'Show Parameters Inspector'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer hidden lg:flex items-center justify-center ${
                inspectorOpen ? 'bg-[#F05BCE]/15 border-[#F05BCE]/40 text-[#F05BCE]' : 'bg-[#211522] border-[#39233B] text-[#A99AAA] hover:text-[#F5EAF4]'
              }`}
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="m-4 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between gap-3 shadow-xs">
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

        {/* ========================================================================= */}
        {/* TAB 1: RADICAL CINEMATIC CREATIVE STUDIO */}
        {/* ========================================================================= */}
        {activeTab === 'studio' && (
          <main className="flex-1 flex flex-col lg:flex-row min-w-0 p-4 sm:p-6 gap-6 items-stretch">
            {/* CENTER: CINEMA VIEWPORT & FLOATING COMMAND BAR */}
            <div className="flex-1 flex flex-col justify-between min-w-0 space-y-4">
              
              {/* STAGE: Large Cinema Display Monitor */}
              <div className="relative w-full rounded-3xl border border-[#39233B] bg-[#211522] overflow-hidden flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] shadow-2xl group">
                
                {/* Cinema Crosshair & Aspect Frame Watermarks */}
                <div className="absolute inset-4 pointer-events-none border border-[#39233B]/50 rounded-2xl flex flex-col justify-between p-3 z-10">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#A99AAA] font-bold uppercase tracking-wider">
                    <span>FLUVIA CINEMA • 4K RENDER</span>
                    <span>{aspectRatio} • {durationSec}s</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#A99AAA]">
                    <span>MODEL: {selectedModelObj.name}</span>
                    <span>15 Credits</span>
                  </div>
                </div>

                {/* VIEWPORT CONTENT STATES */}
                {!activeJob ? (
                  // IDLE MONITOR STATE
                  <div className="py-20 px-6 text-center z-10 max-w-lg mx-auto space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#F05BCE]/10 border border-[#F05BCE]/30 text-[#F05BCE] flex items-center justify-center mx-auto shadow-inner">
                      <Camera className="w-8 h-8 text-[#F05BCE] animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#F5EAF4] tracking-tight">
                        Studio Viewport Ready
                      </h3>
                      <p className="mt-1 text-xs text-[#A99AAA] leading-relaxed">
                        Enter your creative prompt below or select a camera motion path to synthesize 4K cinematic commercial video with Google Gemini Omni 1.1 Flash.
                      </p>
                    </div>

                    {/* Camera Presets Chips */}
                    <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                      {CAMERA_PRESETS.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => handleApplyCameraPreset(p)}
                          className="px-2.5 py-1 rounded-full bg-[#100A12] hover:bg-[#211522] border border-[#39233B] text-[#A99AAA] hover:text-[#F5EAF4] text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          + {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : activeJob.status === 'queued' || activeJob.status === 'processing' ? (
                  // NEURAL SYNTHESIS PROGRESS STATE
                  <div className="py-16 px-6 text-center z-10 max-w-md mx-auto space-y-5">
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-[#F05BCE]/30 animate-ping" />
                      <div className="w-20 h-20 rounded-full bg-[#F05BCE]/20 border-2 border-[#F05BCE] border-t-transparent animate-spin" />
                      <Film className="w-8 h-8 text-[#F05BCE] absolute" />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#F05BCE] font-bold block mb-1">
                        NEURAL INFERENCE IN PROGRESS
                      </span>
                      <h3 className="text-lg font-black text-[#F5EAF4]">
                        {activeJob.status === 'queued' ? 'Dispatched to Queue' : 'Synthesizing Latent Frames'}
                      </h3>
                      <p className="text-xs text-[#A99AAA] mt-1 max-w-xs mx-auto">
                        {activeJob.progressMessage || 'Processing latent motion tensors with Gemini Omni 1.1 Flash...'}
                      </p>
                    </div>

                    {/* Progress Bar & Telemetry */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-mono text-[#A99AAA] font-semibold px-1">
                        <span>Diffusion Step</span>
                        <span>{activeJob.progressPercent || 45}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#100A12] rounded-full overflow-hidden border border-[#39233B]">
                        <div
                          className="h-full bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] transition-all duration-500"
                          style={{ width: `${activeJob.progressPercent || 45}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : activeJob.status === 'completed' ? (
                  // FINISHED RENDER PLAYBACK STATE
                  <div className="w-full h-full flex flex-col justify-between relative z-10 bg-[#100A12]">
                    {/* VIDEO OUTPUT */}
                    {activeJob.output?.videoUrl ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-[#100A12]">
                        <video
                          src={activeJob.output.videoUrl}
                          controls
                          autoPlay
                          loop
                          playsInline
                          className="w-full max-h-[520px] object-contain rounded-2xl shadow-2xl"
                        />
                      </div>
                    ) : activeJob.output?.audioUrl ? (
                      // ELEVENLABS AUDIO PLAYER
                      <div className="p-8 text-center space-y-6 max-w-lg mx-auto my-auto">
                        <div className="w-16 h-16 rounded-full bg-[#F05BCE]/20 border border-[#F05BCE]/40 text-[#F05BCE] flex items-center justify-center mx-auto shadow-lg">
                          <Volume2 className="w-8 h-8" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#F05BCE] font-bold">
                            ElevenLabs Neural Voiceover HD
                          </span>
                          <h4 className="text-xl font-black text-[#F5EAF4] mt-1">Voiceover Synthesized</h4>
                          <p className="text-xs text-[#F5EAF4] mt-2 italic bg-[#100A12] p-3 rounded-xl border border-[#39233B]">
                            "{activeJob.output.text}"
                          </p>
                        </div>
                        <audio src={activeJob.output.audioUrl} controls className="w-full rounded-xl" autoPlay />
                        <div className="flex justify-center gap-3">
                          <a
                            href={activeJob.output.audioUrl}
                            download="fluvia-voiceover.mp3"
                            className="px-4 py-2 rounded-xl bg-[#F05BCE] hover:bg-[#E046BD] text-[#100A12] font-black text-xs flex items-center gap-2 shadow"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download MP3</span>
                          </a>
                        </div>
                      </div>
                    ) : activeJob.output?.imageUrl ? (
                      // IMAGE OUTPUT
                      <div className="relative w-full h-full flex items-center justify-center bg-[#100A12]">
                        <img
                          src={activeJob.output.imageUrl}
                          alt="Rendered Output"
                          className="w-full max-h-[520px] object-contain rounded-2xl shadow-2xl"
                        />
                      </div>
                    ) : (
                      <div className="p-8 text-center text-[#A99AAA]">
                        Render completed without preview output.
                      </div>
                    )}

                    {/* Stage Control Action Strip */}
                    <div className="p-4 bg-gradient-to-t from-[#100A12] via-[#100A12]/90 to-transparent flex items-center justify-between gap-3 border-t border-[#39233B]">
                      <div className="text-xs text-[#F5EAF4] font-medium truncate max-w-md">
                        {activeJob.output?.videoUrl ? 'Gemini Omni 1.1 Flash 4K Video Render' : 'Synthesized Generation'}
                      </div>

                      <div className="flex items-center gap-2">
                        {activeJob.output?.videoUrl && (
                          <button
                            type="button"
                            onClick={() => handleDownloadVideo(activeJob.output.videoUrl)}
                            className="px-4 py-2 rounded-xl bg-[#F05BCE] hover:bg-[#E046BD] text-[#100A12] font-black text-xs flex items-center gap-1.5 shadow-lg shadow-[#F05BCE]/25 cursor-pointer border border-[#F05BCE]/40"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download MP4</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (activeJob.input?.prompt) setPrompt(activeJob.input.prompt);
                            if (activeJob.input?.aspectRatio) setAspectRatio(activeJob.input.aspectRatio);
                          }}
                          className="px-3 py-2 rounded-xl bg-[#211522] hover:bg-[#100A12] text-[#F5EAF4] font-bold text-xs flex items-center gap-1.5 border border-[#39233B] cursor-pointer"
                          title="Remix Prompt"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-[#F05BCE]" />
                          <span>Remix Prompt</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // FAILED STATE
                  <div className="py-16 px-6 text-center z-10 max-w-sm mx-auto space-y-3">
                    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                    <h3 className="text-lg font-black text-[#F5EAF4]">Generation Failed</h3>
                    <p className="text-xs text-rose-300">
                      {activeJob.error || 'The model was unable to complete this generation. Your credits have been restored.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveJob(null)}
                      className="px-4 py-2 rounded-xl bg-[#100A12] hover:bg-[#211522] text-[#F5EAF4] text-xs font-bold border border-[#39233B]"
                    >
                      Reset Viewport
                    </button>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* FLOATING CREATIVE COMMAND DOCK (PROMPT COMPOSER) */}
              {/* ========================================================================= */}
              <div className="rounded-3xl border border-[#39233B] bg-[#211522] p-4 sm:p-5 shadow-2xl space-y-4">
                
                {/* Prompt Textarea & Gemini Enhance */}
                <div className="relative">
                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      mode === 'video'
                        ? 'Describe your cinematic scene... (e.g. Ultra-luxury midnight chronograph watch floating in zero-gravity, studio reflections, 4k commercial camera move)'
                        : mode === 'audio'
                        ? 'Enter the narration script for ElevenLabs Neural Voiceover HD...'
                        : 'Describe the photorealistic subject, lighting, and composition...'
                    }
                    className="w-full bg-[#100A12] text-[#F5EAF4] px-4 py-3 rounded-2xl border border-[#39233B] focus:outline-none focus:border-[#F05BCE] placeholder-[#A99AAA]/50 text-sm leading-relaxed resize-none transition-colors"
                  />

                  {/* Gemini AI Enhance Button */}
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleEnhancePrompt}
                      disabled={isEnhancing || !prompt.trim()}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        enhancementApplied
                          ? 'bg-[#F05BCE]/25 text-[#F5EAF4] border border-[#F05BCE]'
                          : 'bg-[#F05BCE]/15 hover:bg-[#F05BCE]/25 text-[#F05BCE] border border-[#F05BCE]/40'
                      }`}
                    >
                      {isEnhancing ? (
                        <span className="w-3 h-3 border-2 border-[#F05BCE] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-[#F05BCE]" />
                      )}
                      <span>{enhancementApplied ? 'Enhanced by Gemini!' : 'Gemini AI Enhance'}</span>
                    </button>
                  </div>
                </div>

                {/* Command Bar Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  
                  {/* Left Controls: Aspect Ratio & Duration */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {mode !== 'audio' && (
                      <div className="flex items-center gap-1 bg-[#100A12] p-1 rounded-xl border border-[#39233B]">
                        {(['16:9', '9:16', '1:1', '4:3'] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setAspectRatio(r)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                              aspectRatio === r
                                ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-[#100A12] font-black shadow-xs'
                                : 'text-[#A99AAA] hover:text-[#F5EAF4]'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    )}

                    {mode === 'video' && (
                      <div className="flex items-center gap-1 bg-[#100A12] p-1 rounded-xl border border-[#39233B] text-[11px] font-mono">
                        {[5, 10, 15].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDurationSec(d)}
                            className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                              durationSec === d
                                ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-[#100A12] font-black shadow-xs'
                                : 'text-[#A99AAA] hover:text-[#F5EAF4]'
                            }`}
                          >
                            {d}s
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Cost Telemetry Pill */}
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#100A12] border border-[#39233B] text-[11px] font-mono text-[#A99AAA]">
                      <Zap className="w-3.5 h-3.5 text-[#F05BCE]" />
                      <span>Cost: <strong className="text-[#F5EAF4] font-bold">{estimatedCost} Credits</strong></span>
                    </div>
                  </div>

                  {/* Right Controls: Dispatch Button */}
                  <div className="flex items-center gap-2 ml-auto">
                    {!hasEnoughCredits && (
                      <Link
                        href="/pricing"
                        className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#100A12] text-xs font-bold transition-all shadow-xs"
                      >
                        Top Up
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleStartGeneration}
                      disabled={isSubmitting || (!prompt.trim() && !referenceImageUrl) || !hasEnoughCredits}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:opacity-95 text-[#100A12] font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F05BCE]/25 transition-all disabled:opacity-50 cursor-pointer border border-[#F05BCE]/40"
                    >
                      {isSubmitting ? (
                        <span className="inline-block w-4 h-4 border-2 border-[#100A12]/40 border-t-[#100A12] rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-[#100A12]" />
                      )}
                      <span>
                        {!hasEnoughCredits
                          ? 'Insufficient Credits'
                          : isSubmitting
                          ? 'Dispatching Inference...'
                          : 'Dispatch AI Generation'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#100A12]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RIGHT: CONTEXTUAL INSPECTOR PANEL (PARAMETERS & GOOGLE VIDS) */}
            {/* ========================================================================= */}
            {inspectorOpen && (
              <div className="w-full lg:w-80 shrink-0 space-y-4">
                
                {/* 1. Model Engine Selector */}
                <div className="p-4 rounded-2xl border border-[#39233B] bg-[#211522] space-y-3 text-xs shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#A99AAA] uppercase tracking-wider text-[10px]">
                      Active Model Policy
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#F05BCE] bg-[#F05BCE]/15 px-2 py-0.5 rounded border border-[#F05BCE]/30">
                      15 Credits
                    </span>
                  </div>

                  <select
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                    className="w-full bg-[#100A12] text-[#F5EAF4] px-3 py-2 rounded-xl border border-[#39233B] focus:outline-none focus:border-[#F05BCE] text-xs cursor-pointer font-bold"
                  >
                    {MODELS.map((m) => (
                      <option
                        key={m.id}
                        value={m.id}
                        disabled={!m.active}
                        className={`bg-[#211522] ${m.active ? 'text-[#F5EAF4] font-bold' : 'text-[#A99AAA] italic'}`}
                      >
                        {m.name} {!m.active ? '(Coming Soon)' : `(${m.cost} cr)`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Video Workflow: Text-to-Video vs Image-to-Video */}
                {mode === 'video' && (
                  <div className="p-4 rounded-2xl border border-[#39233B] bg-[#211522] space-y-3 text-xs shadow-xl">
                    <span className="font-bold text-[#A99AAA] uppercase tracking-wider text-[10px] block">
                      Input Workflow
                    </span>

                    <div className="grid grid-cols-2 gap-1 bg-[#100A12] p-1 rounded-xl border border-[#39233B]">
                      <button
                        type="button"
                        onClick={() => setVideoInputType('text')}
                        className={`py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          videoInputType === 'text'
                            ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-[#100A12] font-black shadow-2xs'
                            : 'text-[#A99AAA] hover:text-[#F5EAF4]'
                        }`}
                      >
                        Text-to-Video
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoInputType('image')}
                        className={`py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          videoInputType === 'image'
                            ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-[#100A12] font-black shadow-2xs'
                            : 'text-[#A99AAA] hover:text-[#F5EAF4]'
                        }`}
                      >
                        Image-to-Video
                      </button>
                    </div>

                    {/* Image-to-Video Upload Zone */}
                    {videoInputType === 'image' && (
                      <div className="space-y-2 pt-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-to-video-file-input"
                        />

                        {!uploadedImagePreview ? (
                          <label
                            htmlFor="image-to-video-file-input"
                            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#39233B] hover:border-[#F05BCE]/50 rounded-xl bg-[#100A12]/50 hover:bg-[#100A12] transition-colors cursor-pointer text-center"
                          >
                            <UploadCloud className="w-6 h-6 text-[#F05BCE] mb-1" />
                            <span className="font-bold text-[#F5EAF4] text-xs">Upload Starting Frame</span>
                            <span className="text-[10px] text-[#A99AAA] mt-0.5">PNG, JPG, WEBP up to 10MB</span>
                          </label>
                        ) : (
                          <div className="relative rounded-xl overflow-hidden border border-[#39233B] group">
                            <img
                              src={uploadedImagePreview}
                              alt="Uploaded source frame"
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-[#100A12]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={handleClearImage}
                                className="p-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                            <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-[#100A12]/90 text-[#F5EAF4] px-2 py-0.5 rounded font-mono truncate max-w-[180px]">
                              {uploadedImageName || 'Starting Frame'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Neural Voiceover Selector (when mode === 'audio') */}
                {mode === 'audio' && (
                  <div className="p-4 rounded-2xl border border-[#39233B] bg-[#211522] space-y-3 text-xs shadow-xl">
                    <span className="font-bold text-[#A99AAA] uppercase tracking-wider text-[10px] block">
                      ElevenLabs Neural Voice
                    </span>

                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full bg-[#100A12] text-[#F5EAF4] px-3 py-2 rounded-xl border border-[#39233B] focus:outline-none focus:border-[#F05BCE] text-xs cursor-pointer font-bold"
                    >
                      {availableVoices.map((v) => (
                        <option key={v.voiceId || v.id} value={v.voiceId || v.id} className="bg-[#211522] text-[#F5EAF4]">
                          {v.name} ({v.gender || 'Neural'})
                        </option>
                      ))}
                    </select>

                    {/* Quick Voice Chips */}
                    <div className="space-y-1.5 pt-1">
                      {availableVoices.slice(0, 4).map((v) => (
                        <div
                          key={v.voiceId || v.id}
                          onClick={() => setSelectedVoice(v.voiceId || v.id)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            selectedVoice === (v.voiceId || v.id)
                              ? 'bg-[#F05BCE]/20 border-[#F05BCE] text-[#F5EAF4]'
                              : 'bg-[#100A12] border-[#39233B] hover:border-[#39233B]/80 text-[#A99AAA]'
                          }`}
                        >
                          <span className="font-bold truncate text-[11px]">{v.name.split('-')[0].trim()}</span>
                          {v.previewUrl && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleVoicePreview(v.previewUrl, v.voiceId || v.id);
                              }}
                              className="p-1 rounded-full text-[#F05BCE] hover:text-white"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Negative Prompt Drawer */}
                <div className="p-4 rounded-2xl border border-[#39233B] bg-[#211522] space-y-2 text-xs shadow-xl">
                  <span className="font-bold text-[#A99AAA] uppercase tracking-wider text-[10px] block">
                    Negative Prompt (Exclusions)
                  </span>
                  <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="blurry, distorted anatomy, low quality, artifacts..."
                    className="w-full bg-[#100A12] text-[#F5EAF4] px-3 py-2 rounded-xl border border-[#39233B] focus:outline-none focus:border-[#F05BCE] placeholder-[#A99AAA]/50 text-xs"
                  />
                </div>

                {/* 5. Transparent Google Vids Handoff Card */}
                <div className="p-4 rounded-2xl bg-[#211522] border border-[#39233B] text-xs space-y-2 text-[#A99AAA] shadow-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F05BCE] to-[#C026D3] text-[#100A12] font-black text-xs flex items-center justify-center shrink-0">
                        G
                      </div>
                      <div>
                        <p className="font-bold text-[#F5EAF4] text-xs">
                          Google Vids Studio Workspace
                        </p>
                        <p className="text-[10px] text-[#A99AAA]">
                          External Google Workspace tool
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAndLaunchGoogleVids}
                      className="px-3 py-1.5 rounded-lg bg-[#F05BCE] hover:bg-[#E046BD] text-[#100A12] font-black text-[11px] flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer border border-[#F05BCE]/40"
                    >
                      {copiedVids ? <Check className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                      <span>{copiedVids ? 'Opening...' : 'Launch (0 cr)'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-[#F05BCE] bg-[#F05BCE]/15 px-2 py-1 rounded font-semibold border border-[#F05BCE]/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F05BCE]" />
                    <span>0 Fluvia Credits Charged for Google Vids handoff.</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LIVE PRODUCTIVE TEMPLATES VAULT */}
        {/* ========================================================================= */}
        {activeTab === 'templates' && (
          <main className="flex-1 p-5 sm:p-8 max-w-7xl mx-auto w-full space-y-6 text-left">
            <div>
              <h2 className="text-xl font-black text-[#F5EAF4]">Live Productive Templates</h2>
              <p className="text-xs text-[#A99AAA] mt-1">
                Agency-grade commercial video prompts curated for high-converting advertising campaigns.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productiveTemplates.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl border border-[#39233B] bg-[#211522] hover:border-[#F05BCE]/50 flex flex-col justify-between space-y-4 shadow-xl transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F05BCE]/15 text-[#F05BCE] font-mono border border-[#F05BCE]/30">
                        {t.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#A99AAA]">15 Credits</span>
                    </div>
                    <h3 className="font-bold text-[#F5EAF4] text-sm group-hover:text-[#F05BCE] transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-xs text-[#A99AAA] line-clamp-3 leading-relaxed">
                      {t.prompt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLoadTemplate(t)}
                    className="w-full py-2 rounded-xl bg-[#F05BCE]/15 hover:bg-[#F05BCE] text-[#F05BCE] hover:text-[#100A12] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[#F05BCE]/30"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Use Template in Studio</span>
                  </button>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: GENERATION HISTORY & REEL ITERATIONS */}
        {/* ========================================================================= */}
        {activeTab === 'history' && (
          <main className="flex-1 p-5 sm:p-8 max-w-7xl mx-auto w-full space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#F5EAF4]">Your Generation History</h2>
                <p className="text-xs text-[#A99AAA] mt-1">
                  Review, download, and remix all video and audio jobs rendered under your account.
                </p>
              </div>
              <button
                onClick={fetchUserJobs}
                className="px-3 py-1.5 rounded-lg bg-[#211522] border border-[#39233B] text-xs font-bold text-[#F5EAF4] hover:bg-[#100A12] shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#A99AAA]" />
                <span>Refresh</span>
              </button>
            </div>

            {isLoadingJobs ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-2 border-[#F05BCE] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-[#A99AAA]">Loading your generation history...</p>
              </div>
            ) : userJobs.length === 0 ? (
              <div className="py-20 text-center rounded-2xl border border-[#39233B] bg-[#211522] p-8">
                <Film className="w-12 h-12 text-[#A99AAA]/50 mx-auto mb-3" />
                <h4 className="font-bold text-[#F5EAF4] text-sm">No Generations Dispatched Yet</h4>
                <p className="text-xs text-[#A99AAA] max-w-xs mx-auto mt-1 mb-4">
                  Head to the Studio Viewport or choose a template to create your first AI video.
                </p>
                <button
                  onClick={() => setActiveTab('studio')}
                  className="px-4 py-2 bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] text-[#100A12] font-black rounded-xl text-xs shadow-lg shadow-[#F05BCE]/25 cursor-pointer"
                >
                  Launch Studio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {userJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl border border-[#39233B] bg-[#211522] hover:border-[#39233B]/80 flex flex-col justify-between space-y-3 shadow-xl transition-all"
                  >
                    <div>
                      {/* Video / Image preview */}
                      <div className="aspect-video rounded-xl overflow-hidden bg-[#100A12] relative border border-[#39233B] mb-2">
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
                          <div className="w-full h-full flex items-center justify-center text-[#A99AAA] text-xs">
                            {job.status === 'processing' ? 'Generating...' : job.status}
                          </div>
                        )}

                        <span
                          className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                            job.status === 'completed'
                              ? 'bg-[#F05BCE] text-[#100A12] font-black'
                              : job.status === 'failed'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {job.status.toUpperCase()}
                        </span>

                        <span className="absolute bottom-2 right-2 bg-[#100A12]/90 backdrop-blur-md text-[#F5EAF4] text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#39233B]">
                          {job.input?.aspectRatio || '16:9'}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-[#F5EAF4] line-clamp-2 leading-relaxed">
                        {job.input?.prompt || 'No prompt provided'}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-[#A99AAA] mt-2 font-mono">
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        <span>{job.actualCredits || job.estimatedCredits || 15} Credits</span>
                      </div>
                    </div>

                    {/* History actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#39233B]">
                      {job.output?.videoUrl && (
                        <button
                          type="button"
                          onClick={() => handleDownloadVideo(job.output.videoUrl)}
                          className="flex-1 py-1.5 rounded-lg bg-[#F05BCE] hover:bg-[#E046BD] text-[#100A12] font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download MP4</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setActiveJob(job);
                          setActiveTab('studio');
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-[#100A12] hover:bg-[#211522] text-[#F5EAF4] font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer border border-[#39233B]"
                      >
                        <Play className="w-3 h-3 text-[#F05BCE]" />
                        <span>View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (job.input?.prompt) setPrompt(job.input.prompt);
                          if (job.input?.aspectRatio) setAspectRatio(job.input.aspectRatio);
                          setActiveTab('studio');
                        }}
                        className="p-1.5 rounded-lg bg-[#100A12] hover:bg-[#211522] text-[#A99AAA] hover:text-[#F5EAF4] font-bold text-[11px] cursor-pointer border border-[#39233B]"
                        title="Remix Prompt"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#100A12] text-[#F5EAF4] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#F05BCE] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CreateWorkspaceContent />
    </Suspense>
  );
}
