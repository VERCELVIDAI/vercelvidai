-- ==============================================================================
-- FLUVIA FLOW: MYTHOLOGY VIDEO CREATOR STUDIO SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. Myth Characters Table
CREATE TABLE IF NOT EXISTS public.myth_characters (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    culture TEXT NOT NULL DEFAULT 'hindu_epic',
    archetype TEXT NOT NULL DEFAULT 'god',
    appearance TEXT NOT NULL,
    attire TEXT NOT NULL,
    weapon_or_vahana TEXT NOT NULL,
    color_palette TEXT[] DEFAULT '{}',
    reference_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Myth Series Table
CREATE TABLE IF NOT EXISTS public.myth_series (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    culture TEXT NOT NULL DEFAULT 'hindu_epic',
    shared_style_id TEXT NOT NULL DEFAULT 'classical_oil_painting',
    shared_voice_id TEXT NOT NULL DEFAULT 'voice_devotional_hindi_m',
    shared_character_ids TEXT[] DEFAULT '{}',
    project_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Myth Projects Table
CREATE TABLE IF NOT EXISTS public.myth_projects (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id TEXT,
    title TEXT NOT NULL,
    story_concept TEXT NOT NULL,
    source_note TEXT,
    culture TEXT NOT NULL DEFAULT 'hindu_epic',
    language TEXT NOT NULL DEFAULT 'hi',
    target_duration_sec INT NOT NULL DEFAULT 30,
    tone TEXT NOT NULL DEFAULT 'devotional',
    art_style_id TEXT NOT NULL DEFAULT 'classical_oil_painting',
    voice_id TEXT NOT NULL DEFAULT 'voice_devotional_hindi_m',
    bgm_mood_id TEXT NOT NULL DEFAULT 'bgm_vedic_flute',
    character_bible JSONB DEFAULT '[]'::jsonb,
    scenes JSONB DEFAULT '[]'::jsonb,
    audio_track JSONB,
    status TEXT NOT NULL DEFAULT 'draft',
    current_step INT NOT NULL DEFAULT 1,
    exported_videos JSONB DEFAULT '[]'::jsonb,
    thumbnail_url TEXT,
    series_id TEXT REFERENCES public.myth_series(id) ON DELETE SET NULL,
    viral_pack JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_myth_projects_user ON public.myth_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_myth_projects_series ON public.myth_projects(series_id);
CREATE INDEX IF NOT EXISTS idx_myth_characters_user ON public.myth_characters(user_id);
CREATE INDEX IF NOT EXISTS idx_myth_series_user ON public.myth_series(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.myth_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.myth_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.myth_projects ENABLE ROW LEVEL SECURITY;

-- Characters RLS Policies
CREATE POLICY "Users can view public or own myth characters"
    ON public.myth_characters FOR SELECT
    USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can insert own myth characters"
    ON public.myth_characters FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own myth characters"
    ON public.myth_characters FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own myth characters"
    ON public.myth_characters FOR DELETE
    USING (auth.uid() = user_id);

-- Series RLS Policies
CREATE POLICY "Users can view own myth series"
    ON public.myth_series FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own myth series"
    ON public.myth_series FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own myth series"
    ON public.myth_series FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own myth series"
    ON public.myth_series FOR DELETE
    USING (auth.uid() = user_id);

-- Projects RLS Policies
CREATE POLICY "Users can view own myth projects"
    ON public.myth_projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own myth projects"
    ON public.myth_projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own myth projects"
    ON public.myth_projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own myth projects"
    ON public.myth_projects FOR DELETE
    USING (auth.uid() = user_id);
