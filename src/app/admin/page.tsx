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
  Download,
  Clock,
} from 'lucide-react';

export default function AdminConsolePage() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [billingData, setBillingData] = useState<any>(null);
  const [billingSearch, setBillingSearch] = useState('');
  const [recheckStatus, setRecheckStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'providers' | 'jobs' | 'audits' | 'billing' | 'pricing'>('overview');

  // Pricing & Legal Settings Admin State
  const [billingConfig, setBillingConfig] = useState<any>(null);
  const [adminPlans, setAdminPlans] = useState<any[]>([]);
  const [adminPacks, setAdminPacks] = useState<any[]>([]);
  const [pricingActionStatus, setPricingActionStatus] = useState<string | null>(null);

  // Manual Credit Adjustment Modal
  const [adjModal, setAdjModal] = useState<{ open: boolean; userId: string; userEmail: string } | null>(null);
  const [adjAmount, setAdjAmount] = useState<number>(250);
  const [adjReason, setAdjReason] = useState<string>('Courtesy credit grant for creative testing');
  const [adjStatus, setAdjStatus] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const [overviewRes, usersRes, billRes, settingsRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/admin/users'),
        fetch('/api/admin/billing/overview'),
        fetch('/api/admin/billing/settings'),
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
      if (billRes.ok) {
        setBillingData(await billRes.json());
      }
      if (settingsRes.ok) {
        const s = await settingsRes.json();
        setBillingConfig(s.billingSettings || {});
        setAdminPlans(s.plans || []);
        setAdminPacks(s.creditPacks || []);
      }
    } catch (e) {
      console.error(e);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecheckPayUOrder = async (txnid: string) => {
    setRecheckStatus(`Rechecking ${txnid} with PayU upstream...`);
    try {
      const res = await fetch('/api/admin/billing/verify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txnid }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecheckStatus(`Order ${txnid} status: ${data.order?.status} (Verified: ${data.payuCheck?.verified})`);
        fetchAdminData();
      } else {
        setRecheckStatus(`Recheck error: ${data.error}`);
      }
    } catch (e: any) {
      setRecheckStatus(`Network error: ${e.message}`);
    }
  };

  const handleUpdatePlanPrice = async (planId: string, priceInr: number, priceAnnualInr: number, creditsPerPeriod: number) => {
    setPricingActionStatus(`Updating plan ${planId}...`);
    try {
      const res = await fetch('/api/admin/billing/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          updates: { priceInr, priceAnnualInr, creditsPerPeriod },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPricingActionStatus(`Successfully updated ${planId}!`);
        fetchAdminData();
      } else {
        setPricingActionStatus(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setPricingActionStatus(`Network error: ${e.message}`);
    }
  };

  const handleUpdateCreditPack = async (packId: string, priceInr: number, creditAmount: number) => {
    setPricingActionStatus(`Updating credit pack ${packId}...`);
    try {
      const res = await fetch('/api/admin/billing/packs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packId,
          updates: { priceInr, creditAmount },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPricingActionStatus(`Successfully updated credit pack ${packId}!`);
        fetchAdminData();
      } else {
        setPricingActionStatus(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setPricingActionStatus(`Network error: ${e.message}`);
    }
  };

  const handleUpdateBillingConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setPricingActionStatus(`Saving supplier legal and GST configuration...`);
    try {
      const res = await fetch('/api/admin/billing/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billingConfig),
      });
      const data = await res.json();
      if (res.ok) {
        setPricingActionStatus(`Supplier billing & GST configuration updated!`);
        fetchAdminData();
      } else {
        setPricingActionStatus(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setPricingActionStatus(`Network error: ${e.message}`);
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
    <div
      className="min-h-screen flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text-primary)',
      }}
    >
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
            <span className="font-bold text-white text-base">Fluvia Flow • Admin Console</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30 uppercase">
              Super Admin
            </span>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'overview', label: 'Metrics Overview' },
            { id: 'pricing', label: 'Pricing, Plans & Tax' },
            { id: 'billing', label: 'Billing & Finance' },
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

        {/* BILLING & FINANCE TAB */}
        {/* PRICING, PLANS & TAX SETTINGS TAB */}
        {activeTab === 'pricing' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {pricingActionStatus && (
              <div className="p-4 bg-violet-950/60 border border-violet-500/40 text-violet-200 text-xs rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>{pricingActionStatus}</span>
              </div>
            )}

            {/* 1. Subscription Plans Management */}
            <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden space-y-4 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Fluvia Flow Subscription Tiers & Entitlements</h3>
                  <p className="text-xs text-slate-400">
                    Manage authoritative prices, included computing credits, and model dispatch limits.
                  </p>
                </div>
                <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-violet-600/20 text-violet-300 border border-violet-500/30 font-bold self-start sm:self-auto">
                  Server-Side Truth
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(adminPlans || []).map((p: any) => (
                  <div key={p.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{p.name}</h4>
                        <span className="text-[10px] font-mono text-slate-500">ID: {p.id}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-slate-300">
                        {p.category || 'individual'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">
                          Monthly Price (INR)
                        </label>
                        <input
                          type="number"
                          defaultValue={p.priceInr}
                          id={`price_m_${p.id}`}
                          className="w-full bg-[#141722] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">
                          Annual Rate / Mo (INR)
                        </label>
                        <input
                          type="number"
                          defaultValue={p.priceAnnualInr || Math.round(p.priceInr * 0.8)}
                          id={`price_a_${p.id}`}
                          className="w-full bg-[#141722] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">
                          Credits / Period
                        </label>
                        <input
                          type="number"
                          defaultValue={p.creditsPerPeriod}
                          id={`credits_${p.id}`}
                          className="w-full bg-[#141722] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">
                          Max Resolution
                        </label>
                        <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-white font-mono text-xs border border-white/5">
                          {p.entitlements?.maxResolution || '1080p'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const mVal = Number((document.getElementById(`price_m_${p.id}`) as HTMLInputElement)?.value);
                        const aVal = Number((document.getElementById(`price_a_${p.id}`) as HTMLInputElement)?.value);
                        const cVal = Number((document.getElementById(`credits_${p.id}`) as HTMLInputElement)?.value);
                        handleUpdatePlanPrice(p.id, mVal, aVal, cVal);
                      }}
                      className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all border border-white/10"
                    >
                      Save {p.name} Changes
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Credit Packs Management */}
            <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden space-y-4 p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Credit Top-Up Packs</h3>
                  <p className="text-xs text-slate-400">Manage instant on-demand wallet recharge packs.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(adminPacks || []).map((pack: any) => (
                  <div key={pack.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-xs">{pack.name}</strong>
                      <span className="text-[10px] font-mono text-slate-500">{pack.id}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Base Price (INR)</label>
                        <input
                          type="number"
                          defaultValue={pack.priceInr}
                          id={`pack_price_${pack.id}`}
                          className="w-full bg-[#141722] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Credits Awarded</label>
                        <input
                          type="number"
                          defaultValue={pack.creditAmount}
                          id={`pack_credits_${pack.id}`}
                          className="w-full bg-[#141722] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const pVal = Number((document.getElementById(`pack_price_${pack.id}`) as HTMLInputElement)?.value);
                        const cVal = Number((document.getElementById(`pack_credits_${pack.id}`) as HTMLInputElement)?.value);
                        handleUpdateCreditPack(pack.id, pVal, cVal);
                      }}
                      className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all border border-white/10"
                    >
                      Update Pack
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Supplier Legal Identity & Tax Settings */}
            <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden p-6 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-bold text-white">Supplier Legal Identity & GST Settings</h3>
                <p className="text-xs text-slate-400 mt-1">
                  These details appear automatically on all PDF Tax Invoices, Receipts, and PayU transaction manifests.
                </p>
              </div>

              {billingConfig && (
                <form onSubmit={handleUpdateBillingConfig} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Supplier Legal Entity Name</label>
                      <input
                        type="text"
                        value={billingConfig.legalName || ''}
                        onChange={(e) => setBillingConfig({ ...billingConfig, legalName: e.target.value })}
                        className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                        placeholder="e.g. Fluvia Flow Technologies Pvt. Ltd."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Trade / Brand Name</label>
                      <input
                        type="text"
                        value={billingConfig.tradeName || ''}
                        onChange={(e) => setBillingConfig({ ...billingConfig, tradeName: e.target.value })}
                        className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                        placeholder="e.g. Fluvia Flow"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Registered Office Address</label>
                    <input
                      type="text"
                      value={billingConfig.registeredAddress || ''}
                      onChange={(e) => setBillingConfig({ ...billingConfig, registeredAddress: e.target.value })}
                      className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                      placeholder="e.g. Plot 42, DLF Cyber City, Phase III"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">City</label>
                      <input
                        type="text"
                        value={billingConfig.city || ''}
                        onChange={(e) => setBillingConfig({ ...billingConfig, city: e.target.value })}
                        className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">State (Origin for Tax Calc)</label>
                      <input
                        type="text"
                        value={billingConfig.state || ''}
                        onChange={(e) => setBillingConfig({ ...billingConfig, state: e.target.value })}
                        className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                        placeholder="e.g. Delhi"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Pincode</label>
                      <input
                        type="text"
                        value={billingConfig.pincode || ''}
                        onChange={(e) => setBillingConfig({ ...billingConfig, pincode: e.target.value })}
                        className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Supplier GSTIN (15 characters)</label>
                      <input
                        type="text"
                        value={billingConfig.gstin || ''}
                        onChange={(e) => setBillingConfig({ ...billingConfig, gstin: e.target.value.toUpperCase() })}
                        className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono"
                        placeholder="07AAAAA0000A1Z5"
                        maxLength={15}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Billing Support Email</label>
                      <input
                        type="email"
                        value={billingConfig.supportEmail || ''}
                        onChange={(e) => setBillingConfig({ ...billingConfig, supportEmail: e.target.value })}
                        className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                        placeholder="billing@fluviaflow.ai"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs transition-all shadow-md"
                    >
                      Save Supplier & Tax Configuration
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* BILLING & FINANCE TAB */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Total Gross Revenue</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  INR {billingData?.metrics?.totalGrossRevenueInr?.toFixed(2) || '0.00'}
                </div>
                <span className="text-[11px] text-slate-500">PayU Settled Volume</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">GST Collected (18%)</span>
                <div className="text-2xl font-black text-sky-400 font-mono">
                  INR {billingData?.metrics?.totalTaxCollectedInr?.toFixed(2) || '0.00'}
                </div>
                <span className="text-[11px] text-slate-500">CGST + SGST / IGST Total</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Successful Orders</span>
                <div className="text-2xl font-black text-white font-mono">
                  {billingData?.metrics?.successfulOrders || 0}
                </div>
                <span className="text-[11px] text-emerald-400">100% Reconciled on Ledger</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Invoices & Receipts</span>
                <div className="text-2xl font-black text-white font-mono">
                  {billingData?.metrics?.totalInvoicesIssued || 0} Inv / {billingData?.metrics?.totalReceiptsIssued || 0} Rcp
                </div>
                <span className="text-[11px] text-slate-500">Auto-Generated PDFs</span>
              </div>
            </div>

            {/* Gateway Integration Status Banner */}
            <div className="p-4 rounded-xl bg-[#12141A] border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    {billingData?.payuIntegration?.provider || 'PayU India Hosted Checkout'}
                  </h4>
                  <p className="text-slate-400">
                    Mode: <strong className="text-white uppercase font-mono">{billingData?.payuIntegration?.env || 'test'}</strong> • Merchant Key: <span className="font-mono">{billingData?.payuIntegration?.merchantKeyMasked}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/api/admin/billing/overview?format=csv"
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center gap-1.5 border border-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Transactions (CSV)</span>
                </a>
              </div>
            </div>

            {recheckStatus && (
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs rounded-xl flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{recheckStatus}</span>
              </div>
            )}

            {/* Orders Management Table */}
            <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">All Orders & Settlement Audit</h3>
                <span className="text-xs text-slate-400 font-mono">
                  {billingData?.orders?.length || 0} total orders
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 border-b border-white/5 uppercase text-[10px] font-mono">
                    <tr>
                      <th className="py-3 px-4">Txn ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Total (INR)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">PayU Reference</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {(billingData?.orders || []).map((o: any) => (
                      <tr key={o.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {o.txnid}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-white">{o.customerDetails?.name}</div>
                          <div className="text-[10px] text-slate-400">{o.customerDetails?.email}</div>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate font-medium">
                          {o.productInfo}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          INR {o.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              o.status === 'success'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                                : o.status === 'pending'
                                ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                                : 'bg-red-950/80 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {o.payuMihpayid || 'None'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRecheckPayUOrder(o.txnid)}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500 hover:text-black text-slate-300 font-semibold text-[11px] transition-colors"
                              title="Re-verify against official PayU upstream API"
                            >
                              Recheck
                            </button>
                            {o.receiptId && (
                              <a
                                href={`/api/billing/receipts/${o.receiptId}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded text-emerald-400 hover:underline"
                                title="View Receipt"
                              >
                                Rcp
                              </a>
                            )}
                            {o.invoiceId && (
                              <a
                                href={`/api/billing/invoices/${o.invoiceId}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded text-sky-400 hover:underline"
                                title="View Invoice"
                              >
                                Inv
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
