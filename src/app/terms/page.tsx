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
    <div className="min-h-screen bg-white text-[#17191D] flex flex-col text-left">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#17191D] mb-4">Terms of Service</h1>
        <p className="text-xs text-[#667085] font-mono mb-8">Effective Date: October 2026 • Version 2.0</p>

        <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-2xl p-8 sm:p-12 space-y-6 text-sm text-[#667085] leading-relaxed shadow-xs">
          <p>
            Welcome to <strong className="text-[#17191D]">Fluvia Flow</strong>. By accessing or using our website, APIs, generation tools, and studios, you agree to comply with and be bound by these Terms of Service.
          </p>

          <h2 className="text-lg font-bold text-[#17191D] pt-4 border-t border-[#E5E7EB]">1. Brand & Service Ownership</h2>
          <p>
            Fluvia Flow is an independent creative AI platform operated by Fluvia Flow Technologies.
          </p>

          <h2 className="text-lg font-bold text-[#17191D] pt-4 border-t border-[#E5E7EB]">2. Commercial Use and Licensing</h2>
          <p>
            Subscribers on paid tiers receive full commercial licenses to use, monetize, broadcast, and distribute their exported video, audio, and image assets across all commercial channels.
          </p>

          <h2 className="text-lg font-bold text-[#17191D] pt-4 border-t border-[#E5E7EB]">3. Prohibited Content and Misuse</h2>
          <p>
            You agree not to use Fluvia Flow to generate deceptive deepfakes of public figures without consent, hate speech, non-consensual sexual content, defamatory media, or any content violating applicable laws.
          </p>

          <h2 className="text-lg font-bold text-[#17191D] pt-4 border-t border-[#E5E7EB]">4. Credit Ledger & Accounting</h2>
          <p>
            Credits represent non-monetary digital units of compute consumed during AI video generation. All credit adjustments, monthly renewals, and pack additions are governed strictly by our automated server ledger.
          </p>

          <h2 className="text-lg font-bold text-[#17191D] pt-4 border-t border-[#E5E7EB]">5. Fluvia vLabs: Voice Cloning, Audio Production & Video Dubbing Terms</h2>
          <p>
            Users of Fluvia vLabs (including Text-to-Speech, Voice Cloning, AI Voice Design, and AI Video Dubbing) must strictly comply with the following ethical and legal requirements:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#4B5563]">
            <li><strong>Mandatory Voice Ownership & Consent:</strong> You must never clone, synthesize, or imitate the voice of any individual without their explicit, informed written consent. Uploading audio samples of third parties or public figures without verified authorization is strictly prohibited and constitutes an immediate violation resulting in permanent licence termination.</li>
            <li><strong>Anti-Impersonation & Fraud Prevention:</strong> Fluvia vLabs tools may not be used for fraudulent schemes, scam calls, non-consensual biometric profiling, defamatory disinformation, or impersonation of legal or corporate authorities.</li>
            <li><strong>Commercial Voice Licences:</strong> Active holders of a Fluvia vLabs Licence (1-Year, 2-Year, or 5-Year) obtain full worldwide commercial exploitation rights for synthetic audio and dubbed video created through authorized voice profiles.</li>
            <li><strong>Auditability & Compliance:</strong> Fluvia reserves the right to log cryptographic audit timestamps and consent records for voice cloning requests to satisfy statutory compliance and cooperate with legal inquiries into unauthorized impersonation.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
