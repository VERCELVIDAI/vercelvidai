'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '../brand/Logo';
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
  ShieldCheck,
  Zap,
  Sparkles,
  HelpCircle,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Scissors,
  Tag,
} from 'lucide-react';

interface SidebarProps {
  userRole?: string;
  credits?: { availableBalance: number; reservedBalance: number };
}

export function Sidebar({ userRole = 'creator', credits = { availableBalance: 0, reservedBalance: 0 } }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fluvia_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    try {
      localStorage.setItem('fluvia_sidebar_collapsed', String(next));
    } catch {}
  };

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev);
    const handleClose = () => setIsMobileOpen(false);

    window.addEventListener('fluvia-toggle-mobile-sidebar', handleToggle);
    window.addEventListener('fluvia-close-mobile-sidebar', handleClose);

    return () => {
      window.removeEventListener('fluvia-toggle-mobile-sidebar', handleToggle);
      window.removeEventListener('fluvia-close-mobile-sidebar', handleClose);
    };
  }, []);

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
    badgeColor?: string;
    textColor?: string;
    pillBg?: string;
    activeBorder?: string;
  }

  // 1. AI Generation Studios (Categorized & Highlighted with Multi-Color Text)
  const studioItems: SidebarNavItem[] = [
    {
      label: 'OpenHiggs Studio',
      href: '/openhiggs',
      icon: Zap,
      badge: '38 Models',
      textColor: 'text-emerald-700 font-black',
      pillBg: 'bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80',
      badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black',
      activeBorder: 'border-emerald-400',
    },
    {
      label: 'Vox Motion Graphics',
      href: '/studios/motion-graphics',
      icon: Scissors,
      badge: '2 Free Tries',
      textColor: 'text-purple-700 font-black',
      pillBg: 'bg-purple-50/80 hover:bg-purple-100/80 border border-purple-200/80',
      badgeColor: 'bg-purple-100 text-purple-900 border border-purple-300 font-black',
      activeBorder: 'border-purple-400',
    },
    {
      label: 'Free Image Studio',
      href: '/ai-image-generator',
      icon: ImageIcon,
      badge: '100k Free',
      textColor: 'text-amber-700 font-black',
      pillBg: 'bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-black',
      activeBorder: 'border-amber-400',
    },
    {
      label: 'AI Video Ad Studio',
      href: '/create?mode=video',
      icon: Video,
      badge: '15 cr',
      textColor: 'text-blue-700 font-bold',
      pillBg: 'hover:bg-blue-50/60 border border-transparent hover:border-blue-200/60',
      badgeColor: 'bg-blue-100 text-blue-900 border border-blue-200 font-bold',
      activeBorder: 'border-blue-400',
    },
    {
      label: 'Voice-over Studio',
      href: '/create?mode=audio',
      icon: Mic,
      badge: '2 cr',
      textColor: 'text-violet-700 font-bold',
      pillBg: 'hover:bg-violet-50/60 border border-transparent hover:border-violet-200/60',
      badgeColor: 'bg-violet-100 text-violet-900 border border-violet-200 font-bold',
      activeBorder: 'border-violet-400',
    },
  ];

  // 2. Creative Workspace
  const workspaceItems: SidebarNavItem[] = [
    { label: 'Overview', href: '/dashboard', icon: Home, textColor: 'text-slate-800 font-semibold' },
    { label: 'Create Ad Deck', href: '/create', icon: Plus, textColor: 'text-indigo-700 font-bold' },
    {
      label: 'Ad Templates',
      href: '/templates',
      icon: Layers,
      badge: 'Curated',
      textColor: 'text-indigo-700 font-bold',
      badgeColor: 'bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold',
    },
    { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban, textColor: 'text-slate-700 font-medium' },
    { label: 'Brand Kits', href: '/dashboard/brand-kit', icon: Palette, textColor: 'text-slate-700 font-medium' },
    { label: 'Asset Library', href: '/dashboard/assets', icon: HardDrive, textColor: 'text-slate-700 font-medium' },
  ];

  // 3. Subscription & Account
  const accountItems: SidebarNavItem[] = [
    {
      label: 'Credits & Billing',
      href: '/dashboard/billing',
      icon: CreditCard,
      badge: '20% OFF',
      textColor: 'text-rose-700 font-black',
      pillBg: 'bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/80',
      badgeColor: 'bg-rose-100 text-rose-900 border border-rose-300 font-black',
      activeBorder: 'border-rose-400',
    },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings, textColor: 'text-slate-700 font-medium' },
    { label: 'Help & Docs', href: '/help', icon: HelpCircle, textColor: 'text-slate-700 font-medium' },
  ];

  if (userRole === 'admin') {
    accountItems.push({ label: 'Admin Panel', href: '/admin', icon: ShieldCheck, textColor: 'text-slate-900 font-bold' });
  }

  const renderNavGroup = (title: string, groupBadge: string, badgeColor: string, items: SidebarNavItem[], collapsed: boolean, isDrawer: boolean) => (
    <div className="space-y-1">
      {!collapsed && (
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
            {title}
          </span>
          {groupBadge && (
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${badgeColor}`}>
              {groupBadge}
            </span>
          )}
        </div>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href) && !item.href.includes('?'));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => isDrawer && setIsMobileOpen(false)}
            title={collapsed ? `${item.label}${item.badge ? ` (${item.badge})` : ''}` : undefined}
            className={`group relative flex items-center ${
              collapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
            } min-h-[38px] rounded-xl text-xs transition-all cursor-pointer ${
              isActive
                ? 'bg-[#EEF2FF] text-[#5145CD] font-bold border border-[#C7D2FE] shadow-2xs'
                : item.pillBg
                ? `${item.textColor} ${item.pillBg}`
                : `text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA]`
            }`}
          >
            {/* Left active line indicator */}
            {isActive && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#5145CD]" />
            )}

            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive
                    ? 'text-[#5145CD]'
                    : item.textColor
                    ? ''
                    : 'text-[#667085] group-hover:text-[#17191D]'
                }`}
              />
              {!collapsed && <span className={`truncate ${item.textColor || ''}`}>{item.label}</span>}
            </div>

            {!collapsed && item.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                  item.badgeColor
                    ? item.badgeColor
                    : 'bg-[#F7F8FA] text-[#667085] border border-[#E5E7EB]'
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
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col flex-1 overflow-y-auto overscroll-contain">
        {/* Brand Header */}
        <div className={`p-4 border-b border-[#E5E7EB] flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {collapsed ? (
            <Link href="/dashboard" className="w-8 h-8 rounded-lg bg-[#5145CD] flex items-center justify-center text-white font-bold text-sm">
              F
            </Link>
          ) : (
            <Logo size="sm" showTagline={false} />
          )}

          {isDrawer && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation"
              className="p-1 rounded-lg text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Create CTA in Deep Indigo */}
        <div className={`p-3 ${collapsed ? 'px-2' : ''}`}>
          <Link
            href="/create"
            onClick={() => isDrawer && setIsMobileOpen(false)}
            title={collapsed ? 'New Video Ad' : undefined}
            className={`w-full py-2.5 px-3 min-h-[40px] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs bg-[#5145CD] hover:bg-[#4338CA] transition-all cursor-pointer ${
              collapsed ? 'px-0' : ''
            }`}
          >
            <Sparkles className="w-4 h-4 text-white shrink-0" />
            {!collapsed && <span>Create Video Ad</span>}
          </Link>
        </div>

        {/* Navigation Groups Synchronized with Categorized Multi-Color Text */}
        <div className={`space-y-5 py-2 text-left ${collapsed ? 'px-2' : 'px-3'}`}>
          {renderNavGroup('AI Studios', 'ENGINES', 'bg-purple-100 text-purple-900', studioItems, collapsed, isDrawer)}
          {renderNavGroup('Creative Workspace', 'SUITE', 'bg-indigo-100 text-indigo-900', workspaceItems, collapsed, isDrawer)}
          {renderNavGroup('Plans & Billing', 'WALLET', 'bg-rose-100 text-rose-900', accountItems, collapsed, isDrawer)}
        </div>
      </div>

      {/* Bottom Footer: Credit Balance & Collapse Toggle */}
      <div className={`p-3 border-t border-[#E5E7EB] bg-[#F7F8FA] space-y-2.5 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed && (
          <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#17191D] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>Credits</span>
              </span>
              <span className="font-mono font-bold text-[#5145CD]">
                {credits.availableBalance.toLocaleString()}
              </span>
            </div>
            <Link
              href="/checkout?type=pack&id=pack_5000"
              className="w-full block py-1.5 px-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] text-[11px] font-semibold rounded-lg text-center transition-colors"
            >
              Top Up Credits
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            className={`text-xs font-medium text-[#667085] hover:text-[#17191D] flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer ${
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
              className="p-1.5 rounded-lg text-[#667085] hover:text-[#17191D] hover:bg-slate-200/50 transition-colors cursor-pointer"
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
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-[#E5E7EB] bg-white text-[#17191D] select-none transition-all duration-200 shrink-0 ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {renderContent(false, isCollapsed)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 md:hidden flex"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {renderContent(true, false)}
          </div>
        </div>
      )}
    </>
  );
}
