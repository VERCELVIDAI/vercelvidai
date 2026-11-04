'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { VoxMotionGraphicsStudio } from '@/components/studio/VoxMotionGraphicsStudio';

export default function DashboardVoxMotionPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d) router.push('/login?returnUrl=/dashboard/vox-motion');
        else setData(d);
      })
      .catch(() => router.push('/login?returnUrl=/dashboard/vox-motion'))
      .finally(() => setIsLoading(false));
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#667085]">Loading Vox Motion Studio...</span>
        </div>
      </div>
    );
  }

  const user = data?.user || { displayName: 'Creator', role: 'creator' };
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-[#F7F8FA] text-[#17191D] relative">
      {/* Studio Nav Rail */}
      <Sidebar userRole={user.role} credits={credits} />

      {/* Main Studio Viewport */}
      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#F7F8FA] pb-24 md:pb-8">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 w-full min-w-0">
          <VoxMotionGraphicsStudio />
        </main>
      </div>
    </div>
  );
}
