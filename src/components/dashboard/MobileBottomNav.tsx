'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FolderKanban,
  Plus,
  CreditCard,
  Menu,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu?: () => void;
}

export function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const pathname = usePathname();

  const handleOpenMenu = () => {
    if (onOpenMenu) {
      onOpenMenu();
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fluvia-toggle-mobile-sidebar'));
    }
  };

  const navItems = [
    {
      label: 'Home',
      href: '/dashboard',
      icon: Home,
      exact: true,
    },
    {
      label: 'Projects',
      href: '/dashboard/projects',
      icon: FolderKanban,
      exact: false,
    },
    {
      label: 'Create',
      href: '/create',
      icon: Plus,
      isPrimary: true,
    },
    {
      label: 'Billing',
      href: '/dashboard/billing',
      icon: CreditCard,
      exact: false,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] z-40 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg select-none"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 min-h-[44px] rounded-lg transition-colors ${
                isActive ? 'text-[#5145CD] font-bold' : 'text-[#667085] hover:text-[#17191D]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#5145CD]' : 'text-[#667085]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Center Primary Action: Create Ad */}
        <div className="flex flex-col items-center justify-center">
          <Link
            href="/create"
            className="w-11 h-11 -mt-4 rounded-full bg-[#5145CD] hover:bg-[#4338CA] text-white flex items-center justify-center shadow-md shadow-[#5145CD]/30 active:scale-95 transition-all"
            aria-label="Create New Ad"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </Link>
          <span className="text-[10px] mt-0.5 font-bold text-[#5145CD]">Create</span>
        </div>

        {/* Billing */}
        {(() => {
          const item = navItems[2];
          const billingItem = navItems[3];
          const Icon = billingItem.icon;
          const isActive = pathname.startsWith(billingItem.href);

          return (
            <Link
              href={billingItem.href}
              className={`flex flex-col items-center justify-center py-1 min-h-[44px] rounded-lg transition-colors ${
                isActive ? 'text-[#5145CD] font-bold' : 'text-[#667085] hover:text-[#17191D]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#5145CD]' : 'text-[#667085]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{billingItem.label}</span>
            </Link>
          );
        })()}

        {/* Menu / Drawer Trigger */}
        <button
          type="button"
          onClick={handleOpenMenu}
          className="flex flex-col items-center justify-center py-1 min-h-[44px] rounded-lg text-[#667085] hover:text-[#17191D] transition-colors cursor-pointer"
          aria-label="Open More Menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
        </button>
      </div>
    </nav>
  );
}