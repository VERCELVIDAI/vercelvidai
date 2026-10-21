# Vercel Vidai 🎬

> **Next-Generation AI Video Creation & Multi-Track Studio SaaS Platform**  
> *Turn prompts, scripts, reference images, and source clips into cinematic video moments.*

---

## 🚀 Key Highlights & Architecture

- **Original Brand & Identity**: Custom abstract play-frame motion wordmark for **Vercel Vidai**.
- **Unified Creative Workspace (`/create`)**: Condition multiple generative models (Vidai Core, Runway Gen-3 Alpha, Luma Ray, Flux 1.1 Pro, ElevenLabs Voice AI) from a single prompt.
- **Professional Multi-Track Video Editor (`/editor/[projectId]`)**: Nonlinear browser editor with video, subtitle/caption, and audio tracks. Split clips, trim, adjust volume, change aspect ratio dynamically (16:9, 9:16, 1:1), and preview in real time.
- **Atomic Credit Wallet & Immutable Ledger (`/dashboard/wallet`)**: Atomic credit reservation before generation dispatch, settling on completion, with automatic compensating refunds on failed jobs. Replay-proof idempotent ledger.
- **Subscriptions & INR Billing (`/pricing`)**: Full India-focused INR pricing with Razorpay integration, HMAC SHA-256 signature verification, and support for UPI, Cards, and Netbanking.
- **Provider-Independent AI Architecture**: Typed adapter interfaces with capability discovery, background queues, and clear, honest **Demo Mode** labeling when third-party API credentials are not supplied.
- **Protected Admin Console (`/admin`)**: Server-side role verification, platform metrics, user directory, model registry, manual credit adjustments, and audit trail.
- **Complete Public Marketing Matrix**: 20+ responsive public pages including Features, AI Tools, Template Gallery, Use Cases, Engineering Journal, and Legal policies.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (Strict type checking) |
| **Styling** | Tailwind CSS + Custom Dark Studio Design Tokens |
| **Icons & Motion** | Lucide Icons + Framer Motion |
| **Database** | Transactional Local Store (Dev) + Supabase PostgreSQL (Prod DDL Migrations in `supabase/migrations/`) |
| **Payments** | Razorpay (INR Pricing, Webhooks, Signature Verification) |
| **AI Models** | Vidai Core, Runway Gen-3, Luma Ray, Fal Flux 1.1 Pro, ElevenLabs |

---

## 💻 Quick Start & Local Development

### 1. Prerequisites
- Node.js LTS (v20+ recommended)
- npm or pnpm

### 2. Installation
```bash
git clone https://github.com/your-org/vercel-vidai.git
cd vercel-vidai
npm install
```

### 3. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env.local
```

Configure your API keys in `.env.local` (or leave empty to run in honest **Demo Mode**):
```env
# Optional external provider credentials:
OPENAI_API_KEY=""
ELEVENLABS_API_KEY=""
RUNWAY_API_KEY=""
FAL_KEY=""
LUMA_API_KEY=""

# Razorpay credentials:
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_vidai_demo123"
RAZORPAY_KEY_SECRET="vidai_secret_demo456"
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running the Automated Test Suite
```bash
npx tsx tests/platform.test.ts
```
Runs 27 automated tests asserting credit math, atomic reservation, overspending prevention, idempotent transactions, HMAC signatures, timeline operations, and AI job transitions.

---

## 🔑 Pre-Seeded Demonstration Accounts

For instant evaluation, you can log in directly using the quick sign-in buttons on `/login`:

| Account | Email | Password | Role | Features |
|---|---|---|---|---|
| **Demo Creator** | `creator@vidai.io` | `Demo1234!` | `creator` | 350 Credits, Sample Cyberpunk Commercial, Asset Library |
| **Admin Master** | `admin@vidai.io` | `Admin1234!` | `admin` | Super Admin access to `/admin` Console & Metrics |

---

## 📂 Project Directory Structure

```text
├── src/
│   ├── app/                    # Next.js App Router (52 Routes)
│   │   ├── (marketing)/        # Public landing, pricing, tools, templates, blog
│   │   ├── api/                # 17 REST API Route Handlers
│   │   │   ├── admin/          # Admin metrics, user management, credit adjustment
│   │   │   ├── auth/           # Login, signup, logout, session verification
│   │   │   ├── editor/         # Master video export and rendering pipeline
│   │   │   ├── generate/       # AI generation job dispatcher
│   │   │   ├── payments/       # Razorpay order creation, verification, webhooks
│   │   │   └── projects/       # Project CRUD & timeline state
│   │   ├── create/             # Unified AI Creation Workspace
│   │   ├── dashboard/          # Creator dashboard, assets, brand kit, wallet
│   │   └── editor/[projectId]/ # Professional multi-track video editor
│   ├── components/             # Reusable UI components & navigation
│   │   ├── brand/              # Original Vercel Vidai wordmark & logo
│   │   ├── dashboard/          # Sidebar, header, widgets
│   │   └── home/               # Hero composer, interactive visual showcase
│   └── lib/                    # Core SaaS domain logic
│       ├── ai/                 # Multi-provider adapters (Runway, Luma, Fal, etc.)
│       ├── auth/               # Secure session handling & role verification
│       ├── db/                 # Transactional persistent database store
│       └── payments/           # Razorpay order & signature verification
├── supabase/migrations/        # Complete Supabase PostgreSQL DDL & Seeds
└── tests/                      # Automated unit and integration test suites
```

---

## 📄 License & Commercial Rights
Content generated by creators on paid Vercel Vidai tiers carries full commercial distribution and monetization rights.
