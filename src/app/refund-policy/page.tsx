import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Refund & Credit Policy</h1>
        <p className="text-xs text-slate-500 font-mono mb-8">Effective Date: October 2026 • Version 2.0</p>

        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm leading-relaxed">
          <p>
            At <strong>Vercel Vidai</strong>, customer trust and algorithmic fairness are core values. We uphold clear, programmatic refund rules for credit accounting and subscription purchases.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">1. Programmatic AI Generation Failure Refunds</h2>
          <p>
            If any video, image, voice, or export generation job fails due to an upstream provider error, infrastructure timeout, or cluster fault, <strong>100% of the reserved credits are immediately and automatically restored</strong> to your wallet balance via a compensating ledger transaction.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">2. Subscription and Credit Pack Refunds</h2>
          <p>
            Because generative AI operations incur direct computational server costs with our GPU suppliers, credit packs that have been partially or substantially consumed are generally non-refundable. However, if you experience a technical billing duplicate or charge discrepancy, we will issue a full refund within 7 business days via the original Razorpay payment method.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">3. Cancellation Policy</h2>
          <p>
            You may cancel your monthly or annual subscription at any time with one click from your Billing settings. Your subscription entitlements will remain active until the end of your current billing period, and no subsequent renewals will be billed.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">4. Submitting a Refund Request</h2>
          <p>
            To dispute a transaction or request an administrative review, open a ticket at <a href="/contact" className="text-violet-400 underline">vidai.io/contact</a> with your order ID. Our billing team reviews all requests within 24 hours.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
