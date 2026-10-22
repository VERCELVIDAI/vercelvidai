# Vercel Vidai — Production Deployment & Operations Guide

## 1. Quick Verification Commands

Before deploying, run the complete verified test suite:

```bash
# 1. Platform unit test suite (36 tests: atomic credits, ledger idempotency, HMAC signatures, timeline, scrypt security)
npx tsx tests/platform.test.ts

# 2. Live HTTP Security & Authorization audit (10 tests: session signing, tamper protection, asset ownership, webhook HMAC)
python tests/test_security_audit.py

# 3. Full-stack user journey live integration test (login, project creation, generation job dispatch, master export, admin console)
python tests/test_live_api.py

# 4. Next.js strict production compilation (54 routes, zero TypeScript/ESLint warnings)
npm run build
```

---

## 2. Deploying to Vercel

Vercel Vidai is designed to deploy natively to Vercel (Edge & Node.js runtime):

1. Push your repository to GitHub / GitLab:
   ```bash
   git add .
   git commit -m "chore: production readiness audit & security hardening"
   git push -u origin main
   ```
2. Import the project in your [Vercel Dashboard](https://vercel.com/new).
3. Select Next.js framework preset (automatically detected).
4. Configure the Environment Variables listed in `.env.example`.
5. Deploy!

---

## 3. Database Persistence & Supabase Migrations

The platform includes two persistence modes:
1. **Zero-Config Development Mode**: Backed by atomic JSON transaction storage (`data/database.json`), ideal for local development, instant testing, and CI without external infrastructure dependencies.
2. **Production Mode (PostgreSQL / Supabase)**:
   - Create a project on [Supabase](https://supabase.com).
   - In Supabase **SQL Editor**, execute `supabase/migrations/001_initial_schema.sql` to provision the relational tables, foreign key constraints, indexes, and Row Level Security (RLS) policies.
   - Execute `supabase/migrations/002_seed_data.sql` to populate initial system AI providers, models, templates, and credit packages.
   - Set the following environment variables:
     ```env
     DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
     NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
     NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
     SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
     ```

---

## 4. Payment Gateway & Webhook Hardening (Razorpay)

1. Sign in to your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Under **Account & Settings -> API Keys**, generate your **Key ID** and **Key Secret**.
3. Under **Account & Settings -> Webhooks**, configure:
   - **URL**: `https://your-domain.com/api/payments/webhook`
   - **Secret**: Set a strong random secret and add as `RAZORPAY_WEBHOOK_SECRET`
   - **Active Events**:
     - `payment.captured`
     - `order.paid`
     - `subscription.charged`
4. **Security Guarantees**:
   - Webhook requests lacking `x-razorpay-signature` are rejected immediately with HTTP 400.
   - Signatures are verified using timing-safe HMAC-SHA256 comparison (`crypto.timingSafeEqual`).
   - Webhook event IDs are logged and verified to eliminate replay attacks.
   - Credit fulfillment operates idempotently on `orderId` to prevent duplicate credit allocations.

---

## 5. Media & Storage Configuration

Choose between local and cloud object storage:
- **Local Dev**: `STORAGE_PROVIDER="local"` (stores files in public asset directory).
- **Supabase Storage**:
  - Create a public bucket named `media` in Supabase Storage.
  - Set `STORAGE_PROVIDER="supabase"`.
- **AWS S3 / Cloudflare R2**:
  - Configure `STORAGE_PROVIDER="s3"`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION`.

---

## 6. AI Provider API Configuration & Demo Mode

Configure the external API keys in your production environment:

| Provider | Environment Variable | Service Capabilities | Dashboard |
|---|---|---|---|
| **Runway Gen-3** | `RUNWAY_API_KEY` | Text-to-Video, Image-to-Video | [dev.runwayml.com](https://dev.runwayml.com) |
| **Luma Dream Machine** | `LUMA_API_KEY` | Ray-tracing video generation | [lumalabs.ai](https://lumalabs.ai) |
| **Fal.ai** | `FAL_KEY` | Flux 1.1 Pro image synthesis | [fal.ai](https://fal.ai) |
| **ElevenLabs** | `ELEVENLABS_API_KEY` | Multilingual neural voices | [elevenlabs.io](https://elevenlabs.io) |
| **OpenAI** | `OPENAI_API_KEY` | GPT-4o scripts & storyboards | [platform.openai.com](https://platform.openai.com) |

> **Ethical Transparency & Demo Mode**:
> If an API key is omitted, the provider adapter safely switches to Demo Mode, serving high-fidelity seeded media while clearly badging the output as simulated in the user interface. Simulated jobs are never falsely represented as live AI provider calls.

---

## 7. Security Hardening Checklist

- [x] **Salted Scrypt Password Hashing**: Passwords stored as `scrypt:<salt>:<hash>` with timing-safe verification and automatic legacy migration.
- [x] **Cryptographically Signed Sessions**: Session tokens signed with HMAC-SHA256 (`payload.signature`) using `APP_SECRET`. Cookie tampering rejected with HTTP 403.
- [x] **Strict Server-Side Authorization**: Project and Asset CRUD endpoints verify `ownerId === current.user.id || workspaceId === current.workspace.id || current.user.role === 'admin'`.
- [x] **Admin Role Isolation**: Admin overview and user management routes protected with strict role validation.
- [x] **Atomic Credit Accounting**: Credits reserved before dispatch, settled upon completion, and refund-compensated on failure.
- [x] **Webhook Replay Protection**: Razorpay webhooks checked against recorded events and validated with HMAC SHA-256 signatures.
