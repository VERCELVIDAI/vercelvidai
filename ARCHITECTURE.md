# Vercel Vidai — Architecture & Technical Specifications

## 1. System Overview

Vercel Vidai is designed as a decoupled, high-velocity creative video SaaS platform. It bridges generative AI foundation weights with a non-linear multi-track editing workspace.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js 14 App Router                          │
│                                                                        │
│   ┌─────────────────────┐   ┌───────────────────┐   ┌──────────────┐   │
│   │ Public Marketing    │   │ Creator Dashboard │   │ Admin Portal │   │
│   │ /pricing, /tools    │   │ /create, /editor  │   │ /admin       │   │
│   └──────────┬──────────┘   └─────────┬─────────┘   └──────┬───────┘   │
└──────────────┼────────────────────────┼────────────────────┼───────────┘
               │                        │                    │
┌──────────────▼────────────────────────▼────────────────────▼───────────┐
│                           API Route Handlers                            │
│  /api/auth/*  |  /api/generate  |  /api/projects  |  /api/payments     │
└──────────────┬────────────────────────┬────────────────────┬───────────┘
               │                        │                    │
┌──────────────▼────────┐    ┌──────────▼─────────┐    ┌─────▼───────────┐
│  Atomic Credit Ledger │    │ AI Dispatcher Pool │    │ Razorpay Engine │
│  - Available Balance  │    │ - Vidai Core       │    │ - HMAC SHA-256  │
│  - Reserved Balance   │    │ - Runway Gen-3     │    │ - INR Orders    │
│  - Compensating Refund│    │ - Luma Ray Dream   │    │ - Webhooks      │
│  - Idempotency Keys   │    │ - Fal Flux 1.1 Pro │    │ - Subscriptions │
└───────────────────────┘    │ - ElevenLabs Voice │    └─────────────────┘
                             └────────────────────┘
```

---

## 2. Atomic Credit Accounting & Safe Concurrency

### Problem:
In generative AI platforms, requests take anywhere from 5 seconds to 2 minutes to complete. Allowing ordinary client requests to mutate credit balances or calculating balances client-side creates race conditions, double-spending, and financial loss.

### Solution Architecture:
1. **Integer Units**: All balances and costs are tracked in integer units (1 credit = standard fraction of GPU compute).
2. **Two-Phase Reservation & Settlement**:
   - **Phase 1 (Pre-flight Reservation)**:
     - User requests generation (e.g. 50 credits).
     - Database atomically deducts 50 from `availableBalance` and increments 50 into `reservedBalance`.
     - An audit entry with transaction type `generation_reserve` is added to `credit_ledger`.
     - If `availableBalance < requiredCredits`, the request is immediately rejected with HTTP 402.
   - **Phase 2 (Settlement or Compensating Refund)**:
     - **Success**: The reserved credits are released and settled as `generation_settle`.
     - **Failure/Cancellation**: If upstream provider times out or fails, 100% of the reserved credits are immediately restored to `availableBalance` via a compensating ledger entry (`refund`), with zero loss to the customer.
3. **Idempotency Keys**: All payments and grants check `idempotencyKey` before executing. Replaying the same webhook or order confirmation returns the existing record without duplicate credit allocation.

---

## 3. Extensible Multi-Provider AI Architecture

All AI providers implement the `IAIProviderAdapter` contract:

```typescript
export interface IAIProviderAdapter {
  readonly id: string;
  readonly name: string;
  readonly type: 'video' | 'image' | 'audio' | 'text' | 'multimodal';

  isConfigured(): boolean;
  getCapabilities(): AIProviderCapabilities;
  validateInput(input: GenerationInputPayload): { valid: boolean; error?: string };
  startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload>;
  checkStatus(providerRequestId: string, jobId: string): Promise<GenerationResultPayload>;
}
```

### Supported Providers:
- **Vidai Core Neural Architecture**: Built-in high speed engine with realistic video showcase outputs and honest Demo Mode labeling.
- **Runway Gen-3 Alpha**: High-motion cinematic text-to-video and image-to-video.
- **Luma Dream Machine Ray**: Realistic camera tracking, fluid dynamics, and 3D scenes.
- **Fal.ai Flux 1.1 Pro**: Ultra-detailed photorealistic concept art and product images.
- **ElevenLabs**: Neural text-to-speech across 29+ languages.
- **OpenAI GPT-4o**: Script-to-video storyboarding and prompt engineering.

---

## 4. Multi-Track Timeline Data Model

The video editor persists structured timeline configurations conforming to:

```typescript
export interface TimelineData {
  durationSec: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
  resolution: '720p' | '1080p' | '4k';
  backgroundColor?: string;
  tracks: Array<{
    id: string;
    type: 'video' | 'overlay' | 'text' | 'audio';
    name: string;
    muted?: boolean;
    locked?: boolean;
  }>;
  clips: Array<{
    id: string;
    trackId: string;
    type: 'video' | 'image' | 'audio' | 'text';
    title: string;
    sourceUrl?: string;
    text?: string;
    startTimeSec: number;
    durationSec: number;
    volume?: number;
    style?: {
      fontSize?: number;
      color?: string;
      backgroundColor?: string;
      positionY?: number;
    };
  }>;
}
```

---

## 5. Security & Access Control

- **Session Security**: HTTP-only session cookies with Base64 JSON payload and strict path scoping.
- **Role Verification**: Admin routes (`/admin`, `/api/admin/*`) enforce strict server-side `user.role === 'admin'` checks.
- **Resource Ownership**: Every project, asset, and generation job verified against `current.workspace.id` and `current.user.id`.
- **Payment Verification**: Razorpay HMAC SHA-256 signature calculated on server from secret keys; client signatures are never trusted blindly.
