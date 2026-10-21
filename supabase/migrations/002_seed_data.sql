-- ==============================================================================
-- VERCEL VIDAI - SEED DATA FOR PLANS, CREDIT PACKS, PROVIDERS, MODELS & TEMPLATES
-- ==============================================================================

-- 1. PLANS
INSERT INTO plans (id, name, price_inr, billing_interval, credits_per_period, entitlements_json, is_active)
VALUES
('plan_free', 'Free Explorer', 0, 'month', 60, '{"max_resolution": "720p", "watermark": true, "max_video_length_sec": 30, "supported_models": ["vidai-standard", "sdxl-turbo"], "storage_mb": 1000}', true),
('plan_starter', 'Starter Creator', 999, 'month', 500, '{"max_resolution": "1080p", "watermark": false, "max_video_length_sec": 60, "supported_models": ["vidai-standard", "runway-gen2", "eleven-multilingual"], "storage_mb": 10000}', true),
('plan_creator', 'Pro Creator', 2499, 'month', 1600, '{"max_resolution": "4k", "watermark": false, "max_video_length_sec": 180, "supported_models": ["vidai-ultra", "runway-gen3", "luma-dream-machine", "eleven-turbo-v2"], "storage_mb": 50000}', true),
('plan_business', 'Studio Agency', 6999, 'month', 5000, '{"max_resolution": "4k", "watermark": false, "max_video_length_sec": 600, "supported_models": ["all"], "storage_mb": 250000, "priority_queue": true, "brand_kits_allowed": 10}', true)
ON CONFLICT (id) DO NOTHING;

-- 2. CREDIT PACKS
INSERT INTO credit_packs (id, name, price_inr, credit_amount, is_active)
VALUES
('pack_starter', '500 Credits Boost', 499, 500, true),
('pack_popular', '1,200 Credits Studio', 999, 1200, true),
('pack_scale', '3,500 Credits Scale', 2499, 3500, true),
('pack_enterprise', '10,000 Credits Agency', 5999, 10000, true)
ON CONFLICT (id) DO NOTHING;

-- 3. AI PROVIDERS
INSERT INTO ai_providers (id, name, provider_type, configuration_status, is_active)
VALUES
('vidai_core', 'Vidai Neural Engine (Self-Hosted/Fast)', 'multimodal', 'configured', true),
('runway', 'Runway Gen-3 Alpha', 'video', 'configured', true),
('luma', 'Luma Ray Dream Machine', 'video', 'configured', true),
('fal_ai', 'Fal.ai Fast Media Engine', 'multimodal', 'configured', true),
('elevenlabs', 'ElevenLabs Voice AI', 'audio', 'configured', true),
('openai', 'OpenAI (GPT-4o & Sora Adaptor)', 'multimodal', 'configured', true)
ON CONFLICT (id) DO NOTHING;

-- 4. AI MODELS
INSERT INTO ai_models (id, provider_id, model_identifier, display_name, media_type, capabilities_json, cost_configuration_json, credit_pricing_json, is_active)
VALUES
('model_vidai_v1', 'vidai_core', 'vidai-cinematic-v1', 'Vidai Cinematic HD', 'video', '{"resolutions": ["720p", "1080p"], "aspect_ratios": ["16:9", "9:16", "1:1"], "max_duration": 10}', '{"unit_cost_usd": 0.05}', '{"cost_credits": 25}', true),
('model_runway_gen3', 'runway', 'gen3-alpha-turbo', 'Runway Gen-3 Alpha Turbo', 'video', '{"resolutions": ["1080p", "4k"], "aspect_ratios": ["16:9", "9:16"], "max_duration": 15}', '{"unit_cost_usd": 0.20}', '{"cost_credits": 50}', true),
('model_luma_ray', 'luma', 'ray-v2-production', 'Luma Dream Machine Ray', 'video', '{"resolutions": ["1080p"], "aspect_ratios": ["16:9", "9:16", "1:1"], "max_duration": 10}', '{"unit_cost_usd": 0.15}', '{"cost_credits": 40}', true),
('model_fal_flux', 'fal_ai', 'fal-ai/flux-pro-v1', 'Flux 1.1 Pro Vision', 'image', '{"resolutions": ["1024x1024", "1920x1080", "1080x1920"], "aspect_ratios": ["1:1", "16:9", "9:16"]}', '{"unit_cost_usd": 0.02}', '{"cost_credits": 5}', true),
('model_eleven_multilingual', 'elevenlabs', 'eleven_turbo_v2_5', 'ElevenLabs Neural Voice HD', 'voice', '{"languages": ["en", "hi", "es", "fr", "de", "ja"], "emotions": ["neutral", "excited", "whispering", "dramatic"]}', '{"unit_cost_usd": 0.01}', '{"cost_credits": 10}', true)
ON CONFLICT (id) DO NOTHING;

-- 5. TEMPLATES
INSERT INTO templates (id, slug, title, category, thumbnail_url, template_data_json, is_published)
VALUES
(uuid_generate_v4(), 'instagram-reels-ecommerce', 'Viral Product Showcase Reel', 'Instagram Reels', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', '{"aspect_ratio": "9:16", "duration": 15, "music": "energetic-beat", "scenes": [{"text": "Transform Your Look", "duration": 4}, {"text": "Engineered for Comfort", "duration": 5}, {"text": "Get 30% Off Today", "duration": 6}]}', true),
(uuid_generate_v4(), 'youtube-shorts-tech', 'Daily Tech Breakdown Short', 'YouTube Shorts', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80', '{"aspect_ratio": "9:16", "duration": 30, "music": "lo-fi-tech", "scenes": [{"text": "Did you know this AI secret?", "duration": 5}]}', true),
(uuid_generate_v4(), 'cinematic-luxury-perfume', 'Luxury Fragrance Cinematic Ad', 'Product Commercials', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80', '{"aspect_ratio": "16:9", "duration": 20, "music": "ambient-orchestral", "scenes": [{"text": "Pure Essence", "duration": 6}]}', true),
(uuid_generate_v4(), 'saas-explainer-flow', 'SaaS Onboarding & Explainer', 'Explainer Videos', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80', '{"aspect_ratio": "16:9", "duration": 45, "music": "corporate-modern", "scenes": [{"text": "Automate in seconds", "duration": 8}]}', true),
(uuid_generate_v4(), 'ugc-testimonial-unboxing', 'Authentic UGC Unboxing Hook', 'UGC Ads', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80', '{"aspect_ratio": "9:16", "duration": 25, "music": "upbeat-pop", "scenes": [{"text": "Stop scrolling! Look what arrived", "duration": 5}]}', true),
(uuid_generate_v4(), 'youtube-longform-opener', 'Cinematic YouTube Channel Opener', 'YouTube Videos', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80', '{"aspect_ratio": "16:9", "duration": 12, "music": "heavy-impact-trailer", "scenes": [{"text": "WELCOME TO THE FUTURE", "duration": 4}]}', true)
ON CONFLICT (slug) DO NOTHING;
