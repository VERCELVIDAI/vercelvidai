'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '../brand/Logo';
import {
  Home,
  Plus,
  Video,
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
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  interface SidebarNavItem {
    label: string;
    href: string;
    icon: any;
    badge?: string;
  }

  const creationItems: SidebarNavItem[] = [
    { label: 'Overview', href: '/dashboard', icon: Home },
    { label: 'Create', href: '/create', icon: Plus },
    { label: 'Video Studio', href: '/create?mode=video', icon: Video, badge: '15 cr' },
    { label: 'Image Studio', href: '/create?mode=image', icon: ImageIcon, badge: '5 cr' },
    { label: 'Voice-over', href: '/create?mode=audio', icon: Mic, badge: '2 cr' },
    { label: 'Templates', href: '/templates', icon: Layers, badge: 'Curated' },
  ];

  const libraryItems: SidebarNavItem[] = [
    { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { label: 'Brand Kits', href: '/dashboard/brand-kit', icon: Palette },
    { label: 'Asset Library', href: '/dashboard/assets', icon: HardDrive },
  ];

  const accountItems: SidebarNavItem[] = [
    { label: 'Credits & Billing', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    { label: 'Help', href: '/help', icon: HelpCircle },
  ];

  if (userRole === 'admin') {
    accountItems.push({ label: 'Admin Panel', href: '/admin', icon: ShieldCheck });
  }

  const renderNavGroup = (title: string, items: SidebarNavItem[], collapsed: boolean, isDrawer: boolean) => (
    <div className="space-y-0.5">
      {!collapsed && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] px-3 py-1.5 block">
          {title}
        </span>
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
            } min-h-[38px] rounded-lg text-xs font-medium transition-all ${
              isActive
                ? 'bg-[#EEF2FF] text-[#5145CD] font-semibold'
                : 'text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA]'
            }`}
          >
            {/* Left active indigo line indicator */}
            {isActive && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#5145CD]" />
            )}

            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-[#5145CD]' : 'text-[#667085] group-hover:text-[#17191D]'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>

            {!collapsed && item.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium shrink-0 ${
                  item.badge.includes('cr')
                    ? 'bg-[#EEF2FF] text-[#5145CD] border border-[#5145CD]/20'
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
              className="p-1 rounded-lg text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA]"
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

        {/* Navigation Groups */}
        <div className={`space-y-4 py-2 text-left ${collapsed ? 'px-2' : 'px-3'}`}>
          {renderNavGroup('Workspace', creationItems, collapsed, isDrawer)}
          {renderNavGroup('Library', libraryItems, collapsed, isDrawer)}
          {renderNavGroup('Account', accountItems, collapsed, isDrawer)}
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
            className={`text-xs font-medium text-[#667085] hover:text-[#17191D] flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-200/50 transition-colors ${
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
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {renderContent(true, false)}
          </div>
        </div>
      )}
    </>
  );
}
