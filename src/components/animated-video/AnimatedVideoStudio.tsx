'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Code,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  Upload,
  ArrowRight,
  Clock,
  History,
  X,
  Mic,
  MicOff,
  ExternalLink,
  ChevronDown,
  Layers,
  Film,
  Lock,
  Coins,
  Trash2,
} from 'lucide-react';
import { ANIMATION_STYLES, STYLE_SAMPLE_JSONS, MASTER_AI_PROMPTS } from '@/lib/animated-video/styles';
import { AnimationStyleId, AnimatedScene, AnimatedVideoHistoryItem } from '@/lib/animated-video/types';

interface StudioProps {
  initialStyleId?: AnimationStyleId;
  onStyleChange?: (styleId: AnimationStyleId) => void;
}

export function AnimatedVideoStudio({ initialStyleId = 'mythology', onStyleChange }: StudioProps) {
  const [selectedStyleId, setSelectedStyleId] = useState<AnimationStyleId>(initialStyleId);

  // Sync if parent updates initialStyleId
  useEffect(() => {
    if (initialStyleId && initialStyleId !== selectedStyleId) {
      setSelectedStyleId(initialStyleId);
      const sample = STYLE_SAMPLE_JSONS[initialStyleId] || STYLE_SAMPLE_JSONS['mythology'];
      setScenes(sample);
      setRawJsonText(JSON.stringify(sample, null, 2));
    }
  }, [initialStyleId]);

  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [scenes, setScenes] = useState<AnimatedScene[]>(() => {
    return STYLE_SAMPLE_JSONS[initialStyleId] || STYLE_SAMPLE_JSONS['mythology'];
  });

  const [rawJsonText, setRawJsonText] = useState(() => {
    return JSON.stringify(STYLE_SAMPLE_JSONS[initialStyleId] || STYLE_SAMPLE_JSONS['mythology'], null, 2);
  });

  // Validation state
  const [validationState, setValidationState] = useState<{ status: 'idle' | 'valid' | 'invalid'; message: string }>({
    status: 'idle',
    message: '',
  });

  // Prompt View Modal
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isCopiedPrompt, setIsCopiedPrompt] = useState(false);

  // Voice tab state: 'elevenlabs' | 'cartesia' | 'my_recording' | 'no_voice'
  const [voiceTab, setVoiceTab] = useState<'elevenlabs' | 'cartesia' | 'my_recording' | 'no_voice'>('elevenlabs');
  const [elevenApiKey, setElevenApiKey] = useState('');
  const [elevenVoices, setElevenVoices] = useState<Array<{ voice_id: string; name: string; category?: string }>>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState('21m00Tcm4TlvDq8ikWAM'); // Default Rachel / Indian voice
  const [customVoiceId, setCustomVoiceId] = useState('');
  const [voiceModel, setVoiceModel] = useState('eleven_multilingual_v2');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  const [isSynthesizingVoice, setIsSynthesizingVoice] = useState(false);
  const [voiceSuccessMsg, setVoiceSuccessMsg] = useState('');
  const [voiceErrorMsg, setVoiceErrorMsg] = useState('');

  // Cartesia state
  const [cartesiaApiKey, setCartesiaApiKey] = useState('');
  const [cartesiaVoice, setCartesiaVoice] = useState('sonic-hindi-fluent');

  // Custom audio upload / mic state
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  const [uploadedAudioName, setUploadedAudioName] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Synthesized or active audio URL
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);

  // Player & Timeline state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);

  // History Drawer state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<AnimatedVideoHistoryItem[]>([]);

  // Export / Credits modal state
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [creditErrorModal, setCreditErrorModal] = useState<{
    isOpen: boolean;
    message: string;
    required: number;
    available?: number;
    requiresAuth?: boolean;
  }>({
    isOpen: false,
    message: '',
    required: 20,
    requiresAuth: false,
  });

  const activeStyle = ANIMATION_STYLES.find((s) => s.id === selectedStyleId) || ANIMATION_STYLES[0];
  const totalDuration = useMemo(() => {
    return scenes.reduce((acc, s) => acc + (s.duration || 5), 0);
  }, [scenes]);

  // Compute total characters in the script for voice generation
  const totalScriptChars = useMemo(() => {
    return scenes.reduce((acc, s) => {
      const text = s.say || s.narration || '';
      return acc + text.length;
    }, 0);
  }, [scenes]);

  // Load saved ElevenLabs API key and History from localStorage on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('OXFLOW_ELEVENLABS_KEY');
      if (savedKey) setElevenApiKey(savedKey);

      const savedHistory = localStorage.getItem('OXFLOW_ANIMATED_VIDEO_HISTORY');
      if (savedHistory) {
        setHistoryItems(JSON.parse(savedHistory));
      }
    } catch (e) {
      // LocalStorage not available or blocked
    }
  }, []);

  // When user switches style pill
  const handleSelectStyle = (styleId: AnimationStyleId) => {
    setSelectedStyleId(styleId);
    onStyleChange?.(styleId);
    const sample = STYLE_SAMPLE_JSONS[styleId] || STYLE_SAMPLE_JSONS['flat-vector'];
    setScenes(sample);
    setRawJsonText(JSON.stringify(sample, null, 2));
    setValidationState({ status: 'valid', message: `Loaded ${styleId} preset script.` });
    setCurrentSceneIdx(0);
    setCurrentTimeSec(0);
    setIsPlaying(false);
  };

  // Live parse JSON on change
  const handleJsonChange = (text: string) => {
    setRawJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setScenes(parsed);
        setValidationState({ status: 'valid', message: `Parsed ${parsed.length} scenes live.` });
      }
    } catch (e) {
      // User is actively typing, don't show red error immediately unless loaded
    }
  };

  // Explicit Load script action
  const handleLoadScript = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Root JSON must be an array of scenes: [ { "scene": 1, ... } ]');
      }
      if (parsed.length === 0) {
        throw new Error('Scenes array cannot be empty. Please include at least 1 scene.');
      }
      setScenes(parsed);
      setCurrentSceneIdx(0);
      setCurrentTimeSec(0);
      setValidationState({ status: 'valid', message: `Success: Loaded ${parsed.length} scenes into player.` });
    } catch (err: any) {
      setValidationState({ status: 'invalid', message: `JSON Error: ${err.message}` });
    }
  };

  // Load Sample
  const handleLoadSample = () => {
    const sample = STYLE_SAMPLE_JSONS[selectedStyleId] || STYLE_SAMPLE_JSONS['mythology'];
    setScenes(sample);
    setRawJsonText(JSON.stringify(sample, null, 2));
    setCurrentSceneIdx(0);
    setCurrentTimeSec(0);
    setValidationState({ status: 'valid', message: `Loaded example JSON for ${activeStyle.name}.` });
  };

  // Clear JSON
  const handleClearJson = () => {
    setRawJsonText('[\n  \n]');
    setScenes([]);
    setValidationState({ status: 'idle', message: '' });
  };

  // Upload .json file
  const handleUploadJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawJsonText(content);
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            setScenes(parsed);
            setValidationState({ status: 'valid', message: `Loaded ${parsed.length} scenes from ${file.name}.` });
            setCurrentSceneIdx(0);
          }
        } catch (err: any) {
          setValidationState({ status: 'invalid', message: `Invalid JSON in ${file.name}: ${err.message}` });
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Copy AI Prompt
  const handleCopyAiPrompt = () => {
    const prompt = MASTER_AI_PROMPTS[selectedStyleId] || MASTER_AI_PROMPTS.mythology;
    navigator.clipboard.writeText(prompt);
    setIsCopiedPrompt(true);
    setTimeout(() => setIsCopiedPrompt(false), 2000);
  };

  // Fetch ElevenLabs voices with user's key
  const handleLoadElevenVoices = async () => {
    if (!elevenApiKey.trim().startsWith('sk_')) {
      setVoiceErrorMsg('Please enter a valid ElevenLabs API key starting with sk_');
      return;
    }
    setIsLoadingVoices(true);
    setVoiceErrorMsg('');
    setVoiceSuccessMsg('');

    try {
      localStorage.setItem('OXFLOW_ELEVENLABS_KEY', elevenApiKey.trim());
      const res = await fetch('/api/animated-video/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_voices', apiKey: elevenApiKey.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to load voices');
      }
      if (data.voices && Array.isArray(data.voices)) {
        setElevenVoices(data.voices);
        setVoiceSuccessMsg(`Loaded ${data.voices.length} voices successfully.`);
        if (data.voices.length > 0) {
          setSelectedVoiceId(data.voices[0].voice_id);
        }
      }
    } catch (err: any) {
      setVoiceErrorMsg(err.message || 'Error connecting to ElevenLabs');
    } finally {
      setIsLoadingVoices(false);
    }
  };

  // Generate voice synthesis via ElevenLabs
  const handleGenerateVoice = async () => {
    const allNarration = scenes
      .map((s) => s.say || s.narration || '')
      .filter(Boolean)
      .join(' ');

    if (!allNarration.trim()) {
      setVoiceErrorMsg('No narration text found in scenes to synthesize.');
      return;
    }

    if (!elevenApiKey.trim().startsWith('sk_')) {
      setVoiceErrorMsg('Please enter your ElevenLabs API key (sk_...) first.');
      return;
    }

    setIsSynthesizingVoice(true);
    setVoiceErrorMsg('');
    setVoiceSuccessMsg('');

    try {
      const voiceToUse = customVoiceId.trim() || selectedVoiceId;
      const res = await fetch('/api/animated-video/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'synthesize',
          apiKey: elevenApiKey.trim(),
          text: allNarration,
          voiceId: voiceToUse,
          modelId: voiceModel,
          speed: voiceSpeed,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Speech synthesis failed');
      }

      if (data.audioUrl) {
        setActiveAudioUrl(data.audioUrl);
        setVoiceSuccessMsg('Voice generated and synced to player!');
      }
    } catch (err: any) {
      setVoiceErrorMsg(err.message || 'Failed to synthesize voice');
    } finally {
      setIsSynthesizingVoice(false);
    }
  };

  // Handle custom audio file upload
  const handleUploadAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedAudioUrl(url);
    setUploadedAudioName(file.name);
    setActiveAudioUrl(url);
    setVoiceSuccessMsg(`Loaded audio file: ${file.name}`);
  };

  // Start microphone recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const url = URL.createObjectURL(audioBlob);
        setUploadedAudioUrl(url);
        setUploadedAudioName('Mic Recording.mp3');
        setActiveAudioUrl(url);
        setVoiceSuccessMsg('Recording saved and synced to player!');
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access was denied or is not supported in this browser.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Play / Pause Preview Simulation
  const handleTogglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play().catch(() => {});
      if (activeAudioUrl && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  };

  // Scrubber & Timeline interval
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.currentTime = 0;
            return 0;
          }
          const next = prev + 1;
          // Compute active scene
          let elapsed = 0;
          for (let i = 0; i < scenes.length; i++) {
            elapsed += scenes[i].duration || 5;
            if (next <= elapsed) {
              setCurrentSceneIdx(i);
              break;
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration, scenes]);

  // Export Video Handler (Consumes 20 Video Credits)
  const handleExportVideo = async () => {
    setIsExporting(true);
    setExportComplete(false);

    try {
      const res = await fetch('/api/animated-video/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: scenes[0]?.on_screen_text || `${activeStyle.name} Video`,
          styleId: selectedStyleId,
          scenes,
          aspectRatio,
          duration: totalDuration,
          audioUrl: activeAudioUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setCreditErrorModal({
            isOpen: true,
            message: data.error || 'Please sign in to export videos. Exports require an active plan or video credits.',
            required: 20,
            requiresAuth: true,
          });
          return;
        }
        if (res.status === 402) {
          setCreditErrorModal({
            isOpen: true,
            message: data.error || 'Insufficient video credits. Please upgrade your plan to export videos.',
            required: data.requiredCredits || 20,
            available: data.availableBalance || 0,
            requiresAuth: false,
          });
          return;
        }
        throw new Error(data.error || 'Failed to export video');
      }

      // Successful export! Deducted 20 credits
      setExportComplete(true);

      const newHistoryItem: AnimatedVideoHistoryItem = {
        id: data.project?.id || `vid_${Date.now()}`,
        title: scenes[0]?.on_screen_text || `${activeStyle.name} Short`,
        styleId: selectedStyleId,
        styleName: activeStyle.name,
        duration: totalDuration,
        scenesCount: scenes.length,
        aspectRatio,
        videoUrl: activeStyle.previewVideo || '/media/mythology/mythos-template-1.mp4',
        audioUrl: activeAudioUrl || undefined,
        rawJson: rawJsonText,
        creditsCost: 20,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };

      const updatedHistory = [newHistoryItem, ...historyItems];
      setHistoryItems(updatedHistory);
      try {
        localStorage.setItem('OXFLOW_ANIMATED_VIDEO_HISTORY', JSON.stringify(updatedHistory));
      } catch (e) {}

      // Trigger file download
      const a = document.createElement('a');
      a.href = newHistoryItem.videoUrl;
      a.download = `${activeStyle.id}_video_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      alert(`Export error: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const activeScene = scenes[currentSceneIdx] || scenes[0];

  return (
    <div className="space-y-8 text-white font-sans selection:bg-[#FFB800] selection:text-black">
      {/* Top Status & History Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#231F3D]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800] animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Active Studio: {activeStyle.name}
          </span>
          <span className="text-[11px] text-[#8680A6] hidden sm:inline">
            • JSON-to-Video Engine (9:16 Vertical)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#17142A] hover:bg-[#231E40] border border-[#2B2552] text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Generations History ({historyItems.length})</span>
          </button>

          <Link
            href="/mythology/pricing"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Mythology Plans</span>
          </Link>
        </div>
      </div>

      {/* STEP 1: CHOOSE A STYLE (7 SWATCHES MATCHING SCREENSHOT 1) */}
      <div className="p-5 rounded-2xl bg-[#0E0D1B] border border-[#231F3D] space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#FFB800] text-black font-black text-xs flex items-center justify-center">
            1
          </span>
          <h2 className="text-base font-bold text-white tracking-wide">Choose a style</h2>
        </div>

        <p className="text-xs text-[#9E9AB7]">
          {selectedStyleId === 'mythology'
            ? 'Mythology: Indian mythology stories. The Mythology studio has its own player, characters and Hindi voice. It is open below.'
            : `${activeStyle.name}: ${activeStyle.description}`}
        </p>

        {/* 7 Swatches matching screenshot media_1795243354221_58749c01.png */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {ANIMATION_STYLES.map((st) => {
            const isSelected = selectedStyleId === st.id;
            const palette = st.palette || ['#FBF6EE', '#202E44', '#F97316', '#3B82F6'];

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleSelectStyle(st.id)}
                className={`shrink-0 flex flex-col items-center p-2 rounded-2xl transition-all border min-w-[125px] ${
                  isSelected
                    ? 'bg-[#1F193D] border-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.3)] ring-1 ring-[#FFB800]'
                    : 'bg-[#121124] border-[#252047] hover:border-[#3E366E] text-[#9E9AB7]'
                }`}
              >
                {/* 4 Palette stripes swatch */}
                <div className="w-full h-7 rounded-xl overflow-hidden flex mb-2 shadow-inner border border-black/20">
                  {palette.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[#A5A0C5]'}`}>
                  {st.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* WORKSPACE ROW: STEP 2 (SCRIPT) + STEP 3 (VOICE) ON LEFT, STEP 4 (PLAYER & EXPORT) ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: STEP 2 (JSON SCRIPT) & STEP 3 (VOICE) (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 2: GET YOUR SCRIPT (MATCHING SCREENSHOT 2) */}
          <div className="p-5 rounded-2xl bg-[#0E0D1B] border border-[#231F3D] space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FFB800] text-black font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base font-bold text-white tracking-wide">Get your script</h2>
              </div>
              <p className="text-xs text-[#9E9AB7] leading-relaxed">
                Copy the prompt and paste it into <strong className="text-white">ChatGPT, Gemini or Claude</strong>. It asks your topic, or type <strong className="text-[#FFB800]">IDEAS</strong> and it suggests viral topics with hooks. Pick one, then paste the JSON reply below.
              </p>
            </div>

            {/* Prompt Actions Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCopyAiPrompt}
                className="px-4 py-2 rounded-xl bg-[#FFB800] hover:bg-[#E5A600] text-black font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#FFB800]/20 transition-all cursor-pointer"
              >
                {isCopiedPrompt ? (
                  <>
                    <Check className="w-4 h-4 text-black stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>Copy AI prompt</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsPromptModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#1B1736] hover:bg-[#26214A] border border-[#2E2856] text-xs font-bold text-[#E2DEFA] flex items-center gap-1.5 transition-colors"
              >
                <span>👁️ View prompt</span>
              </button>

              <button
                type="button"
                onClick={handleLoadSample}
                className="px-3.5 py-2 rounded-xl bg-[#1B1736] hover:bg-[#26214A] border border-[#2E2856] text-xs font-bold text-[#E2DEFA] flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Load example</span>
              </button>
            </div>

            {/* Validation Banner if any */}
            {validationState.status === 'valid' && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{validationState.message}</span>
              </div>
            )}
            {validationState.status === 'invalid' && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{validationState.message}</span>
              </div>
            )}

            {/* Code Textarea Editor */}
            <div className="relative rounded-xl overflow-hidden border border-[#231F3D] focus-within:border-[#FFB800] transition-colors">
              <textarea
                rows={11}
                value={rawJsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="w-full p-4 font-mono text-xs leading-relaxed bg-[#08080E] text-[#F3E8FF] focus:outline-none selection:bg-[#FFB800] selection:text-black resize-y"
                placeholder='[\n  {\n    "scene": 1,\n    "say": "कुरुक्षेत्र के रणक्षेत्र में...",\n    "quote": "कुरुक्षेत्र: विषाद",\n    "on": "कुरुक्षेत्र",\n    "setting": "battlefield"\n  }\n]'
              />
            </div>

            {/* Bottom Actions Under JSON Editor (Matching Screenshot 2) */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadScript}
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Load script</span>
                </button>

                <label className="px-3 py-2 rounded-xl bg-[#1A1733] hover:bg-[#252047] border border-[#2B2552] text-xs font-bold text-[#D0CCE8] flex items-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload .json</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleUploadJson}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleClearJson}
                  className="px-3 py-2 rounded-xl bg-[#1A1733] hover:bg-[#252047] border border-[#2B2552] text-xs font-bold text-[#A5A0C5] hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="text-[11px] text-[#8680A6] font-mono">
                {scenes.length} scenes • ~{totalDuration}s duration
              </div>
            </div>
          </div>

          {/* STEP 3: ADD A VOICE (MATCHING SCREENSHOT 3) */}
          <div className="p-5 rounded-2xl bg-[#0E0D1B] border border-[#231F3D] space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FFB800] text-black font-black text-xs flex items-center justify-center">
                  3
                </span>
                <h2 className="text-base font-bold text-white tracking-wide">Add a voice</h2>
              </div>
              <p className="text-xs text-[#9E9AB7]">
                Scenes change exactly on the spoken words. Your API key stays in this browser and goes only to the voice company.
              </p>
            </div>

            {/* 4 Provider Tabs (ElevenLabs / Cartesia / My recording / No voice) */}
            <div className="flex items-center p-1 rounded-xl bg-[#08080E] border border-[#231F3D] gap-1">
              {(
                [
                  { id: 'elevenlabs', label: 'ElevenLabs' },
                  { id: 'cartesia', label: 'Cartesia' },
                  { id: 'my_recording', label: 'My recording' },
                  { id: 'no_voice', label: 'No voice' },
                ] as const
              ).map((tab) => {
                const isActive = voiceTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setVoiceTab(tab.id)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#1E193C] text-white shadow-sm border border-[#3E366E]'
                        : 'text-[#8A84AC] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Feedback Banners */}
            {voiceSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{voiceSuccessMsg}</span>
              </div>
            )}
            {voiceErrorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{voiceErrorMsg}</span>
              </div>
            )}

            {/* TAB 1: ELEVENLABS (EXACT SCREENSHOT 3 UI) */}
            {voiceTab === 'elevenlabs' && (
              <div className="space-y-4">
                {/* ElevenLabs API Key Row */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-xs font-bold text-white">
                      ElevenLabs API key{' '}
                      <a
                        href="https://elevenlabs.io"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#FFB800] underline font-semibold hover:opacity-90"
                      >
                        (get a free key)
                      </a>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={elevenApiKey}
                      onChange={(e) => setElevenApiKey(e.target.value)}
                      placeholder="sk_..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#08080E] border border-[#231F3D] text-xs font-mono text-white placeholder-[#544E75] focus:outline-none focus:border-[#FFB800]"
                    />
                    <button
                      type="button"
                      onClick={handleLoadElevenVoices}
                      disabled={isLoadingVoices}
                      className="px-4 py-2.5 rounded-xl bg-[#1B1736] hover:bg-[#28224F] border border-[#2F2959] text-xs font-bold text-white shrink-0 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isLoadingVoices ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Load voices</span>
                    </button>
                  </div>
                </div>

                {/* Voice Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">Voice</label>
                  <select
                    value={selectedVoiceId}
                    onChange={(e) => setSelectedVoiceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080E] border border-[#231F3D] text-xs font-bold text-white outline-none focus:border-[#FFB800]"
                  >
                    {elevenVoices.length > 0 ? (
                      elevenVoices.map((v) => (
                        <option key={v.voice_id} value={v.voice_id}>
                          {v.name} ({v.category || 'Standard'})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="21m00Tcm4TlvDq8ikWAM">Rachel (Calm & Clear)</option>
                        <option value="ErXwobaYiN019PkySvjV">Antoni (Deep & Dramatic)</option>
                        <option value="VR6AewLTigWG4xSOukaG">Arnold (Epic Hindi & English)</option>
                        <option value="pNInz6obpgDQGcFmaJgB">Adam (Classic Narration)</option>
                        <option value="custom">Load voices first using API key above</option>
                      </>
                    )}
                  </select>

                  <input
                    type="text"
                    value={customVoiceId}
                    onChange={(e) => setCustomVoiceId(e.target.value)}
                    placeholder="...or paste a Voice ID"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#08080E] border border-[#231F3D] text-xs text-white placeholder-[#544E75] focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                {/* Model & Speed Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white block">Model</label>
                    <select
                      value={voiceModel}
                      onChange={(e) => setVoiceModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#08080E] border border-[#231F3D] text-xs font-bold text-white outline-none focus:border-[#FFB800]"
                    >
                      <option value="eleven_multilingual_v2">Multilingual v2 (best, Hindi...)</option>
                      <option value="eleven_turbo_v2_5">Eleven Turbo v2.5 (Fast)</option>
                      <option value="eleven_flash_v2_5">Eleven Flash v2.5</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-white">Speed</label>
                      <span className="font-mono text-[#FFB800] font-bold">{voiceSpeed.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.7}
                      max={1.3}
                      step={0.05}
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                      className="w-full accent-[#FFB800] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Big Yellow Generate Voice Button with Char Counter */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleGenerateVoice}
                    disabled={isSynthesizingVoice}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#FFB800] hover:bg-[#E5A600] text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#FFB800]/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSynthesizingVoice ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Synthesizing Audio...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-black" />
                        <span>Generate voice</span>
                      </>
                    )}
                  </button>

                  <div className="text-xs font-mono text-[#8680A6] shrink-0">
                    ≈ {totalScriptChars} characters
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CARTESIA */}
            {voiceTab === 'cartesia' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">Cartesia API key</label>
                  <input
                    type="password"
                    value={cartesiaApiKey}
                    onChange={(e) => setCartesiaApiKey(e.target.value)}
                    placeholder="cartesia_..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080E] border border-[#231F3D] text-xs font-mono text-white placeholder-[#544E75] focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">Sonic Model Voice</label>
                  <select
                    value={cartesiaVoice}
                    onChange={(e) => setCartesiaVoice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080E] border border-[#231F3D] text-xs font-bold text-white outline-none focus:border-[#FFB800]"
                  >
                    <option value="sonic-hindi-fluent">Sonic Indian Accent (Ultra Low Latency)</option>
                    <option value="sonic-english-cinema">Sonic Epic Narrator (English)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Cartesia sonic synthesis queued!')}
                  className="w-full py-3 px-4 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize with Cartesia Sonic</span>
                </button>
              </div>
            )}

            {/* TAB 3: MY RECORDING (UPLOAD AUDIO FILE OR MICROPHONE) */}
            {voiceTab === 'my_recording' && (
              <div className="space-y-4">
                <p className="text-xs text-[#9E9AB7]">
                  Upload an existing voiceover file (.mp3, .wav, .m4a) or record directly using your microphone.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Button */}
                  <label className="p-4 rounded-xl bg-[#08080E] border border-[#231F3D] hover:border-[#FFB800] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                    <Upload className="w-5 h-5 text-[#FFB800]" />
                    <span className="text-xs font-bold text-white">Upload Voice Audio File</span>
                    <span className="text-[10px] text-[#8680A6]">MP3, WAV, M4A up to 25MB</span>
                    <input
                      ref={audioFileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleUploadAudio}
                      className="hidden"
                    />
                  </label>

                  {/* Browser Microphone Recorder */}
                  <div className="p-4 rounded-xl bg-[#08080E] border border-[#231F3D] flex flex-col items-center justify-center gap-2 text-center">
                    {isRecording ? (
                      <button
                        type="button"
                        onClick={handleStopRecording}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 animate-pulse"
                      >
                        <MicOff className="w-4 h-4" />
                        <span>Stop Recording</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className="px-4 py-2 rounded-xl bg-[#1B1736] hover:bg-[#252047] border border-[#2B2552] text-xs font-bold text-white flex items-center gap-2"
                      >
                        <Mic className="w-4 h-4 text-[#FFB800]" />
                        <span>Record with Mic</span>
                      </button>
                    )}
                    <span className="text-[10px] text-[#8680A6]">
                      {isRecording ? 'Recording in progress...' : 'One-click direct microphone capture'}
                    </span>
                  </div>
                </div>

                {uploadedAudioName && (
                  <div className="p-2.5 rounded-xl bg-[#17142A] border border-[#2B2552] flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-2 truncate">
                      <Volume2 className="w-4 h-4 text-[#FFB800] shrink-0" />
                      <span className="truncate">{uploadedAudioName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedAudioUrl(null);
                        setUploadedAudioName(null);
                        setActiveAudioUrl(null);
                      }}
                      className="text-[#8680A6] hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: NO VOICE */}
            {voiceTab === 'no_voice' && (
              <div className="p-4 rounded-xl bg-[#08080E] border border-[#231F3D] text-center space-y-2">
                <VolumeX className="w-6 h-6 text-[#8680A6] mx-auto" />
                <p className="text-xs font-bold text-white">Silent / Background Music Mode</p>
                <p className="text-xs text-[#8680A6]">
                  Scenes will advance on timer with animated on-screen captions and ambient music.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW PLAYER & STEP 4 (EXPORT MP4 - DEDUCTS CREDITS) (5 COLS) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="p-5 rounded-2xl bg-[#0E0D1B] border border-[#231F3D] flex flex-col items-center">
            {/* Aspect Ratio Switcher */}
            <div className="w-full flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-[#9E9AB7]">Video Preview</span>
              <div className="flex items-center gap-1 bg-[#090A11] p-1 rounded-lg border border-[#231F3D]">
                {(['9:16', '1:1', '16:9'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAspectRatio(r)}
                    className={`px-2 py-0.5 rounded text-[10px] font-black transition-all ${
                      aspectRatio === r ? 'bg-[#FFB800] text-black' : 'text-[#9E9AB7] hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas / Video Screen */}
            <div
              className={`relative w-full rounded-2xl overflow-hidden bg-black border border-[#2B2552] flex items-center justify-center shadow-2xl ${
                aspectRatio === '9:16'
                  ? 'aspect-[9/16] max-w-[280px]'
                  : aspectRatio === '1:1'
                  ? 'aspect-square max-w-[320px]'
                  : 'aspect-[16/9] w-full'
              }`}
            >
              {/* Background Video if available (e.g. for Mythology) */}
              {activeStyle.previewVideo ? (
                <video
                  ref={videoRef}
                  src={activeStyle.previewVideo}
                  poster={activeStyle.previewImage}
                  playsInline
                  loop
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${activeStyle.previewImage})` }}
                />
              )}

              {/* Dimmer Overlay for Readability */}
              <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />

              {/* Dynamic Live Scene Overlay */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between z-10 pointer-events-none">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#FFB800] border border-[#FFB800]/40">
                    Scene {currentSceneIdx + 1}/{scenes.length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FFB800] text-black text-[10px] font-black uppercase">
                    {activeStyle.name}
                  </span>
                </div>

                {/* Center Subtitle & Karaoke Caption (Synched with JSON say/quote/on) */}
                <div className="text-center space-y-2 px-1">
                  {(activeScene?.quote || activeScene?.on_screen_text) && (
                    <div className="inline-block px-3 py-1 rounded-lg bg-black/85 border border-[#FFB800]/60 text-xs font-black text-[#FFB800] shadow-xl">
                      {activeScene.quote || activeScene.on_screen_text}
                    </div>
                  )}

                  {activeScene?.on && (
                    <div className="text-[11px] font-bold text-amber-300 drop-shadow">
                      ✨ Focus: {activeScene.on}
                    </div>
                  )}

                  <p className="text-xs text-white leading-relaxed font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    "{activeScene?.say || activeScene?.narration || 'Enter scene JSON to render animated story preview...'}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#A5A0C5]">
                  <span>Camera: {activeScene?.camera || 'zoom_in'}</span>
                  <span>{activeScene?.duration || 5}s</span>
                </div>
              </div>

              {/* Play/Pause Center Overlay */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className="absolute inset-0 flex items-center justify-center group/play cursor-pointer z-20"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isPlaying
                      ? 'bg-black/50 text-white opacity-0 group-hover/play:opacity-100 scale-90'
                      : 'bg-[#FFB800] text-black scale-100 shadow-[0_0_30px_rgba(255,184,0,0.6)]'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </div>
              </button>

              {/* Hidden Audio Sync Element */}
              {activeAudioUrl && (
                <audio ref={audioRef} src={activeAudioUrl} muted={isMuted} />
              )}
            </div>

            {/* Timeline & Player Bar Below Screen */}
            <div className="w-full mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#9E9AB7]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="p-1 rounded text-white hover:text-[#FFB800]"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <span>
                    {currentTimeSec}s / {totalDuration}s
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 rounded text-white hover:text-[#FFB800]"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Scrubber Progress Bar */}
              <div
                className="w-full h-1.5 rounded-full bg-[#1A1733] cursor-pointer overflow-hidden relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / rect.width;
                  const newTime = Math.round(ratio * totalDuration);
                  setCurrentTimeSec(newTime);
                  if (audioRef.current && totalDuration > 0) {
                    audioRef.current.currentTime = ratio * (audioRef.current.duration || totalDuration);
                  }
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#FFB800] to-[#FF9000] transition-all"
                  style={{ width: `${(currentTimeSec / (totalDuration || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 4: EXPORT & DOWNLOAD (CONSUMES 20 CREDITS - NOT FREE) */}
            <div className="w-full mt-5 pt-3 border-t border-[#231F3D]">
              <button
                type="button"
                onClick={handleExportVideo}
                disabled={isExporting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFB800] via-[#FFAE00] to-[#FF9000] hover:opacity-95 text-black font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,184,0,0.35)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Rendering 1080p Video...</span>
                  </>
                ) : exportComplete ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>Video Exported & Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>Export 1080p MP4 (20 Credits)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#8680A6] mt-2 px-1">
                <span>Requires active plan or 20 credits</span>
                <Link href="/mythology/pricing" className="text-[#FFB800] hover:underline font-bold">
                  View plans →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROMPT VIEW MODAL */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121124] border border-[#2F2959] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#231F3D] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFB800]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Master AI Prompt: {activeStyle.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPromptModalOpen(false)}
                className="text-[#8680A6] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#9E9AB7]">
              Paste this prompt into ChatGPT, Gemini, or Claude. Type your story topic, and the AI will output the exact scene JSON ready for this studio.
            </p>

            <pre className="p-4 rounded-xl bg-[#08080E] border border-[#231F3D] text-[11px] font-mono text-[#DCD7F5] overflow-y-auto max-h-60 whitespace-pre-wrap leading-relaxed">
              {MASTER_AI_PROMPTS[selectedStyleId] || MASTER_AI_PROMPTS.mythology}
            </pre>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    MASTER_AI_PROMPTS[selectedStyleId] || MASTER_AI_PROMPTS.mythology
                  );
                  setIsCopiedPrompt(true);
                  setTimeout(() => setIsCopiedPrompt(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-[#FFB800] text-black font-black text-xs flex items-center gap-1.5"
              >
                {isCopiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedPrompt ? 'Copied to clipboard' : 'Copy Prompt'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPromptModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1B1736] text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSUFFICIENT CREDITS / AUTH MODAL */}
      {creditErrorModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121124] border border-[#3E366E] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
              <Coins className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white">
                {creditErrorModal.requiresAuth ? 'Sign In Required' : 'Video Credits Required'}
              </h3>
              <p className="text-xs text-[#9E9AB7] leading-relaxed">
                {creditErrorModal.message}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090A11] border border-[#231F3D] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#8680A6]">
                <span>Required for 1080p Export:</span>
                <span className="font-bold text-white">20 Video Credits</span>
              </div>
              {creditErrorModal.available !== undefined && (
                <div className="flex items-center justify-between text-[#8680A6]">
                  <span>Your Current Balance:</span>
                  <span className="font-bold text-amber-400">{creditErrorModal.available} Credits</span>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              {creditErrorModal.requiresAuth ? (
                <Link
                  href="/login?redirect=/mythology/studio"
                  className="w-full py-3 rounded-xl bg-[#FFB800] hover:bg-[#E5A600] text-black font-black text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Sign In or Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/checkout?plan=plan_mythos_20"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 transition-all"
                  >
                    <span>Get 20 Videos Plan (₹7,999/mo)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/checkout?plan=plan_mythos_10"
                    className="w-full py-2.5 rounded-xl bg-[#1B1736] hover:bg-[#28224F] border border-[#2F2959] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Starter 10 Videos Plan (₹5,100/mo)</span>
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={() => setCreditErrorModal({ isOpen: false, message: '', required: 20 })}
                className="w-full py-2 text-xs text-[#8680A6] hover:text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATIONS HISTORY DRAWER */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="bg-[#0E0D1B] border-l border-[#231F3D] w-full max-w-md h-full flex flex-col p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#231F3D] pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#FFB800]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Generations History ({historyItems.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="text-[#8680A6] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {historyItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2 text-[#8680A6]">
                <Film className="w-10 h-10 text-[#3B3564]" />
                <p className="text-xs font-bold text-white">No videos generated yet</p>
                <p className="text-xs">
                  Your exported 1080p MP4 videos will appear here for easy replay, re-download, or re-loading back into the studio.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#141226] border border-[#252047] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/30">
                        {item.styleName}
                      </span>
                      <span className="text-[10px] text-[#8680A6] font-mono">{item.createdAt}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>

                    <div className="flex items-center justify-between text-[11px] text-[#8680A6]">
                      <span>{item.scenesCount} scenes • {item.duration}s</span>
                      <span className="text-amber-400 font-bold">{item.creditsCost} Credits</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-[#231F3D]">
                      <a
                        href={item.videoUrl}
                        download={`${item.id}.mp4`}
                        className="flex-1 py-1.5 rounded-lg bg-[#FFB800] hover:bg-[#E5A600] text-black font-black text-xs flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3 stroke-[3]" />
                        <span>Download</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setRawJsonText(item.rawJson);
                          try {
                            const parsed = JSON.parse(item.rawJson);
                            setScenes(parsed);
                          } catch (e) {}
                          if (item.audioUrl) setActiveAudioUrl(item.audioUrl);
                          setSelectedStyleId(item.styleId);
                          setIsHistoryOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#1E193C] hover:bg-[#28224F] border border-[#3E366E] text-xs font-bold text-white transition-colors"
                      >
                        Load to Studio
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = historyItems.filter((h) => h.id !== item.id);
                          setHistoryItems(updated);
                          try {
                            localStorage.setItem('OXFLOW_ANIMATED_VIDEO_HISTORY', JSON.stringify(updated));
                          } catch (e) {}
                        }}
                        className="p-1.5 rounded-lg text-[#8680A6] hover:text-rose-400"
                        title="Delete from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}