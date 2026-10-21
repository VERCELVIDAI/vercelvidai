import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Terms of Service</h1>
        <p className="text-xs text-slate-500 font-mono mb-8">Effective Date: October 2026 • Version 2.0</p>

        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm leading-relaxed">
          <p>
            Welcome to <strong>Vercel Vidai</strong>. By accessing or using our website, APIs, generation tools, and editor, you agree to comply with and be bound by these Terms of Service.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">1. Brand Independence</h2>
          <p>
            Vercel Vidai is an independent creative AI platform. The platform name uses &ldquo;Vercel Vidai&rdquo; as an original service identifier and has no affiliation, partnership, or sponsorship with Vercel Inc.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">2. Commercial Use and Licensing</h2>
          <p>
            Subscribers on paid tiers (Starter, Creator, Studio Agency) receive full commercial licenses to use, monetize, broadcast, and distribute their exported video, audio, and image assets across all commercial channels.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">3. Prohibited Content and Misuse</h2>
          <p>
            You agree not to use Vercel Vidai to generate deceptive deepfakes of public figures without consent, hate speech, non-consensual sexual content, defamatory media, or any content violating applicable laws.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">4. Credit Ledger & Accounting</h2>
          <p>
            Credits represent non-monetary digital units of compute consumed during AI video generation. All credit adjustments, monthly renewals, and pack additions are governed strictly by our automated server ledger.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
