# Fluvia Flow — Production Deployment & Operations Guide

## 1. Quick Verification Commands

Before deploying, run the complete verified test suite:

```bash
# 1. Platform unit test suite
npx tsx tests/platform.test.ts

# 2. Next.js strict production compilation (zero TypeScript/ESLint warnings)
npm run build
```

---

## 2. Deploying to Vercel

Fluvia Flow is designed to deploy natively to Vercel (Edge & Node.js runtime):

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Fluvia Flow product rebrand, cinema studios, and Gemini AI integration"
   git push -u origin main
   ```
2. Import or connect the project in your [Vercel Dashboard](https://vercel.com).
3. Framework Preset: Next.js (automatically detected).
4. Root Directory: `./` (root).
5. Configure Environment Variables (`GEMINI_API_KEY`, `APP_SECRET`, `PAYU_MERCHANT_KEY`, etc. as documented in `.env.example`).
6. Deploy!
