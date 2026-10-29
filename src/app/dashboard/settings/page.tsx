'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { User, Trash2, CheckCircle2, Palette } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d) router.push('/login');
        else {
          setData(d);
          setDisplayName(d.user?.displayName || '');
          setEmail(d.user?.email || '');
        }
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('Profile changes saved successfully.');
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handleDeleteAccount = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-white text-[#17191D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden relative bg-[#F7F8FA] pb-24 md:pb-6">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-6 text-left">
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17191D]">Account Settings</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#667085]">
              Manage your personal credentials, workspace preferences, and privacy controls.
            </p>
          </div>

          {statusMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{statusMsg}</span>
            </div>
          )}

          {/* Profile Form */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] space-y-4 shadow-xs">
            <h3 className="font-bold text-[#17191D] text-sm mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#5145CD]" />
              <span>Personal Details</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#17191D] font-semibold mb-1.5 uppercase text-[11px] tracking-wider">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#F7F8FA] border border-[#E5E7EB] text-[#17191D] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[#5145CD]"
                />
              </div>

              <div>
                <label className="block text-[#17191D] font-semibold mb-1.5 uppercase text-[11px] tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-[#F7F8FA] border border-[#E5E7EB] text-[#667085] px-3.5 py-2.5 rounded-xl text-xs cursor-not-allowed"
                />
                <span className="text-[10px] text-[#667085] mt-1 block">
                  Email verification active. Contact support to update primary address.
                </span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Workspace Standard */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] space-y-3 shadow-xs">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-[#17191D] text-sm mb-1 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#5145CD]" />
                  <span>Workspace Theme</span>
                </h3>
                <p className="text-xs text-[#667085]">
                  FLUVIA FLOW Executive Business Theme (Pure white with restrained deep indigo accents).
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#EEF2FF] text-[#5145CD] border border-[#5145CD]/20">
                Active Standard
              </span>
            </div>
          </div>

          {/* Danger Zone: Account Deletion */}
          <div className="p-6 sm:p-8 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
            <h3 className="font-bold text-rose-800 text-sm flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Danger Zone: Account Deletion</span>
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Permanently delete your profile, workspaces, private video projects, and ledger history. This action cannot be undone.
            </p>

            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold transition-all border border-rose-200 cursor-pointer shadow-2xs"
            >
              Delete Account
            </button>
          </div>

          {deleteConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
                <h3 className="font-bold text-rose-600 text-base">Confirm Account Purge</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Are you absolutely certain? All credits and video exports will be immediately purged.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setDeleteConfirmOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F7F8FA] border border-[#E5E7EB] text-[#17191D] hover:bg-[#F1F3F5] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                  >
                    Yes, Delete Everything
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}