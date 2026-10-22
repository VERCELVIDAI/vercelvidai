import React from 'react';
import Link from 'next/link';
import { Logo } from '../brand/Logo';
import { Sparkles, Shield, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer
      className="border-t transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-sidebar)',
        borderColor: 'var(--app-card-border)',
        color: 'var(--app-text-muted)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              Vercel Vidai is the next-generation AI video creation studio. Turn text prompts, scripts, and product images into cinematic visuals, ads, and social content.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All AI Inference Clusters Operational</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Not affiliated with Vercel Inc. &ldquo;Vercel Vidai&rdquo; is an independent creative platform.
            </p>
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">AI Tools</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/ai-video-generator" className="hover:text-violet-400 transition-colors">AI Video Generator</Link></li>
              <li><Link href="/ai-image-generator" className="hover:text-violet-400 transition-colors">AI Image Creator</Link></li>
              <li><Link href="/ai-voice-generator" className="hover:text-violet-400 transition-colors">AI Voice & Audio</Link></li>
              <li><Link href="/ai-avatar-generator" className="hover:text-violet-400 transition-colors">AI Avatars</Link></li>
              <li><Link href="/models" className="hover:text-violet-400 transition-colors">Foundation Models</Link></li>
              <li><Link href="/templates" className="hover:text-violet-400 transition-colors">Creative Templates</Link></li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Use Cases</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/use-cases/marketing" className="hover:text-violet-400 transition-colors">Performance Marketing</Link></li>
              <li><Link href="/use-cases/youtube" className="hover:text-violet-400 transition-colors">YouTube Shorts & Videos</Link></li>
              <li><Link href="/use-cases/ecommerce" className="hover:text-violet-400 transition-colors">Ecommerce & Amazon</Link></li>
              <li><Link href="/use-cases/social-media" className="hover:text-violet-400 transition-colors">Instagram Reels & TikTok</Link></li>
              <li><Link href="/features" className="hover:text-violet-400 transition-colors">Feature Matrix</Link></li>
              <li><Link href="/pricing" className="hover:text-violet-400 transition-colors">Plans & Pricing</Link></li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Resources & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/blog" className="hover:text-violet-400 transition-colors">Engineering & Design Blog</Link></li>
              <li><Link href="/help" className="hover:text-violet-400 transition-colors">Help Center & FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-violet-400 transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-violet-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-violet-400 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Vercel Vidai. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              <span>Enterprise Grade Security</span>
            </span>
            <span>•</span>
            <span>Made for modern creative teams worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
