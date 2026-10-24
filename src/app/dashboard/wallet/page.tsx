'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function CreditWalletPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [ledger, setLedger] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      const [authRes, credRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/credits'),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      const authData = await authRes.json();
      setData(authData);

      if (credRes.ok) {
        const c = await credRes.json();
        setLedger(c.ledger || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen text-[#17211D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const isLowBalance = credits.availableBalance < 30;

  return (
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden text-[#17211D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D]">Credit Wallet & Ledger</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Real-time audit log of your available balances, reservations, purchases, and refunds.
            </p>
          </div>

          {/* Low Balance Warning */}
          {isLowBalance && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs text-amber-900 shadow-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Your credit balance is low ({credits.availableBalance} credits remaining). Standard video generations require 25 credits.</span>
              </div>
              <Link
                href="/pricing"
                className="px-3 py-1.5 bg-amber-500 text-white font-bold rounded-lg shrink-0 ml-4 hover:bg-amber-600 transition-colors shadow-sm"
              >
                Top Up Now
              </Link>
            </div>
          )}

          {/* Balances Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl glass-card relative overflow-hidden shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-slate-500 font-semibold uppercase">Available Balance</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-4xl font-black text-[#17211D]">{credits.availableBalance}</div>
              <p className="mt-2 text-xs text-slate-500">Ready to spend on immediate AI jobs</p>
            </div>

            <div className="p-6 rounded-3xl glass-card shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-slate-500 font-semibold uppercase">In-Flight Reserved</span>
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-500/20">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-4xl font-black text-[#17211D]">{credits.reservedBalance}</div>
              <p className="mt-2 text-xs text-slate-500">Locked while rendering active jobs</p>
            </div>

            <div className="p-6 rounded-3xl glass-card flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase">Top-Up Wallet</span>
                <h3 className="font-bold text-[#17211D] text-base mt-1">Need additional compute?</h3>
                <p className="mt-1 text-xs text-slate-600">Purchase instant top-up packs via UPI or Card.</p>
              </div>
              <Link
                href="/pricing"
                className="mt-4 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold text-center block shadow-md shadow-emerald-500/20 transition-all"
              >
                View Credit Packs
              </Link>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="rounded-3xl glass-card overflow-hidden shadow-sm">
            <div className="p-4 border-b border-emerald-500/10 bg-emerald-50/30 flex items-center justify-between">
              <h3 className="font-bold text-[#17211D] text-sm">Immutable Transaction Ledger</h3>
              <span className="text-xs font-mono text-slate-500">{ledger.length} total entries</span>
            </div>

            {ledger.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No ledger transactions recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-500/10 bg-emerald-50/50 text-slate-600">
                      <th className="p-3.5 font-semibold">Transaction Type</th>
                      <th className="p-3.5 font-semibold">Amount</th>
                      <th className="p-3.5 font-semibold">Balance After</th>
                      <th className="p-3.5 font-semibold">Reference / Notes</th>
                      <th className="p-3.5 font-semibold">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/10 text-slate-700">
                    {ledger.map((entry) => {
                      const isPositive = entry.amount > 0;
                      return (
                        <tr key={entry.id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="p-3.5 flex items-center gap-2">
                            {isPositive ? (
                              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-rose-500" />
                            )}
                            <span className="font-semibold text-[#17211D] capitalize">
                              {entry.transactionType.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className={`p-3.5 font-mono font-bold ${isPositive ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {isPositive ? `+${entry.amount}` : entry.amount} cr
                          </td>
                          <td className="p-3.5 font-mono font-semibold text-[#17211D]">
                            {entry.balanceAfter} cr
                          </td>
                          <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                            {entry.relatedJobId || entry.idempotencyKey || entry.metadata?.packName || 'System grant'}
                          </td>
                          <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                            {new Date(entry.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
