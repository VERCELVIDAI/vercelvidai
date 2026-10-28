'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '../brand/Logo';
import {
  Home,
  Film,
  Megaphone,
  Layers,
  Sliders,
  Video,
  Image as ImageIcon,
  Mic,
  FolderKanban,
  HardDrive,
  Palette,
  Wallet,
  CreditCard,
  Settings,
  HelpCircle,
  ShieldAlert,
  LogOut,
  Sparkles,
  Zap,
  X,
} from 'lucide-react';

interface SidebarProps {
  userRole?: string;
  credits?: { availableBalance: number; reservedBalance: number };
}

export function Sidebar({ userRole = 'creator', credits = { availableBalance: 0, reservedBalance: 0 } }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev);
    window.addEventListener('fluvia-toggle-mobile-sidebar', handleToggle);
    return () => window.removeEventListener('fluvia-toggle-mobile-sidebar', handleToggle);
  }, []);

  // Lock background scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobileOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  interface SidebarNavItem {
    label: string;
    href: string;
    icon: any;
    badge?: string;
  }

  const studioItems: SidebarNavItem[] = [
    { label: 'Cinema Studio', href: '/studios/cinema', icon: Film, badge: 'Director' },
    { label: 'Marketing Studio', href: '/studios/marketing', icon: Megaphone, badge: 'Ecom' },
    { label: 'Storyboard Studio', href: '/studios/storyboard', icon: Layers, badge: 'Gemini' },
    { label: 'Creative Canvas', href: '/editor', icon: Sliders },
  ];

  const creationItems: SidebarNavItem[] = [
    { label: 'AI Video Studio', href: '/create?mode=video', icon: Video, badge: '15 cr' },
    { label: 'AI Voiceover HD', href: '/create?mode=audio', icon: Mic, badge: '2 cr' },
    { label: 'AI Image Studio', href: '/create?mode=image', icon: ImageIcon, badge: '5 cr' },
    { label: 'Curated Templates', href: '/templates', icon: Layers, badge: '24' },
  ];

  const managementItems: SidebarNavItem[] = [
    { label: 'My Projects', href: '/dashboard/projects', icon: FolderKanban },
    { label: 'Asset Library', href: '/dashboard/assets', icon: HardDrive },
    { label: 'Brand Kit', href: '/dashboard/brand-kit', icon: Palette },
    { label: 'Credit Wallet', href: '/dashboard/wallet', icon: Wallet },
    { label: 'Billing & Plans', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const renderContent = (isDrawer: boolean) => (
    <>
      <div className="flex flex-col flex-1 overflow-y-auto overscroll-contain">
        {/* Brand header */}
        <div className="p-4 border-b border-emerald-500/15 flex items-center justify-between">
          <Logo size="sm" showTagline={false} />
          {isDrawer && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation"
              className="p-1.5 rounded-xl text-slate-500 hover:text-[#17211D] hover:bg-emerald-50 transition-colors"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          )}
        </div>

        {/* Quick Create CTA */}
        <div className="p-3">
          <Link
            href="/create"
            onClick={() => isDrawer && setIsMobileOpen(false)}
            className="w-full py-2.5 px-3 min-h-[44px] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            <span>New Creation</span>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 space-y-4 py-1 text-left">
          {/* Main */}
          <Link
            href="/dashboard"
            onClick={() => isDrawer && setIsMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all border ${
              pathname === '/dashboard'
                ? 'font-bold bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/60'
            }`}
          >
            <Home className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Dashboard Overview</span>
          </Link>

          {/* Studios Section */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
              Production Studios
            </span>
            {studioItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isDrawer && setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'font-bold bg-emerald-100 text-emerald-950 border-emerald-300 shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Creative Tools */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
              Generative Tools
            </span>
            {creationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isDrawer && setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'font-bold bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'border-transparent text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Management */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
              Workspace & Billing
            </span>
            {managementItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isDrawer && setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'font-bold bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'border-transparent text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Admin link if user is admin */}
          {userRole === 'admin' && (
            <Link
              href="/admin"
              onClick={() => isDrawer && setIsMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all mt-2 ${
                pathname.startsWith('/admin')
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Admin Console</span>
            </Link>
          )}
        </div>
      </div>

      {/* Credit Wallet Widget & Footer Profile */}
      <div className="p-3 border-t border-emerald-500/15 space-y-2">
        <Link
          href="/dashboard/wallet"
          onClick={() => isDrawer && setIsMobileOpen(false)}
          className="p-3 bg-emerald-50/90 hover:bg-emerald-100/80 rounded-2xl border border-emerald-300/80 flex items-center justify-between transition-colors block text-left shadow-xs"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">Available Credits</div>
              <div className="text-sm font-black text-[#17211D]">{credits.availableBalance}</div>
            </div>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold hover:underline">Top Up</span>
        </Link>

        <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
          <Link
            href="/help"
            onClick={() => isDrawer && setIsMobileOpen(false)}
            className="hover:text-emerald-800 flex items-center gap-1 text-[11px] font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support</span>
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-rose-600 flex items-center gap-1 text-[11px] font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 flex-col justify-between shrink-0 h-full select-none border-r border-emerald-500/15 glass-sidebar transition-colors duration-200 text-[#17211D]">
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative flex flex-col justify-between w-72 max-w-[85vw] h-full bg-white shadow-2xl z-10 glass-sidebar border-r border-emerald-500/25 animate-in slide-in-from-left duration-200 text-[#17211D]">
            {renderContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
