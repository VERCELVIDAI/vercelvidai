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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#667085] mb-1 font-medium">
                <Link href="/dashboard/billing" className="hover:text-[#5145CD] transition-colors">
                  Billing
                </Link>
                <span>/</span>
                <span className="text-[#17191D] font-semibold">Receipts</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#17191D]">Payment Receipts</h1>
              <p className="mt-1 text-xs sm:text-sm text-[#667085]">
                Verified payment settlement vouchers confirming funds received by Fluvia Flow via PayU India.
              </p>
            </div>

            <Link
              href="/checkout?type=pack&id=pack_5000"
              className="px-4 py-2.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold shadow-xs shrink-0 transition-all self-start sm:self-auto cursor-pointer"
            >
              Top Up Credits
            </Link>
          </div>

          {/* Search Bar */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by receipt # or txn ID..."
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2 text-xs text-[#17191D] placeholder-[#667085] focus:outline-hidden focus:border-[#5145CD] transition-colors"
              />
            </form>
          </div>

          {/* Receipts Table */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              {receipts.length === 0 ? (
                <div className="p-12 text-center text-[#667085] text-xs space-y-3">
                  <Receipt className="w-10 h-10 text-[#667085] mx-auto opacity-50" />
                  <p className="font-semibold text-[#17191D] text-sm">No payment receipts found</p>
                  <p>Official receipts are generated upon verified payment settlement.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F8FA] text-[#667085] border-b border-[#E5E7EB] uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Receipt Number</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Product Purchased</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Amount Received</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-[#17191D]">
                    {receipts.map((rcp: any) => (
                      <tr key={rcp.id} className="hover:bg-[#F7F8FA] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#17191D]">
                          <Link href={`/dashboard/billing/receipts/${rcp.id}`} className="hover:text-[#5145CD] underline">
                            {rcp.receiptNumber}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-[#667085]">
                          {new Date(rcp.paymentDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#17191D] max-w-xs truncate">
                          {rcp.productPurchased}
                        </td>
                        <td className="py-3.5 px-4 text-[#667085] font-medium">
                          {rcp.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#5145CD]">
                          INR {rcp.amountReceived.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-[#F1F3F5] text-emerald-700 border border-emerald-200">
                            Verified
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/billing/receipts/${rcp.id}`}
                              className="px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#17191D] hover:bg-[#F7F8FA] transition-colors font-medium text-xs shadow-xs"
                            >
                              View
                            </Link>
                            <a
                              href={`/api/billing/receipts/${rcp.id}/pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-[#5145CD]/10 hover:bg-[#5145CD]/20 text-[#5145CD] border border-[#5145CD]/20 flex items-center gap-1 transition-colors font-semibold text-xs"
                              title="Download Official Receipt PDF"
                            >
                              <Download className="w-3.5 h-3.5 text-[#5145CD]" />
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
