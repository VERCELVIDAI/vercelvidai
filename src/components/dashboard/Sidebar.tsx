'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '../brand/Logo';
import { MobileBottomNav } from './MobileBottomNav';
import {
  Home,
  Plus,
  Video,
  Film,
  Image as ImageIcon,
  Mic,
  FolderKanban,
  Palette,
  HardDrive,
  CreditCard,
  Settings,
  HelpCircle,
  ShieldCheck,
  LogOut,
  Sparkles,
  Zap,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Scissors,
  Radio,
  Coins,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  userRole?: string;
  credits?: { availableBalance: number; reservedBalance: number };
}

export function Sidebar({
  userRole = 'creator',
  credits = { availableBalance: 0, reservedBalance: 0 },
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentQuery(window.location.search);
    }
  }, [pathname]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fluvia_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('fluvia_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev);
    window.addEventListener('fluvia-toggle-mobile-sidebar', handleToggle);
    return () => window.removeEventListener('fluvia-toggle-mobile-sidebar', handleToggle);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobileOpen]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    window.location.href = '/login';
  };

  interface SidebarNavItem {
    label: string;
    href: string;
    icon: any;
    badge?: string;
    badgeClass?: string;
    isSpecial?: boolean;
    specialType?: 'lime' | 'violet' | 'amber';
  }

  // 1. AI Generation Studios Group
  const studioItems: SidebarNavItem[] = [
    {
      label: 'OpenHiggs Studio',
      href: '/openhiggs',
      icon: Zap,
      badge: '38 Models',
      isSpecial: true,
      specialType: 'lime',
      badgeClass: 'bg-[#121c10] text-[#d4ff00] border border-[#d4ff00]/40 font-mono font-black shadow-[0_0_10px_rgba(212,255,0,0.2)]',
    },
    {
      label: 'Vox Motion Graphics',
      href: '/dashboard/vox-motion',
      icon: Scissors,
      badge: '2 Free',
      isSpecial: true,
      specialType: 'violet',
      badgeClass: 'bg-violet-950/80 text-violet-300 border border-violet-400/50 font-mono font-black shadow-[0_0_10px_rgba(139,92,246,0.3)]',
    },
    {
      label: 'Free Image Studio',
      href: '/ai-image-generator',
      icon: ImageIcon,
      badge: '100k Free',
      isSpecial: true,
      specialType: 'amber',
      badgeClass: 'bg-amber-950/80 text-amber-300 border border-amber-400/50 font-mono font-black shadow-[0_0_10px_rgba(245,158,11,0.25)]',
    },
    {
      label: 'AI Video Ad',
      href: '/create?mode=video',
      icon: Video,
      badge: '15 cr',
      badgeClass: 'bg-white/10 text-slate-300 border border-white/10 font-mono font-bold',
    },
    {
      label: 'Voice-over Studio',
      href: '/create?mode=audio',
      icon: Mic,
      badge: '2 cr',
      badgeClass: 'bg-white/10 text-slate-300 border border-white/10 font-mono font-bold',
    },
  ];

  // 2. Creative Workspace & Assets
  const workspaceItems: SidebarNavItem[] = [
    { label: 'Overview', href: '/dashboard', icon: Home },
    {
      label: 'Templates',
      href: '/templates',
      icon: Layers,
      badge: 'Curated',
      badgeClass: 'bg-blue-950/70 text-blue-300 border border-blue-500/30 font-mono font-bold',
    },
    { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { label: 'Brand Kits', href: '/dashboard/brand-kit', icon: Palette },
    { label: 'Asset Library', href: '/dashboard/assets', icon: HardDrive },
  ];

  // 3. Workspace Account & Billing
  const accountItems: SidebarNavItem[] = [
    { label: 'Credits & Billing', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    { label: 'Help & Docs', href: '/help', icon: HelpCircle },
  ];

  if (userRole === 'admin') {
    accountItems.push({
      label: 'Admin Panel',
      href: '/admin',
      icon: ShieldCheck,
      badge: 'Admin',
      badgeClass: 'bg-rose-950/80 text-rose-300 border border-rose-500/40 font-mono font-black',
    });
  }

  const renderNavGroup = (
    title: string,
    items: SidebarNavItem[],
    collapsed: boolean,
    isDrawer: boolean
  ) => (
    <div className="space-y-1">
      {!collapsed && (
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 px-3 py-1.5 block select-none">
          {title}
        </span>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        let isActive = false;
        if (item.href.includes('?')) {
          const [itemPath, itemQuery] = item.href.split('?');
          isActive = pathname === itemPath && currentQuery.includes(itemQuery);
        } else if (item.href === '/dashboard') {
          isActive = pathname === '/dashboard';
        } else {
          isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/');
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => isDrawer && setIsMobileOpen(false)}
            title={collapsed ? `${item.label}${item.badge ? ` (${item.badge})` : ''}` : undefined}
            className={`group relative flex items-center ${
              collapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
            } min-h-[40px] rounded-xl text-xs font-semibold transition-all duration-200 ${
              isActive
                ? item.specialType === 'lime'
                  ? 'bg-[#14230E] text-white font-black border border-[#d4ff00]/50 shadow-[0_0_20px_rgba(212,255,0,0.22)]'
                  : item.specialType === 'violet'
                  ? 'bg-violet-950/60 text-white font-black border border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                  : item.specialType === 'amber'
                  ? 'bg-amber-950/50 text-white font-black border border-amber-500/50 shadow-[0_0_18px_rgba(245,158,11,0.22)]'
                  : 'bg-white/10 text-white font-bold border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.08)]'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.07] border border-transparent hover:border-white/5 group-hover:translate-x-0.5'
            }`}
          >
            {/* Active Left Indicator Bar */}
            {isActive && (
              <span
                className={`absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full ${
                  item.specialType === 'lime'
                    ? 'bg-[#d4ff00] shadow-[0_0_10px_#d4ff00]'
                    : item.specialType === 'violet'
                    ? 'bg-violet-400 shadow-[0_0_10px_#a78bfa]'
                    : item.specialType === 'amber'
                    ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]'
                    : 'bg-indigo-400 shadow-[0_0_10px_#818cf8]'
                }`}
              />
            )}

            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  item.specialType === 'lime'
                    ? 'text-[#d4ff00]'
                    : item.specialType === 'violet'
                    ? 'text-violet-400'
                    : item.specialType === 'amber'
                    ? 'text-amber-400'
                    : isActive
                    ? 'text-indigo-400'
                    : 'text-slate-400 group-hover:text-white'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>

            {!collapsed && item.badge && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-mono shrink-0 ${
                  item.badgeClass || 'bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  const renderContent = (isDrawer: boolean, collapsed: boolean) => (
    <div className="flex flex-col h-full justify-between bg-[#0B0E17] text-white selection:bg-[#d4ff00] selection:text-black">
      <div className="flex flex-col flex-1 overflow-y-auto overscroll-contain">
        {/* Brand Header */}
        <div
          className={`p-4 border-b border-white/[0.08] flex items-center ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {collapsed ? (
            <Link
              href="/dashboard"
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-black text-base shadow-[0_0_20px_rgba(139,92,246,0.45)] border border-violet-400/40 hover:scale-105 transition-all"
              title="Fluvia Creative Suite"
            >
              F
            </Link>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Logo size="sm" isDark={true} showTagline={false} />
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-950/90 text-violet-300 border border-violet-500/40 text-[9px] font-mono font-black uppercase tracking-wider shadow-[0_0_12px_rgba(139,92,246,0.25)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <span>STUDIO v2.5</span>
              </div>
            </div>
          )}

          {isDrawer && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Primary Radiant CTA: Create Video Ad */}
        <div className={`p-3 ${collapsed ? 'px-2' : ''}`}>
          <Link
            href="/create"
            onClick={() => isDrawer && setIsMobileOpen(false)}
            title={collapsed ? 'Create Video Ad' : undefined}
            className={`relative overflow-hidden group w-full py-2.5 px-3 min-h-[44px] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(139,92,246,0.4)] bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer border border-violet-400/40 ${
              collapsed ? 'px-0' : ''
            }`}
          >
            {/* Shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

            <Sparkles className="w-4 h-4 text-[#d4ff00] shrink-0 animate-pulse" />
            {!collapsed && <span className="tracking-wide">+ Create Video Ad</span>}
          </Link>
        </div>

        {/* Navigation Rail Groups */}
        <div className={`space-y-4 py-2 text-left ${collapsed ? 'px-2' : 'px-3'}`}>
          {renderNavGroup('AI Studios', studioItems, collapsed, isDrawer)}
          {renderNavGroup('Workspace', workspaceItems, collapsed, isDrawer)}
          {renderNavGroup('Account', accountItems, collapsed, isDrawer)}
        </div>
      </div>

      {/* Bottom Footer: Titanium Credit Card Widget & Controls */}
      <div className={`p-3 border-t border-white/[0.08] bg-[#07090F] space-y-2.5 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#121828] via-[#0E1320] to-[#121828] border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Coins className="w-3.5 h-3.5 text-violet-400" />
                <span>Available Fuel</span>
              </span>
              <span className="font-mono font-black text-[#d4ff00] text-sm tracking-wide">
                {credits.availableBalance.toLocaleString()} CR
              </span>
            </div>

            {/* Battery / Fuel visual bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden p-[1px] border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-[#d4ff00] rounded-full shadow-[0_0_8px_rgba(212,255,0,0.5)] transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(8, (credits.availableBalance / 5000) * 100))}%`,
                }}
              />
            </div>

            <Link
              href="/checkout?type=pack&id=pack_5000"
              className="w-full block py-2 px-3 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 hover:from-violet-600 hover:to-indigo-600 text-violet-200 hover:text-white text-xs font-black rounded-xl text-center transition-all border border-violet-500/40 hover:border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)] cursor-pointer"
            >
              Top Up Credits (5,000 CR)
            </Link>
          </div>
        )}

        {/* Collapsed Credit Mini Badge */}
        {collapsed && (
          <Link
            href="/dashboard/billing"
            title={`${credits.availableBalance.toLocaleString()} credits available`}
            className="w-full p-2.5 rounded-xl bg-violet-950/60 border border-violet-500/40 flex flex-col items-center justify-center text-[#d4ff00] font-mono text-[10px] font-black hover:border-violet-400 transition-colors shadow-xs"
          >
            <Coins className="w-3.5 h-3.5 text-violet-400 mb-0.5" />
            <span>{credits.availableBalance > 999 ? `${Math.round(credits.availableBalance / 1000)}k` : credits.availableBalance}</span>
          </Link>
        )}

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out of Fluvia"
            className={`text-xs font-semibold text-slate-400 hover:text-rose-400 flex items-center gap-2 py-1.5 px-2 rounded-xl hover:bg-rose-950/30 transition-colors cursor-pointer ${
              collapsed ? 'w-full justify-center px-0' : ''
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>

          {!isDrawer && (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Obsidian Rail */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-800/90 bg-[#0B0E17] text-white select-none transition-all duration-300 ease-in-out shrink-0 shadow-2xl z-20 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderContent(false, isCollapsed)}
      </aside>

      {/* Dedicated Mobile Bottom Navigation Bar */}
      <MobileBottomNav onOpenMenu={() => setIsMobileOpen(true)} />

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 md:hidden flex"
        >
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-[#0B0E17] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 pb-[max(1rem,env(safe-area-inset-bottom))] border-r border-slate-800">
            {renderContent(true, false)}
          </div>
        </div>
      )}
    </>
  );
}
