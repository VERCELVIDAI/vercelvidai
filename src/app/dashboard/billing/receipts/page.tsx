'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  Receipt,
  Search,
  Download,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Calendar,
} from 'lucide-react';

export default function ReceiptsListPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchReceipts = async () => {
    try {
      const [authRes, rcpRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/billing/receipts?search=${encodeURIComponent(search)}`),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      setData(await authRes.json());
      if (rcpRes.ok) {
        const rcpData = await rcpRes.json();
        setReceipts(rcpData.receipts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReceipts();
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
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-[#FFFFFF] text-[#17191D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden relative bg-[#F7F8FA] pb-24 md:pb-8">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 text-left relative">
          {/* Ambient Frosted Background Lights */}
          <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-[#5145CD]/10 blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -z-0" />

          {/* Frosted Glass Header Card */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl shadow-[#5145CD]/5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#667085] mb-2 font-medium">
                <Link href="/dashboard/billing" className="hover:text-[#5145CD] transition-colors">
                  Billing
                </Link>
                <span>/</span>
                <span className="text-[#17191D] font-bold">Receipts</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#17191D] tracking-tight">Payment Receipts</h1>
              <p className="mt-1 text-xs sm:text-sm text-[#667085]">
                Verified payment settlement vouchers confirming funds received by Fluvia Flow via PayU India.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <Link
                href="/dashboard/billing/invoices"
                className="px-4 py-2.5 bg-white/80 hover:bg-white text-[#17191D] border border-white/80 rounded-xl text-xs font-semibold shadow-2xs backdrop-blur-md transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>View Invoices</span>
              </Link>
              <Link
                href="/checkout?type=pack&id=pack_5000"
                className="px-4 py-2.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold shadow-xs shrink-0 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Top Up Credits</span>
              </Link>
            </div>
          </div>

          {/* Search Bar (Frosted Glass) */}
          <div className="relative z-10 p-3 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-xs">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by receipt # or txn ID..."
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2 text-xs text-[#17191D] placeholder-[#667085] focus:outline-none focus:border-[#5145CD] transition-colors"
              />
            </form>
          </div>

          {/* Receipts Table (Frosted Glass) */}
          <div className="relative z-10 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 overflow-hidden shadow-xl shadow-[#5145CD]/5">
            <div className="overflow-x-auto">
              {receipts.length === 0 ? (
                <div className="p-12 text-center text-[#667085] text-xs space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mx-auto text-[#5145CD]">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-[#17191D] text-sm">No payment receipts found</p>
                  <p>Official receipts are generated automatically upon verified PayU payment settlement.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F8FA]/80 backdrop-blur-xs text-[#667085] border-b border-[#E5E7EB] uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">Receipt Number</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Product Purchased</th>
                      <th className="py-3.5 px-4">Payment Method</th>
                      <th className="py-3.5 px-4">Amount Received</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]/70 text-[#17191D]">
                    {receipts.map((rcp: any) => (
                      <tr key={rcp.id} className="hover:bg-white/60 transition-colors">
                        <td className="py-4 px-5 font-mono font-bold text-[#17191D]">
                          <Link
                            href={`/dashboard/billing/receipts/${rcp.id}`}
                            className="hover:text-[#5145CD] flex items-center gap-1.5 group"
                          >
                            <Receipt className="w-3.5 h-3.5 text-[#5145CD] opacity-70 group-hover:opacity-100" />
                            <span>{rcp.receiptNumber}</span>
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-[#667085]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#667085]/60" />
                            <span>
                              {new Date(rcp.paymentDate).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-[#17191D] max-w-xs truncate">
                          {rcp.productPurchased}
                        </td>
                        <td className="py-4 px-4 text-[#667085] font-medium">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-[#667085]/60" />
                            <span>{rcp.paymentMethod || 'PayU India Gateway'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono font-black text-sm text-[#5145CD]">
                          INR {rcp.amountReceived.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/billing/receipts/${rcp.id}`}
                              className="px-3 py-1.5 rounded-xl border border-white/80 bg-white/80 text-[#17191D] hover:bg-white hover:border-[#5145CD]/30 transition-all font-semibold text-xs shadow-2xs backdrop-blur-md flex items-center gap-1"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3 text-[#667085]" />
                            </Link>
                            <a
                              href={`/api/billing/receipts/${rcp.id}/pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-[#5145CD]/10 hover:bg-[#5145CD] text-[#5145CD] hover:text-white border border-[#5145CD]/20 flex items-center gap-1.5 transition-all font-bold text-xs shadow-2xs"
                              title="Download Official Receipt PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>PDF</span>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
