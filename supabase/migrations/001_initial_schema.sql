-- ==============================================================================
-- VERCEL VIDAI - FULL POSTGRESQL SCHEMA MIGRATION
-- Compatible with Supabase PostgreSQL, Row Level Security (RLS), and Indexes
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'creator', -- 'creator' | 'admin' | 'enterprise'
    onboarding_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. WORKSPACES
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. WORKSPACE MEMBERS
CREATE TABLE IF NOT EXISTS workspace_members (
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- 'owner' | 'admin' | 'member' | 'viewer'
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (workspace_id, user_id)
);

-- 4. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    media_type TEXT NOT NULL DEFAULT 'video', -- 'video' | 'image' | 'audio' | 'script'
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'processing' | 'completed' | 'archived'
    thumbnail_url TEXT,
    timeline_json JSONB DEFAULT '{}'::jsonb,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 5. ASSETS
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    asset_type TEXT NOT NULL, -- 'video' | 'image' | 'audio' | 'font' | 'subtitle'
    storage_key TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. GENERATION JOBS
CREATE TABLE IF NOT EXISTS generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    provider_id TEXT NOT NULL,
    model_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued', -- 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled'
    input_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_json JSONB DEFAULT '{}'::jsonb,
    estimated_credits INTEGER NOT NULL DEFAULT 0,
    reserved_credits INTEGER NOT NULL DEFAULT 0,
    actual_credits INTEGER NOT NULL DEFAULT 0,
    provider_request_id TEXT,
    error_code TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 7. CREDIT ACCOUNTS
CREATE TABLE IF NOT EXISTS credit_accounts (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    available_balance INTEGER NOT NULL DEFAULT 100,
    reserved_balance INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. CREDIT LEDGER
CREATE TABLE IF NOT EXISTS credit_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL, -- 'signup_bonus' | 'monthly_allowance' | 'purchase' | 'generation_reserve' | 'generation_settle' | 'refund' | 'admin_adjustment'
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    related_job_id UUID REFERENCES generation_jobs(id) ON DELETE SET NULL,
    payment_id TEXT,
    idempotency_key TEXT UNIQUE,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. PLANS
CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_inr INTEGER NOT NULL,
    billing_interval TEXT NOT NULL, -- 'month' | 'year'
    credits_per_period INTEGER NOT NULL,
    entitlements_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 10. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES plans(id),
    provider_subscription_id TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'past_due' | 'canceled' | 'trialing'
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL,
    provider_payment_id TEXT,
    amount_inr INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'success' | 'failed' | 'refunded'
    payment_type TEXT NOT NULL, -- 'subscription' | 'credit_pack'
    webhook_event_id TEXT,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. CREDIT PACKS
CREATE TABLE IF NOT EXISTS credit_packs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_inr INTEGER NOT NULL,
    credit_amount INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 13. AI PROVIDERS
CREATE TABLE IF NOT EXISTS ai_providers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    provider_type TEXT NOT NULL, -- 'video' | 'image' | 'audio' | 'text' | 'multimodal'
    configuration_status TEXT NOT NULL DEFAULT 'configured', -- 'configured' | 'unconfigured' | 'mock'
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 14. AI MODELS
CREATE TABLE IF NOT EXISTS ai_models (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL REFERENCES ai_providers(id) ON DELETE CASCADE,
    model_identifier TEXT NOT NULL,
    display_name TEXT NOT NULL,
    media_type TEXT NOT NULL, -- 'video' | 'image' | 'voice' | 'script'
    capabilities_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    cost_configuration_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    credit_pricing_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 15. TEMPLATES
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    template_data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true
);

-- 16. BRAND KITS
CREATE TABLE IF NOT EXISTS brand_kits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    logo_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    colors_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    fonts_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    guidelines_text TEXT
);

-- 17. RENDER JOBS
CREATE TABLE IF NOT EXISTS render_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'queued', -- 'queued' | 'rendering' | 'completed' | 'failed'
    settings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. WEBHOOK EVENTS
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL,
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    processing_status TEXT NOT NULL DEFAULT 'received', -- 'received' | 'processed' | 'ignored' | 'failed'
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- 19. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open', -- 'open' | 'in_progress' | 'resolved' | 'closed'
    priority TEXT NOT NULL DEFAULT 'medium', -- 'low' | 'medium' | 'high'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & RELIABILITY
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_assets_workspace ON assets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_assets_project ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user ON generation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_user ON credit_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_idempotency ON credit_ledger(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_id ON webhook_events(event_id);
