import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions governing the use of Fluvia Flow creative software platform and API services.',
  alternates: {
    canonical: `${BRAND.siteUrl}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#100A12] text-[#F5EAF4] flex flex-col text-left">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5EAF4] mb-4">Terms of Service</h1>
        <p className="text-xs text-[#A99AAA] font-mono mb-8">Effective Date: October 2026 • Version 2.0</p>

        <div className="bg-[#211522] border border-[#39233B] rounded-3xl p-8 sm:p-12 space-y-6 text-sm text-[#A99AAA] leading-relaxed shadow-sm">
          <p>
            Welcome to <strong className="text-[#F5EAF4]">Fluvia Flow</strong>. By accessing or using our website, APIs, generation tools, and studios, you agree to comply with and be bound by these Terms of Service.
          </p>

          <h2 className="text-lg font-bold text-[#F5EAF4] pt-4 border-t border-[#39233B]">1. Brand & Service Ownership</h2>
          <p>
            Fluvia Flow is an independent creative AI platform operated by Fluvia Flow Technologies.
          </p>

          <h2 className="text-lg font-bold text-[#F5EAF4] pt-4 border-t border-[#39233B]">2. Commercial Use and Licensing</h2>
          <p>
            Subscribers on paid tiers receive full commercial licenses to use, monetize, broadcast, and distribute their exported video, audio, and image assets across all commercial channels.
          </p>

          <h2 className="text-lg font-bold text-[#F5EAF4] pt-4 border-t border-[#39233B]">3. Prohibited Content and Misuse</h2>
          <p>
            You agree not to use Fluvia Flow to generate deceptive deepfakes of public figures without consent, hate speech, non-consensual sexual content, defamatory media, or any content violating applicable laws.
          </p>

          <h2 className="text-lg font-bold text-[#F5EAF4] pt-4 border-t border-[#39233B]">4. Credit Ledger & Accounting</h2>
          <p>
            Credits represent non-monetary digital units of compute consumed during AI video generation. All credit adjustments, monthly renewals, and pack additions are governed strictly by our automated server ledger.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
