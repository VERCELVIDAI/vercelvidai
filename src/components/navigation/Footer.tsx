'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../brand/Logo';
import { BRAND } from '@/lib/brand';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F7F8FA] text-[#667085] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <Logo size="md" showTagline={true} />
            <p className="text-xs text-[#667085] max-w-sm leading-relaxed">
              FLUVIA FLOW is the enterprise advertising creative platform. Generate broadcast-quality video commercials, product photography, and multilingual voiceovers from simple product inputs.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#5145CD] font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#10B981]" />
              <span>Commercial Video Engine & Neural Voice Active</span>
            </div>
          </div>

          {/* Product & Solutions */}
          <div>
            <h4 className="text-xs font-bold text-[#17191D] tracking-wider uppercase mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/create?mode=video" className="hover:text-[#5145CD] transition-colors">AI Video Ads</Link></li>
              <li><Link href="/ai-image-generator" className="hover:text-[#5145CD] transition-colors">Product Photography</Link></li>
              <li><Link href="/create?mode=audio" className="hover:text-[#5145CD] transition-colors">Neural Voiceover</Link></li>
              <li><Link href="/templates" className="hover:text-[#5145CD] transition-colors">Creative Templates</Link></li>
              <li><Link href="/pricing" className="hover:text-[#5145CD] transition-colors">Pricing & Plans</Link></li>
            </ul>
          </div>

          {/* Solutions by Industry */}
          <div>
            <h4 className="text-xs font-bold text-[#17191D] tracking-wider uppercase mb-4">Solutions</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/templates?category=E-commerce" className="hover:text-[#5145CD] transition-colors">E-commerce Brands</Link></li>
              <li><Link href="/templates?category=Product Commercials" className="hover:text-[#5145CD] transition-colors">Consumer Products</Link></li>
              <li><Link href="/templates?category=Social Reels" className="hover:text-[#5145CD] transition-colors">Social Performance Ads</Link></li>
              <li><Link href="/templates?category=Brand Films" className="hover:text-[#5145CD] transition-colors">Luxury & Automotive</Link></li>
              <li><Link href="/templates?category=Explainer Videos" className="hover:text-[#5145CD] transition-colors">SaaS & B2B Explainers</Link></li>
            </ul>
          </div>

          {/* Resources & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-[#17191D] tracking-wider uppercase mb-4">Legal & Company</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/help" className="hover:text-[#5145CD] transition-colors">Help Center & FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-[#5145CD] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#5145CD] transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[#5145CD] transition-colors">Refund Policy</Link></li>
              <li><Link href="/contact" className="hover:text-[#5145CD] transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
          <div>
            © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
          </div>
          <div className="flex items-center gap-5 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>18% GST Compliant Invoicing</span>
            </span>
            <span>•</span>
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
