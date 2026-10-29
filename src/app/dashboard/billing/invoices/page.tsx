'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  FileText,
  Search,
  Download,
  Filter,
} from 'lucide-react';

export default function InvoicesListPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const [authRes, invRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/billing/invoices?search=${encodeURIComponent(search)}&status=${statusFilter}`),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      setData(await authRes.json());
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvoices(invData.invoices || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices();
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
                <span className="text-[#17191D] font-semibold">Invoices</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#17191D]">GST Tax Invoices</h1>
              <p className="mt-1 text-xs sm:text-sm text-[#667085]">
                Official billing invoices with 18% GST itemization for accounting and compliance.
              </p>
            </div>

            <Link
              href="/checkout?type=pack&id=pack_5000"
              className="px-4 py-2.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold shadow-xs shrink-0 transition-all self-start sm:self-auto cursor-pointer"
            >
              Buy Additional Credits
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-[#E5E7EB] p-3 rounded-2xl shadow-xs">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by invoice # or txn ID..."
                className="w-full bg-[#F7F8FA] rounded-xl pl-10 pr-4 py-2 text-xs text-[#17191D] border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD]"
              />
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-[#667085] font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#5145CD]" /> Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#17191D] font-medium focus:outline-none focus:border-[#5145CD] cursor-pointer"
              >
                <option value="all">All Invoices</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              {invoices.length === 0 ? (
                <div className="p-12 text-center text-[#667085] text-xs space-y-3">
                  <FileText className="w-10 h-10 text-[#667085]/60 mx-auto" />
                  <p className="font-semibold text-[#17191D]">No invoices found</p>
                  <p>Invoices are automatically issued whenever a credit pack or subscription is completed.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F8FA] text-[#667085] border-b border-[#E5E7EB] uppercase text-[10px] font-mono font-semibold">
                    <tr>
                      <th className="py-3 px-4">Invoice Number</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Subtotal</th>
                      <th className="py-3 px-4">Taxes (18%)</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-[#17191D]">
                    {invoices.map((inv: any) => (
                      <tr key={inv.id} className="hover:bg-[#F7F8FA] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#17191D]">
                          <Link href={`/dashboard/billing/invoices/${inv.id}`} className="hover:text-[#5145CD] underline">
                            {inv.invoiceNumber}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-[#667085]">
                          {new Date(inv.issueDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#17191D] max-w-xs truncate">
                          {inv.items?.[0]?.description || 'Creative Credits'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#667085]">
                          INR {inv.baseAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#667085]">
                          INR {inv.taxAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#5145CD]">
                          INR {inv.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/billing/invoices/${inv.id}`}
                              className="px-2.5 py-1.5 rounded-lg bg-[#F7F8FA] hover:bg-[#F1F3F5] text-[#17191D] border border-[#E5E7EB] transition-colors font-medium text-[11px]"
                            >
                              View
                            </Link>
                            <a
                              href={`/api/billing/invoices/${inv.id}/pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white flex items-center gap-1 transition-colors font-medium text-[11px] shadow-2xs"
                              title="Download Official Tax Invoice PDF"
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