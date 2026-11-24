-- ==============================================================================
-- FLUVIA vLABS — COMPLETE DATABASE MIGRATION SCHEMA (PostgreSQL / Supabase)
-- AI Voiceover, Voice Cloning, Voice Design & Video Dubbing Studio Engine
-- ==============================================================================

-- 1. vLabs Licences Table (1-Year, 2-Year, 5-Year Studio Licences)
CREATE TABLE IF NOT EXISTS public.vlabs_licences (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL CHECK (plan_id IN ('vlabs_1yr', 'vlabs_2yr', 'vlabs_5yr')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    end_date TIMESTAMPTZ NOT NULL,
    duration_months INTEGER NOT NULL,
    price_paid INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_id TEXT,
    invoice_number TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_vlabs_licences_user_id ON public.vlabs_licences(user_id);
CREATE INDEX IF NOT EXISTS idx_vlabs_licences_status ON public.vlabs_licences(status);
CREATE INDEX IF NOT EXISTS idx_vlabs_licences_end_date ON public.vlabs_licences(end_date);

-- 2. vLabs Generations History Table (TTS, Dubbing, Cloning, Voice Design)
CREATE TABLE IF NOT EXISTS public.vlabs_generations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('tts', 'dubbing', 'cloning', 'design')),
    title TEXT NOT NULL,
    input_text TEXT,
    audio_url TEXT NOT NULL,
    video_url TEXT,
    duration_sec NUMERIC(8, 2) NOT NULL DEFAULT 0.0,
    voice_id TEXT NOT NULL,
    voice_name TEXT NOT NULL,
    language TEXT NOT NULL,
    format TEXT NOT NULL DEFAULT 'wav',
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    file_size_kb INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_vlabs_generations_user_id ON public.vlabs_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_vlabs_generations_created_at ON public.vlabs_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vlabs_generations_type ON public.vlabs_generations(type);

-- 3. vLabs Voices Table (System default voices + Custom/Cloned voices)
CREATE TABLE IF NOT EXISTS public.vlabs_voices (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL for global system voices
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    language TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'neutral')),
    description TEXT,
    sample_audio_url TEXT NOT NULL,
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,
    is_cloned BOOLEAN NOT NULL DEFAULT FALSE,
    consent_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
    consent_timestamp TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('ready', 'processing', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_vlabs_voices_user_id ON public.vlabs_voices(user_id);
CREATE INDEX IF NOT EXISTS idx_vlabs_voices_category ON public.vlabs_voices(category);
CREATE INDEX IF NOT EXISTS idx_vlabs_voices_language ON public.vlabs_voices(language);

-- 4. vLabs Dubbing Projects Table
CREATE TABLE IF NOT EXISTS public.vlabs_dubbing_projects (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    source_video_url TEXT NOT NULL,
    source_language TEXT NOT NULL,
    target_language TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('uploaded', 'processing', 'completed', 'failed')),
    progress_percent INTEGER NOT NULL DEFAULT 0,
    transcripts JSONB NOT NULL DEFAULT '[]'::jsonb,
    dubbed_audio_url TEXT,
    dubbed_video_url TEXT,
    subtitles_srt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_vlabs_dubbing_user_id ON public.vlabs_dubbing_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_vlabs_dubbing_status ON public.vlabs_dubbing_projects(status);

-- 5. vLabs Settings & Engine Configuration Table
CREATE TABLE IF NOT EXISTS public.vlabs_settings (
    id TEXT PRIMARY KEY DEFAULT 'vlabs_global',
    default_provider TEXT NOT NULL DEFAULT 'vlabs_neural',
    elevenlabs_configured BOOLEAN NOT NULL DEFAULT FALSE,
    gemini_configured BOOLEAN NOT NULL DEFAULT FALSE,
    max_chars_per_generation INTEGER NOT NULL DEFAULT 50000,
    allow_guest_previews BOOLEAN NOT NULL DEFAULT TRUE,
    enforce_voice_cloning_consent BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Seed default global settings row if not exists
INSERT INTO public.vlabs_settings (id, default_provider, elevenlabs_configured, gemini_configured, max_chars_per_generation, allow_guest_previews, enforce_voice_cloning_consent)
VALUES ('vlabs_global', 'vlabs_neural', false, false, 50000, true, true)
ON CONFLICT (id) DO NOTHING;

-- Seed default global system voices
INSERT INTO public.vlabs_voices (id, user_id, name, category, language, gender, description, sample_audio_url, is_custom, is_cloned, consent_confirmed)
VALUES
    ('voice_in_male_1', NULL, 'Aarav Sharma', 'Indian Male - Professional Narrator', 'Hindi & English', 'male', 'Deep, authoritative Indian English and Hindi voice tailored for corporate, documentary and educational narration.', '/media/audio/samples/aarav-sharma.wav', false, false, true),
    ('voice_in_female_1', NULL, 'Priya Patel', 'Indian Female - Natural Conversational', 'Hindi & English', 'female', 'Warm, welcoming conversational delivery perfect for podcasts, explainer videos and storytelling.', '/media/audio/samples/priya-patel.wav', false, false, true),
    ('voice_cinematic_male_1', NULL, 'Marcus Vance', 'Cinematic Male - Deep Voice', 'English (US/UK)', 'male', 'Resonant bass-baritone tone suited for movie trailers, dramatic audiobooks and epic promos.', '/media/audio/samples/marcus-vance.wav', false, false, true),
    ('voice_energetic_female_1', NULL, 'Zara Chen', 'Energetic Female - Advertisement', 'English (Global)', 'female', 'Vibrant, fast-paced commercial presenter voice built for YouTube ads and social media reels.', '/media/audio/samples/zara-chen.wav', false, false, true),
    ('voice_hindi_story_1', NULL, 'Kabir Verma', 'Hindi Storytelling', 'Hindi', 'male', 'Expressive and emotive classical storyteller voice with rich cadence for audio dramas and epics.', '/media/audio/samples/kabir-verma.wav', false, false, true),
    ('voice_en_pro_1', NULL, 'Arthur Pendelton', 'English Professional', 'English (UK/Global)', 'male', 'Clean, refined BBC-style broadcaster cadence ideal for news, financial reports and institutional videos.', '/media/audio/samples/arthur-pendelton.wav', false, false, true),
    ('voice_doc_narrator_1', NULL, 'David Atten', 'Documentary Narrator', 'English & Multilingual', 'male', 'Calm, thoughtful natural history narration style with breath control and pacing.', '/media/audio/samples/david-atten.wav', false, false, true),
    ('voice_yt_creator_1', NULL, 'Leo Sparks', 'YouTube Creator Voice', 'English (Casual)', 'male', 'Dynamic, engaging creator tone engineered for tech reviews, gaming and retention editing.', '/media/audio/samples/leo-sparks.wav', false, false, true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) on all vLabs tables
ALTER TABLE public.vlabs_licences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vlabs_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vlabs_voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vlabs_dubbing_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vlabs_settings ENABLE ROW LEVEL SECURITY;

-- 6. Row Level Security Policies
-- Licences: Users can view their own licences; Service role / Admin can manage all
CREATE POLICY "Users can view their own vLabs licences"
    ON public.vlabs_licences FOR SELECT
    USING (auth.uid()::text = user_id);

-- Generations: Users can read and delete their own generation history
CREATE POLICY "Users can view their own generations"
    ON public.vlabs_generations FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own generations"
    ON public.vlabs_generations FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own generations"
    ON public.vlabs_generations FOR DELETE
    USING (auth.uid()::text = user_id);

-- Voices: Anyone can read global voices; Users can manage their own custom/cloned voices
CREATE POLICY "Anyone can view global and own voices"
    ON public.vlabs_voices FOR SELECT
    USING (user_id IS NULL OR auth.uid()::text = user_id);

CREATE POLICY "Users can create their own custom voices"
    ON public.vlabs_voices FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own custom voices"
    ON public.vlabs_voices FOR DELETE
    USING (auth.uid()::text = user_id);

-- Dubbing: Users can manage their own dubbing projects
CREATE POLICY "Users can manage their own dubbing projects"
    ON public.vlabs_dubbing_projects FOR ALL
    USING (auth.uid()::text = user_id);

-- Settings: Anyone can read global engine settings
CREATE POLICY "Anyone can view vLabs settings"
    ON public.vlabs_settings FOR SELECT
    USING (true);
