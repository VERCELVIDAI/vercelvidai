'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../brand/Logo';
import { BRAND } from '@/lib/brand';
import { Shield, Sparkles, Heart, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#39233B] bg-[#100A12] text-[#A99AAA] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <Logo size="md" showTagline={true} />
            <p className="mt-4 text-xs text-[#A99AAA] max-w-sm leading-relaxed">
              {BRAND.description}
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-[#F05BCE] font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-[#F05BCE] animate-pulse" />
              <span>Gemini Omni Flash 4K & ElevenLabs Neural Voice Active</span>
            </div>
            <p className="mt-3 text-[11px] text-[#A99AAA]/70">
              Fluvia Flow — Premium AI Creative Studio with Midnight Plum × Hot Pink Art Direction.
            </p>
          </div>

          {/* Studios */}
          <div>
            <h4 className="text-xs font-bold text-[#F5EAF4] tracking-wider uppercase mb-4">Production Studios</h4>
            <ul className="space-y-2.5 text-xs text-[#A99AAA]">
              <li><Link href="/studios/cinema" className="hover:text-[#F05BCE] transition-colors">Cinema Studio</Link></li>
              <li><Link href="/studios/marketing" className="hover:text-[#F05BCE] transition-colors">Marketing Studio</Link></li>
              <li><Link href="/studios/storyboard" className="hover:text-[#F05BCE] transition-colors">Storyboard Studio</Link></li>
              <li><Link href="/editor" className="hover:text-[#F05BCE] transition-colors">Creative Canvas</Link></li>
              <li><Link href="/templates" className="hover:text-[#F05BCE] transition-colors">Creative Templates</Link></li>
              <li><Link href="/models" className="hover:text-[#F05BCE] transition-colors">Foundation Models</Link></li>
            </ul>
          </div>

          {/* Generative Tools */}
          <div>
            <h4 className="text-xs font-bold text-[#F5EAF4] tracking-wider uppercase mb-4">Creative Tools</h4>
            <ul className="space-y-2.5 text-xs text-[#A99AAA]">
              <li><Link href="/create?mode=video" className="hover:text-[#F05BCE] transition-colors">Text-to-Video (15 cr)</Link></li>
              <li><Link href="/create?mode=video" className="hover:text-[#F05BCE] transition-colors">Image-to-Video (15 cr)</Link></li>
              <li><Link href="/create?mode=image" className="hover:text-[#F05BCE] transition-colors">Flux 1.1 Pro Vision (5 cr)</Link></li>
              <li><Link href="/create?mode=audio" className="hover:text-[#F05BCE] transition-colors">Neural Voiceover HD (2 cr)</Link></li>
              <li><Link href="/ai-avatar-generator" className="hover:text-[#F05BCE] transition-colors">AI Talking Avatars</Link></li>
              <li><Link href="/pricing" className="hover:text-[#F05BCE] transition-colors">Plans & Credit Wallet</Link></li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="text-xs font-bold text-[#F5EAF4] tracking-wider uppercase mb-4">Company & Legal</h4>
            <ul className="space-y-2.5 text-xs text-[#A99AAA]">
              <li><Link href="/blog" className="hover:text-[#F05BCE] transition-colors">Engineering & Architecture</Link></li>
              <li><Link href="/help" className="hover:text-[#F05BCE] transition-colors">Help Center & FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-[#F05BCE] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#F05BCE] transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[#F05BCE] transition-colors">Refund & Settlement</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#39233B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A99AAA]">
          <div>
            © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Powered by Google Gemini Omni & ElevenLabs</span>
            <span>•</span>
            <span>0% GST PayU India Billing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
