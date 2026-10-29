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
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const isLowBalance = credits.availableBalance < 30;

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-white text-[#17191D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#F7F8FA] pb-24 md:pb-6">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#17191D]">Credit Wallet & Ledger</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#667085]">
              Real-time audit log of your available balances, reservations, purchases, and refunds.
            </p>
          </div>

          {/* Low Balance Warning */}
          {isLowBalance && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-800 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Your credit balance is low ({credits.availableBalance} credits remaining). Video generations require 15 credits.</span>
              </div>
              <Link
                href="/pricing"
                className="px-3 py-1.5 bg-[#5145CD] hover:bg-[#4338CA] text-white font-medium rounded-lg shrink-0 sm:ml-4 transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
              >
                Top Up Now
              </Link>
            </div>
          )}

          {/* Balances Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] relative overflow-hidden shadow-xs">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-[#667085] font-semibold uppercase tracking-wider font-mono">Available Balance</span>
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center border border-[#5145CD]/20">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-4xl font-extrabold text-[#17191D] font-mono">{credits.availableBalance}</div>
              <p className="mt-2 text-xs text-[#667085]">Ready to spend on immediate AI jobs</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-[#667085] font-semibold uppercase tracking-wider font-mono">In-Flight Reserved</span>
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#667085] flex items-center justify-center border border-[#E5E7EB]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-4xl font-extrabold text-[#17191D] font-mono">{credits.reservedBalance}</div>
              <p className="mt-2 text-xs text-[#667085]">Locked while rendering active jobs</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs text-[#667085] font-semibold uppercase tracking-wider font-mono">Top-Up Wallet</span>
                <h3 className="font-bold text-[#17191D] text-base mt-1">Need additional compute?</h3>
                <p className="mt-1 text-xs text-[#667085]">Purchase instant top-up packs via UPI or Card.</p>
              </div>
              <Link
                href="/pricing"
                className="mt-4 w-full py-2.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold text-center block shadow-xs transition-colors cursor-pointer"
              >
                View Credit Packs
              </Link>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#E5E7EB] bg-[#F7F8FA] flex items-center justify-between">
              <h3 className="font-semibold text-[#17191D] text-sm">Immutable Transaction Ledger</h3>
              <span className="text-xs font-mono text-[#667085]">{ledger.length} total entries</span>
            </div>

            {ledger.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#667085]">No ledger transactions recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-white text-[#667085]">
                      <th className="p-3.5 font-semibold">Transaction Type</th>
                      <th className="p-3.5 font-semibold">Amount</th>
                      <th className="p-3.5 font-semibold">Balance After</th>
                      <th className="p-3.5 font-semibold">Reference / Notes</th>
                      <th className="p-3.5 font-semibold">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-[#17191D]">
                    {ledger.map((entry) => {
                      const isPositive = entry.amount > 0;
                      return (
                        <tr key={entry.id} className="hover:bg-[#F7F8FA] transition-colors">
                          <td className="p-3.5 flex items-center gap-2">
                            {isPositive ? (
                              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-rose-500" />
                            )}
                            <span className="font-medium text-[#17191D] capitalize">
                              {entry.transactionType.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className={`p-3.5 font-mono font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? `+${entry.amount}` : entry.amount} cr
                          </td>
                          <td className="p-3.5 font-mono font-medium text-[#17191D]">
                            {entry.balanceAfter} cr
                          </td>
                          <td className="p-3.5 font-mono text-[#667085] text-[11px]">
                            {entry.relatedJobId || entry.idempotencyKey || entry.metadata?.packName || 'System grant'}
                          </td>
                          <td className="p-3.5 font-mono text-[#667085] text-[11px]">
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
