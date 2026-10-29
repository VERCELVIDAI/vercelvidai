import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Fluvia Flow protects creator privacy, manages data security, and handles personal information.',
  alternates: {
    canonical: `${BRAND.siteUrl}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-[#17191D] flex flex-col text-left">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#17191D] mb-4">Privacy Policy</h1>
        <p className="text-xs text-[#667085] font-mono mb-8">Effective Date: October 2026 • Version 2.0</p>

        <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-2xl p-8 sm:p-12 space-y-6 text-sm text-[#667085] leading-relaxed shadow-xs">
          <p>
            At <strong className="text-[#17191D]">Fluvia Flow</strong> (&ldquo;Fluvia&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), we take your privacy, proprietary creative assets, and prompt confidentiality seriously. This Privacy Policy details how we collect, process, and protect your information when utilizing our AI video creation studios.
          </p>

          <h2 className="text-lg font-bold text-[#17191D] pt-4 border-t border-[#E5E7EB]">1. Data We Collect</h2>
          <p>
            We collect account identification (email address, display name, encrypted passwords), workspace configurations (brand kits, uploaded assets, logos, and fonts), transactional credit history, and generation job parameters (prompts, negative prompts, aspect ratios, model selections).
          </p>

          <h2 className="text-lg font-bold text-[#17191D] pt-4 border-t border-[#E5E7EB]">2. Ownership and Model Training Protections</h2>
          <p>
            <strong className="text-[#17191D]">Your inputs and outputs are yours.</strong> We do not sell your personal data or user-submitted prompts. We do not utilize customer private footage, confidential brand kits, or enterprise video exports to train foundational public weights without explicit opt-in consent.
          </p>

          <h2 className="text-lg font-bold text-[#17191D] pt-4 border-t border-[#E5E7EB]">3. Payment Information & Security</h2>
          <p>
            All payment transactions (UPI, credit cards, debit cards, net banking) are processed through certified PCI-DSS compliant gateways such as PayU India. Fluvia Flow never stores full credit card numbers or banking secrets on our servers.
          </p>

          <h2 className="text-lg font-bold text-[#17191D] pt-4 border-t border-[#E5E7EB]">4. Account and Data Deletion</h2>
          <p>
            Users can request immediate and irreversible account deletion through their profile settings at any time, which purges all stored projects, uploaded assets, and credentials from our active database.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
