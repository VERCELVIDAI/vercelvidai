'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import {
  ShieldAlert,
  Users,
  Video,
  CreditCard,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sliders,
  Cpu,
  Search,
  Plus,
  RefreshCw,
  FileText,
} from 'lucide-react';

export default function AdminConsolePage() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'providers' | 'jobs' | 'audits'>('overview');

  // Manual Credit Adjustment Modal
  const [adjModal, setAdjModal] = useState<{ open: boolean; userId: string; userEmail: string } | null>(null);
  const [adjAmount, setAdjAmount] = useState<number>(250);
  const [adjReason, setAdjReason] = useState<string>('Courtesy credit grant for creative testing');
  const [adjStatus, setAdjStatus] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const [overviewRes, usersRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/admin/users'),
      ]);

      if (!overviewRes.ok) {
        router.push('/dashboard');
        return;
      }

      setAdminData(await overviewRes.json());
      if (usersRes.ok) {
        const u = await usersRes.json();
        setUsersList(u.users || []);
      }
    } catch (e) {
      console.error(e);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAdjustCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjModal) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: adjModal.userId,
          adjustmentAmount: Number(adjAmount),
          reason: adjReason,
        }),
      });

      if (!res.ok) throw new Error('Credit adjustment failed');

      setAdjStatus('Credits adjusted successfully!');
      setTimeout(() => {
        setAdjStatus(null);
        setAdjModal(null);
        fetchAdminData();
      }, 1200);
    } catch (err: any) {
      setAdjStatus(`Error: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07080B] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const metrics = adminData?.metrics || {};
  const providers = adminData?.providers || [];
  const models = adminData?.models || [];
  const recentJobs = adminData?.recentJobs || [];
  const recentAudits = adminData?.recentAudits || [];

  return (
    <div className="min-h-screen bg-[#07080B] text-slate-100 flex flex-col">
      {/* Admin Top Bar */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0A0B10] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            title="Return to User Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white text-base">Vercel Vidai • Admin Console</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30 uppercase">
              Super Admin
            </span>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'overview', label: 'Metrics Overview' },
            { id: 'users', label: 'User Directory' },
            { id: 'providers', label: 'AI Providers & Models' },
            { id: 'jobs', label: 'Job Monitor' },
            { id: 'audits', label: 'Audit Trail' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Admin View */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 sm:p-8 space-y-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl glass-panel border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs uppercase font-semibold text-slate-400">Registered Users</span>
                  <Users className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{metrics.totalUsers}</div>
                <span className="text-[11px] text-emerald-400 font-mono mt-1 block">Active Accounts Verified</span>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs uppercase font-semibold text-slate-400">Gross INR Volume</span>
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">₹{metrics.totalGrossRevenueInr?.toLocaleString()}</div>
                <span className="text-[11px] text-slate-400 font-mono mt-1 block">Razorpay Settled</span>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs uppercase font-semibold text-slate-400">Total Generations</span>
                  <Video className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{metrics.totalGenerations}</div>
                <span className="text-[11px] text-slate-400 font-mono mt-1 block">Across All Providers</span>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs uppercase font-semibold text-slate-400">Generation Success Rate</span>
                  <Activity className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400">{metrics.successRate}%</div>
                <span className="text-[11px] text-slate-400 font-mono mt-1 block">0 Failed Without Auto-Refund</span>
              </div>
            </div>

            {/* Provider Status Quick Grid */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
              <h3 className="font-bold text-white text-base">Configured Provider Integrations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {providers.map((prv: any) => (
                  <div key={prv.id} className="p-3 bg-[#0E1017] rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">{prv.name}</span>
                      <span className="text-[11px] text-slate-400 capitalize">{prv.providerType} AI</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                      Live / Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-white text-base">User Directory & Wallets</h3>
              <span className="text-xs text-slate-400 font-mono">{usersList.length} Accounts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold">
                    <th className="p-3">User</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Available Credits</th>
                    <th className="p-3">Joined Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-semibold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-violet-600/30 text-white flex items-center justify-center font-bold text-[11px]">
                          {usr.displayName[0]}
                        </div>
                        <span>{usr.displayName}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{usr.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                          usr.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-violet-500/20 text-violet-300'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        {usr.credits?.availableBalance || 0} cr
                      </td>
                      <td className="p-3 font-mono text-slate-500 text-[11px]">
                        {new Date(usr.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => setAdjModal({ open: true, userId: usr.id, userEmail: usr.email })}
                          className="px-2.5 py-1 bg-white/5 hover:bg-violet-600 text-white rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Adjust Credits
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROVIDERS TAB */}
        {activeTab === 'providers' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
              <h3 className="font-bold text-white text-base">Model Registry & Unit Pricing</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-semibold">
                      <th className="p-3">Model Name</th>
                      <th className="p-3">Provider</th>
                      <th className="p-3">Media Type</th>
                      <th className="p-3">Customer Credit Price</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {models.map((m: any) => (
                      <tr key={m.id}>
                        <td className="p-3 font-bold text-white">{m.displayName}</td>
                        <td className="p-3 font-mono text-slate-400">{m.providerId}</td>
                        <td className="p-3 uppercase font-mono text-violet-400">{m.mediaType}</td>
                        <td className="p-3 font-mono font-bold text-amber-400">
                          {m.creditPricing?.costCredits} cr
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* JOBS MONITOR TAB */}
        {activeTab === 'jobs' && (
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="font-bold text-white text-base">Generation Job Pipeline</h3>
            <div className="divide-y divide-white/5 text-xs">
              {recentJobs.map((j: any) => (
                <div key={j.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block truncate max-w-lg">
                      {j.input?.prompt || 'Task'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Model: {j.modelId} • Credits: {j.actualCredits || j.estimatedCredits} cr • {new Date(j.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                    j.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-violet-500/20 text-violet-300'
                  }`}>
                    {j.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDITS TAB */}
        {activeTab === 'audits' && (
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="font-bold text-white text-base">System Audit Trail</h3>
            <div className="divide-y divide-white/5 text-xs font-mono">
              {recentAudits.map((aud: any) => (
                <div key={aud.id} className="py-2.5 flex items-center justify-between text-slate-300">
                  <div>
                    <strong className="text-white">{aud.action}</strong>
                    <span className="text-slate-500 ml-2">[{aud.resourceType} : {aud.resourceId}]</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">{new Date(aud.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADJUST CREDIT MODAL */}
        {adjModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#12141A] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="font-bold text-white text-base">Adjust User Credits</h3>
              <p className="text-xs text-slate-400">
                Grant or revoke credits for <strong className="text-white">{adjModal.userEmail}</strong>.
              </p>

              {adjStatus && (
                <div className="p-3 bg-violet-950/60 border border-violet-500/40 text-xs text-violet-300 rounded-xl">
                  {adjStatus}
                </div>
              )}

              <form onSubmit={handleAdjustCreditSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Credit Amount (+ to grant, - to deduct)</label>
                  <input
                    type="number"
                    required
                    value={adjAmount}
                    onChange={(e) => setAdjAmount(Number(e.target.value))}
                    className="w-full bg-[#0E1017] text-white px-3 py-2 rounded-xl border border-white/10 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Audit Reason</label>
                  <input
                    type="text"
                    required
                    value={adjReason}
                    onChange={(e) => setAdjReason(e.target.value)}
                    className="w-full bg-[#0E1017] text-white px-3 py-2 rounded-xl border border-white/10 text-xs"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setAdjModal(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold"
                  >
                    Post Ledger Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
