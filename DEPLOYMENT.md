# Vercel Vidai — Production Deployment Guide

## 1. Deploying to Vercel

Vercel Vidai is designed to deploy natively to Vercel:

1. Push your code to GitHub / GitLab:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Vercel Vidai SaaS platform"
   git remote add origin https://github.com/your-org/vercel-vidai.git
   git push -u origin main
   ```
2. Import project in Vercel Dashboard.
3. Configure the Environment Variables listed in `.env.example`.
4. Deploy!

---

## 2. Supabase PostgreSQL Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Run the initial migration script:
   - Copy contents of `supabase/migrations/001_initial_schema.sql` and execute.
4. Run the seed data script:
   - Copy contents of `supabase/migrations/002_seed_data.sql` and execute.
5. Set `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in your environment.

---

## 3. Razorpay Payment Gateway & Webhook Setup

1. Sign in to your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. In **Settings -> API Keys**, generate your **Key ID** and **Key Secret**.
3. In **Settings -> Webhooks**, add a new webhook endpoint:
   - **Webhook URL**: `https://your-domain.com/api/payments/webhook`
   - **Secret**: Set a strong random secret and add as `RAZORPAY_WEBHOOK_SECRET`
   - **Active Events**:
     - `payment.captured`
     - `order.paid`
     - `subscription.charged`
4. The server validates signatures using HMAC SHA-256 before granting subscription or top-up credits.

---

## 4. AI Provider API Configuration

Add external API credentials to unlock live provider inference:

- **Runway Gen-3 Alpha**: `RUNWAY_API_KEY` (from [dev.runwayml.com](https://dev.runwayml.com))
- **Luma Dream Machine Ray**: `LUMA_API_KEY` (from [lumalabs.ai](https://lumalabs.ai))
- **Fal.ai Flux Vision**: `FAL_KEY` (from [fal.ai](https://fal.ai))
- **ElevenLabs Voice AI**: `ELEVENLABS_API_KEY` (from [elevenlabs.io](https://elevenlabs.io))
- **OpenAI GPT-4o**: `OPENAI_API_KEY` (from [platform.openai.com](https://platform.openai.com))

> **Note on Demo Mode**: If any API key is missing or empty, the platform operates in safe, honest **Demo Mode** with clear UI labeling, and never falsely represents simulated media as real external AI generations.
